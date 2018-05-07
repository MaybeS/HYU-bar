const {ipcRenderer} = require('electron');

const bLogin = window.document.getElementById('btn-login');
bLogin.onclick = function() {
  const id = window.document.getElementById('id').value;
  const pw = window.document.getElementById('password').value;
  ipcRenderer.send('login', id, pw);
  ipcRenderer.once('sign', (e, success) => {
    if (success) {
      alert('login success');
    } else {
      alert('login failed');
    }
  });
}
