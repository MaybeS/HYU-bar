const ipcMain = require('electron').ipcMain;
const menubar = require('menubar');

const apis = require('./lib/apis');
const crypto = require('./lib/crypto');
const config = require('./config');

const menu = menubar({
  width: config.width,
  height: config.height,
  dir: config.dir
});

menu.on('ready', function ready() {});

ipcMain.on('login', (e, id, pw) => {
  apis.login(id, pw).then(res => {
    e.sender.send('sign', true, res);
  }).catch(err => {
    e.sender.send('sign', false, err)
  });
});

ipcMain.on('hide', () => {
  menu.app.hide()
});
