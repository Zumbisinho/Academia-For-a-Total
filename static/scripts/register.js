const usernameInput = document.getElementById('username')
const passwordInput = document.getElementById('password')
const ErrorHandler = document.getElementById('error-p')
const emailInput = document.getElementById('email')
const submitButton = document.getElementById('submitButton')
const form = document.getElementById('formulario')
const regex = /^[A-Za-z0-9_]{1,20}$/;
const pwRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

console.log('JS carregado');

function VerifyForm() {
    if (!usernameInput.value && !passwordInput.value && !emailInput.value) {
        return "Username or Password are empty!"
    }
    // Email

    if (!emailRegex.test(emailInput.value)) {
        return "Invalid Email"
    }

    // Username
    if (!regex.test(usernameInput.value)) {
        return "Wrong format!"
    }

    //pass
    if (!pwRegex.test(passwordInput.value)) {
        return "Password Too Weak!"
    }
    return true
}


form.addEventListener('submit', (event) => {
        event.preventDefault();
        passwordInput.classList.remove('wrong')
        usernameInput.classList.remove('wrong')
        emailInput.classList.remove('wrong')
        ErrorHandler.style.display = 'none'
        if (VerifyForm() === "Password Too Weak!") {
            passwordInput.classList.add('wrong')
            ErrorHandler.style.display = 'inline-block'
            ErrorHandler.innerText = "Senha deve conter no mínimo 8 caracteres e 1 número"
        }

        if (VerifyForm() === true) {
            const un = usernameInput.value;
            const email = emailInput.value;
            const pw = passwordInput.value;
            const data = {
                username: un,
                email: email,
                password: pw
            }

            fetch('../api/v1/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                    credentials: 'include'
                })
                .then(res => res.json())
                .then(data => {
                    if (data.status === 201) {
                        window.location.href = '../';
                    }
                    if (data.status === 4090) {
                        usernameInput.classList.add('wrong')
                        ErrorHandler.innerText = data.msg
                        ErrorHandler.style.display = 'inline-block'
                    }
                    if (data.status === 4091) {
                        emailInput.classList.add('wrong')
                        ErrorHandler.innerText = data.msg
                        ErrorHandler.style.display = 'inline-block'
                    }
                });

        }

    }


);