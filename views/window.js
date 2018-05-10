const {ipcRenderer} = require('electron');

const bLogin = window.document.getElementById('btn-login');

bLogin.onclick = function() {
  ipcRenderer.send('login',
                    window.document.getElementById('id').value, 
                    window.document.getElementById('password').value);
}

ipcRenderer.on('sign', (e, success, res) => {
  if (!success) alert('Login failed\n' + res);
  else {
    alert('Login!');
    for (const [key, value] of Object.entries(res)) {
      console.log(key, value);
    }
  }
});