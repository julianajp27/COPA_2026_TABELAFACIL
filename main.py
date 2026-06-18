from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
import os

app = FastAPI()

# Libera o CORS para o seu site no GitHub Pages conseguir acessar os dados
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Chave de segurança (escondida posteriormente no painel do Railway)
API_KEY = os.environ.get("FOOTBALL_API_KEY", "7234a70900d449c3babb4ea8677c14be")
API_URL = "https://api.football-data.org/v4/competitions/WC/matches"

@app.get("/api/jogos")
def buscar_jogos():
    headers = {"X-Auth-Token": API_KEY}
    resposta = requests.get(API_URL, headers=headers)
    
    if resposta.status_code != 200:
        raise HTTPException(status_code=resposta.status_code, detail="Erro ao conectar com a API original")
        
    return resposta.json()