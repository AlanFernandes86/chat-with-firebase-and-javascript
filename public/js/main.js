import { database, analytics } from "./init-firebase.js";
import { ref, set, update, onValue, push, child, get, onChildAdded } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-database.js";
import { Observable } from "./observable.js";

const __template = document.createElement('template');
__template.innerHTML = `<section class="message">
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

    connectedCallback() {

        //let shadowRoot = this.attachShadow({mode: 'open'});

        this.appendChild(__template.content.cloneNode(true));

        this._value = '';

        this._list = new Observable();
        this._list.subscribe((newValue) => this.updateData(newValue));

        this._selectedId = new Observable();
        this._selectedId.subscribe((newValue) => this.hasSelected(newValue));

        this._htmlUl = document.getElementById('test-list');

        this._input = document.getElementById('input-message');
        this._btnMessage = document.getElementById('btn-message');

        this._progress = document.createElement('progress-bar');
        this.before(this._progress);
        this._progress.open();

        this.listeners();
        this.materialDesign();
    }

    listeners() {
        this._input.oninput = ({ target: { value } }) => this._value = value;

        this._input.onkeyup = ({ key }) => {
            if (key === 'Enter') this._btnMessage.click();
        }

        this._btnMessage.onclick = (_) => this.upsertData(this._selectedId.value);

        this._htmlUl.onclick = (event) => this.selectLi(event);

        onValue(ref(database, 'messages'), async (snap) => {
            const acc = [];

            const entries = Object.entries(snap.val());

            entries.forEach(([key, { message, uid }], index, array) => {

                get(ref(database, `users/${uid}`)).then((snapshot) => {
                    const { name, photoUrl } = snapshot.val();
                    acc.push(
                        {
                            time: key,
                            uid,
                            name,
                            photoUrl,
                            message,
                        }
                    );
                    
                    if (index === array.length - 1) this._list.value = acc;
                });

            });

        });

    }

    materialDesign() {
        mdc.textField.MDCTextField.attachTo(document.getElementById('mdc-message'));
        mdc.ripple.MDCRipple.attachTo(this._btnMessage);
    }

    htmlReset() {
        this._htmlUl.innerHTML = '';
        this._input.value = '';
        this._btnMessage.innerText = 'Inserir';
    }

    updateData(data) {
        this.htmlReset();

        data.forEach((message) => {
            this._htmlUl.appendChild(this.createLi(message));
        })

        this._progress.remove();
    }

    createLi({ time, uid, name, photoUrl, message }) {
        const li = document.createElement('li');

        const span = document.createElement('span');
        span.id = time;
        span.className = 'material-icons';
        span.innerText = 'delete';
        span.onclick = this.deleteData;

        li.append(span);

        li.id = time;
        li.append(`${name} : ${message}`);

        return li;
    }

    upsertData(key) {
        console.log(this._user);
        const reference = ref(database, `messages/${key || Date.now()}`);
        update(reference, {
            uid: this._user.uid,
            message: this._value,
        })
            .then(() => this._selectedId.value = undefined)
            .catch((error) => console.error(error));
    }

    deleteData({ target: { id } }) {
        update(ref(database, 'messages'), {
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
            this._input.value = this._list.value.find(({ time }) => time === selected).message;
        } else {
            const li = document.querySelector('.selected');
            this._btnMessage.innerText = 'Inserir';
            this._input.value = '';
            if (li) li.classList.remove('selected');
        }
        this._input.dispatchEvent(new Event('input'));
        this._input.focus();
    }

    set user(val) {
        this._user = val;
    }
}

export const registerMainPage = () => customElements.define('main-page', MainPage);

class SignInPage extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<h2>Você não está logado!</h2>`
    }
}

export const registerSignInPage = () => customElements.define('sign-in-page', SignInPage);

