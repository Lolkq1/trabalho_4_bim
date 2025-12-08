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
                                        res.status(401).send('candidato nada ve')
                                    }
                                }
                            }})

                            }
                        }
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
    
})

app.post('/login', (req, res) => {

})

app.listen(8080, () => {
    console.log('servidor rodando em 8080')
})