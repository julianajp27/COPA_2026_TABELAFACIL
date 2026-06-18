from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv

# Carrega as variáveis de segurança do arquivo .env (para quando rodar localmente)
load_dotenv()

app = FastAPI()

# Libera o CORS para o seu site no GitHub Pages conseguir acessar os dados
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Chave de segurança lida das variáveis de ambiente (nunca exposta no código)
API_KEY = os.getenv("FOOTBALL_API_KEY")
API_URL = "https://api.football-data.org/v4/competitions/WC/matches"

@app.get("/api/jogos")
def buscar_jogos():
    # Prevenção: avisa se a chave não for encontrada no ambiente
    if not API_KEY:
        raise HTTPException(status_code=500, detail="Chave da API não configurada no servidor.")
        
    headers = {"X-Auth-Token": API_KEY}
    resposta = requests.get(API_URL, headers=headers)
    
    if resposta.status_code != 200:
        raise HTTPException(status_code=resposta.status_code, detail="Erro ao conectar com a API original")
        
    return resposta.json()