const btn = document.querySelector("#btn")
const vc = document.querySelector("#votos_candidato")
const votos_branco = document.querySelector("#votos_branco")
const candid = document.querySelector("#nome_candidato")
const divboletim = document.querySelector(".boletimdiv")
const divvoto = document.querySelector(".votediv")
const input = document.querySelector("#candidato")

let sessionT = localStorage.getItem('sessionToken')
if (sessionT !== undefined && sessionT.length > 0) {
    fetch('/ver', {
        method: 'POST',
        body: sessionT
    }).then(res => {if (res.ok) {
        if (localStorage.getItem('votou') == 'true') {
        console.log(localStorage.getItem('votou'))
        fetch('/cred', {
            method:'POST',
            body: localStorage.getItem('codigo')
        }).then(res => {
            if (res.ok) {
                res.text().then(iae => JSON.parse(iae)).then(obj => {
                    console.log('iae')
                    document.body.removeChild(divvoto)
                    divboletim.style.display = 'inline'
                    votos_branco.textContent = 'votos em branco: '+obj.votos_branco
                    vc.textContent = 'votos do candidato: '+obj.votos
                    candid.textContent = 'candidato: '+obj.nome
                })
            } else {
                    console.log('deu erro')
                    alert('erro: o candidato no qual você votou não existe.')
                    }
        }) } else {
        //parte do voto
        
        btn.addEventListener("click", () => {
        if (input.value.length != 0 && input.value != " " && typeof parseInt(input.value) === "number") {
            fetch('/voto', {
        method: 'POST',
        body: JSON.stringify(
            {
                codigo: input.value,
                eleitor: localStorage.getItem('sessionToken')
            }
        )
        }).then(res => {
            if (res.ok) {
                res.text().then(res2 => JSON.parse(res2)).then(obj => {
                    console.log(obj)
                    localStorage.setItem('votou', true)
                    localStorage.setItem('codigo', obj.codigo)
                    divvoto.style.display = 'none'
                    divboletim.style.display = 'inline'
                    votos_branco.textContent = 'votos em branco: '+obj.votos_branco
                    vc.textContent = 'votos do candidato: '+obj.votos
                    candid.textContent = 'candidato: '+obj.nome
                })
            } else {
                if (res.status === 500) {
                    console.log('deu erro')
                    alert('erro interno do servidor.')
                } else {
                    if (res.status === 401) {
                        console.log('candidato inexistente.')
                        alert('candidato não encontrado.')
                    } else {
                        console.log('erro desconhecido.')
                        alert('erro desconhecido.')
                    }
                }
                
            }
        })
        } else {
            alert('digite um numero valido.')
        }
})
        }


    } else {
        document.location.href = 'http://localhost:8080/telaInicial.html'
    }

})
} else {
    document.location.href = 'http://localhost:8080/telaInicial.html'
}



    
