from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.api import router

app = FastAPI(title="Deceive the AI")

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ou ["*"] para liberar geral
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# rota estática para servir as imagens
app.mount("/images", StaticFiles(directory="static"), name="images")

app.include_router(router, prefix="/api")
