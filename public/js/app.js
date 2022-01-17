import { topAppBar } from './header.js';
import { registerMainPage, registerSignInPage } from "./main.js";
import { signIn, singOut, getResult, onStateChanged } from "./firebase-auth.js";


const app = async () => {
    topAppBar();
    registerMainPage();
    registerSignInPage();
    await login();
}

async function login() {
    const root = document.getElementById('root-element');
    const btnLogin = document.getElementById('login');
    const singInPage = document.createElement('sign-in-page');
    const mainPage = document.createElement('main-page');
    const linearProgress = mdc.linearProgress.MDCLinearProgress.attachTo(document.querySelector('.mdc-linear-progress'));   
    linearProgress.foundation.adapter.addClass('mdc-linear-progress--indeterminate');

    console.dir(linearProgress);

    await onStateChanged(async (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            const uid = user.uid;
            
            root.appendChild(mainPage);            
            btnLogin.innerText = 'logout';
            btnLogin.onclick = singOut;
        } else {
            root.appendChild(singInPage);
            btnLogin.innerText = 'login';
            btnLogin.onclick = signIn;
        }
    });

    

    await getResult()
        .then((result) => {
            console.log(result.user);
        })
        .catch((error) => {

        });
}


document.addEventListener('DOMContentLoaded', app);