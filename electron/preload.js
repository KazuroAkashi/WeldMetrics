const electron = require("electron");
const contextBridge = electron.contextBridge;
const ipcRenderer = electron.ipcRenderer;

contextBridge.exposeInMainWorld("api", {
  send: (name, ...params) => ipcRenderer.send(name, ...params),
  invoke: (name, ...params) => ipcRenderer.invoke(name, ...params),
});
