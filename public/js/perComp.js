//const templateLogin = document.getElementById('loginForm');
//const templateForgot = document.getElementById('forgotPwForm');

function showLogin(){
    var login = document.getElementById("loginForm");
    var forgot = document.getElementById("forgotPwForm");
    var btn = document.getElementById("enterButton");

    login.classList.remove("hidden");
    forgot.classList.add("hidden");
    btn.innerHTML = 'login';
   
    console.log("clicked");
}

function showForgotten(){
    var login = document.getElementById("loginForm");
    var forgot = document.getElementById("forgotPwForm");
    var btn = document.getElementById("enterButton");

    login.classList.add("hidden");
    forgot.classList.remove("hidden");
    // btn.innerHTML = 'reset';
    
    console.log("clicked");
}

function checkCredentials(){
    console.log("clicked");
}