require('update-electron-app')();

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('node:fs/promises');
const io = require('socket.io-client');

const serverURL = 'https://chatly-server.glitch.me';
// const serverURL = 'http://localhost:3000';

let socket = null;

let mainWindow;

const dataFilePath = path.join(app.getPath('userData'), 'data.json');

let myData = {
    me: {

    },
    contacts: []
};


if (require('electron-squirrel-startup')) {
    app.quit();
}

function loadMainScreen(window) {
    window.webContents.on('did-finish-load', () => {
        window.webContents.send('my-data', myData);
        initializeSocket();
    });
    window.loadFile(path.join(__dirname, 'renderer/html/index.html'));
}

async function getContactsID(id) {
    const response = await fetch(`${serverURL}/getContactsID?id=${id}`);
    if (response.ok) {
        return await response.json();
    }
}

async function loadContacts(id) {
    const contactsID = await getContactsID(id);
    contactsID.forEach(async (contactID) => {
        const response = await fetch(`${serverURL}/getContact?id=${contactID}`);
        if (response.ok) {
            const contact = await response.json();
            myData.contacts.push(contact);
        }
    })
}

function initializeSocket() {
    socket = io(serverURL, {
        auth: {
            user: {
                id: myData.me.id,
                username: myData.me.username,
                password: myData.me.password
            }
        }
    });
    socket.on('unDeliveredMessages', (messages) => {
        messages.forEach(message => {
            mainWindow.webContents.send('recieveMessage', message);
        });
    });
    socket.on('message', (message) => {
        mainWindow.webContents.send('recieveMessage', message);
    });
    socket.on('notification', (notification) => {
        mainWindow.webContents.send('notification', notification);
    })
}

async function isDataFileExists() {
    try {
        await fs.access(dataFilePath);
        return true;
    } catch {
        return false;
    }
}

async function loadData() {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    myData = JSON.parse(data);
}

async function registerMe(event, name, username, password) {
    try {
        const response = await fetch(`${serverURL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, username, password }),
        });
        if (response.ok) {
            const data = await response.json();
            myData = data;
            loadMainScreen(mainWindow);
        }
    } catch (err) {

    }
}

async function loginMe(event, username, password) {
    const response = await fetch(`${serverURL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });
    if (!response.ok || response.status === 401) {
        return false;
    }
    const me = await response.json();
    const contacts = await loadContacts(me.id);
    myData.me = me;
    myData.contacts = contacts;
    loadMainScreen(mainWindow);
    return true;
}



async function saveData(event, data = myData) {
    await fs.writeFile(dataFilePath, JSON.stringify(data), 'utf-8');
}

function sendMessage(event, message) {
    socket.emit('message', message);
}

const createWindow = async () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        autoHideMenuBar: true,
        icon: path.join(__dirname, '../assets/icon.png')
    });

    try {
        if (await isDataFileExists()) {
            await loadData();
            loadMainScreen(mainWindow);
        } else {
            mainWindow.loadFile(path.join(__dirname, 'renderer/html/firstTime.html'));
        }
    }
    catch (err) {

    }
    ipcMain.handle('register', registerMe);
    ipcMain.handle('login', loginMe);
    ipcMain.handle('saveData', saveData);
    ipcMain.handle('sendMessage', sendMessage);
};

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});