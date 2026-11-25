const NUMERO_WHATSAPP = "5585986150846";
const LINK_INSTAGRAM = "https://www.instagram.com/nascimentoo.vx?jplx=b2c0Nm4zdDl6bGtn";

const botoesFiltro = document.querySelectorAll(".filtro-btn");
const cardsServico = document.querySelectorAll(".card-servico");

const painelInspecao = document.getElementById("painelInspecao");
const inspecaoTitulo = document.getElementById("inspecaoTitulo");
const inspecaoDescricao = document.getElementById("inspecaoDescricao");
const fecharInspecao = document.getElementById("fecharInspecao");
const btnInspecaoOrcamento = document.getElementById("btnInspecaoOrcamento");

const modalOrcamento = document.getElementById("modalOrcamento");
const btnAbrirModalTopo = document.getElementById("btnAbrirModalTopo");
const btnAbrirModalRodape = document.getElementById("btnAbrirModalRodape");
const fecharModal = document.getElementById("fecharModal");
const formOrcamento = document.getElementById("formOrcamento");
const campoServico = document.getElementById("campoServico");
const campoAmbiente = document.getElementById("campoAmbiente");
const campoMensagem = document.getElementById("campoMensagem");
const previaTexto = document.getElementById("previaTexto");

let servicoSelecionadoAtual = "Instalações Elétricas";

function montarMensagem() {
    const servico = campoServico.value;
    const ambiente = campoAmbiente.value;
    const obs = campoMensagem.value.trim();

    let texto = `Olá Guilherme Nascimento (GN Eletricista)! Gostaria de solicitar uma avaliação.\n`;
    texto += `• Serviço: ${servico}\n`;
    texto += `• Local: ${ambiente}`;
    if (obs) {
        texto += `\n• Detalhes: ${obs}`;
    }
    return texto;
}

function atualizarPrevia() {
    if (previaTexto) {
        previaTexto.textContent = montarMensagem();
    }
}

// 1. Filtrar serviços do catálogo
botoesFiltro.forEach((botao) => {
    botao.addEventListener("click", () => {
        botoesFiltro.forEach((b) => b.classList.remove("ativo"));
        botao.classList.add("ativo");

        const filtro = botao.dataset.filtro;

        cardsServico.forEach((card) => {
            const categoria = card.dataset.categoria;
            if (filtro === "todos" || categoria === filtro) {
                card.classList.remove("oculto");
            } else {
                card.classList.add("oculto");
            }
        });
    });
});

// 2. Abrir e fechar modal de orçamento
function abrirModal(servicoNome) {
    if (servicoNome) {
        servicoSelecionadoAtual = servicoNome;
        campoServico.value = servicoNome;
    }
    atualizarPrevia();
    modalOrcamento.classList.remove("oculto");
}

function fecharModalFn() {
    modalOrcamento.classList.add("oculto");
}

btnAbrirModalTopo.addEventListener("click", () => abrirModal(servicoSelecionadoAtual));
btnAbrirModalRodape.addEventListener("click", () => abrirModal(servicoSelecionadoAtual));
fecharModal.addEventListener("click", fecharModalFn);

modalOrcamento.addEventListener("click", (e) => {
    if (e.target === modalOrcamento) {
        fecharModalFn();
    }
});

campoServico.addEventListener("change", atualizarPrevia);
campoAmbiente.addEventListener("change", atualizarPrevia);
campoMensagem.addEventListener("input", atualizarPrevia);

// 3. Interação 3D, detalhes e orçamento nos cartões
cardsServico.forEach((card) => {
    const nomeServico = card.dataset.servico;
    const detalheServico = card.dataset.detalhe;
    const btnDetalhes = card.querySelector(".btn-detalhes");
    const btnOrcamento = card.querySelector(".btn-orcamento");

    card.addEventListener("mousemove", (e) => {
        if (window.innerWidth <= 820) return;
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(850px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateY(-6px)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "";
    });

    card.addEventListener("click", () => {
        cardsServico.forEach((c) => c.classList.remove("selecionado"));
        card.classList.add("selecionado");
        servicoSelecionadoAtual = nomeServico;

        inspecaoTitulo.textContent = nomeServico;
        inspecaoDescricao.textContent = detalheServico;
        painelInspecao.classList.remove("oculto");
    });

    btnDetalhes.addEventListener("click", (e) => {
        e.stopPropagation();
        card.click();
        painelInspecao.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    btnOrcamento.addEventListener("click", (e) => {
        e.stopPropagation();
        abrirModal(nomeServico);
    });
});

fecharInspecao.addEventListener("click", () => {
    painelInspecao.classList.add("oculto");
});

btnInspecaoOrcamento.addEventListener("click", () => {
    abrirModal(servicoSelecionadoAtual);
});

// 4. Enviar mensagem com os detalhes preenchidos direto para o WhatsApp
formOrcamento.addEventListener("submit", (e) => {
    e.preventDefault();

    const mensagem = montarMensagem();
    const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    fecharModalFn();
});