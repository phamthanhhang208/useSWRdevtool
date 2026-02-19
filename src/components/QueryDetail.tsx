import React from 'react';
import { styled } from 'goober';
import { JsonViewer } from './JsonViewer';

const Container = styled('div')`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1e1e1e;
  overflow: hidden;
`;

const Toolbar = styled('div')`
  padding: 8px 16px;
  border-bottom: 1px solid #333;
  color: #ccc;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Content = styled('div')`
  padding: 16px;
  flex: 1;
  overflow-y: auto;
  color: #e4e4e4;
`;

const Section = styled('div')`
  margin-bottom: 24px;
`;

const SectionTitle = styled('h3')`
  font-size: 12px;
  text-transform: uppercase;
  color: #888;
  margin: 0 0 8px 0;
  letter-spacing: 0.5px;
`;

const KeyTag = styled('div')`
  background: #2a2a2a;
  padding: 8px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  word-break: break-all;
  border: 1px solid #333;
  color: #61dafb;
`;

const StatusBadge = styled('span')`
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
  background: ${({ color }: { color: string }) => color};
  color: #fff;
`;

const Actions = styled('div')`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 12px;
  background: #252526;
  border-bottom: 1px solid #333;
`;

const ActionButton = styled('button')`
  background: #333;
  color: #ccc;
  border: 1px solid #444;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: #444;
    color: #fff;
    border-color: #555;
  }
  
  &:active {
    background: #222;
  }
`;

interface QueryDetailProps {
  queryKey: string;
  data: any;
  onMutate: (key: string) => void;
  onDelete: (key: string) => void;
}

export const QueryDetail: React.FC<QueryDetailProps> = ({ queryKey, data, onMutate, onDelete }) => {
  // Infer status with proper SWR state differentiation
  const hasError = !!data?.error;
  const hasData = data?.data !== undefined;

  let statusText: string;
  let statusColor: string;

  if (data?.isLoading) {
    statusText = 'LOADING';
    statusColor = '#61dafb';
  } else if (data?.isValidating) {
    statusText = 'REVALIDATING';
    statusColor = '#a78bfa';
  } else if (hasError) {
    statusText = 'ERROR';
    statusColor = '#f44336';
  } else if (hasData) {
    statusText = 'FRESH';
    statusColor = '#4caf50';
  } else {
    statusText = 'IDLE';
    statusColor = '#888';
  }

  return (
    <Container>
      <Toolbar>
        <span style={{ fontWeight: 'bold' }}>Query Details</span>
        <StatusBadge color={statusColor}>{statusText}</StatusBadge>
      </Toolbar>
      <Actions>
        <ActionButton onClick={() => onMutate(queryKey)}>Refetch / Invalidate</ActionButton>
        <ActionButton onClick={() => onDelete(queryKey)}>Remove</ActionButton>
      </Actions>
      <Content>
        <Section>
          <SectionTitle>Query Key</SectionTitle>
          <KeyTag>{queryKey}</KeyTag>
        </Section>
        
        {hasError && (
          <Section>
            <SectionTitle>Error</SectionTitle>
            <div style={{ background: '#2a0a0a', padding: '12px', borderRadius: '4px', border: '1px solid #5a1a1a', color: '#f44336', fontFamily: 'monospace', fontSize: 12, wordBreak: 'break-all' }}>
              {data.error instanceof Error ? data.error.message : String(data.error)}
            </div>
          </Section>
        )}

        <Section>
          <SectionTitle>Data</SectionTitle>
          <div style={{ background: '#111', padding: '12px', borderRadius: '4px', border: '1px solid #333' }}>
            <JsonViewer data={data?.data} initialOpen={true} />
          </div>
        </Section>

        <Section>
          <SectionTitle>SWR State</SectionTitle>
          <div style={{ background: '#111', padding: '12px', borderRadius: '4px', border: '1px solid #333' }}>
            <JsonViewer data={{ isLoading: data?.isLoading, isValidating: data?.isValidating, error: data?.error }} initialOpen={true} />
          </div>
        </Section>
      </Content>
    </Container>
  );
};
