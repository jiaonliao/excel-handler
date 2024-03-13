// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const {contextBridge, ipcRenderer} = require('electron/renderer')
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    };

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type]);
    }
});

contextBridge.exposeInMainWorld('fs', require('fs/promises'));
contextBridge.exposeInMainWorld('path', require('path'));
contextBridge.exposeInMainWorld("usrHomePth", () => process.env.HOME || process.env.USERPROFILE);
contextBridge.exposeInMainWorld("windowsCtrl", {
    close: () => {
        ipcRenderer.send('window-close');
    },
    min: () => {
        ipcRenderer.send('window-min');
    },
    max: () => {
        ipcRenderer.send('window-max');
    }
});