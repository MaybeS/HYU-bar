const ipcMain = require('electron').ipcMain;
const menubar = require('menubar');

const apis = require('./lib/apis')
const crypto = require('./lib/crypto')
const config = require('./config')

const mb = menubar({
  width: config.width,
  height: config.height,
  dir: config.dir
});

mb.on('ready', function ready() {})

ipcMain.on('login', (e, id, pw) => {
  apis.login(id, pw).then(res => {
      e.sender.send('sign', res);
    }).catch(err => {
      e.sender.send('sign', false)
    });
});

ipcMain.on('get', (e, t) => {
  apis.get(t).then(res => {
    e.sender.send('response', res);
  }).catch(err => {
    e.sender.send('response', false)
  });
});

ipcMain.on('hide', () => {
  mb.app.hide()
})
