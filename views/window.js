const {ipcRenderer} = require('electron');

const bLogin = window.document.getElementById('btn-login');

var user = {};

bLogin.onclick = function() {
  ipcRenderer.send('login',
                    window.document.getElementById('id').value, 
                    window.document.getElementById('password').value);
}

ipcRenderer.on('sign', (e, success, res) => {
  if (!success) alert('Login failed\n' + res);
  else {
    alert('Login!')
    user = res;
    ipcRenderer.send('get', 'classes'); 
  }
});

ipcRenderer.on('response', (e, result) => {
  alert('get success');
});
