function login_github () {
    location.href = 'https://github.com/login/oauth/authorize?client_id=' +
        'ddfaf7a04a86ca27e7ad' +
        '&redirect_uri=http://127.0.0.1:3001/open-api/authorization/github'
}

function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] === variable){return pair[1];}
    }
    return false;
}
window.onload = function () {
    const aAuthCode = getQueryVariable('code')
    const code_dom = document.querySelector('#code')
    if (aAuthCode) {
        if (code_dom) {
            document.querySelector('#login').style.display = 'none'
            code_dom.style.display = 'block'
            code_dom.innerHTML = `登录github 成功!<br><br><br>复制此code以用作api请求aAuth头:  ${aAuthCode}`
        }

    } else {
        if (code_dom)  {
            document.querySelector('#login').style.display = 'inline-block'
            code_dom.style.display = 'none'
            code_dom.innerHTML = ''
        }
    }
}
