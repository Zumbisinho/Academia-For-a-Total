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
const planSection = document.getElementById('plan-name')
const plan = getCookie('plan')
console.log(plan)
planSection.innerText = plan && plan !== 'none' ? plan : 'Nenhum'

const queue = []
let IsalertShowing = false
async function createAlert(title, desc, timeout, type) {
    queue.push([title, desc, timeout, type])
    if (!IsalertShowing) {
        process()
    } else {}
    async function process() {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        const descArea = document.getElementById('alertDesc')
        const progressbar = document.getElementById('alert-progress')
        const titleArea = document.getElementById('alertName')
        const alertContainer = document.getElementById('alert')

        while (queue.length > 0) {
            IsalertShowing = true

            await sleep(500)
            const Data = queue.shift()
            console.log(Data)
            progressbar.setAttribute('value', 0)
            alertContainer.style.display = 'inline-block'
            alertContainer.classList.remove('exit-anim')
            alertContainer.classList.remove('alert-error', 'alert-info')
            titleArea.innerText = Data[0]
            descArea.innerText = Data[1]
            switch (Data[3]) {
                case 'info':
                    {
                        alertContainer.classList.add('alert-info')
                    }
                case "error":
                    {
                        alertContainer.classList.add('alert-error')
                    }
            }
            let progressloop = setInterval(() => {
                progressbar.setAttribute('value', parseInt(progressbar.getAttribute('value')) + 1)
            }, Data[2] * 10)
            setTimeout(() => {
                alertContainer.classList.add('exit-anim')
                clearInterval(progressloop)
            }, Data[2] * 1000)
            await sleep(Data[2] * 1000)

        }
        IsalertShowing = false
    }

}