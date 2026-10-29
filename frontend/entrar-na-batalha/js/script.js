/* =====================================================
   SCRIPT.JS
   Comportamento compartilhado do app "Entrar na Batalha"
   Cada função cuida de uma parte simples da tela.
   ===================================================== */

/* -----------------------------------------------------
   1. TEMA CLARO / ESCURO
   Guarda a escolha do usuário no navegador (localStorage)
   para o tema continuar o mesmo ao trocar de página.
   ----------------------------------------------------- */
function aplicarTemaSalvo() {
  var temaSalvo = localStorage.getItem("tema-entrar-na-batalha");
  if (temaSalvo === "escuro") {
    document.documentElement.setAttribute("data-tema", "escuro");
  }
  atualizarIconeBotaoTema();
}

function alternarTema() {
  var estaEscuro = document.documentElement.getAttribute("data-tema") === "escuro";

  if (estaEscuro) {
    document.documentElement.removeAttribute("data-tema");
    localStorage.setItem("tema-entrar-na-batalha", "claro");
  } else {
    document.documentElement.setAttribute("data-tema", "escuro");
    localStorage.setItem("tema-entrar-na-batalha", "escuro");
  }

  atualizarIconeBotaoTema();
}

function atualizarIconeBotaoTema() {
  var botaoTema = document.querySelector(".botao-tema");
  if (!botaoTema) return;

  var estaEscuro = document.documentElement.getAttribute("data-tema") === "escuro";
  botaoTema.textContent = estaEscuro ? "☀️" : "🌙";
}

/* Aplica o tema assim que o script carrega, antes de tudo */
aplicarTemaSalvo();

/* -----------------------------------------------------
   2. TELA DE PERSONAGENS
   Permite clicar em um personagem da lista para selecioná-lo.
   ----------------------------------------------------- */
function configurarListaDePersonagens() {
  var cartoesDePersonagem = document.querySelectorAll(".item-personagem[data-bloqueado='false']");

  cartoesDePersonagem.forEach(function (cartao) {
    cartao.addEventListener("click", function () {
      cartoesDePersonagem.forEach(function (outroCartao) {
        outroCartao.classList.remove("selecionado");
      });
      cartao.classList.add("selecionado");
    });
  });
}

/* -----------------------------------------------------
   3. TELA DE MISSÕES
   - Clicar em uma missão marca (ou desmarca) como concluída.
   - Clicar na lixeira exclui a missão da lista.
   - O formulário no fim da lista adiciona uma missão nova.
   O contador "X/Y" do cartão é sempre recalculado depois
   de qualquer uma dessas três ações.
   ----------------------------------------------------- */
function configurarListaDeMissoes() {
  var listaDeMissoes = document.getElementById("lista-de-missoes");
  var seloContagem = document.querySelector(".selo-contagem");
  var formularioNovaMissao = document.getElementById("formulario-nova-missao");
  var campoNovaMissao = document.getElementById("campo-nova-missao");

  if (!listaDeMissoes) return;

  function atualizarContadorDeMissoes() {
    var total = listaDeMissoes.querySelectorAll(".item-missao").length;
    var concluidas = listaDeMissoes.querySelectorAll(".item-missao.concluida").length;
    if (seloContagem) {
      seloContagem.textContent = concluidas + "/" + total;
    }
  }

  // Cria o <li> de uma nova missão, com a mesma estrutura das outras
  function criarItemDeMissao(nomeDaMissao) {
    var novoItem = document.createElement("li");
    novoItem.className = "item-missao";
    novoItem.innerHTML =
      '<span class="caixa-marcacao">✓</span>' +
      '<div class="texto-missao">' +
      '<span class="titulo-missao"></span>' +
      '<p class="recompensa-missao">Recompensa: +10 XP</p>' +
      "</div>" +
      '<button type="button" class="botao-excluir-missao" aria-label="Excluir esta missão">🗑️</button>';

    // Define o nome da missão desta forma (em vez de já ir no innerHTML)
    // para evitar problemas caso o usuário digite algo como < ou >.
    novoItem.querySelector(".titulo-missao").textContent = nomeDaMissao;

    return novoItem;
  }

  // Um único "escutador" no <ul> cuida de marcar como concluída
  // e de excluir, mesmo em missões criadas depois pelo usuário.
  listaDeMissoes.addEventListener("click", function (evento) {
    var botaoExcluir = evento.target.closest(".botao-excluir-missao");
    var itemClicado = evento.target.closest(".item-missao");

    if (botaoExcluir) {
      botaoExcluir.closest(".item-missao").remove();
      atualizarContadorDeMissoes();
      return;
    }

    if (itemClicado) {
      itemClicado.classList.toggle("concluida");
      atualizarContadorDeMissoes();
    }
  });

  if (formularioNovaMissao && campoNovaMissao) {
    formularioNovaMissao.addEventListener("submit", function (evento) {
      evento.preventDefault();

      var nomeDigitado = campoNovaMissao.value.trim();
      if (nomeDigitado === "") return;

      var novoItem = criarItemDeMissao(nomeDigitado);
      listaDeMissoes.appendChild(novoItem);

      campoNovaMissao.value = "";
      campoNovaMissao.focus();
      atualizarContadorDeMissoes();
    });
  }

  atualizarContadorDeMissoes();
}

/* -----------------------------------------------------
   4. SUB-ABAS (usadas em missões e inventário)
   Clicar em uma sub-aba destaca ela e tira o destaque das outras.
   ----------------------------------------------------- */
function configurarSubAbas() {
  var gruposDeAbas = document.querySelectorAll(".sub-abas");

  gruposDeAbas.forEach(function (grupo) {
    var botoesDaAba = grupo.querySelectorAll("button");

    botoesDaAba.forEach(function (botao) {
      botao.addEventListener("click", function () {
        botoesDaAba.forEach(function (outroBotao) {
          outroBotao.classList.remove("sub-aba-ativa");
        });
        botao.classList.add("sub-aba-ativa");
      });
    });
  });
}

/* -----------------------------------------------------
   5. TELA DE INVENTÁRIO
   Clicar em um item do grid mostra os detalhes dele no cartão abaixo.
   ----------------------------------------------------- */
function configurarGradeDeItens() {
  var itensDoInventario = document.querySelectorAll(".item-inventario[data-bloqueado='false']");
  var nomeNoDetalhe = document.querySelector(".cartao-item-detalhe .linha-titulo-item span:first-child");
  var descricaoNoDetalhe = document.querySelector(".cartao-item-detalhe p");

  if (itensDoInventario.length === 0) return;

  itensDoInventario.forEach(function (item) {
    item.addEventListener("click", function () {
      itensDoInventario.forEach(function (outroItem) {
        outroItem.classList.remove("item-selecionado");
      });
      item.classList.add("item-selecionado");

      if (nomeNoDetalhe) nomeNoDetalhe.textContent = item.getAttribute("data-nome-item");
      if (descricaoNoDetalhe) descricaoNoDetalhe.textContent = item.getAttribute("data-descricao-item");
    });
  });
}

/* -----------------------------------------------------
   6. TELA DE FOCO (temporizador)
   Contagem regressiva simples em minutos e segundos,
   com botões para iniciar/pausar e ajustar o tempo.
   ----------------------------------------------------- */
function configurarTemporizadorDeFoco() {
  var mostrador = document.querySelector(".mostrador");
  var anelTemporizador = document.querySelector(".anel-temporizador");
  var botaoIniciarPausar = document.querySelector(".botao-iniciar-pausar");
  var botaoMenosCincoMinutos = document.querySelector(".botao-menos-cinco");
  var botaoMaisCincoMinutos = document.querySelector(".botao-mais-cinco");

  if (!mostrador || !anelTemporizador) return;

  var duracaoTotalEmSegundos = 25 * 60;
  var segundosRestantes = duracaoTotalEmSegundos;
  var temporizadorEstaRodando = false;
  var idDoIntervalo = null;

  function formatarTempo(segundos) {
    var minutos = Math.floor(segundos / 60);
    var segundosRestantesFormatados = segundos % 60;
    var minutosTexto = String(minutos).padStart(2, "0");
    var segundosTexto = String(segundosRestantesFormatados).padStart(2, "0");
    return minutosTexto + ":" + segundosTexto;
  }

  function atualizarVisualDoTemporizador() {
    mostrador.textContent = formatarTempo(segundosRestantes);

    var porcentagemRestante = (segundosRestantes / duracaoTotalEmSegundos) * 100;
    anelTemporizador.style.setProperty("--progresso-temporizador", porcentagemRestante + "%");
  }

  function avancarUmSegundo() {
    if (segundosRestantes <= 0) {
      pausarTemporizador();
      return;
    }
    segundosRestantes = segundosRestantes - 1;
    atualizarVisualDoTemporizador();
  }

  function iniciarTemporizador() {
    temporizadorEstaRodando = true;
    if (botaoIniciarPausar) botaoIniciarPausar.textContent = "⏸ Pausar";
    idDoIntervalo = setInterval(avancarUmSegundo, 1000);
  }

  function pausarTemporizador() {
    temporizadorEstaRodando = false;
    if (botaoIniciarPausar) botaoIniciarPausar.textContent = "▶ Começar";
    clearInterval(idDoIntervalo);
  }

  if (botaoIniciarPausar) {
    botaoIniciarPausar.addEventListener("click", function () {
      if (temporizadorEstaRodando) {
        pausarTemporizador();
      } else {
        iniciarTemporizador();
      }
    });
  }

  if (botaoMenosCincoMinutos) {
    botaoMenosCincoMinutos.addEventListener("click", function () {
      duracaoTotalEmSegundos = Math.max(5 * 60, duracaoTotalEmSegundos - 5 * 60);
      segundosRestantes = duracaoTotalEmSegundos;
      atualizarVisualDoTemporizador();
    });
  }

  if (botaoMaisCincoMinutos) {
    botaoMaisCincoMinutos.addEventListener("click", function () {
      duracaoTotalEmSegundos = duracaoTotalEmSegundos + 5 * 60;
      segundosRestantes = duracaoTotalEmSegundos;
      atualizarVisualDoTemporizador();
    });
  }

  atualizarVisualDoTemporizador();
}

/* -----------------------------------------------------
   7. FORMULÁRIOS (login e cadastro)
   Impede o envio de verdade (não existe servidor aqui)
   e apenas leva o usuário para a próxima tela.
   ----------------------------------------------------- */
function configurarFormulario(idDoFormulario, paginaDeDestino) {
  var formulario = document.getElementById(idDoFormulario);
  if (!formulario) return;

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    window.location.href = paginaDeDestino;
  });
}

/* -----------------------------------------------------
   8. INICIALIZAÇÃO
   Quando a página termina de carregar, liga cada parte
   que existir naquela tela (as funções se protegem
   sozinhas quando o elemento não existe).
   ----------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  var botaoTema = document.querySelector(".botao-tema");
  if (botaoTema) {
    botaoTema.addEventListener("click", alternarTema);
  }

  configurarListaDePersonagens();
  configurarListaDeMissoes();
  configurarSubAbas();
  configurarGradeDeItens();
  configurarTemporizadorDeFoco();
});
