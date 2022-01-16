import { database, analytics } from "./init-firebase.js";
import { ref, set, update, onValue, push} from "https://www.gstatic.com/firebasejs/9.6.3/firebase-database.js";
import { Observable } from "./observable.js";

class MainPage {
    constructor() {
        this._value = '';

        this.listeners();

        this.list = new Observable({});
        this.list.subscribe((newValue) => this.listData(newValue));

        this._htmlUl = document.getElementById('list-test');
        this._htmlUl.onclick = this.selectLine;
    }

    
    listeners() {
        document.getElementById('input')
        .oninput = ({ target: { value } }) => this._value = value;

        document.getElementById('btn')
        .onclick = (_) => this.upsertData();

        onValue(ref(database, 'Testes'), (snapshot) => {
            this.list.value = snapshot.val();
        });
    }

    htmlUlReset() {
        this._htmlUl.innerHTML = '';
    }
    
    listData(data) {
        this.htmlUlReset();
        Object.entries(data).forEach( (entry) => {
            this._htmlUl
            .appendChild(this.createLi(entry));
        });
    }

    upsertData(key) {
        update(ref(database, 'Testes'), {
            [key || Date.now()] : this._value,
        });
    }

    deleteData({ target: { id } }) {
        update(ref(database, 'Testes'), {
            [id] : null,
        });
    }

    selectLine({ target: { id } , currentTarget }) {
        console.log(currentTarget);
    }
        
    createLi(data) {
        const li = document.createElement('li');
        
        const span = document.createElement('span');
        span.id = data[0];
        span.className = 'material-icons';
        span.innerText = 'delete';
        span.onclick = this.deleteData;
        
        li.append(span);

        li.id = data[0];
        li.append(`${data[0]} --> ${data[1]}`);
        
        return li;
    } 
}

export const mainPage = () => new MainPage();