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

    limpaTabelaMatriz(tamanhoString, alfabeto) {
        for (let i = 1; i <= (tamanhoString); i++) {
            let posicaoAlfabeto = alfabeto.indexOf(ultimaPalavra.slice(-i)[0].toUpperCase()) + 1
            let tdLetra = document.getElementById(`${tamanhoAnterior - i}_${posicaoAlfabeto}`)
            if (tdLetra != null) {
                tdLetra.className = ''
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

        token.id = id

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
let ultimaPalavra = ''

async function verificaPosicao(texto, validaToken = false) {
    const matriz = analisadorLexico.getMatriz()
    const alfabeto = analisadorLexico.getAlfabeto()
    const tamanhoAtual = texto.trim().length
    let posicaoAlfabeto
    let tdLetra

    if ((tamanhoAtual == 0) || (matriz[tamanhoAtual - 1] != undefined)) {
        //apagou o caractere
        if (tamanhoAtual < tamanhoAnterior) {
            tabela.limpaTabelaMatriz((tamanhoAnterior - tamanhoAtual), alfabeto)
        }
        else {
            //Separador ' '
            if (texto.slice(-1) == ' ') {
                //Chama função recursiva para validar o token informado
                verificaPosicao(texto.trim(), true)
                return
            }

            if (validaToken) {
                document.getElementById('validarToken').readOnly = true

                for (let i = 0; i <= tamanhoAtual; i++) {
                    posicaoAlfabeto = alfabeto.indexOf(texto[i]) + 1
                    tdLetra = document.getElementById(`${i}_${posicaoAlfabeto}`)

                    if (tdLetra != null) {
                        const classeAtual = tdLetra.className;

                        tdLetra.className = 'selecionado_verificando'

                        await new Promise((resolve) => setTimeout(resolve, 500));

                        tdLetra.className = classeAtual
                    }
                }

                validaTokenExistente(texto)
                document.getElementById('validarToken').value = ''
                tabela.limpaTabelaMatriz(tamanhoAtual, alfabeto)
                document.getElementById('validarToken').readOnly = false

            } else {
                posicaoAlfabeto = alfabeto.indexOf(texto.slice(-1).toUpperCase()) + 1
                tdLetra = document.getElementById(`${tamanhoAtual - 1}_${posicaoAlfabeto}`)

                if (posicaoAlfabeto > 0) {
                    if (matriz[tamanhoAtual - 1][posicaoAlfabeto] === (tamanhoAtual - 1)) {
                        tdLetra.className = 'selecionado_valido'
                    } else {
                        tdLetra.className = 'selecionado_invalido'
                    }
                }
            }
        }
    }
    tamanhoAnterior = document.getElementById('validarToken').value.length
    ultimaPalavra = texto
}

function apenasLetrasMaiusculas(texto, permiteEspaco) {
    if (permiteEspaco && texto.trim().length > 0) {
        return texto.replace(/[^A-Z\s]/g, '')
    } else {
        return texto.replace(/[^A-Z]/g, '')
    }
}

function validaTokenExistente(texto) {
    let tokens = bd.recuperarTokens()
    //Percorre todo array de objetos procurando pelo token informado
    //item é o parametro que recebe o objeto que está no indice do array
    let tokenExistente = tokens.some(item => item.token === texto)
    if (tokenExistente) {
        document.getElementById('cabecalhoModal').className = 'modal-header text-success'
        document.getElementById('textoCabecalho').innerHTML = 'Token válido'
        document.getElementById('corpoTexto').innerHTML = 'Token reconhecido com sucesso!'
        document.getElementById('botaoModal').className = 'btn btn-success'

        let modalToken = new bootstrap.Modal(document.getElementById('modalToken'));
        modalToken.show();
    } else {
        document.getElementById('cabecalhoModal').className = 'modal-header text-danger'
        document.getElementById('textoCabecalho').innerHTML = 'Token inválido'
        document.getElementById('corpoTexto').innerHTML = 'O Token foi rejeitado!'
        document.getElementById('botaoModal').className = 'btn btn-danger'

        let modalToken = new bootstrap.Modal(document.getElementById('modalToken'));
        modalToken.show();
    }
}