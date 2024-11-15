class AnalisadorLexico {
    #matriz
    #alfabeto
    constructor() {
        this.#matriz = Array.from({ length: 100 }, () => Array(27).fill(null))

        //Adiciona alfabeto convertendo ASCII para letra correspondente
        this.#alfabeto = [];
        for (let i = 65; i <= 90; i++) {
            this.#alfabeto.push(String.fromCharCode(i));
        }

        this.#alimentaMatriz(bd.recuperarTokens())
    }

    getMatriz() {
        return this.#matriz
    }

    adicionaToken() {
        let tokenElement = document.getElementById('token')

        this.#alimentaMatriz(tokenElement)

        tabela.montaTabela()

        let token = new Token(tokenElement.value)

        bd.gravarToken(token)

        tabela.montaTabelaTokens()
    }

    #alimentaMatriz(token) {

        if (Array.isArray(token)) {
            token.forEach((value) => {
                for(let i = 0; i <= value.token.length - 1; i++) {
                    let posicaoAlfabeto = this.#alfabeto.indexOf(value.token[i].toUpperCase()) + 1
                    this.#matriz[i][posicaoAlfabeto] = i
                }
            })
        } else {
            for (let i = 0; i <= token.value.length - 1; i++) {
                let posicaoAlfabeto = this.#alfabeto.indexOf(token.value[i].toUpperCase()) + 1
                this.#matriz[i][posicaoAlfabeto] = i
            }
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
        console.log(matriz)
        for (let i = 0; i < matriz.length; i++) {

            let linhaTabela = bodyTabela.insertRow()

            for (let x = 0; x < matriz[i].length; x++) {
                let celulaTabela = linhaTabela.insertCell()
                if (x == 0) {
                    celulaTabela.innerHTML = i + 1
                } else {
                    celulaTabela.innerHTML = matriz[i][x]
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