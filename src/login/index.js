const check = require('../utils/check.js');
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import './index.less'
// console.log(check);
// console.log(check.checkphone(138888888888));
// console.log(check.checkcode(666666));
import myAxios from '../utils/request.js'
import myAlert from '../utils/alert.js'
document.querySelector('.btn-primary').addEventListener('click', function () {
    let phone = document.querySelector('[name="mobile"]').value;
    let code = document.querySelector('[name="code"]').value;
    if(!check.checkphone(phone)){
        return alert('手机号码格式不正确');
    }
    if(!check.checkcode(code)){
        return alert('验证码格式不正确');
    }
    // alert('提交成功');
    myAxios({
      url: '/v1_0/authorizations',
      method: 'POST',
      data: {
        mobile: phone,
        code: code
      }
    }).then(res => {
      myAlert(true, '登录成功')
      setTimeout(() => {
        localStorage.setItem('token', res.data.token)
        location.href = '../content/index.html'
      },1500)
    }).catch(error => {
      myAlert(false, error.response.data.message)
    })
})

import imgsrc from './assets/logo.png'
const img=document.createElement('img');
img.src=imgsrc;
document.querySelector('.login-wrap').appendChild(img)

if(process.env.NODE_ENV === 'production'){
  console.log=function(){};
}
console.log(11);