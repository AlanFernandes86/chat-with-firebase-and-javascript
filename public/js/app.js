import { topAppBar } from './header.js';
import { registerMainPage, registerSignInPage } from "./main.js";
import { registerProgressBar } from './progress-bar.js';
import { signIn, singOut, getResult, onStateChanged } from "./firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-database.js";
import { database } from "./init-firebase.js";

const app = async () => {
    topAppBar();
    registerMainPage();
    registerSignInPage();
    registerProgressBar();
    await login();
}

async function login() {
    const root = document.getElementById('root-element');
    const btnLogin = document.getElementById('login');
    const progress = document.createElement('progress-bar');
    const mainPage = document.createElement('main-page');

    root.before(progress);
    progress.open();
    
    await getResult()
        .then(async (result) => {
            const { uid, displayName, photoURL } = result.user;
            set(ref(database, `users/${uid}`), { 
                name: displayName,
                photoUrl: photoURL,
            });
        })
        .catch((error) => {

        });
    
    await onStateChanged(async (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            const uid = user.uid;
            mainPage.user = user;
            root.appendChild(mainPage);        
            btnLogin.innerText = 'logout';
            btnLogin.onclick = singOut;
            progress.remove();
        } else {
            root.innerHTML = '<sign-in-page></sign-in-page>';
            btnLogin.innerText = 'login';
            btnLogin.onclick = signIn;
            progress.remove();
        }
    });
    
}


document.addEventListener('DOMContentLoaded', app);