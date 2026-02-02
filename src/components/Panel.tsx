import React, { useState, useCallback, useEffect } from 'react';
import { styled, setup } from 'goober';
import { Sidebar } from './Sidebar';
import { QueryDetail } from './QueryDetail';

setup(React.createElement);

const Container = styled('div')`
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  height: ${({ height }: { height: number }) => height}px;
  min-height: 200px;
  max-height: 90vh;
  background: #1e1e1e;
  border-top: 1px solid #333;
  z-index: 99999;
  display: flex;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
`;

const Header = styled('div')`
  position: absolute;
  top: -30px;
  right: 0;
  background: #2d2d2d;
  color: #fff;
  padding: 4px 12px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border: 1px solid #3d3d3d;
  border-bottom: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
`;

const Content = styled('div')`
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
`;

const VerticalResizer = styled('div')`
  position: absolute;
  top: -5px;
  left: 0;
  width: 100%;
  height: 10px;
  cursor: ns-resize;
  z-index: 10;
  background: transparent;
`;

const HorizontalResizer = styled('div')`
  width: 4px;
  background: #333;
  cursor: ew-resize;
  flex-shrink: 0;
  transition: background 0.2s;
  
  &:hover {
    background: #FF5722;
  }
`;

interface PanelProps {
  cacheData: Record<string, any>;
  mutate: (key: string) => Promise<any>;
  cache: Map<string, any>;
  mutations: any[];
  isMiddlewareActive: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export const Panel: React.FC<PanelProps> = ({ cacheData, mutate, cache, mutations, isMiddlewareActive, isOpen, onClose }) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  /* searchTerm state moved to Sidebar */
  
  // Resizable state
  const [panelHeight, setPanelHeight] = useState(400);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [isResizingHeight, setIsResizingHeight] = useState(false);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);

  // Resize handlers
  const startResizingHeight = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingHeight(true);
  }, []);

  const startResizingSidebar = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingSidebar(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingHeight) {
        const newHeight = window.innerHeight - e.clientY;
        if (newHeight > 100 && newHeight < window.innerHeight - 50) {
          setPanelHeight(newHeight);
        }
      }
      if (isResizingSidebar) {
        const newWidth = e.clientX; 
        if (newWidth > 150 && newWidth < window.innerWidth - 200) {
          setSidebarWidth(newWidth);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizingHeight(false);
      setIsResizingSidebar(false);
    };

    if (isResizingHeight || isResizingSidebar) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = '';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isResizingHeight, isResizingSidebar]);

  if (!isOpen) return null;

  const keys = Object.keys(cacheData);
  const selectedData = selectedKey ? cacheData[selectedKey] : null;

  const handleDelete = (key: string) => {
     if (cache) {
       cache.delete(key);
       // Force update or wait for poll
       setSelectedKey(null);
     }
  };

  return (
    <Container height={panelHeight}>
      <VerticalResizer onMouseDown={startResizingHeight} />
      <Header onClick={onClose}>
        Close DevTools
      </Header>
      <Content>
        <Sidebar 
          keys={keys} 
          cacheData={cacheData}
          mutations={mutations}
          isMiddlewareActive={isMiddlewareActive}
          selectedKey={selectedKey} 
          onSelect={setSelectedKey}
          width={sidebarWidth}
        />
        <HorizontalResizer onMouseDown={startResizingSidebar} />
        {selectedKey && selectedData ? (
          <QueryDetail 
            queryKey={selectedKey} 
            data={selectedData} 
            onMutate={(k) => mutate(k)}
            onDelete={handleDelete}
          />
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
            Select a query to view details
          </div>
        )}
      </Content>
    </Container>
  );
};
