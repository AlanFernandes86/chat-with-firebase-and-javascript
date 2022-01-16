import { topAppBar } from './header.js';
import { mainPage } from "./main.js";
import { signIn, singOut, getResult, onStateChanged } from "./firebase-auth.js";


const app = async () => {
    topAppBar();
    await login();
}

async function login() {
    const btnLogin = document.getElementById('login');

    await onStateChanged((user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            const uid = user.uid;
            console.log(uid);
            console.log(user);
        
            mainPage(user);
            btnLogin.innerText = 'logout';
            btnLogin.onclick = singOut;
        } else {
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