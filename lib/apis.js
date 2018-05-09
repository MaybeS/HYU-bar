const conn = require('./connection');
const utils = require('./utils')
const crypto = require('./crypto');

var isLogin = false;

function login(id, pw) {
  return new Promise((resolve, reject) => {
    var key = "sso_001"
    conn.getToken(key).then(token => {
      conn.req(
        'get',
        'https://portal.hanyang.ac.kr/sso/lgnp.do',
        {},{
          'loginGb': 1,
          'ipSecGb': 1,
          'systemGb': 'PORTAL',
          'keyNm': key,
          'userId': crypto(token, id),
          'password': crypto(token, pw)
      }).then(res => {
        conn.getUserInfo().then(user => {
          if (utils.docufy(res).getElementsByName('lginForm').length) {
            reject('ID or Password missmatch');
          } else if (isLogin) {
            reject('Already Login!');
          } else {
            isLogin = true;
            resolve(user);
          }
        }).catch(err => {
          reject('get user information failed');
        })
      }).catch(err => {
        reject('Network Error');
      });
    });
  });
};

module.exports = {
  login
}
