from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.api import router

app = FastAPI(title="Deceive the AI")

# rota estática para servir as imagens
app.mount("/images", StaticFiles(directory="static"), name="images")

app.include_router(router, prefix="/api")
