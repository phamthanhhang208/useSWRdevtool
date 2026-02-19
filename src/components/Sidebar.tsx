import React from 'react';
import { styled } from 'goober';

const SidebarContainer = styled('div')`
  width: ${({ width }: { width: number }) => width}px;
  background: #1e1e1e;
  border-right: 1px solid #333;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  flex-shrink: 0;
`;

const SearchInput = styled('input')`
  background: #252526;
  border: none;
  border-bottom: 1px solid #333;
  color: #ccc;
  padding: 8px 12px;
  font-size: 13px;
  outline: none;

  &:focus {
    background: #333;
  }
`;

const List = styled('div')`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;

const ListItem = styled('div')`
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #2a2a2a;
  background: ${({ active }: { active: boolean }) => (active ? '#37373d' : 'transparent')};
  color: ${({ active }: { active: boolean }) => (active ? '#fff' : '#ccc')};
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;

  &:hover {
    background: ${({ active }: { active: boolean }) => (active ? '#37373d' : '#2a2a2a')};
  }
`;

const StatusDot = styled('span')`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
  display: inline-block;
  flex-shrink: 0;
`;

const Tabs = styled('div')`
  display: flex;
  background: #252526;
  border-bottom: 1px solid #333;
`;

const Tab = styled('button')`
  flex: 1;
  background: ${({ active }: { active: boolean }) => (active ? '#1e1e1e' : 'transparent')};
  color: ${({ active }: { active: boolean }) => (active ? '#fff' : '#888')};
  border: none;
  padding: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  border-bottom: ${({ active }: { active: boolean }) => (active ? '1px solid #007acc' : '1px solid transparent')};
  outline: none;

  border-radius: 0;

  &:hover {
    color: #fff;
  }
`;

interface SidebarProps {
  keys: string[];
  cacheData: Record<string, any>;
  mutations: any[]; 
  isMiddlewareActive: boolean;
  selectedKey: string | null;
  onSelect: (key: string) => void;
  width: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ keys, cacheData, mutations, isMiddlewareActive, selectedKey, onSelect, width }) => {
  const [activeTab, setActiveTab] = React.useState<'queries' | 'mutations'>('queries');
  const [searchTerm, setSearchTerm] = React.useState('');
  const filteredKeys = keys.filter((key) => key.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <SidebarContainer width={width}>
      {isMiddlewareActive && (
        <Tabs>
          <Tab active={activeTab === 'queries'} onClick={() => setActiveTab('queries')}>
            Queries
          </Tab>
          <Tab active={activeTab === 'mutations'} onClick={() => setActiveTab('mutations')}>
            Mutations
          </Tab>
        </Tabs>
      )}
      <SearchInput
      id="swr-devtools-sidebar-search"
        placeholder="Search..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
      />
      <List>
        {activeTab === 'queries' ? (
          filteredKeys.map((key) => {
            const data = cacheData[key];
            const isFetching = data?.isValidating || data?.isLoading;
            const hasError = !!data?.error;
            const statusColor = isFetching ? '#61dafb' : hasError ? '#f44336' : '#4caf50';

            return (
              <ListItem 
                key={key} 
                active={selectedKey === key} 
                onClick={() => onSelect(key)}
                title={key}
              >
                <StatusDot style={{ background: statusColor }} />
                {key}
              </ListItem>
            );
          })
        ) : (
          mutations.length === 0 ? (
            <div style={{ padding: 20, color: '#666', fontSize: 13, textAlign: 'center', lineHeight: 1.5 }}>
              No mutations recorded.
              <div style={{ marginTop: 10, fontSize: 11, color: '#555' }}>
                To see mutations, make sure to add <code>swrDevToolsMiddleware</code> to your SWRConfig.
              </div>
            </div>
          ) : (
            mutations.map((mutation) => (
              <ListItem 
                 key={mutation.id}
                 active={false} // No selection detail for mutation history for now
                 title={mutation.status}
                 style={{ opacity: mutation.status === 'pending' ? 0.7 : 1 }}
              >
                 <StatusDot style={{
                   background: mutation.status === 'success' ? '#4caf50' : 
                               mutation.status === 'error' ? '#f44336' : '#61dafb' 
                 }} />
                 <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <span>{mutation.key}</span>
                    <span style={{ fontSize: 10, color: '#888' }}>
                      {new Date(mutation.startTime).toLocaleTimeString()} - {mutation.status}
                    </span>
                 </div>
              </ListItem>
            ))
          )
        )}
      </List>
    </SidebarContainer>
  );
};
