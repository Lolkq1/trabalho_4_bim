require('dotenv').config()
const express = require('express')
const app = express()
const mysql = require('mysql2')
const path = require('path')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
app.use(express.static(path.join(__dirname, 'public')))
const con = mysql.createConnection({
    user: 'root',
    password: process.env.PASSWORD,
    port: 3306,
    database: 'candidatos'
})


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.post('/voto', (req, res) => {
    //verificaçao de credenciais
    let j=''
    req.on('data', (chunk) => {
        j+=chunk
    })
    req.on('end', () => {
        let j2 = JSON.parse(j)
        let codigo = j2.codigo
        let user = j2.token
        con.query("SELECT * FROM sessoes where token=?", [user], (err, data) => {
            if (err) {res.status(500).send('E.I.S.')} else {
                if (data.length === 0) {
                    res.status(401).send('usuario nao está logado//token inválido.')
                } else {
                    con.query("SELECT * FROM usuarios WHERE email=?", [data[0].email], (err, data2) => {
                        if (err) {console.log('erro interno svr')} else {
                            if (data2.length === 0) {
                            res.status(401).send('erro incomum: token válido, email inválido.')
                            } else {
                                if (data2[0].votou === true) {
                                    res.status(401).send('usuário já votou.')
                                } else {
                                    con.query("SELECT * FROM candidatos WHERE codigo=? OR codigo=0 ORDER BY codigo DESC", [codigo], (err, data) => {
                                        console.log(data)
                                        if (err) {
                                            res.status(500).send('erro interno do servidor')
                                        } else {
                                            if (data.length === 1 && data[0].codigo !== 0) {
                                                console.log('candidato não existe.')
                                                res.status(401).send('candidato não encontrado.')
                                            } else {
                                                    if (data.length === 2) {
                                                        console.log('candidato encontrado.')
                                                        let votosAtual = data[0].votos
                                                        console.log(data[0].votos)
                                                        votosAtual++
                                                        con.query("UPDATE candidatos SET votos=? WHERE codigo=?", [votosAtual, data[0].codigo], (err) => {
                                                            if (err) {
                                                                console.log('erro interno do servidor')
                                                                res.status(500).send('erro interno do servidor')
                                                            } else {
                                                                let votos_b = data[1].votos
                                                                        let boletim = {
                                                                            nome: data[0].nome,
                                                                            votos: data[0].votos+1,
                                                                            votos_branco: votos_b,
                                                                            codigo: codigo
                                                                        }
                                                                        console.log('enviando dados.')
                                                                        res.send(JSON.stringify(boletim))
                                                            }
                                                        })
                                                    } else {
                                                        if (data[0].codigo === 0) {
                                                            console.log('voto em branco.')
                                                        let votosAtual = data[0].votos
                                                        console.log(data[0].votos)
                                                        votosAtual++
                                                        con.query("UPDATE candidatos SET votos=? WHERE codigo=?", [votosAtual, data[0].codigo], (err) => {
                                                            if (err) {
                                                                console.log('erro interno do servidor')
                                                                res.status(500).send('erro interno do servidor')
                                                            } else {
                                                                if (data.length === 2) {
                                                                    let votos_b = data[0].votos
                                                                        let boletim = {
                                                                            nome: 'voto em branco',
                                                                            votos: data[0].votos,
                                                                            votos_branco: data[0].votos,
                                                                            codigo: codigo
                                                                        }
                                                                        console.log('enviando dados.')
                                                                        res.send(JSON.stringify(boletim))
                                                                } else {
                                                                    if (data[0].codigo === codigo && codigo===0) {
                                                                        let boletim = {
                                                                        nome: 'voto em branco',
                                                                        votos_branco: data[0].votos,
                                                                        votos: data[0].votos,
                                                                        codigo: k2
                                                                        } 
                                                                        res.send(JSON.stringify(boletim))
                                                                } else {
                                                                    console.log('nada ve')
                                                                    res.status(401).send('candidato não existe.')
                                                                }
                                                            }
                                                        }})

                                                        }
                                                    }
                                            }
                                        }
                                    })
                                }
                            } 
                        }
                        
                    } )
                }
            }
        })
        
    })
})
app.post('/cred', (req, res) => {
    let k = ''
    req.on('data', (chunk) => {
        k+=chunk
    })
    req.on('end', () => {
        let k2 = parseInt(k)
        console.log(k2)
        con.query("SELECT * FROM candidatos WHERE codigo=? OR codigo=0 ORDER BY codigo DESC", [k2], (err, data) => {
            if (err) {console.log('erro interno do servidor'); res.status(500).send('erro interno do servidor')} else {
                console.log(data)
                    if (data.length === 2) {
                        let boletim = {
                        nome: data[0].nome,
                        votos: data[0].votos,
                        codigo: k2,
                        votos_branco: data[1].votos
                        }
                        res.send(JSON.stringify(boletim))
                    } else {
                            if (data[0].codigo === k2 && k2===0) {
                                let boletim = {
                                nome: 'voto em branco',
                                votos_branco: data[0].votos,
                                votos: data[0].votos,
                                codigo: k2
                            }
                            res.send(JSON.stringify(boletim))
                    } else {
                        console.log('nada ve')
                        res.status(401).send('candidato nada ve')
                    }
                }
                
            }
        })
    })
})

app.post('/criar', (req, res) => {
    let ney = ''
    req.on('data', (chunk) => {ney+=chunk})
    req.on('end', () => {
        let messi = JSON.parse(ney)
        con.query("SELECT * FROM usuarios WHERE email=?", [messi.email], (err, data) => {
            if (err) {
                console.log('erro interno ao criar conta')
                res.status(500).send('erro interno do servidor.')
            } else {
                if (data.length >= 1) {
                    console.log('ja existe alguem com esse email registrado!!!')
                    res.status(401).send('este email já está em uso!')
                } else {
                        bcrypt.hash(messi.senha, 3).then(hash => {
                        let horaresenha = new Date()
                        let token = crypto.createHash('sha256').update(horaresenha).digest('hex')
                        con.query('INSERT INTO usuarios VALUES (?,?,?,?,?)', [messi.email, messi.nome, hash, false, -1], (err) => {
                            if (err) {
                                console.log('erro interno do servidor')
                                res.status(500).send('erro interno do servidor')
                            } else {
                                con.query('INSERT INTO tokens VALUES (?,?)', [token, messi.email], (err) => {
                                    if (err) {
                                        console.log('a conta foi criada, porém houve um erro na criação do token.')
                                        res.status(500).send('erro interno do servidor; tente logar na página de login.')
                                    } else {
                                        console.log('conta criada com sucesso! Enviando token para o cliente...')
                                        res.send(token)
                                    }
                                })
                            }
                        })
                    })
                }
            }
        })
    })
})

app.post('/login', (req, res) => {
    let kmbappe = ''
    req.on('data', (chunk) => {kmbappe+=chunk})
    req.on('end', () => {
        let mbappe = JSON.parse(kmbappe)
        con.query('SELECT * FROM usuarios WHERE email=?', [mbappe.email], (err, data) => {
            if (err) {
                console.log('erro interno do server.')
                res.status(500).send('erro interno.')
            } else {
                if (data.length === 0) {
                    res.status(401).send('erro: não existe nenhuma conta registrada com esse e-mail.')
                } else {
                    bcrypt.compare(mbappe.senha, data[0].hash).then(resultado => {
                        if (resultado) {
                            let data = new Date()
                            let token = crypto.createHash('sha256').update(data).digest('hex')
                            console.log('tudo certo! Senha correta; enviando token de sessão para o cliente... vai pra cima deles SANTOOOOOOOOOOOOOOOOOOOOOOOS')
                            res.send(token)
                        } else {
                            console.log('senha incorreta inserida.')
                            res.status(401).send('erro: senha incorreta')
                        }
                    })
                }
            }
        })
    })
})

app.post('/ver', (req, res)=> {
    let tk = ''
    req.on('data', (chunk) =>{j+=chunk})
    req.on('end', () => {
        con.query('SELECT * FROM sessoes WHERE token=?', [tk], (err, data) => {
            if (err) {
                console.log('erro interno no servidor')
                res.status(500).send('erro interno no servidor')
            } else {
                if (data.length === 0) {
                    res.status(401).send('A conta à qual você estava conectado não existe.')
                } else {
                    con.query("SELECT * FROM usuarios WHERE email=?", [data[0].email], (err, data2) => {
                        if (err) {res.status(500).send('E.I.S.')} else {
                            res.send(JSON.stringify(data2))
                        }
                    })
                    res.status(200).send('está dado o aval!!!')
                }
            }
        })
    })
})


app.listen(8080, () => {
    console.log('servidor rodando em 8080')
})