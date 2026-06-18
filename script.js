// Capturando elementos do DOM
const botoesFase = document.querySelectorAll('.btn-fase');
const tabelaCorpo = document.getElementById('tabela-corpo');
const loading = document.getElementById('loading');

// ==========================================
// CONFIGURAÇÃO DA API REAL (football-data.org)
// ==========================================
// Substitua a linha do const API_URL por esta:
const API_URL = 'http://127.0.0.1:8000/api/jogos'; // <-- Trocaremos pelo link do Railway depois
const API_KEY = 'SUA_CHAVE_SECRETA_AQUI'; // <-- Insira sua chave secreta aqui (sem aspas)

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
        // O "fetch" agora vai na URL real e envia a sua chave secreta como um cabeçalho (Header)
        const resposta = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'X-Auth-Token': API_KEY
            }
        });

        if (!resposta.ok) {
            throw new Error(`Erro de autenticação ou limite excedido. Status: ${resposta.status}`);
        }

        const dados = await resposta.json();
        
        // Converte o nome do botão clicado para o nome da fase na API
        const faseAPI = deParaFases[faseEscolhida];

        // Filtra dentro dos "matches" (jogos) apenas os que são da fase correta
        const jogosDaFase = dados.matches.filter(jogo => jogo.stage === faseAPI);

        renderizarTabela(jogosDaFase);

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
    if (!jogos || jogos.length === 0) {
        tabelaCorpo.innerHTML = `<tr><td colspan="5" style="text-align: center;">Nenhum jogo encontrado ou os dados ainda não foram liberados.</td></tr>`;
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
        // Atualiza a cor verde do botão ativo
        botoesFase.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // Dispara a busca
        const fase = e.target.getAttribute('data-fase');
        carregarFase(fase);
    });
});

// Ao abrir a página, já puxa a Fase de Grupos
carregarFase('Fase de Grupos');