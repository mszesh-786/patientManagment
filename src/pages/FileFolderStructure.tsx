const initialData = [
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
  {
    id: "2",
    name: "public",
    isOpen: true,
    files: [
      {
        name: "index.html",
      },
      {
        name: "favicon.ico",
      },
    ],
  },
  {
    id: "3",
    name: "node_modules",
    isOpen: false,
    files: [
      {
        name: "react",
      },
      {
        name: "react-dom",
      },
    ],
  },
  {
    id: "4",
    name: "Git",
    isOpen: false,
    files: [
      {
        name: "commit1",
      },
      {
        name: "commit2",
      },
    ],
  },
];
import React, { useState } from "react";

const addFileToNode = (nodes, nodeName, fileName) =>
  nodes.map((node) => {
    if (node.name === nodeName) {
      return {
        ...node,
        files: node.files
          ? [...node.files, { name: fileName }]
          : [{ name: fileName }],
        isOpen: true,
      };
    }

    if (node.files) {
      return {
        ...node,
        files: addFileToNode(node.files, nodeName, fileName),
      };
    }

    return node;
  });
const onChangeName = (nodes, nodeName, newName) =>
  nodes.map((node) => {
    if (node.name === nodeName) {
      return {
        ...node,
        name: newName,
      };
    }

    if (node.files) {
      return {
        ...node,
        files: onChangeName(node.files, nodeName, newName),
      };
    }
    return node;
  });

const onDeleteFolderNode = (nodes, nodeName) => {
 return nodes
    .filter((node) => (node.name !== nodeName))
    .map((node) => {
      if (node.files) {
        return {
          ...node,
          files: onDeleteFolderNode(node.files, nodeName),
        };
      }
      return node;
    })
}
const TreeItem = ({
  node,
  onToggle,
  onAddFile,
  depth = 0,
  fileName,
  onChangeFolderName,
  onDeleteNode,
}) => {
  const canToggle = Boolean(node.files);
  const [dblClick, setDblClick] = useState(false);
  const [folderName, setFolderName] = useState("");

  return (
    <ul>
      <li>
        {!dblClick ? (
          <div style={{ display: "flex", gap: "5px" }}>
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                border: "none",
                background: "transparent",
                padding: 0,
                cursor: canToggle ? "pointer" : "default",
                color: "#0f172a",
                fontSize: "14px",
              }}
              onClick={() => canToggle && onToggle(node.name)}
              onDoubleClick={() => setDblClick(true)}
            >
              <span
                style={{
                  backgroundColor: "#18b45b",
                  color: "#ffffff",
                  padding: "8px 14px",
                  borderRadius: "2px",
                  fontWeight: 600,
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  textAlign: "center",
                }}
              >
                {node.name} {node.files ? `[${node.isOpen ? "-" : "+"}]` : ""}
              </span>
            </button>
            <button
              onClick={() => onDeleteNode(node.name)}
              style={{
                backgroundColor: "red",
                color: "#ffffff",
                padding: "8px 14px",
                borderRadius: "2px",
                fontWeight: 600,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                textAlign: "center",
              }}
            >
              <span>[x]</span>
            </button>
          </div>
        ) : (
          <input
            autoFocus
            type="text"
            placeholder="Enter folder name"
            onChange={(e) => setFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onChangeFolderName(node.name, folderName);
                setDblClick(false);
              }
              console.log(e.key);
              if (e.key === "Escape") setDblClick(false);
            }}
          />
        )}
        {node.files && node.isOpen && node.files.length > 0 ? (
          <ul style={{ marginTop: "14px", marginLeft: "28px" }}>
            {node.files.map((child) => (
              <TreeItem
                key={child.name}
                node={child}
                onToggle={onToggle}
                onAddFile={onAddFile}
                depth={depth + 1}
                fileName={fileName}
                onChangeFolderName={onChangeFolderName}
                onDeleteNode={onDeleteNode}
              />
            ))}
            <button
              style={{
                backgroundColor: "#18b45b",
                color: "#ffffff",
                padding: "8px 14px",
                borderRadius: "2px",
                fontWeight: 600,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                textAlign: "center",
              }}
              onClick={() => onAddFile(node.name, fileName)}
            >
              <span>[+]</span>
            </button>
          </ul>
        ) : null}
      </li>
    </ul>
  );
};
const toggleNode = (nodeData, nodeName) =>
  nodeData.map((node) => {
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

const FileFolderStructure = () => {
  const [data, setData] = useState(initialData);
  const [newFileName, setNewFileName] = useState("");

  const handleToggle = (nodeName: string) => {
    setData((currentData) => toggleNode(currentData, nodeName));
  };

  const handleAddFile = (nodeName: string, fileName: string) => {
    const trimmedFileName = fileName.trim();
    if (!trimmedFileName) {
      window.alert("File name cannot be empty");
      return;
    }

    setData((currentData) =>
      addFileToNode(currentData, nodeName, trimmedFileName),
    );
    setNewFileName("");
  };
  const handleChangeName = (nodeName: string, fileName: string) => {
    const trimmedFileName = fileName.trim();
    if (!trimmedFileName) {
      window.alert("Folder name cannot be empty");
      return;
    }
    setData((currentData) => onChangeName(currentData, nodeName, fileName));
  };
  const handleDeleteNode = (nodeName: string) => {
    setData((currentData) => onDeleteFolderNode(currentData, nodeName));
  };
  function findMin(arr){
            let temp = arr[0];
        

    for(let i=1; i< arr.length;i++)
    {
       if(arr[i] < temp)
       {
        temp = arr[i];
       }

    }
    return temp;

  }
  function fabonacci(n){
    if(n<=1) return n;
    return fabonacci(n-1) + fabonacci(n-2)
  }
  console.log(fabonacci(3))

  return (
    <section
      style={{
        width: "750px",
        minHeight: "370px",
        backgroundColor: "#f8fafc",
        border: "1px solid #cbd5e1",
        boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
      }}
    >
      <input
        type="text"
        placeholder="Enter file name"
        value={newFileName}
        onChange={(e) => setNewFileName(e.target.value)}
      />
      <div>
        <h1>File Folder Structure</h1>
        <div style={{ padding: "16px 20px 8px" }}>
          <ul style={{ margin: 0, paddingLeft: "24px", textAlign: "left" }}>
            {data.map((node) => (
              <TreeItem
                key={node.id}
                node={node}
                onToggle={handleToggle}
                onAddFile={handleAddFile}
                onChangeFolderName={handleChangeName}
                onDeleteNode={handleDeleteNode}
                fileName={newFileName}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
export default FileFolderStructure;
