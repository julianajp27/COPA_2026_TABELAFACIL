# 🏆 Copa do Mundo 2026 - Tabela de Jogos (Full-Stack)

Uma aplicação web completa (Full-Stack) desenvolvida para exibir os resultados, horários e chaveamentos atualizados da Copa do Mundo FIFA 2026. O projeto consome dados reais através de uma integração segura com a API do *football-data.org*.

## 🚀 Arquitetura e Tecnologias

O projeto foi construído separando as responsabilidades de Front-end e Back-end para garantir escalabilidade, segurança das chaves de API e contornar bloqueios de CORS.

* **Front-end:** HTML5, CSS3 (Glassmorphism design) e JavaScript Vanilla. Hospedado no **GitHub Pages**.
* **Back-end:** Python 3 e FastAPI. Hospedado na nuvem pelo **Render**.
* **Integração:** Fetch API assíncrona, tratamento de JSON e conversão automática de fuso horário (UTC para Local).

## ✨ Funcionalidades Principais

- **Navegação por Fases:** Abas dinâmicas para filtrar jogos desde a Fase de Grupos até a Final.
- **Filtro de Calendário:** Seleção de datas específicas para visualizar jogos do dia escolhido.
- **Tradução Dinâmica:** Dicionário interno no Front-end que traduz os nomes originais dos países para Português do Brasil.
- **Tratamento de Timezone:** Conversão automática dos horários dos jogos para o fuso horário local do usuário.
- **Segurança de API:** O Front-end não expõe chaves. Todas as requisições passam pelo Back-end em Python, que guarda os tokens em variáveis de ambiente (`.env`).

# 🛠️ Como rodar o projeto localmente

## 1. Configurando o Back-end
Certifique-se de ter o Python instalado em sua máquina.

**Clone o repositório**
git clone [https://github.com/SEU-USUARIO/COPA_2026_TABELAFACIL.git](https://github.com/SEU-USUARIO/COPA_2026_TABELAFACIL.git)

**Entre na pasta**
cd COPA_2026_TABELAFACIL

**Instale as dependências do servidor Python**
pip install -r requirements.txt

**Crie um arquivo .env na raiz do projeto com a sua chave da API:**
FOOTBALL_API_KEY=sua_chave_aqui

**Inicie o servidor local:**
python -m uvicorn main:app --reload

A API estará rodando em http://127.0.0.1:8000.

# 2. Configurando o Front-end
No arquivo script.js, certifique-se de que a constante API_URL esteja apontando para o seu servidor local (para testes) ou para o seu servidor no Render (produção).

**Exemplo para desenvolvimento local**
const API_URL = '[http://127.0.0.1:8000/api/jogos](http://127.0.0.1:8000/api/jogos)';
Basta abrir o arquivo index.html em seu navegador para utilizar a aplicação.
