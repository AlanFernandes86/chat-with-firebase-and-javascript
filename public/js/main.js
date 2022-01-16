import { database, analytics } from "./init-firebase.js";
import { ref, set, update, onValue, push} from "https://www.gstatic.com/firebasejs/9.6.3/firebase-database.js";
import { Observable } from "./observable.js";

class MainPage {
    constructor() {
        this._value = '';
        
        this._list = new Observable({});
        this._list.subscribe((newValue) => this.updateData(newValue));

        this._selectedLi = new Observable();
        this._selectedLi.subscribe((newValue) => this.hasSelected(newValue));
        
        this._htmlUl = document.getElementById('list-test');
                
        this._input = document.getElementById('input');
        this._btnInsert = document.getElementById('btn-insert');
        this._btnClear = document.getElementById('btn-clear');

        this.listeners();
    }

    
    listeners() {
        this._input.oninput = ({ target: { value } }) => this._value = value;
        
        this._input.onkeyup = ({ key }) => {
            if (key === 'Enter') this._btnInsert.click(); 
        }

        this._btnInsert.onclick = (_) => this.upsertData(this._selectedLi.value);

        this._btnClear.onclick = (_) => this._selectedLi.value = undefined;

        this._htmlUl.onclick = (event) => this.selectLi(event);

        onValue(ref(database, 'Testes'), (snapshot) => {
            this._list.value = snapshot.val();
        });
    }

    htmlReset() {
        this._htmlUl.innerHTML = '';
        this._input.value = '';
        this._btnInsert.innerText = 'Inserir';
    }
    
    updateData(data) {
        this.htmlReset();
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

    selectLi({ target: { id } , currentTarget: { childNodes } }) {
        childNodes.forEach( ({ classList, id: childId }) => {
            if (id === childId) { 
                classList.add('selected');
                this._selectedLi.value = id;
            } else {
                classList.remove('selected')
            };
        });
    }

    hasSelected(selected) {
        const li = document.querySelector('.selected');
        
        if (selected) {
            this._btnInsert.innerText = 'Atualizar';
            this._input.value = this._list.value[selected];
        } else {
            this._btnInsert.innerText = 'Inserir';
            this._input.value = '';
            li.classList.remove('selected');
        }

        this._input.focus();
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