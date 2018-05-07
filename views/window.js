const {ipcRenderer} = require('electron');

const bLogin = window.document.getElementById('btn-login');
bLogin.onclick = function() {
  const id = window.document.getElementById('id').value;
  const pw = window.document.getElementById('password').value;
  ipcRenderer.send('login', id, pw);
  ipcRenderer.once('sign', (e, success) => {
    if (success == 'success') {
      ipcRenderer.send('get', 'classes');
      ipcRenderer.once('response', (e, result) => {
        alert('get success');
      });
    } else {
      alert('login failed');
    }
  });
}
