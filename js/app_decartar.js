class AnalisadorLexico {
    #matriz;

    constructor() {
        this.#matriz = null
        this.#inicializaArray()
    }

    get matriz() {
        return this.#matriz
    }

    set matriz(tokenCompleto = '') {
        if(this.#matriz.length == 0) {
            this.#inicializaArray()
        }

        tokenCompleto = tokenCompleto.toUpperCase();
        let caractere = tokenCompleto.charAt(tokenCompleto.length - 1).toUpperCase()

        if (caractere !== '') {
            if (caractere === ' ') {
                this.#adicionaLinhaMatriz()
                console.log(this.#matriz)
            } else {
                if (this.#validaTokens(tokenCompleto)) {
                    let posicao = this.#retornaPosicaoCaractere(caractere)
                    this.#validaInput(this.#matriz.length - 1, posicao)
                } else {
                    console.log('Inválido');
                }
            }
        } else {
            this.#matriz = []
        }
    }

    #inicializaArray() {
        this.#matriz = Array.from({length: 100}, () => Array(25).fill(null))
    }

    #validaTokens(token) {
        for (let i = 0; i <= token.length - 1; i++) {
            if (this.#retornaPosicaoCaractere(token[i]) === -1) {
                return false;
            }
        }
        return true;
    }

    #validaInput(linha, coluna) {
        if (this.#matriz[linha][coluna] !== undefined) {
            this.#matriz[linha][coluna] = coluna
            console.log(this.#matriz[linha][coluna])
            console.log(this.#matriz)
        } else {
            console.log('Inválido')
        }
    }

    #retornaPosicaoCaractere(caractere) {
        let posicao = null;
        switch (caractere) {
            case 'A': posicao = 0; break
            case 'B': posicao = 1; break
            case 'C': posicao = 2; break
            case 'D': posicao = 3; break
            case 'E': posicao = 4; break
            case 'F': posicao = 5; break
            case 'G': posicao = 6; break
            case 'H': posicao = 7; break
            case 'I': posicao = 8; break
            case 'J': posicao = 9; break
            case 'K': posicao = 10; break
            case 'L': posicao = 11; break
            case 'M': posicao = 12; break
            case 'N': posicao = 13; break
            case 'O': posicao = 14; break
            case 'P': posicao = 15; break
            case 'Q': posicao = 16; break
            case 'R': posicao = 17; break
            case 'S': posicao = 18; break
            case 'T': posicao = 19; break
            case 'U': posicao = 20; break
            case 'V': posicao = 21; break
            case 'W': posicao = 22; break
            case 'X': posicao = 23; break
            case 'Y': posicao = 24; break
            case 'Z': posicao = 25; break
            case ' ': posicao = 999; break
            default: posicao = -1; break
        }
        return posicao
    }

    #adicionaLinhaMatriz() {
        this.#matriz.push([])
        for (let i = 0; i <= 25; i++) {
            this.#matriz[this.#matriz.length - 1].push(-1)
        }
    }
}

let a = new AnalisadorLexico()
