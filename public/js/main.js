import { database, analytics } from "./init-firebase.js";
import { ref, set, update, onValue, push } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-database.js";
import { Observable } from "./observable.js";

const __template = document.createElement('template');
__template.innerHTML = `<div role="progressbar" class="mdc-linear-progress" aria-label="Progress Bar" aria-valuemin="0" aria-valuemax="1"
aria-valuenow="0">
<div class="mdc-linear-progress__buffer">
  <div class="mdc-linear-progress__buffer-bar"></div>
  <div class="mdc-linear-progress__buffer-dots"></div>
</div>
<div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
  <span class="mdc-linear-progress__bar-inner"></span>
</div>
<div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
  <span class="mdc-linear-progress__bar-inner"></span>
</div>
</div>
<section class="message">
<div class="div-message">
  <label class="mdc-text-field mdc-text-field--outlined mdc-text-field--no-label" id="mdc-message">
    <span class="mdc-notched-outline">
      <span class="mdc-notched-outline__leading"></span>
      <span class="mdc-notched-outline__trailing"></span>
    </span>
    <input class="mdc-text-field__input" type="text" aria-label="Label" id="input-message">
  </label>

  <button class="mdc-button" id="btn-message">
    <span class="mdc-button__ripple"></span>
    <span class="mdc-button__label"></span>
  </button>
</div>
<ul id="test-list" class="ul-main"></ul>
</section>`;

class MainPage extends HTMLElement {

    connectedCallback(user) {

        //let shadowRoot = this.attachShadow({mode: 'open'});

        this.appendChild(__template.content.cloneNode(true));

        this._user = user;

        this._value = '';

        this._list = new Observable({});
        this._list.subscribe((newValue) => this.updateData(newValue));

        this._selectedId = new Observable();
        this._selectedId.subscribe((newValue) => this.hasSelected(newValue));

        this._htmlUl = document.getElementById('test-list');

        this._input = document.getElementById('input-message');
        this._btnMessage = document.getElementById('btn-message');

        this.listeners();
        this.materialDesign();
        //this.progressBar();
    }

    listeners() {
        this._input.oninput = ({ target: { value } }) => this._value = value;

        this._input.onkeyup = ({ key }) => {
            if (key === 'Enter') this._btnMessage.click();
        }

        this._btnMessage.onclick = (_) => this.upsertData(this._selectedId.value);

        this._htmlUl.onclick = (event) => this.selectLi(event);

        onValue(ref(database, 'Testes'), (snapshot) => {
            this._list.value = snapshot.val();
        });
    }

    materialDesign() {
        mdc.textField.MDCTextField.attachTo(document.getElementById('mdc-message'));
        mdc.ripple.MDCRipple.attachTo(this._btnMessage);
    }

    progressBar() {
        const linearProgress = document.querySelector('.mdc-linear-progress');
        mdc.linearProgress.MDCLinearProgress.attachTo(linearProgress);
        linearProgress.classList.add('mdc-linear-progress--indeterminate');
        
        console.dir(linearProgress);
    }

    htmlReset() {
        this._htmlUl.innerHTML = '';
        this._input.value = '';
        this._btnMessage.innerText = 'Inserir';
    }

    updateData(data) {
        this.htmlReset();
        Object.entries(data).forEach((entry) => {
            this._htmlUl
                .appendChild(this.createLi(entry));
        });
    }

    upsertData(key) {
        update(ref(database, 'Testes'), {
            [key || Date.now()]: this._value,
        })
            .then(() => this._selectedId.value = undefined)
            .catch((error) => console.error(error));
    }

    deleteData({ target: { id } }) {
        update(ref(database, 'Testes'), {
            [id]: null,
        });
    }

    selectLi({ target: { id }, currentTarget: { childNodes } }) {
        if (!Array.from(childNodes).find(({ id: childId }) => childId === id)) return;

        childNodes.forEach(({ classList, id: childId }) => {
            if (id === childId) {
                classList.add('selected');
                this._selectedId.value = id;
            } else {
                classList.remove('selected')
            };
        });
    }

    hasSelected(selected) {
        if (selected) {
            this._btnMessage.innerText = 'Atualizar';
            this._input.value = this._list.value[selected];
        } else {
            const li = document.querySelector('.selected');
            this._btnMessage.innerText = 'Inserir';
            this._input.value = '';
            if (li) li.classList.remove('selected');
        }
        this._input.dispatchEvent(new Event('input'));
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

export const registerMainPage = (user) => customElements.define('main-page', MainPage);

class SignInPage extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<h2>Você não está logado!</h2>`
    }
}

export const registerSignInPage = () => customElements.define('sign-in-page', SignInPage);

