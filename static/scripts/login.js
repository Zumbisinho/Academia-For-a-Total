const usernameInput = document.getElementById('username')
const passwordInput = document.getElementById('password')
const submitButton = document.getElementById('submitButton')
const ErrorHandler = document.getElementById('error-p')
const form = document.getElementById('formulario')
const regex = /^[A-Za-z0-9_]{1,20}$/;
const pwRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;


function VerifyForm() {
    if (!usernameInput.value && !passwordInput.value) {
        return "Username or Password are empty!"
    }
    // Email
    if (usernameInput.value.includes("@")) {
        if (!emailRegex.test(usernameInput.value)) {
            return "Invalid Email"
        }

    } else { // Username
        if (!regex.test(usernameInput.value)) {
            return "Wrong format!"
        }

    }
    if (!pwRegex.test(passwordInput.value)) {
        return "Password Too Weak!"
    }
    return true
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    passwordInput.classList.remove('wrong')
    usernameInput.classList.remove('wrong')
    ErrorHandler.style.display = 'none'

    if (VerifyForm() === true) {
        const inpute = usernameInput.value;
        const pw = passwordInput.value;
        const data = {
            input: inpute,
            password: pw
        }
        fetch('../api/v1/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include'
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 202) {
                    window.location.href = '../';
                }
                if (data.status === 401) {
                    passwordInput.classList.add('wrong')
                    usernameInput.classList.add('wrong')
                    ErrorHandler.style.display = 'inline-block'
                    ErrorHandler.innerText = data.msg
                }
            });

    }






});