const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    onReceiveData: (callback) => ipcRenderer.on('my-data', (event, data) => callback(data)),
    onRecieveMessage : (callback) => ipcRenderer.on('recieveMessage', (event, message) => callback(message)),
    onRecieveNotification : (callback) => ipcRenderer.on('notification', (event, notification) => callback(notification)),
    register: (name, username, password) => ipcRenderer.invoke('register', name, username, password),
    login: async (username,password) => ipcRenderer.invoke('login',username,password),
    saveData: (data) => ipcRenderer.invoke('saveData', data),
    sendMessage : ( message) => ipcRenderer.invoke('sendMessage', message),
});