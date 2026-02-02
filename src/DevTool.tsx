import React, { useState } from 'react';
import { useSWRDevTools } from './hooks/useSWRDevTools';
import { Panel } from './components/Panel';
import { styled } from 'goober';

const FloatingButton = styled('button')`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #000;
  color: #fff;
  border: none;
  font-weight: bold;
  cursor: pointer;
  z-index: 99999;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  
  &:hover {
    transform: scale(1.05);
  }
`;

export const SWRDevTools: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cacheData, mutate, cache, mutations, isMiddlewareActive } = useSWRDevTools();
  
  // Draggable logic
  const [position, setPosition] = useState({ x: -1, y: -1 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = React.useRef({ x: 0, y: 0 });
  const buttonStartPos = React.useRef({ x: 0, y: 0 });
  const hasMoved = React.useRef(false);

  // Initialize position on mount (if needed, otherwise relying on CSS for initial)
  // We use -1, -1 to indicate "use CSS defaults" initially

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    // Only left click
    if ('button' in e && e.button !== 0) return;
    
    e.preventDefault();
    setIsDragging(true);
    hasMoved.current = false;

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    dragStartPos.current = { x: clientX, y: clientY };
    
    // If we haven't set a custom position yet, get the current one from the element
    if (position.x === -1) {
        // This logic assumes the button is clicked, so e.currentTarget is the button
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        buttonStartPos.current = { x: rect.left, y: rect.top };
    } else {
        buttonStartPos.current = { x: position.x, y: position.y };
    }
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault(); // Prevent scrolling on touch

      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      const dx = clientX - dragStartPos.current.x;
      const dy = clientY - dragStartPos.current.y;

      // Threshold to consider it a drag vs a click
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          hasMoved.current = true;
      }

      setPosition({
        x: buttonStartPos.current.x + dx,
        y: buttonStartPos.current.y + dy,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleMouseMove);
        window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  const onButtonClick = () => {
      if (!hasMoved.current) {
          setIsOpen(true);
      }
  };

  return (
    <>
      {!isOpen && (
        <FloatingButton 
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            onClick={onButtonClick}
            style={
                position.x !== -1 
                ? { left: position.x, top: position.y, bottom: 'auto', right: 'auto', transform: 'none' } 
                : {}
            }
        >
          SWR
        </FloatingButton>
      )}
      <Panel 
        cacheData={cacheData} 
        mutate={mutate as any}
        cache={cache as any}
        mutations={mutations}
        isMiddlewareActive={isMiddlewareActive}
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
};
