const crypto = require('./crypto')

const request = require('request');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var cookie = request.jar();
var user = {};

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
      const dom = new JSDOM(res);
      dom.window.document.querySelector('head')
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

function login(id, pw) {
  return new Promise((resolve, reject) => {
    var key = "sso_001"
    getToken(key).then(token => {
      req(
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
        getUserInfo().then(info => {
          user = info;
          const dom = new JSDOM(res);
          var loginForm = dom.window.document.getElementsByName('lginForm');
          resolve(loginForm.length ? 'failed' : 'success');
        }).catch(err => {
          reject('get user information failed');
        })
      }).catch(err => {
        reject('login failed');
      });
    });
  });
};

const services = { 
  'origin': 'https://portal.hanyang.ac.kr/',
  'classes': {
    'url': 'haksa/SuscAct/findMyHomeCourse.do?pgmId={pid}&menuId={mid}&tk={tk}',
    'param': {
      'pid': 'P309649',
      'mid': 'M007261',
      'tk': 'f8383313b291cfd08baca17f7e3b413e3c99f7c4737f1e16b348c910260ad50e'
    }, 'payload': {
      "strTermYear": "2018",
      "strTermCd": "10",
      "strSiteId": "lc1",
      "strAspId": "ASP00001",
      "strUserNo": "2015004584",
      "strRoleGb": "5",
      "strSelGroupCd": "HY"
    }
  }
};

const tokens = {};

function domParser(body, t) {
  const dom = new JSDOM(body);
  if (t == 'classes') {
    var table = dom.window.document.getElementsByName('ilbanGangjwaStud');
  }
}

function get(t) {
  return new Promise((resolve, reject) => {
    request.get({
      url: services.origin + services[t],
      jar: cookie
    }, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        resolve(domParser(body, t));
      }
      reject(err);
    });
  });
};


module.exports = {
  login,
  get
}
