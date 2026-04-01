import React, { useState } from 'react';

type TreeNode = {
    id?: string;
    name: string;
    isOpen?: boolean;
    files?: TreeNode[];
};

const initialData: TreeNode[] = [
  {
    id: "1",
    name: "src",
    isOpen: true,
    files: [
      {
        name: "App.js",
      },
      {
        name: "components",
        isOpen: false,
        files: [
          {
            name: "Button.js",
          },
          {
            name: "Input.js",
          },
        ],
      },
    ],
  },
];

const toggleNode = (nodes: TreeNode[], nodeName: string): TreeNode[] =>
    nodes.map((node) => {
        if (node.name === nodeName && node.files) {
            return {
                ...node,
                isOpen: !node.isOpen,
            };
        }

        if (node.files) {
            return {
                ...node,
                files: toggleNode(node.files, nodeName),
            };
        }

        return node;
    });

type TreeItemProps = {
    node: TreeNode;
    onToggle: (nodeName: string) => void;
    depth?: number;
};

function TreeItem({ node, onToggle, depth = 0 }: TreeItemProps) {
    const canToggle = Boolean(node.files);

    return (
        <li style={{ listStyle: 'circle', marginBottom: '16px' }}>
            <button
                type="button"
                onClick={() => canToggle && onToggle(node.name)}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    border: 'none',
                    background: 'transparent',
                    padding: 0,
                    cursor: canToggle ? 'pointer' : 'default',
                    color: '#0f172a',
                    fontSize: '14px',
                }}
            >
                <span
                    style={{
                        backgroundColor: '#18b45b',
                        color: '#ffffff',
                        padding: '8px 14px',
                        borderRadius: '2px',
                        fontWeight: 600,
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        textAlign: 'center',
                    }}
                >
                    {node.name}
                    {node.files ? `[${node.isOpen ? '-' : '+'}]` : ''}
                </span>
            </button>

            {node.files && node.isOpen && node.files.length > 0 ? (
                <ul style={{ marginTop: '14px', marginLeft: '28px' }}>
                    {node.files.map((child) => (
                        <TreeItem key={child.name} node={child} onToggle={onToggle} depth={depth + 1} />
                    ))}
                </ul>
            ) : null}
        </li>
    );
}

const FileFolderStructure = () => {
    const [data, setData] = useState(initialData);

    const handleToggle = (nodeName: string) => {
        setData((currentData) => toggleNode(currentData, nodeName));
    };

    return (
        <section style={{ width: '750px', minHeight: '370px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)' }}>
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#1e293b', color: '#22c55e' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', backgroundColor: '#111827', color: '#86efac', fontSize: '11px', fontWeight: 700 }}>H</span>
                    <h1 style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>File Folder Structure</h1>
                </div>
                <input type="text" placeholder="Enter an item" style={{ width: '125px', height: '24px', border: '1px solid #cbd5e1', padding: '0 8px', fontSize: '10px', color: '#0f172a', outline: 'none', backgroundColor: '#f8fafc' }} />
            </header>
            <div style={{ padding: '16px 20px 8px' }}>
                <ul style={{ margin: 0, paddingLeft: '24px', textAlign: 'left' }}>
                    {data.map((node) => (
                        <TreeItem key={node.name} node={node} onToggle={handleToggle} />
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default FileFolderStructure;
