import { database, analytics } from "./init-firebase.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-database.js";

class MainPage {
    constructor() {
        this._value = '';
        this.listeners();
    }
    
    listeners() {
        document.getElementById('input')
        .oninput = ({ target: { value : value} }) => this._value = value;

        document.getElementById('btn')
        .onclick = (_) => this.gravarDados();
    }  

    gravarDados() {
        console.log(this._value);
        set(ref(database, 'Testes'), {
            input: 'this._value',
        })
    }

}

export const mainPage = () => new MainPage();