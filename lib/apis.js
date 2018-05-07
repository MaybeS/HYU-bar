const crypto = require('./crypto')

const request = require('request');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var cookie = request.jar();

function getToken(key) {
  return new Promise((resolve, reject) => {
    request({
      url: 'https://portal.hanyang.ac.kr/publicTk.do?keyNm=' + key,
      jar: cookie,
      headers: {
        'Content-Type': 'application/json+sua; charset=UTF-8'
      }
    }, (e, r, b) => {
      if (!e && r.statusCode == 200) {
        resolve(JSON.parse(b)['key'][0]['value']);
      }
      reject();
    });
  });
}

function login(id, pw) {
  return new Promise((resolve, reject) => {
    var key = "sso_001"
    getToken(key).then((token) => {
      var cid = crypto(token, id);
      var cpw = crypto(token, pw);
      request({
        url: 'https://portal.hanyang.ac.kr/sso/lgnp.do',
        qs: {
          'loginGb': 1,
          'ipSecGb': 1,
          'systemGb': 'PORTAL',
          'keyNm': key,
          'userId': cid,
          'password': cpw
        }
      }, (e, r, b) => {
        if (!e && r.statusCode == 200) {
          const dom = new JSDOM(b);
          var loginForm = dom.window.document.getElementsByName('lginForm');
          resolve(loginForm.length ? 'failed' : 'success');
        }
        reject();
      });
    });
  });
};

const services = { 
  'origin': 'https://portal.hanyang.ac.kr/port.do#!',
  'classes': 'UDMwOTY0OSRAXmhha3NhLyRAXjAkQF5NMDA3MjYxJEBe64K06rCV7J2Y7IukJEBeTTAwMzc4MSRAXmY4MzgzMzEzYjI5MWNmZDA4YmFjYTE3ZjdlM2I0MTNlM2M5OWY3YzQ3MzdmMWUxNmIzNDhjOTEwMjYwYWQ1MGU='
}

function domParser(body, t) {
  console.log('domparser called')
  const dom = new JSDOM(body);
  if (t == 'classes') {
    var table = dom.window.document.getElementsByName('ilbanGangjwaStud');
    console.log(table);
  }
}

function get(t) {
  return new Promise((resolve, reject) => {
    request.get({
      url: services.origin + services[t],
      jar: cookie
    }, (e, r, b) => {
      if (!e && r.statusCode == 200) {
        resolve(domParser(b, t));
      }
      reject();
    });
  });
};


module.exports = {
  login,
  get
}
