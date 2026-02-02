import React, { useState } from 'react';
import { styled } from 'goober';

const Container = styled('div')`
  font-family: monospace;
  font-size: 12px;
  line-height: 1.5;
`;

const Key = styled('span')`
  color: #881391;
  margin-right: 4px;
`;

const StringVal = styled('span')`
  color: #c41a16;
`;

const NumberVal = styled('span')`
  color: #1c00cf;
`;

const BooleanVal = styled('span')`
  color: #0d22aa;
`;

const NullVal = styled('span')`
  color: #808080;
`;

const Toggle = styled('span')`
  cursor: pointer;
  margin-right: 4px;
  user-select: none;
  color: #727272;
  font-size: 10px;
  display: inline-block;
  transform: ${({ open }: { open: boolean }) => (open ? 'rotate(90deg)' : 'rotate(0deg)')};
  transition: transform 0.1s;
`;

const ObjectContent = styled('div')`
  padding-left: 16px;
  border-left: 1px solid #eee;
  display: ${({ open }: { open: boolean }) => (open ? 'block' : 'none')};
`;



interface JsonViewerProps {
  data: any;
  name?: string;
  initialOpen?: boolean;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ data, name, initialOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const renderValue = (val: any) => {
    if (val === null) return <NullVal>null</NullVal>;
    if (val === undefined) return <NullVal>undefined</NullVal>;
    if (typeof val === 'string') return <StringVal>"{val}"</StringVal>;
    if (typeof val === 'number') return <NumberVal>{val}</NumberVal>;
    if (typeof val === 'boolean') return <BooleanVal>{val.toString()}</BooleanVal>;
    return null; // Objects/Arrays handled separately
  };

  const isObject = data !== null && typeof data === 'object';
  const isEmpty = isObject && Object.keys(data).length === 0;

  if (isObject) {
    const isArray = Array.isArray(data);
    const keys = Object.keys(data);
    const preview = isArray ? `Array(${keys.length})` : `{...}`;

    return (
      <Container>
        <div>
           {!isEmpty && <Toggle open={isOpen} onClick={() => setIsOpen(!isOpen)}>▶</Toggle>}
          {name && <Key>{name}: </Key>}
          <span style={{color: '#666', cursor: !isEmpty ? 'pointer' : 'default'}} onClick={() => !isEmpty && setIsOpen(!isOpen)}>
            {isEmpty ? (isArray ? '[]' : '{}') : preview}
          </span>
        </div>
        {!isEmpty && (
          <ObjectContent open={isOpen}>
            {keys.map((key) => (
              <JsonViewer
                key={key}
                name={key}
                data={data[key]}
                initialOpen={false}
              />
            ))}
          </ObjectContent>
        )}
      </Container>
    );
  }

  return (
    <Container>
      {name && <Key>{name}:</Key>}
      {renderValue(data)}
    </Container>
  );
};
