// ========================================
// RAÍZES DO NORDESTE
// SCRIPT PRINCIPAL
// ========================================


// ========================================
// CARRINHO
// ========================================


// ========================================
// ADICIONAR AO CARRINHO
// ========================================

function adicionarCarrinho(nome, preco, unidade) {

    let carrinho =
        JSON.parse(
            localStorage.getItem("carrinho")
        ) || [];


    // ====================================
    // VERIFICA SE EXISTE OUTRA UNIDADE
    // ====================================

    if (carrinho.length > 0) {

        let unidadeAtual =
            carrinho[0].unidade;


        if (
            unidadeAtual &&
            unidadeAtual !== unidade
        ) {

            alert(
                "Seu carrinho já possui produtos da unidade " +
                unidadeAtual.toUpperCase() +
                ".\n\n" +
                "Finalize ou esvazie o carrinho antes de escolher outra unidade."
            );

            return;
        }
    }


    // ====================================
    // PROCURA O PRODUTO NO CARRINHO
    // ====================================

    let produtoExistente =
        carrinho.find(
            function(produto) {

                return (
                    produto.nome === nome &&
                    produto.unidade === unidade
                );

            }
        );


    // ====================================
    // SE JÁ EXISTE, AUMENTA A QUANTIDADE
    // ====================================

    if (produtoExistente) {

        produtoExistente.quantidade =
            Number(
                produtoExistente.quantidade || 1
            ) + 1;

    }


    // ====================================
    // SE NÃO EXISTE, ADICIONA
    // ====================================

    else {

        carrinho.push({

            nome: nome,

            preco: Number(preco),

            unidade: unidade,

            quantidade: 1

        });

    }


    // ====================================
    // SALVA O CARRINHO
    // ====================================

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );


    // ====================================
    // VAI PARA O CARRINHO
    // ====================================

    window.location.href =
        "carrinho.html";

}



// ========================================
// ALTERAR QUANTIDADE
// ========================================

function alterarQuantidade(indice, alteracao) {

    let carrinho =
        JSON.parse(
            localStorage.getItem("carrinho")
        ) || [];


    // Verifica se o índice existe

    if (
        indice < 0 ||
        indice >= carrinho.length
    ) {

        return;
    }


    let produto =
        carrinho[indice];


    let quantidadeAtual =
        Number(produto.quantidade) || 1;


    let novaQuantidade =
        quantidadeAtual + alteracao;


    // ====================================
    // LIMITE MÍNIMO
    // ====================================

    if (novaQuantidade < 1) {

        return;
    }


    // ====================================
    // LIMITE MÁXIMO
    // ====================================

    if (novaQuantidade > 12) {

        alert(
            "Você pode adicionar no máximo 12 unidades deste produto."
        );

        return;
    }


    // ====================================
    // ATUALIZA QUANTIDADE
    // ====================================

    produto.quantidade =
        novaQuantidade;


    // ====================================
    // SALVA NO LOCALSTORAGE
    // ====================================

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );


    // ====================================
    // ATUALIZA O CARRINHO
    // ====================================

    carregarCarrinho();

}


// ========================================
// EXCLUIR ITEM DO CARRINHO
// ========================================

function excluirItemCarrinho(indice) {

    let carrinho =
        JSON.parse(
            localStorage.getItem("carrinho")
        ) || [];


    if (
        indice < 0 ||
        indice >= carrinho.length
    ) {

        return;
    }


    carrinho.splice(
        indice,
        1
    );


    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );


    carregarCarrinho();

}



// ========================================
// ESVAZIAR CARRINHO
// ========================================

function esvaziarCarrinho() {

    let carrinho =
        JSON.parse(
            localStorage.getItem("carrinho")
        ) || [];


    if (carrinho.length === 0) {

        alert(
            "O carrinho já está vazio."
        );

        return;
    }


    let confirmar =
        confirm(
            "Deseja realmente remover todos os itens do carrinho?"
        );


    if (!confirmar) {

        return;
    }


    localStorage.removeItem(
        "carrinho"
    );


    carregarCarrinho();

}



// ========================================
// CALCULAR TOTAL DO CARRINHO
// ========================================

function calcularTotalCarrinho() {

    let carrinho =
        JSON.parse(
            localStorage.getItem("carrinho")
        ) || [];


    let subtotal = 0;


    // ====================================
    // CALCULA SUBTOTAL
    // ====================================

    carrinho.forEach(
        function(produto) {

            let preco =
                Number(
                    produto.preco
                ) || 0;


            let quantidade =
                Number(
                    produto.quantidade
                ) || 1;


            subtotal +=
                preco * quantidade;

        }
    );


    // ====================================
    // CALCULA DESCONTO
    // ====================================

    let desconto = 0;


    carrinho.forEach(
        function(produto) {

            let quantidade =
                Number(
                    produto.quantidade
                ) || 1;


            // Promoção:
            // 2 ou mais Tapiocas Especiais
            // = 10% de desconto

            if (
                produto.nome ===
                "Tapioca Especial" &&
                quantidade >= 2
            ) {

                let preco =
                    Number(
                        produto.preco
                    ) || 0;


                desconto +=
                    (preco * quantidade) * 0.10;

            }

        }
    );


    // ====================================
    // TOTAL FINAL
    // ====================================

    let total =
        subtotal - desconto;


    return {

        subtotal: subtotal,

        desconto: desconto,

        total: total

    };

}



// ========================================
// CARREGAR CARRINHO
// ========================================

function carregarCarrinho() {

    let carrinho =
        JSON.parse(
            localStorage.getItem("carrinho")
        ) || [];


    let tabela =
        document.querySelector(
            "#listaCarrinho tbody"
        );


    // Se não estiver na página
    // do carrinho, encerra

    if (!tabela) {

        return;
    }


    tabela.innerHTML = "";


    // ====================================
    // CARRINHO VAZIO
    // ====================================

    if (carrinho.length === 0) {

        tabela.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >

                    Seu carrinho está vazio.

                </td>

            </tr>

        `;


        atualizarTotal(0);


        mostrarDescontoPromocao({

            subtotal: 0,

            desconto: 0,

            total: 0

        });


        return;
    }


    // ====================================
    // CORRIGE QUANTIDADES ANTIGAS
    // ====================================

    carrinho.forEach(
        function(produto) {

            if (
                !produto.quantidade ||
                Number(
                    produto.quantidade
                ) < 1
            ) {

                produto.quantidade = 1;

            }

        }
    );


    // Salva possíveis correções

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );


    // ====================================
    // CRIA AS LINHAS
    // ====================================

    carrinho.forEach(
        function(produto, indice) {

            let preco =
                Number(
                    produto.preco
                ) || 0;


            let quantidade =
                Number(
                    produto.quantidade
                ) || 1;


            let valorLinha =
                preco * quantidade;


            let linha =
                tabela.insertRow();


            linha.innerHTML = `

                <td>

                    ${produto.nome}

                </td>


                <td
                    style="
                        text-align:center;
                        white-space:nowrap;
                    "
                >

                    <button
                        type="button"
                        onclick="alterarQuantidade(
                            ${indice},
                            -1
                        )"
                        style="
                            width:30px;
                            height:30px;
                            border:none;
                            border-radius:50%;
                            cursor:pointer;
                            font-size:18px;
                        "
                    >

                        −

                    </button>


                    <strong
                        style="
                            margin:0 10px;
                        "
                    >

                        ${quantidade}

                    </strong>


                    <button
                        type="button"
                        onclick="alterarQuantidade(
                            ${indice},
                            1
                        )"
                        style="
                            width:30px;
                            height:30px;
                            border:none;
                            border-radius:50%;
                            cursor:pointer;
                            font-size:18px;
                        "
                    >

                        +

                    </button>

                </td>


                <td
                    style="
                        text-align:right;
                    "
                >

                    R$ ${valorLinha
                        .toFixed(2)
                        .replace(".", ",")}

                </td>


                <td
                    style="
                        text-align:center;
                    "
                >

                    <button
                        type="button"
                        onclick="excluirItemCarrinho(
                            ${indice}
                        )"
                        class="btn-excluir"
                    >

                        Excluir

                    </button>

                </td>

            `;

        }
    );


    // ====================================
    // CALCULA TOTAL
    // ====================================

    let resultado =
        calcularTotalCarrinho();


    atualizarTotal(
        resultado.total
    );


    // ====================================
    // MOSTRA DESCONTO
    // ====================================

    mostrarDescontoPromocao(
        resultado
    );

}



// ========================================
// ATUALIZAR TOTAL
// ========================================

function atualizarTotal(total) {

    let campoTotal =
        document.getElementById(
            "total"
        );


    if (campoTotal) {

        campoTotal.innerHTML =
            "R$ " +
            Number(total)
                .toFixed(2)
                .replace(".", ",");

    }

}



// ========================================
// MOSTRAR DESCONTO DA PROMOÇÃO
// ========================================

function mostrarDescontoPromocao(resultado) {

    let resumo =
        document.querySelector(
            ".resumo"
        );


    if (!resumo) {

        return;
    }


    // ====================================
    // REMOVE AVISO ANTIGO
    // ====================================

    let avisoAntigo =
        document.getElementById(
            "avisoPromocao"
        );


    if (avisoAntigo) {

        avisoAntigo.remove();

    }


    // ====================================
    // MOSTRA AVISO
    // ====================================

    if (
        resultado.desconto > 0
    ) {

        let aviso =
            document.createElement(
                "div"
            );


        aviso.id =
            "avisoPromocao";


        aviso.style.marginTop =
            "10px";


        aviso.style.color =
            "#2e7d32";


        aviso.style.fontWeight =
            "600";


        aviso.innerHTML =

            "🔥 Promoção aplicada! " +
            "Desconto de R$ " +
            resultado.desconto
                .toFixed(2)
                .replace(".", ",") +
            ".";


        resumo.appendChild(
            aviso
        );

    }

}



// ========================================
// IR PARA PAGAMENTO
// ========================================

function irParaPagamento() {

    let carrinho =
        JSON.parse(
            localStorage.getItem("carrinho")
        ) || [];


    // ====================================
    // VERIFICA CARRINHO
    // ====================================

    if (
        carrinho.length === 0
    ) {

        alert(
            "Seu carrinho está vazio."
        );

        return;
    }


    // ====================================
    // CALCULA TOTAL COM PROMOÇÃO
    // ====================================

    let resultado =
        calcularTotalCarrinho();


    // ====================================
    // SALVA VALOR DO PAGAMENTO
    // ====================================

    localStorage.setItem(
        "valorPagamento",
        resultado.total.toFixed(2)
    );


    localStorage.setItem(
        "valorPedido",
        resultado.total.toFixed(2)
    );


    // ====================================
    // GUARDA UNIDADE
    // ====================================

    localStorage.setItem(
        "unidadePedido",
        carrinho[0].unidade ||
        "Não informada"
    );


    // ====================================
    // GUARDA ITENS
    // ====================================

    localStorage.setItem(
        "itensPedido",
        JSON.stringify(carrinho)
    );


    // ====================================
    // VAI PARA PAGAMENTO
    // ====================================

    window.location.href =
        "pagamento.html";

}



// ========================================
// FINALIZAR PEDIDO
// ========================================

function finalizarPedido() {

    let carrinho =
        JSON.parse(
            localStorage.getItem("carrinho")
        ) || [];


    if (
        carrinho.length === 0
    ) {

        alert(
            "Seu carrinho está vazio."
        );

        return;
    }


    // ====================================
    // CALCULA TOTAL COM PROMOÇÃO
    // ====================================

    let resultado =
        calcularTotalCarrinho();


    let total =
        resultado.total;


    // ====================================
    // NÚMERO DO PEDIDO
    // ====================================

    let numeroPedido =
        Math.floor(
            Math.random() * 90000
        ) + 10000;


    // ====================================
    // DATA
    // ====================================

    let dataPedido =
        new Date().toLocaleDateString(
            "pt-BR"
        );


    // ====================================
    // UNIDADE
    // ====================================

    let unidadePedido =
        carrinho[0].unidade ||
        "Não informada";


    // ====================================
    // SALVA PEDIDO
    // ====================================

    localStorage.setItem(
        "pedido",
        numeroPedido
    );


    localStorage.setItem(
        "valorPedido",
        total.toFixed(2)
    );


    localStorage.setItem(
        "dataPedido",
        dataPedido
    );


    localStorage.setItem(
        "unidadePedido",
        unidadePedido
    );


    // ====================================
    // PONTOS DE FIDELIDADE
    // ====================================

    let pontosGanhos =
        Math.floor(total);


    let pontosAtuais =
        Number(
            localStorage.getItem("pontos")
        ) || 0;


    pontosAtuais +=
        pontosGanhos;


    localStorage.setItem(
        "pontos",
        pontosAtuais
    );


    // ====================================
    // GUARDA ITENS DO PEDIDO
    // ====================================

    localStorage.setItem(
        "itensPedido",
        JSON.stringify(carrinho)
    );


    // ====================================
    // LIMPA CARRINHO
    // ====================================

    localStorage.removeItem(
        "carrinho"
    );


    // ====================================
    // VAI PARA PEDIDO
    // ====================================

    window.location.href =
        "pedido.html";

}



// ========================================
// CARREGAR PEDIDO
// ========================================

function carregarPedido() {

    // ====================================
    // NÚMERO
    // ====================================

    let numero =
        localStorage.getItem(
            "pedido"
        );


    let numeroElemento =
        document.getElementById(
            "numeroPedido"
        );


    if (
        numeroElemento &&
        numero
    ) {

        numeroElemento.innerHTML =
            "#" + numero;

    }


    // ====================================
    // DATA
    // ====================================

    let data =
        localStorage.getItem(
            "dataPedido"
        );


    let dataElemento =
        document.getElementById(
            "dataPedido"
        );


    if (
        dataElemento &&
        data
    ) {

        dataElemento.innerHTML =
            data;

    }


    // ====================================
    // VALOR
    // ====================================

    let valor =
        localStorage.getItem(
            "valorPedido"
        );


    let valorElemento =
        document.getElementById(
            "valorPedido"
        );


    if (
        valorElemento &&
        valor
    ) {

        valorElemento.innerHTML =
            "R$ " +
            Number(valor)
                .toFixed(2)
                .replace(".", ",");

    }

}



// ========================================
// LOGIN
// ========================================

function login(event) {

    event.preventDefault();


    let emailElemento =
        document.getElementById(
            "email"
        );


    let senhaElemento =
        document.getElementById(
            "senha"
        );


    if (
        !emailElemento ||
        !senhaElemento
    ) {

        return;
    }


    let email =
        emailElemento.value.trim();


    let senha =
        senhaElemento.value.trim();


    if (
        email === "" ||
        senha === ""
    ) {

        alert(
            "Preencha todos os campos!"
        );

        return;
    }


    let usuario = {

        email: email

    };


    localStorage.setItem(
        "usuario",
        JSON.stringify(usuario)
    );


    alert(
        "Login realizado com sucesso!"
    );


    window.location.href =
        "index.html";

}



// ========================================
// MOSTRAR USUÁRIO
// ========================================

function mostrarUsuario() {

    let usuarioSalvo =
        localStorage.getItem(
            "usuario"
        );


    let menu =
        document.getElementById(
            "usuarioMenu"
        );


    if (!menu) {

        return;
    }


    // ====================================
    // USUÁRIO LOGADO
    // ====================================

    if (usuarioSalvo) {

        let usuario =
            JSON.parse(
                usuarioSalvo
            );


        menu.innerHTML = `

            <span class="usuario-logado">

                <i class="fa-solid fa-user"></i>

                ${usuario.email}

            </span>


            <a
                href="#"
                onclick="
                    sair();
                    return false;
                "
            >

                <i
                    class="fa-solid fa-right-from-bracket"
                ></i>

                Sair

            </a>

        `;

    }


    // ====================================
    // USUÁRIO NÃO LOGADO
    // ====================================

    else {

        menu.innerHTML = `

            <a href="login.html">

                <i
                    class="fa-solid fa-user"
                ></i>

                Entrar

            </a>

        `;

    }

}



// ========================================
// SAIR
// ========================================

function sair() {

    localStorage.removeItem(
        "usuario"
    );


    alert(
        "Você saiu da conta!"
    );


    window.location.href =
        "index.html";

}



// ========================================
// FIDELIDADE
// ========================================

function carregarPontos() {

    let pontos =
        Number(
            localStorage.getItem("pontos")
        ) || 0;


    let elemento =
        document.getElementById(
            "pontos"
        );


    if (elemento) {

        elemento.innerHTML =
            pontos;

    }

}



// ========================================
// CADASTRO
// ========================================

function cadastrarUsuario(event) {

    event.preventDefault();


    let nome =
        document.getElementById(
            "nome"
        );


    let email =
        document.getElementById(
            "email"
        );


    let senha =
        document.getElementById(
            "senha"
        );


    let confirmarSenha =
        document.getElementById(
            "confirmarSenha"
        );


    let termos =
        document.getElementById(
            "termos"
        );


    if (
        !nome ||
        !email ||
        !senha ||
        !confirmarSenha
    ) {

        return;
    }


    if (
        nome.value.trim() === "" ||
        email.value.trim() === "" ||
        senha.value.trim() === "" ||
        confirmarSenha.value.trim() === ""
    ) {

        alert(
            "Preencha todos os campos!"
        );

        return;
    }


    if (
        senha.value !==
        confirmarSenha.value
    ) {

        alert(
            "As senhas não coincidem!"
        );

        return;
    }


    if (
        termos &&
        !termos.checked
    ) {

        alert(
            "Você precisa aceitar os termos e a política de privacidade."
        );

        return;
    }


    let usuario = {

        nome:
            nome.value.trim(),

        email:
            email.value.trim(),

        senha:
            senha.value

    };


    localStorage.setItem(
        "usuario",
        JSON.stringify(usuario)
    );


    alert(
        "Cadastro realizado com sucesso!"
    );


    window.location.href =
        "index.html";

}



// ========================================
// CARDÁPIO POR UNIDADE
// ========================================

const produtosPorUnidade = {


    // ====================================
    // RECIFE
    // ====================================

    recife: [

        {

            nome:
                "X-Baião",

            imagem:
                "img/produtos/xbalao.png",

            descricao:
                "Hambúrguer artesanal com carne de sol, queijo coalho e molho especial.",

            preco:
                28.90

        },


        {

            nome:
                "Tapioca Especial",

            imagem:
                "img/produtos/tapioca.png",

            descricao:
                "Tapioca recheada com frango, queijo coalho e manteiga da terra.",

            preco:
                18.90

        },


        {

            nome:
                "Cuscuz Completo",

            imagem:
                "img/produtos/cuscuz.png",

            descricao:
                "Cuscuz nordestino com ovos, queijo coalho e carne seca.",

            preco:
                24.90

        },


        {

            nome:
                "Carne de Sol",

            imagem:
                "img/produtos/carnedesol.png",

            descricao:
                "Carne de sol acompanhada de macaxeira frita e vinagrete.",

            preco:
                39.90

        },


        {

            nome:
                "Escondidinho",

            imagem:
                "img/produtos/escondidinho.png",

            descricao:
                "Purê de macaxeira recheado com carne seca desfiada.",

            preco:
                34.90

        },


        {

            nome:
                "Suco de Caju",

            imagem:
                "img/produtos/suco.png",

            descricao:
                "Suco natural de caju, preparado na hora.",

            preco:
                9.90

        }

    ],


    // ====================================
    // OLINDA
    // ====================================

    olinda: [

        {

            nome:
                "X-Baião",

            imagem:
                "img/produtos/xbalao.png",

            descricao:
                "Hambúrguer artesanal com carne de sol e queijo coalho.",

            preco:
                29.90

        },


        {

            nome:
                "Tapioca Especial",

            imagem:
                "img/produtos/tapioca.png",

            descricao:
                "Tapioca artesanal recheada com frango e queijo coalho.",

            preco:
                19.90

        },


        {

            nome:
                "Cuscuz Completo",

            imagem:
                "img/produtos/cuscuz.png",

            descricao:
                "Cuscuz nordestino com ovos e carne seca.",

            preco:
                25.90

        },


        {

            nome:
                "Carne de Sol",

            imagem:
                "img/produtos/carnedesol.png",

            descricao:
                "Carne de sol acompanhada de macaxeira frita e vinagrete.",

            preco:
                41.90

        },


        {

            nome:
                "Escondidinho",

            imagem:
                "img/produtos/escondidinho.png",

            descricao:
                "Escondidinho de macaxeira com carne seca desfiada.",

            preco:
                35.90

        },


        {

            nome:
                "Suco de Caju",

            imagem:
                "img/produtos/suco.png",

            descricao:
                "Suco natural de caju preparado na hora.",

            preco:
                10.90

        }

    ],


    // ====================================
    // JABOATÃO
    // ====================================

    jaboatao: [

        {

            nome:
                "X-Baião",

            imagem:
                "img/produtos/xbalao.png",

            descricao:
                "Hambúrguer artesanal com sabores do Nordeste.",

            preco:
                27.90

        },


        {

            nome:
                "Tapioca Especial",

            imagem:
                "img/produtos/tapioca.png",

            descricao:
                "Tapioca recheada com queijo coalho e manteiga da terra.",

            preco:
                17.90

        },


        {

            nome:
                "Cuscuz Completo",

            imagem:
                "img/produtos/cuscuz.png",

            descricao:
                "Cuscuz nordestino com ovos, queijo coalho e carne seca.",

            preco:
                23.90

        },


        {

            nome:
                "Carne de Sol",

            imagem:
                "img/produtos/carnedesol.png",

            descricao:
                "Carne de sol com macaxeira frita e vinagrete.",

            preco:
                38.90

        },


        {

            nome:
                "Escondidinho",

            imagem:
                "img/produtos/escondidinho.png",

            descricao:
                "Purê de macaxeira recheado com carne seca.",

            preco:
                33.90

        },


        {

            nome:
                "Suco de Caju",

            imagem:
                "img/produtos/suco.png",

            descricao:
                "Suco natural de caju preparado na hora.",

            preco:
                8.90

        }

    ]

};



// ========================================
// CARREGAR CARDÁPIO
// ========================================

function carregarCardapio() {

    let unidadeElemento =
        document.getElementById(
            "unidade"
        );


    let lista =
        document.getElementById(
            "listaProdutos"
        );


    // Não está na página do cardápio

    if (
        !unidadeElemento ||
        !lista
    ) {

        return;
    }


    let unidade =
        unidadeElemento.value;


    let produtos =
        produtosPorUnidade[
            unidade
        ];


    // ====================================
    // SEGURANÇA
    // ====================================

    if (!produtos) {

        lista.innerHTML = `

            <p
                style="
                    text-align:center;
                "
            >

                Nenhum produto encontrado
                para esta unidade.

            </p>

        `;

        return;
    }


    // ====================================
    // LIMPA A LISTA
    // ====================================

    lista.innerHTML = "";


    // ====================================
    // CRIA OS CARDS
    // ====================================

    produtos.forEach(
        function(produto) {

            let card =
                document.createElement(
                    "div"
                );


            card.className =
                "card";


            card.innerHTML = `

                <img
                    src="${produto.imagem}"
                    alt="${produto.nome}"
                >


                <h3>

                    ${produto.nome}

                </h3>


                <p>

                    ${produto.descricao}

                </p>


                <span>

                    R$ ${produto.preco
                        .toFixed(2)
                        .replace(".", ",")}

                </span>


                <button
                    type="button"
                    class="btn"
                    onclick="adicionarCarrinho(
                        '${produto.nome}',
                        ${produto.preco},
                        '${unidade}'
                    )"
                >

                    Adicionar ao Carrinho

                </button>

            `;


            lista.appendChild(
                card
            );

        }
    );

}



// ========================================
// INICIALIZAÇÃO DO SITE
// ========================================

function iniciarSite() {

    carregarCarrinho();

    carregarPedido();

    mostrarUsuario();

    carregarPontos();

    carregarCardapio();

}



// ========================================
// EXECUTA QUANDO A PÁGINA ESTIVER PRONTA
// ========================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        iniciarSite
    );

}

else {

    iniciarSite();

}