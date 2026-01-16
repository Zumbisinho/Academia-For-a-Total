const btn = document.getElementById('logged-btn')
const login = document.querySelector('.login-ul')
const logado = document.querySelector('.logged-wrapper')
const dropdown = document.querySelector('.logged-options')
const nome = document.querySelector('.logged-wrapper .name')
const foto = document.querySelector('.logged-wrapper .foto')
let menuOn = false
btn.addEventListener('click', function() {
    if (menuOn === false) {
        dropdown.style.display = 'block'
        menuOn = true
    } else {
        dropdown.style.display = 'none'
        menuOn = false
    }
})

function getCookie(name) {
    const nameEQ = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}
username = getCookie('username')
if (username != null) {
    login.style.display = 'none'
    logado.style.display = 'block'
    nome.innerText = username
    foto.innerText = username[0]


}