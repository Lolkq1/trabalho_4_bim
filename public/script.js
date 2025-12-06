const btn = document.querySelector("#btn")
const vc = document.querySelector("#votos_candidato")
const votos_branco = document.querySelector("#votos_branco")
const candid = document.querySelector("#nome_candidato")
const divboletim = document.querySelector(".boletimdiv")
const divvoto = document.querySelector(".votediv")
const input = document.querySelector("#candidato")
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
                    console.log('deu ero')
                    alert('erro: ta de marola pcr us guri vai te gruda tu te cuida guri senao os guri vao ai')
                    }
        }) } else {
            btn.addEventListener("click", () => {
        if (input.value.length != 0 && input.value != " " && typeof parseInt(input.value) === "number") {
            fetch('/voto', {
        method: 'POST',
        body: JSON.stringify(
            {
                codigo: input.value
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
                console.log('deu erro')
                alert('ocorreu um erro.')
            }
        })
        } else {
            alert('digite um numero valido.')
        }
})
        }


