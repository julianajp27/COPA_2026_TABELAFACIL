// Capturando elementos do DOM
const botoesFase = document.querySelectorAll('.btn-fase');
const tabelaCorpo = document.getElementById('tabela-corpo');
const loading = document.getElementById('loading');
const filtroData = document.getElementById('filtro-data'); 

// ==========================================
// CONFIGURAÇÃO DA API (Seu Back-end no Render)
// ==========================================
const API_URL = 'https://copa-2026-tabelafacil.onrender.com/api/jogos';

let jogosDaFaseAtual = []; 

// Dicionário de Fases
const deParaFases = {
    "Fase de Grupos": "GROUP_STAGE",
    "16-Avos": "LAST_32",
    "Oitavas": "LAST_16",
    "Quartas": "QUARTER_FINALS",
    "Semifinal": "SEMI_FINALS",
    "Final": "FINAL"
};

// ==========================================
// DICIONÁRIO DE TRADUÇÃO DE PAÍSES
// ==========================================
const nomesPaises = {
    "Algeria": "Argélia",
    "Argentina": "Argentina",
    "Australia": "Austrália",
    "Belgium": "Bélgica",
    "Bosnia-Herzegovina": "Bósnia e Herzegovina",
    "Brazil": "Brasil",
    "Cameroon": "Camarões",
    "Canada": "Canadá",
    "Cape Verde Islands": "Cabo Verde",
    "Colombia": "Colômbia",
    "Costa Rica": "Costa Rica",
    "Croatia": "Croácia",
    "Czechia": "Chéquia",
    "Denmark": "Dinamarca",
    "Ecuador": "Equador",
    "England": "Inglaterra",
    "Egypt": "Egito",
    "France": "França",
    "Germany": "Alemanha",
    "Ghana": "Gana",
    "Haiti": "Haiti",
    "Honduras": "Honduras",
    "Iraq": "Iraque",
    "Iran": "Irã",
    "Ivory Coast": "Costa do Marfim",
    "Japan": "Japão",
    "Jordan": "Jordânia",
    "Mexico": "México",
    "Morocco": "Marrocos",
    "Netherlands": "Holanda",
    "New Zealand": "Nova Zelândia",
    "Norway": "Noruega",
    "Panama": "Panamá",
    "Paraguay": "Paraguai",
    "Peru": "Peru",
    "Poland": "Polônia",
    "Portugal": "Portugal",
    "Qatar": "Catar",
    "Saudi Arabia": "Arábia Saudita",
    "Senegal": "Senegal",
    "Serbia": "Sérvia",
    "Slovenia": "Eslovênia",
    "South Africa": "África do Sul",
    "South Korea": "Coreia do Sul",
    "Spain": "Espanha",
    "Scotland": "Escócia",
    "Sweden": "Suécia",
    "Switzerland": "Suíça",
    "Turkey": "Turquia",
    "Tunisia": "Tunísia",
    "United States": "Estados Unidos",
    "Uruguay": "Uruguai",
    "Uzbekistan": "Uzbequistão",
    "Wales": "País de Gales"
};

async function carregarFase(faseEscolhida) {
    tabelaCorpo.innerHTML = '';
    loading.classList.remove('hidden');

    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error(`Erro ao conectar com o seu servidor. Status: ${resposta.status}`);
        }

        const dados = await resposta.json();
        const faseAPI = deParaFases[faseEscolhida];

        jogosDaFaseAtual = dados.matches.filter(jogo => jogo.stage === faseAPI);

        filtroData.value = '';

        renderizarTabela(jogosDaFaseAtual);

    } catch (erro) {
        console.error("Erro na requisição:", erro);
        tabelaCorpo.innerHTML = `
            <tr>
                <td colspan="5" style="color: #ff5252; text-align: center;">
                    Erro ao conectar na API. Verifique o console (F12) para mais detalhes.
                </td>
            </tr>`;
    } finally {
        loading.classList.add('hidden'); 
    }
}

function renderizarTabela(jogos) {
    tabelaCorpo.innerHTML = '';

    if (!jogos || jogos.length === 0) {
        tabelaCorpo.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px;">Nenhum jogo encontrado para esta data.</td></tr>`;
        return;
    }

    jogos.forEach(jogo => {
        // ================= TRADUÇÃO DOS TIMES =================
        const nomeOriginalA = jogo.homeTeam.name;
        const nomeOriginalB = jogo.awayTeam.name;

        // Se o nome existir no dicionário, usa a tradução. Se não, usa o original. Se for nulo, "A Definir".
        const timeA = nomeOriginalA ? (nomesPaises[nomeOriginalA] || nomeOriginalA) : "A Definir";
        const timeB = nomeOriginalB ? (nomesPaises[nomeOriginalB] || nomeOriginalB) : "A Definir";
        
        let placar = "- x -";
        if (jogo.status === "FINISHED" || jogo.status === "IN_PLAY" || jogo.status === "PAUSED") {
            placar = `${jogo.score.fullTime.home} x ${jogo.score.fullTime.away}`;
        }

        const dataObj = new Date(jogo.utcDate);
        const dataFormatada = dataObj.toLocaleDateString('pt-BR');
        const horaFormatada = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        let statusTraduzido = "A Jogar";
        if (jogo.status === "FINISHED") statusTraduzido = "Finalizado";
        if (jogo.status === "IN_PLAY") statusTraduzido = "Ao Vivo";
        if (jogo.status === "PAUSED") statusTraduzido = "Intervalo";

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div style="font-weight: 600;">${dataFormatada}</div>
                <div style="font-size: 0.85rem; color: #b0b0b0;">${horaFormatada}</div>
            </td>
            <td class="time-col">${timeA}</td>
            <td class="placar-col">${placar}</td>
            <td class="time-col">${timeB}</td>
            <td>${statusTraduzido}</td>
        `;
        tabelaCorpo.appendChild(tr);
    });
}

botoesFase.forEach(botao => {
    botao.addEventListener('click', (e) => {
        botoesFase.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        const fase = e.target.getAttribute('data-fase');
        carregarFase(fase);
    });
});

filtroData.addEventListener('change', (e) => {
    const dataEscolhida = e.target.value; 

    if (!dataEscolhida) {
        renderizarTabela(jogosDaFaseAtual);
        return;
    }

    const [ano, mes, dia] = dataEscolhida.split('-');
    const dataFormatadaFiltro = `${dia}/${mes}/${ano}`;

    const jogosFiltrados = jogosDaFaseAtual.filter(jogo => {
        const dataDoJogoLocal = new Date(jogo.utcDate).toLocaleDateString('pt-BR'); 
        return dataDoJogoLocal === dataFormatadaFiltro;
    });

    renderizarTabela(jogosFiltrados);
});

carregarFase('Fase de Grupos');