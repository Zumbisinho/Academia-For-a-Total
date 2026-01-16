# Academia Força Total – Website Full-Stack com Flask

Este projeto é um website full-stack desenvolvido em **Python com Flask**, voltado para uma academia fictícia chamada **Força Total**.
Ele simula um sistema real de usuários, com **cadastro, login, sessões autenticadas e compra de planos**, tudo rodando localmente com banco de dados SQLite.
Projeto/Desafio dado por Junior - Instituto Evoluir

O objetivo do projeto é demonstrar, de forma prática, como funciona a base de um sistema web moderno, simples e organizado, sem depender de serviços externos.

---

## Funcionalidades principais

* Cadastro de usuários com validação de dados
* Login utilizando **username ou email**
* Sistema de sessões baseado em **tokens**
* Cookies HTTP para manter o usuário autenticado
* Compra e troca de planos da academia
* Expiração de planos
* Exclusão de conta
* Banco de dados local com SQLite

---

## Tecnologias utilizadas

* **Python 3**
* **Flask** (backend e rotas)
* **SQLite** (banco de dados local)
* **bcrypt** (hash seguro de senhas)
* **Regex** para validação de dados
* **HTML/CSS/JS** no frontend (via templates)

---

## Estrutura do projeto

```
Academia-Forca-Total/
│
├── main.py          # Arquivo principal do Flask (rotas e servidor)
├── auth.py          # Lógica de autenticação, banco de dados e planos
├── classes.py       # Classes auxiliares (User e Plan)
├── database/
│   └── users.db     # Banco de dados SQLite (criado automaticamente)
├── templates/
│   ├── index.html
│   ├── login.html
│   └── register.html
└── static/
    └── (arquivos CSS/JS)
```

---

## Como o sistema funciona (visão geral)

### Autenticação e segurança

* As senhas **nunca são salvas em texto puro**
  Elas são protegidas com `bcrypt`, usando salt automático.
* Após login ou cadastro, o sistema gera um **token seguro**
* Esse token é salvo:

  * No banco de dados (`sessions`)
  * Em um cookie HTTP no navegador
* Esse cookie é usado para identificar o usuário nas próximas requisições

---

### Cadastro de usuários

O cadastro verifica:

* Username (somente letras, números e `_`, até 20 caracteres)
* Email válido
* Senha com no mínimo 8 caracteres e números

Se tudo estiver correto:

* O usuário é criado no banco
* Um token de sessão é gerado automaticamente
* O usuário já entra logado

---

### Login

O login aceita:

* **Username ou email**
* Senha

Se os dados baterem:

* O token existente da sessão é reutilizado
* Cookies são definidos no navegador

---

### Sistema de planos

Planos disponíveis:

* `none`
* `básico`
* `completo`
* `premium`

Regras importantes:

* O usuário **não pode trocar para um plano inferior**
* Cada plano dura **30 dias**
* A data de expiração é salva no banco
* O sistema já está preparado para integração com pagamento (Stripe, Mercado Pago, etc.)

Atualmente, o pagamento é simulado, pois o projeto roda apenas em ambiente local.

---

## Como rodar o projeto localmente

### 1. Pré-requisitos

Certifique-se de ter instalado:

* **Python 3.10 ou superior**
* **pip** (gerenciador de pacotes do Python)

Você pode verificar com:

```bash
python --version
pip --version
```

---

### 2. Clonar o repositório

```bash
git clone https://github.com/Zumbisinho/Academia-For-a-Total.git
cd Academia-For-a-Total
```

---

### 3. Criar um ambiente virtual (recomendado)

```bash
python -m venv venv
```

Ativar:

**Windows**

```bash
venv\Scripts\activate
```

**Linux / macOS**

```bash
source venv/bin/activate
```

---

### 4. Instalar as dependências

```bash
pip install -r requirements.txt
```

(O projeto usa apenas bibliotecas essenciais, para manter tudo simples.)

---

### 5. Iniciar o servidor

```bash
python main.py
```

Você verá algo como:

```
Running on http://0.0.0.0:5000
```

Acesse no navegador:

```
http://localhost:5000
```

---

## Rotas principais da API

| Rota                  | Método | Descrição           |
| --------------------- | ------ | ------------------- |
| `/api/v1/register`    | POST   | Cadastro de usuário |
| `/api/v1/login`       | POST   | Login               |
| `/api/v1/logout`      | GET    | Logout              |
| `/api/v1/change_plan` | POST   | Troca de plano      |
| `/api/v1/delete`      | GET    | Excluir conta       |

---

## Observações importantes

* Este projeto **não é para produção**
* Cookies `secure=False` são usados apenas para testes locais
* Não há HTTPS
* Não há sistema real de pagamento
* O foco é **aprendizado e demonstração**

---

## Considerações finais

Este projeto foi desenvolvido com cuidado para manter o código **legível, organizado e didático**, mesmo abordando temas importantes como autenticação, sessões e segurança.

Se você está começando com Flask ou quer entender como funciona um sistema web completo, este repositório é um bom ponto de partida para estudar, modificar e evoluir.

---


É só me dizer.
