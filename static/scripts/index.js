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
const queue = []
let IsalertShowing = false
async function createAlert(title, desc, timeout) {
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    const descArea = document.getElementById('alertDesc')
    const progressbar = document.getElementById('alert-progress')
    const titleArea = document.getElementById('alertName')
    const alertContainer = document.getElementById('alert')
    console.log(queue.length)
    if (queue.length == 0 && !IsalertShowing) {
        IsalertShowing = true
        progressbar.setAttribute('value', 0)
        alertContainer.style.display = 'inline-block'
        alertContainer.classList.remove('exit-anim')
        titleArea.innerText = title
        descArea.innerText = desc
        setInterval(() => {
            progressbar.setAttribute('value', parseInt(progressbar.getAttribute('value')) + 1)
        }, timeout * 10)
        setTimeout(() => {
            alertContainer.classList.add('exit-anim');
            process()
        }, timeout * 1000)
        return
    } else { queue.push([title, desc, timeout]) }



    async function process() {
        console.log(queue)
        while (queue.length > 0) {

            await sleep(0.5)
            const Data = queue.shift()
            const { Title, Desc, Timeout } = Data
            progressbar.setAttribute('value', 0)
            alertContainer.style.display = 'inline-block'
            alertContainer.classList.remove('exit-anim')
            titleArea.innerText = Title
            descArea.innerText = Desc
            setInterval(() => {
                progressbar.setAttribute('value', parseInt(progressbar.getAttribute('value')) + 1)
            }, Timeout * 10)
            setTimeout(() => {
                alertContainer.classList.add('exit-anim')
            }, Timeout * 1000)
            return
        }
    }

}