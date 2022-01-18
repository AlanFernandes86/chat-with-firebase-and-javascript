// Instantiation
// Padrão - >> https://stackoverflow.com/questions/62271636/material-io-with-cdn
const topAppBarElement = document.querySelector('.mdc-top-app-bar');
export const topAppBar = () => mdc.topAppBar.MDCTopAppBar.attachTo(topAppBarElement);