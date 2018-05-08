const request = require('request');

const utils = require('./utils')

var cookie = request.jar();

function req(method, uri, header, param) {
  return new Promise((resolve, reject) => {
    request[method]({
      url: uri,
      jar: cookie,
      headers: header,
      qs: param
    }, (err, res, body) => {
      if (!err) resolve(body);
      reject(err);
    });
  });
}

function getToken(key) {
  return new Promise((resolve, reject) => {
    req(
      'get',
      'https://portal.hanyang.ac.kr/publicTk.do?keyNm=' + key,
      {'Content-Type': 'application/json+sua; charset=UTF-8'}
    ).then(res => {
      resolve(JSON.parse(res)['key'][0]['value']);
    }).catch(err => {
      reject(err);
    });
  });
}

function getUserInfo() {
  return new Promise((resolve, reject) => {
    req(
      'get',
      'https://portal.hanyang.ac.kr/port.do',
    ).then(res => {
      var user = {};
      utils.docufy(res).querySelector('head')
                       .textContent
                       .split(/\r?\n/)
                       .filter(line => line.startsWith('GNBServiceController'))
                       .forEach(line => {
                          var sentence = line.split('=');
                          var tag = sentence[0].split('.')[1].trim();
                          var value = sentence[1].replace(/['";]+/g, '').trim();
                          user[tag] = Buffer.from(Buffer.from(value, 'base64').toString('utf-8'), 'base64').toString('utf-8');
                       });
      resolve(user);
    }).catch(err => {
      reject(err);
    });
  });
}

module.exports = {
  req,
  getToken,
  getUserInfo
};
