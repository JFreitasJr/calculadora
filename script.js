class Calculadora {

    constructor() {
        this.nrVisor = '0';
        this.ptDecimal = false;
        this.iniciouSegundo = false;
        this.estadoErro = false;
        this.memTemp = '';
        this.memoria = 0;
        this.op = {
            NOP: 0,
            DIV: 1,
            MULT: 2,
            SUB: 3,
            SUM: 4
        };
        this.opAtual = this.op.NOP;
        this.ligada = false;
    }

    //
    ligarCalc() {
        this.ligada= true;
        this.nrVisor = '0';
        this.ptDecimal = false;
        this.iniciouSegundo = false;
        this.estadoErro = false;
        this.memTemp = '';
        this.memoria = 0;
        this.opAtual = this.op.NOP;
    }

    //
    desligarCalc() {
        this.ligada = false;
        this.nrVisor = '';
        this.ptDecimal = false;
        this.iniciouSegundo = false;
        this.estadoErro = false;
        this.memTemp = '';
        this.memoria = 0;
        this.opAtual = this.op.NOP;
        document.getElementById('visor-id').innerHTML = this.nrVisor
    }

    // Retorna o contúdo do visor
    mostraVisor() {
        return this.nrVisor;
    }

    // Recebe um dígito
    insereDigito(dig) {
        if (!this.ligada) return;
        if (this.estadoErro) return;
        if (dig.length != 1) return;
        if ((dig < '0' || dig > '9') && dig != '.') return;
        if (!this.iniciouSegundo && this.opAtual != this.op.NOP) {
            this.iniciouSegundo = true;
            this.ptDecimal = false;
            this.nrVisor = '0';
        }
        if (dig == '.') {
            if (this.ptDecimal) return;
            this.ptDecimal = true;
        }
        if (this.nrVisor.length == 10) return;
        if (this.nrVisor == '0') {
            this.nrVisor = dig == '.' ? '0.' : dig;
        } else {
            this.nrVisor += dig;
        }
    }

    // Define a operação atual
    defineOperacao(op) {
        if (!this.ligada) return;
        if (this.estadoErro) return;
        switch (op) {
            case '+':
                this.opAtual = this.op.SUM;
                break;
            case '-':
                this.opAtual = this.op.SUB;
                break;
            case '*':
                this.opAtual = this.op.MULT;
                break;
            case '/':
                this.opAtual = this.op.DIV;
                break;
        }
        this.memTemp = this.nrVisor;
    }

    // Executa operação: tecla IGUAL
    igual() {
        if (!this.ligada) return;
        if (this.estadoErro) return;
        let num1 = parseFloat(this.memTemp);
        let num2 = parseFloat(this.nrVisor);
        let resultado = 0;
        switch (this.opAtual) {
            case this.op.SUM:
                resultado = num1 + num2;
                break;
            case this.op.SUB:
                resultado = num1 - num2;
                break;
            case this.op.MULT:
                resultado = num1 * num2;
                break;
            case this.op.DIV:
                // PERIGO: DIVISÃO POR ZERO
                if (num2 == 0) {
                    this.estadoErro = true;
                    this.nrVisor = 'ERRO!';
                    return;
                }
                resultado = num1 / num2;
        }
        this.opAtual = this.op.NOP;
        this.ptDecimal = false;
        this.iniciouSegundo = false;
        this.memTemp = '';
        this.nrVisor = String(resultado).slice(0, 10);
    }

    // Limpa o conteúdo do visor e as operações (mas não a memória)
    teclaC() {
        if (!this.ligada) return;
        this.nrVisor = '0';
        this.ptDecimal = false;
        this.memTemp = '';
        this.iniciouSegundo = false;
        this.estadoErro = false;
        this.opAtual = this.op.NOP;
    }

    // tecla M+ : acrescenta à memória o número no visor
    teclaMmais() {
        if (!this.ligada) return;
        if (this.estadoErro) return;
        this.memoria += parseFloat(this.nrVisor);
    }

    // tecla M- : subtrai da memória o número no visor
    teclaMmenos() {
        if (!this.ligada) return;
        if (this.estadoErro) return;
        this.memoria -= parseFloat(this.nrVisor);
    }

    // tecla RM : recupera o conteúdo da memória -> coloca no visor
    teclaRM() {
        if (!this.ligada) return;
        if (this.estadoErro) return;
        this.nrVisor = String(this.memoria);
    }

    // tecla CLM : limpa totalmente o conteúdo da memória -> atribui 0
    teclaCLM() {
        if (!this.ligada) return;
        if (this.estadoErro) return;
        this.memoria = 0;
    }

    //Tecla Raiz quadrada: pega o número no visor e calcula a raiz desse número e limita o resultado em até 10 digitos
    teclaRaiz() {
        if (!this.ligada) return;
        if (this.estadoErro) return;
        let num = parseFloat(this.nrVisor);
        if (num < 0) {
            this.estadoErro = true;
            this.nrVisor = 'ERRO!';
            return;
        }
        let resultado = Math.sqrt(num);
        this.nrVisor = String(resultado).slice(0, 10);
    }

    // Tecla Porcentagem: calcula o valor da porcentagem digitada do valor na memória
    teclaPorc() {
        if (!this.ligada) return;
        if (this.estadoErro) return;
        let num = parseFloat(this.memTemp);
        let porc = parseFloat(this.nrVisor) / 100;
        let resultado = num * porc;
        this.nrVisor = String(resultado).slice(0, 10);
    }

    // Tecla Potência: calcula o quadrado do número no visor
    teclaPot() {
        if (!this.ligada) return;
        if (this.estadoErro) return;
        let num = parseFloat(this.nrVisor);
        let resultado = num * num;
        this.nrVisor = String(resultado).slice(0, 10);
    }

    //Tecla inverso: Inverte o valor apresentado no visor
    teclaInver() {
        if (!this.ligada) return;
        if (this.estadoErro) return;
        let num = parseFloat(this.nrVisor);
        if(num === 0) {
            this.estadoErro = true;
            this.nrVisor = 'DIVISÃO POR ZERO!';
            return;
        }
        let resultado = 1 / num;
        this.nrVisor = String(resultado).slice(0, 10);
    }

    //Tecla troca de sinal: trocal o sinal do valor apresentado no visor
    teclaSinal() {
        if (!this.ligada) return;
        if (this.estadoErro) return;
        let num= parseFloat(this.nrVisor);
        let resultado = -(num);
        this.nrVisor = String(resultado).slice(0, 10);
    }

}


// ========================================================================
//      REAÇÃO A EVENTOS DO MOUSE
// ========================================================================

//
let alternarCalculadora = () => {
    const botaoLigarDesligar = document.querySelector('.teclas-ligardesligar');

    if (calculadora.ligada) {
        calculadora.desligarCalc();
        botaoLigarDesligar.textContent = 'ON';
    } else{
        calculadora.ligarCalc();
        botaoLigarDesligar.textContent = 'OFF';
    }
    atualizaVisor();
}

// Exibe o conteúdo do visor
let atualizaVisor = () => {
    if (!calculadora.ligada) return;

    document.getElementById('visor-id').innerHTML = calculadora.mostraVisor();
}

// RECEBE UM DÍGITO DA CALCULADORA
let digito = (dig) => {
    calculadora.insereDigito(dig);
    atualizaVisor();
}

// RECEBE OPERAÇÃO ATUAL
let defineOp = (op) => {
    if (calculadora.opAtual != calculadora.op.NOP) {
        igual();
        atualizaVisor();
    }
    calculadora.defineOperacao(op);
}

// CALCULA A OPERAÇÃO
let igual = () => {
    calculadora.igual();
    atualizaVisor();
}

// TECLA C: LIMPA TUDO, EXCETO MEMÓRIA
let teclaC = () => {
    calculadora.teclaC();
    atualizaVisor();
}

// M+ ACRESCENTA À MEMÓRIA O NÚMERO ATUAL NO VISOR
let teclaMmais = () => {
    calculadora.teclaMmais();
}

// M- SUBTRAI DA MEMÓRIA O NÚMERO ATUAL NO VISOR
let teclaMmenos = () => {
    calculadora.teclaMmenos();
}

// PÕE NO VISOR O CONTEÚDO DA MEMÓRIA
let teclaRM = () => {
    calculadora.teclaRM();
    atualizaVisor();
}

// APAGA TODO O CONTEÚDO DA MEMÓRIA
let teclaCLM = () => {
    calculadora.teclaCLM();
}

// CALCULA A RAIZ DO NÚMERO NO VISOR
let teclaRaiz = () => {
    calculadora.teclaRaiz();
    atualizaVisor();
}

// REALIZA A CONVERSÃO DO NÚMERO NA MEMÓRIA NA PORCENTAGEM SELECIONADA
let teclaPorc = () => {
    calculadora.teclaPorc();
    atualizaVisor();
}

// REALIZA A POTÊNCIA DO VALOR NO VISOR
let teclaPot = () => {
    calculadora.teclaPot();
    atualizaVisor();
}

//REALIZA A OPERAÇÃO DA TECLA INVERSO
let teclaInver = () => {
    calculadora.teclaInver();
    atualizaVisor();
}

//
let teclaSinal = () => {
    calculadora.teclaSinal();
    atualizaVisor();
}



// ==========  INICIALIZAÇÃO ===================
let calculadora = new Calculadora();