// Capturando elementos do DOM
const botoesFase = document.querySelectorAll('.btn-fase');
const tabelaCorpo = document.getElementById('tabela-corpo');
const loading = document.getElementById('loading');
const filtroData = document.getElementById('filtro-data'); // Novo elemento do filtro

// ==========================================
// CONFIGURAÇÃO DA API (Seu Back-end no Render)
// ==========================================
const API_URL = 'https://copa-2026-tabelafacil.onrender.com/api/jogos';

let jogosDaFaseAtual = []; // Memória para guardar os jogos da fase selecionada

// Dicionário para traduzir o nome do nosso botão (Português) para o formato da API (Inglês)
const deParaFases = {
    "Fase de Grupos": "GROUP_STAGE",
    "16-Avos": "LAST_32",
    "Oitavas": "LAST_16",
    "Quartas": "QUARTER_FINALS",
    "Semifinal": "SEMI_FINALS",
    "Final": "FINAL"
};

async function carregarFase(faseEscolhida) {
    // Prepara a tela
    tabelaCorpo.innerHTML = '';
    loading.classList.remove('hidden');

    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error(`Erro ao conectar com o seu servidor. Status: ${resposta.status}`);
        }

        const dados = await resposta.json();
        
        // Converte o nome do botão clicado para o nome da fase na API
        const faseAPI = deParaFases[faseEscolhida];

        // Filtra dentro dos "matches" (jogos) apenas os que são da fase correta
        // E salva na nossa variável de memória
        jogosDaFaseAtual = dados.matches.filter(jogo => jogo.stage === faseAPI);

        // Limpa o calendário toda vez que o usuário trocar de aba (Fase)
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
        loading.classList.add('hidden'); // Esconde o "Carregando..."
    }
}

function renderizarTabela(jogos) {
    // Limpa a tabela antes de renderizar os novos dados (importante para o filtro)
    tabelaCorpo.innerHTML = '';

    if (!jogos || jogos.length === 0) {
        tabelaCorpo.innerHTML = `<tr><td colspan="5" style="text-align: center;">Nenhum jogo encontrado para esta seleção.</td></tr>`;
        return;
    }

    jogos.forEach(jogo => {
        // Pega o nome do time ou coloca "A Definir" caso o chaveamento ainda não esteja pronto
        const timeA = jogo.homeTeam.name || "A Definir";
        const timeB = jogo.awayTeam.name || "A Definir";
        
        // Tratamento do placar
        let placar = "- x -";
        if (jogo.status === "FINISHED" || jogo.status === "IN_PLAY" || jogo.status === "PAUSED") {
            placar = `${jogo.score.fullTime.home} x ${jogo.score.fullTime.away}`;
        }

        // Formatação da Data (converte de padrão UTC para o formato brasileiro)
        const dataFormatada = new Date(jogo.utcDate).toLocaleDateString('pt-BR');

        // Tradução do Status do jogo
        let statusTraduzido = "A Jogar";
        if (jogo.status === "FINISHED") statusTraduzido = "Finalizado";
        if (jogo.status === "IN_PLAY") statusTraduzido = "Ao Vivo";
        if (jogo.status === "PAUSED") statusTraduzido = "Intervalo";

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${dataFormatada}</td>
            <td class="time-col">${timeA}</td>
            <td class="placar-col">${placar}</td>
            <td class="time-col">${timeB}</td>
            <td>${statusTraduzido}</td>
        `;
        tabelaCorpo.appendChild(tr);
    });
}

// Adicionando eventos de clique nos botões
botoesFase.forEach(botao => {
    botao.addEventListener('click', (e) => {
        // Atualiza a cor de destaque do botão ativo
        botoesFase.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // Dispara a busca
        const fase = e.target.getAttribute('data-fase');
        carregarFase(fase);
    });
});

// Evento que escuta quando o usuário escolhe uma data no calendário
filtroData.addEventListener('change', (e) => {
    const dataEscolhida = e.target.value; // Vem no formato YYYY-MM-DD

    // Se o usuário limpar o calendário, mostra todos os jogos da fase novamente
    if (!dataEscolhida) {
        renderizarTabela(jogosDaFaseAtual);
        return;
    }

    // Filtra os jogos comparando a data escolhida com a data do jogo
    const jogosFiltrados = jogosDaFaseAtual.filter(jogo => {
        // A data da API vem como "2026-06-11T19:00:00Z". O split('T')[0] pega só o "2026-06-11"
        const dataDoJogo = jogo.utcDate.split('T')[0]; 
        return dataDoJogo === dataEscolhida;
    });

    renderizarTabela(jogosFiltrados);
});

// Ao abrir a página, já puxa a Fase de Grupos
carregarFase('Fase de Grupos');