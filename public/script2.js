const mainDiv = document.querySelector("#mainDiv")
const createDiv = document.querySelector("#createDiv")
const loginDiv = document.querySelector("#loginDiv")
const btn1 = document.querySelector("#btn1")
const btn2 = document.querySelector("#btn2")

function switchTabs(div) {
    // pode nao funcionar por conta da prioridade ja q ta pegando por tag mas jaé
    let divs = document.querySelectorAll("div")
    div.style.display = 'inline'
    for (x in divs) {
        if (divs[x] !== div) {
            divs[x].style.display = 'none'
        }
    }
}


btn1.addEventListener("click", () => {
    switchTabs(createDiv)
})

btn2.addEventListener("click", () => {
    switchTabs(loginDiv)
})

const btnCriar = document.querySelector("#enois")
const btnLogin = document.querySelector("#enois2")

const nome = document.querySelector("#nome")
const resenha1 = document.querySelector("#resenha1")
const resenha2 = document.querySelector("#resenha2")
btnCriar.addEventListener("click", () => {
    fetch("/criar", {
        method: 'POST',
        body: {
            nome: nome,
            email: resenha1,
            senha: resenha2
        }
    }).then(res => {
        if (res.ok) {
            res.text().then(ney => {
                localStorage.setItem('sessionToken', ney)
                document.location.href = 'http://localhost:8080/'
            })
        } else {
            res.text().then(ney => alert(ney))
        }
    })
})

const email = document.querySelector("#email")
const senha = document.querySelector("#senha")

btnLogin.addEventListener("click", () => {
    fetch('/login', {
        method: 'POST',
        body: {
            email: email,
            senha: senha
        }
    }).then(res => {
        if (res.ok) {
            res.text().then(santos2012 => {
                localStorage.setItem('sessionToken', santos2012)
                document.location.href='http://localhost:8080/'
            })
        } else {
            res.text().then(neymaaaar => alert(neymaaaar))
        }
    })
})