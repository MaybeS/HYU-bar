
function login(id, pw) {
    return new Promise((resolve, reject) => {
      resolve('ok');
    });
};


function getClasses() {
  return [{
    'name': '데이터 사이언스',
    'id': 'ITE4005'
  }, {
    'name': '컴퓨터 그래픽스',
    'id': 'CSE4020'
  }]
};


module.exports = {
  login,
  getClasses
}
