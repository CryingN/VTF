function url_encode_str(input) {
    // 对输入字符串进行 URI 编码，确保所有字符都是安全的
    let encoded = encodeURIComponent(input).replace(/%([0-9A-F]{2})/g,
        function(match, p1) {
            return String.fromCharCode('0x' + p1);
        }
    );
    // 对编码后的字符串进行 Base64 编码
    let base64 = window.btoa(encoded);
    // 替换掉 Base64 编码中的 URL 不安全字符
    base64 = base64.replace(/\+/g, '-'); // 替换 + 为 -
    base64 = base64.replace(/\//g, '_'); // 替换 / 为 _
    base64 = base64.replace(/=+$/, '');  // 去除末尾的 =

    return base64;
}

// post传递数据
function post_data(data, route) {
    console.log("发送信息ing...");
    /*******************************************************
    *   这里留了一个大坑, 不知道为什么firefox无法返回数值
    ********************************************************/
    const XHR = new XMLHttpRequest();  
    XHR.addEventListener("load", (event) => {
        console.log("发送成功, 正在校验账号");
    });
    
    // 错误提示
    XHR.addEventListener("error", (event) => {
        console.log("Error: 发送失败");
    });

    // 建立请求
    XHR.open("POST", route);
    XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    XHR.send(data);
}

// 注册函数
function refusrer() {
    var id = url_encode_str(document.getElementById('id').value);
    var email = url_encode_str(document.getElementById('email').value);
    var passwd = document.getElementById('passwd').value;
    var passwdagain = document.getElementById('passwdagain').value;
    if (passwd === passwdagain) {             
        const data = "id=" + id + "&email=" + email + "&passwd=" + url_encode_str(passwd);
        post_data(data, '/refusrerapi');
    } else {
        alert("Error: 密码不一致");
    }
}

// 更新密码函数
function fixpasswd() {
    var oldpasswd = url_encode_str(document.getElementById('old-passwd').value);
    var newpasswd = document.getElementById('new-passwd').value;
    var passwdagain = document.getElementById('passwd-again').value;
    if (newpasswd === passwdagain) {
        const data = "oldpasswd=" + oldpasswd + "&newpasswd=" + url_encode_str(newpasswd);
        post_data(data, '/memberapi');
    } else {
        alert("Error: 密码不一致");
    }
}

// 登录函数
function passwdlogin() {
    /*****************************
    *   修改方法参考main.v文件
    ******************************/
    var email = url_encode_str(document.getElementById('email').value);
    var passwd  = url_encode_str(document.getElementById('passwd').value);
    const data = "email=" + email + "&passwd=" + passwd;
    post_data(data, '/loginapi');
    location.reload();
}

// 登出函数
function logout() {
    delCookie('id');
    delCookie('passdwd');
    location.reload();
}

// 提交flag
function inputflag(flag, name){
    const data = "flag=" + flag + "&name=" + name;
    post_data(data, '/flagapi')
}

/*****************
 * cookie管理函数
*****************/ 

// 删除cookie
function delCookie(name){
   document.cookie = name+"=;expires="+(new Date(0)).toGMTString();
}

// 查询cookie
function findCookie(name){
    var re =new RegExp('(?:(?:^|.*;\\s*)' + name + '\\s*\=\\s*([^;]*).*$)|^.*$');
    // /(?:(?:^|.*;\s*) name \s*\=\s*([^;]*).*$)|^.*$/
    return document.cookie.replace(re, "$1")
}

/*****************
 * 节点管理函数
*****************/ 

// 对非权限用户去掉console节点
function KillConsole() {
    var the_console = document.getElementsByClassName('navbar-list')[0];
    the_console.removeChild(the_console.firstElementChild);
}

// 对未登录用户修改为注册和登录节点
function NoLog() {
    const cookie_id = findCookie('id');
    const cookie_whoami = findCookie('whoami');
    if (cookie_id == "") {
        var the_team = document.getElementById('navbar4');
        var the_member = document.getElementById('navbar5');
        the_team.innerText = "注册";
        the_member.innerText = "登录";
        the_team.href = "refusrer.html";
        the_member.href = "login.html";
    };
    if (cookie_whoami != "root") {
        KillConsole();
    };

}

NoLog();

