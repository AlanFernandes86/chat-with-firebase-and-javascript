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
</div>`;

class ProgressBar extends HTMLElement {
  connectedCallback() {

    this.appendChild(__template.content.cloneNode(true));

    this._linearProgress = undefined;

    this.initBar();
  }

  initBar() {
    const element = document.querySelector('.mdc-linear-progress');
    this._linearProgress = mdc.linearProgress.MDCLinearProgress.attachTo(element);
  }

  open() {
    this._linearProgress.foundation.adapter.addClass('mdc-linear-progress--indeterminate');
  }

  close() {
    this._linearProgress.foundation.adapter.removeClass('mdc-linear-progress--indeterminate');
  }

}

export const registerProgressBar = () => customElements.define('progress-bar', ProgressBar);