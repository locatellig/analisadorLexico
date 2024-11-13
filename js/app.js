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
    }

    getMatriz() {
        return this.#matriz
    }

    adicionaToken() {
        let token = document.getElementById('token')

        for (let i = 0; i <= token.value.length - 1; i++) {
            var posicaoAlfabeto = this.#alfabeto.indexOf(token.value[i].toUpperCase()) + 1
            this.#matriz[i][posicaoAlfabeto] = i
        }
        tabela.montaTabela()
    }
}

class Tabela {
    constructor() {
        this.linhas = 100
        this.colunas = 26
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
                    celulaTabela.innerHTML = i + 1
                } else {
                    celulaTabela.innerHTML = matriz[i][x]
                }
            }
        }
    }
}

let analisadorLexico = new AnalisadorLexico()

let tabela = new Tabela()