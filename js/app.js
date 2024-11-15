class AnalisadorLexico {
    #matriz
    #alfabeto
    constructor() {
        this.#matriz = Array()
        //Adiciona alfabeto convertendo ASCII para letra correspondente
        this.#alfabeto = [];
        for (let i = 65; i <= 90; i++) {
            this.#alfabeto.push(String.fromCharCode(i));
        }

        this.alimentaMatriz(bd.recuperarTokens())
    }

    getMatriz() {
        return this.#matriz
    }

    getAlfabeto() {
        return this.#alfabeto
    }

    alimentaMatriz(token) {
        let i = 0
        if (Array.isArray(token)) {
            token.forEach((value) => {
                for (i = 0; i <= value.token.length - 1; i++) {
                    let posicaoAlfabeto = this.#alfabeto.indexOf(value.token[i].toUpperCase()) + 1

                    this.#adicionaArrayDinamico(i)

                    this.#matriz[i][posicaoAlfabeto] = i
                }
                this.#matriz[i - 1][0] = 'F'
            })
        } else {
            for (i = 0; i <= token.value.length - 1; i++) {
                let posicaoAlfabeto = this.#alfabeto.indexOf(token.value[i].toUpperCase()) + 1

                this.#adicionaArrayDinamico(i)

                this.#matriz[i][posicaoAlfabeto] = i
            }
            this.#matriz[i - 1][0] = 'F'
        }
    }

    #adicionaArrayDinamico(posicaoArray) {
        if (this.#matriz[posicaoArray] === undefined) {
            this.#matriz.push(Array(27).fill(null))
        }
    }
}

class Tabela {
    constructor() {
        this.linhas = 100
        this.colunas = 26
    }

    montaTabelaTokens() {
        let arrayTokens = bd.recuperarTokens()
        let bodyTabelaTokens = document.getElementById('tokens')

        bodyTabelaTokens.innerHTML = ''

        let funcaoCallBack = function (valor) {
            let linhaTabelaTokens = bodyTabelaTokens.insertRow()

            let celulaTabelaTokens = linhaTabelaTokens.insertCell()

            celulaTabelaTokens.innerHTML = valor.token
        }

        arrayTokens.forEach(funcaoCallBack)
    }

    montaTabela() {
        let matriz = analisadorLexico.getMatriz()
        let bodyTabela = document.getElementById('matrizBody')
        bodyTabela.innerHTML = ''
        for (let i = 0; i < matriz.length; i++) {

            let linhaTabela = bodyTabela.insertRow()

            for (let x = 0; x < matriz[i].length; x++) {
                let celulaTabela = linhaTabela.insertCell()
                if (x == 0) {
                    celulaTabela.innerHTML = (matriz[i][x] == 'F') ? ((i + 1) + '*') : i + 1
                } else {
                    celulaTabela.innerHTML = matriz[i][x]
                    celulaTabela.id = `${i}_${x}`
                }
            }
        }
    }
}

class Token {
    constructor(token) {
        this.token = token
    }
}

class BD {
    constructor() {
        let id = localStorage.getItem('id')

        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getProximoID() {
        let proximoID = localStorage.getItem('id')
        return parseInt(proximoID) + 1
    }

    gravarToken(token) {
        let id = this.getProximoID()

        localStorage.setItem(id, JSON.stringify(token))

        localStorage.setItem('id', id)
    }

    recuperarTokens() {
        let arrayTokens = Array()

        let id = localStorage.getItem('id')

        for (let i = 0; i <= id; i++) {

            if (localStorage.getItem(i) !== null) {
                let tokenLocalStorage = JSON.parse(localStorage.getItem(i))

                if (tokenLocalStorage === null) {
                    continue
                }

                tokenLocalStorage.id = i

                arrayTokens.push(tokenLocalStorage)
            }

        }

        return arrayTokens
    }
}

let bd = new BD()
let analisadorLexico = new AnalisadorLexico()
let tabela = new Tabela()

function adicionaTokenBD() {
    let tokenElement = document.getElementById('token')
    analisadorLexico.alimentaMatriz(tokenElement)

    tabela.montaTabela()

    let token = new Token(tokenElement.value)

    bd.gravarToken(token)

    tabela.montaTabelaTokens()
}

let tamanhoAnterior = 0
let ultimoCaractere = ''

function verificaPosicao(texto) {
    let matriz = analisadorLexico.getMatriz()
    let alfabeto = analisadorLexico.getAlfabeto()
    const tamanhoAtual = texto.length

    if ((tamanhoAtual == 0) || (matriz[tamanhoAtual-1] != undefined)) {
        //apagou o caractere
        if (tamanhoAtual < tamanhoAnterior) {
            let posicaoAlfabeto = alfabeto.indexOf(ultimoCaractere.toUpperCase()) + 1
            let tdLetra = document.getElementById(`${tamanhoAtual}_${posicaoAlfabeto}`)
            if (tdLetra != null) {
                tdLetra.className = ''
            }
        }
        else {
            let posicaoAlfabeto = alfabeto.indexOf(texto.slice(-1).toUpperCase()) + 1
            let tdLetra = document.getElementById(`${tamanhoAtual - 1}_${posicaoAlfabeto}`)
            if (posicaoAlfabeto > 0) {
                if (matriz[tamanhoAtual - 1][posicaoAlfabeto] === (tamanhoAtual - 1)) {
                    tdLetra.className = 'selecionado_valido'
                } else {
                    tdLetra.className = 'selecionado_invalido'
                }
            }
        }
    }

    tamanhoAnterior = texto. length
    ultimoCaractere = texto.slice(-1)
}