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
    #linhasPaginaTokens
    constructor() {
        this.#linhasPaginaTokens = 3
    }

    getLinhasPaginaTokens() {
        return this.#linhasPaginaTokens
    }

    montaTabelaTokens(pagina = 1) {
        let arrayTokens = bd.recuperarTokens()
        let bodyTabelaTokens = document.getElementById('tokens')

        //Separa de 3 em 3 para paginação
        const inicio = (pagina - 1) * this.#linhasPaginaTokens
        const final = inicio + this.#linhasPaginaTokens
        const dadosTabela = arrayTokens.slice(inicio, final)

        bodyTabelaTokens.innerHTML = ''

        let funcaoCallBack = function (valor) {

            let linhaTabelaTokens = bodyTabelaTokens.insertRow()

            let celulaTabelaTokens = linhaTabelaTokens.insertCell()

            celulaTabelaTokens.innerHTML = valor.token
            celulaTabelaTokens.style.width = '95%'

            let btn = document.createElement("a")
            btn.className = 'excluir'
            btn.innerHTML = '<i class="fa-solid fa-trash-can"></i>'
            btn.id = `id_token_${valor.id}`
            btn.onclick = function () {
                //Remove a despesa
                let id = this.id.replace('id_token_', '')
                bd.remover(id)

                window.location.reload();
            }

            linhaTabelaTokens.insertCell().append(btn)
        }

        dadosTabela.forEach(funcaoCallBack)
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

class Paginacao {
    constructor(tabela) {
        this.tabela = tabela
    }

    montaPaginacao(paginaSelecionada = 1) {
        const arrayTokens = bd.recuperarTokens()
        const totalPaginas = Math.ceil((arrayTokens.length / tabela.getLinhasPaginaTokens()))
        const divPagination = document.getElementById('pagination')
        divPagination.innerHTML = ''

        let lista = document.createElement('ul')
        lista.className = 'pagination justify-content-end'

        let itemAnterior = document.createElement('li')
        itemAnterior.id = 'A'
        itemAnterior.className = 'page-item'
        itemAnterior.innerHTML = '<a class="page-link">Anterior</a>'
        itemAnterior.onclick = function () {
            paginacao.mudarPagina(this.id)
        }

        lista.append(itemAnterior)

        for (let i = 1; i <= totalPaginas; i++) {

            let itemLista = document.createElement('li')

            if (i == paginaSelecionada) {
                itemLista.className = 'active'
            }
            itemLista.id = `item_${i}`
            itemLista.className += ' page-item'
            itemLista.innerHTML = `<a class="page-link">${i}</a>`
            itemLista.onclick = function () {
                paginacao.mudarPagina(this.id)
            }
            lista.append(itemLista)

        }

        let itemProximo = document.createElement('li')
        itemProximo.id = 'P'
        itemProximo.className = 'page-item'
        itemProximo.innerHTML = '<a class="page-link">Próximo</a>'
        itemProximo.onclick = function () {
            paginacao.mudarPagina(this.id)
        }

        lista.append(itemProximo)

        divPagination.append(lista)
    }

    mudarPagina(pagina) {
        let paginaSelecionada
        let totalTokens = bd.recuperarTokens()
        let qtdTotalPaginas = Math.ceil((totalTokens.length / tabela.getLinhasPaginaTokens()))

        if (pagina == 'A' || pagina == 'P') {
            let paginaAtiva = document.getElementsByClassName('active')

            if (pagina == 'A') {
                paginaSelecionada = parseInt(paginaAtiva[0].id.replace('item_', '')) - 1
            } else {
                paginaSelecionada = parseInt(paginaAtiva[0].id.replace('item_', '')) + 1
            }

        } else {
            paginaSelecionada = parseInt(pagina.replace('item_', ''))
        }

        if (paginaSelecionada > 0 && paginaSelecionada <= qtdTotalPaginas) {
            this.tabela.montaTabelaTokens(paginaSelecionada)
            this.montaPaginacao(paginaSelecionada)
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

    remover(id) {
        localStorage.removeItem(id)
    }
}

let bd = new BD()
let analisadorLexico = new AnalisadorLexico()
let tabela = new Tabela()
let paginacao = new Paginacao(tabela)

function adicionaTokenBD() {
    let tokenElement = document.getElementById('token')
    analisadorLexico.alimentaMatriz(tokenElement)

    tabela.montaTabela()

    let token = new Token(tokenElement.value)

    bd.gravarToken(token)

    tabela.montaTabelaTokens()
    paginacao.montaPaginacao()

    tokenElement.value = ''
}

let tamanhoAnterior = 0;
let ultimaPalavra = '';

async function verificaPosicao(texto, validaToken = false) {
    
    let textoOriginal = texto
    texto = texto.toUpperCase();
    const matriz = analisadorLexico.getMatriz();
    const alfabeto = analisadorLexico.getAlfabeto();
    const tamanhoAtual = texto.trim().length;
    let posicaoAlfabeto;
    let tdLetra;

    if (tamanhoAtual === 0 || matriz[tamanhoAtual - 1] !== undefined) {
        if (tamanhoAtual < tamanhoAnterior) {
            tabela.limpaTabelaMatriz(tamanhoAnterior - tamanhoAtual, alfabeto);
        } else {
            for (let i = tamanhoAnterior; i < tamanhoAtual; i++) {
                posicaoAlfabeto = alfabeto.indexOf(texto[i]) + 1;
                tdLetra = document.getElementById(`${i}_${posicaoAlfabeto}`);

                if (tdLetra && posicaoAlfabeto > 0) {
                    if (matriz[i] && matriz[i][posicaoAlfabeto] === i) {
                        tdLetra.className = 'selecionado_valido';
                    } else {
                        tdLetra.className = 'selecionado_invalido';
                    }
                }
            }

            // Separador ' '
            if (texto.slice(-1) === ' ') {
                // Valida token ao encontrar um espaço
                verificaPosicao(texto.trim(), true);
                return;
            }

            if (validaToken) {
                document.getElementById('validarToken').readOnly = true;
                let tokenValido = true;

                for (let i = 0; i <= tamanhoAtual; i++) {
                    posicaoAlfabeto = alfabeto.indexOf(texto[i]) + 1;
                    tdLetra = document.getElementById(`${i}_${posicaoAlfabeto}`);

                    if (tdLetra !== null) {
                        const classeAtual = tdLetra.className;

                        if (classeAtual === 'selecionado_invalido') {
                            tokenValido = false;
                        }

                        tdLetra.className = 'selecionado_verificando';

                        await new Promise((resolve) => setTimeout(resolve, 500));

                        tdLetra.className = classeAtual;
                    }
                }
                validaTokenExistente(texto)
                // if (tokenValido && matriz[tamanhoAtual - 1][0] && matriz[tamanhoAtual - 1][0].includes('F')) {
                //     addListaTokens(texto, true);

                //     document.getElementById('cabecalhoModal').className = 'modal-header text-success';
                //     document.getElementById('textoCabecalho').innerHTML = 'Token válido';
                //     document.getElementById('corpoTexto').innerHTML = 'Token reconhecido com sucesso!';
                //     document.getElementById('botaoModal').className = 'btn btn-success';

                //     let modalToken = new bootstrap.Modal(document.getElementById('modalToken'));
                //     modalToken.show();
                // } else {
                //     addListaTokens(texto, false);

                //     document.getElementById('cabecalhoModal').className = 'modal-header text-danger';
                //     document.getElementById('textoCabecalho').innerHTML = 'Token inválido';
                //     document.getElementById('corpoTexto').innerHTML = 'O Token foi rejeitado!';
                //     document.getElementById('botaoModal').className = 'btn btn-danger';

                //     let modalToken = new bootstrap.Modal(document.getElementById('modalToken'));
                //     modalToken.show();
                // }

                document.getElementById('validarToken').value = '';
                tabela.limpaTabelaMatriz(tamanhoAtual, alfabeto);
                document.getElementById('validarToken').readOnly = false;
            }
        }
    }

    tamanhoAnterior = document.getElementById('validarToken').value.length
    ultimaPalavra = texto
}

function apenasLetras(texto, permiteEspaco) {
    if (permiteEspaco && texto.trim().length > 0) {
        // Permitir letras maiúsculas, minúsculas e espaços
        return texto.replace(/[^a-zA-Z\s]/g, '');
    } else {
        // Permitir apenas letras maiúsculas e minúsculas, sem espaços
        return texto.replace(/[^a-zA-Z]/g, '');
    }
}

function validaTokenExistente(texto) {
    let tokens = bd.recuperarTokens()
    //Percorre todo array de objetos procurando pelo token informado
    //item é o parametro que recebe o objeto que está no indice do array
    let tokenExistente = tokens.some(item => item.token.toUpperCase() === texto)
    if (tokenExistente) {

        addListaTokens(texto, true)
        //Modal sucesso
        document.getElementById('cabecalhoModal').className = 'modal-header text-success'
        document.getElementById('textoCabecalho').innerHTML = 'Token válido'
        document.getElementById('corpoTexto').innerHTML = 'Token reconhecido com sucesso!'
        document.getElementById('botaoModal').className = 'btn btn-success'

        let modalToken = new bootstrap.Modal(document.getElementById('modalToken'));
        modalToken.show();
    } else {

        addListaTokens(texto, false)
        //Modal erro
        document.getElementById('cabecalhoModal').className = 'modal-header text-danger'
        document.getElementById('textoCabecalho').innerHTML = 'Token inválido'
        document.getElementById('corpoTexto').innerHTML = 'O Token foi rejeitado!'
        document.getElementById('botaoModal').className = 'btn btn-danger'

        let modalToken = new bootstrap.Modal(document.getElementById('modalToken'));
        modalToken.show();
    }
}

function addListaTokens(descricao, valido) {

    let listaOrdenada = document.getElementById('listaInformados')
    let elementoLista = document.createElement('li')

    if (valido) {
        elementoLista.innerHTML = descricao
        elementoLista.className = 'token_valido'
        listaOrdenada.append(elementoLista)
    } else {
        elementoLista.innerHTML = descricao
        elementoLista.className = 'token_invalido'
        listaOrdenada.append(elementoLista)
    }
}