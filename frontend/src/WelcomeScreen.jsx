import React from "react";

function WelcomeScreen({ startGame, isLoading }) {
    return (
        <div className="welcome-screen">
            <div className="welcome-content">
                <div className="logo-container">
                    <div className="logo-icon">🤖</div>
                    <h1 className="game-title">Deceive the AI</h1>
                </div>
                <p className="game-description">
                    Desafie a inteligência artificial! Escolha imagens de tênis e tente enganar
                    o sistema de reconhecimento. Será que você consegue confundir a IA?
                </p>
                <div className="brands-info">
                    <h3>Marcas no jogo:</h3>
                    <div className="brand-tags">
                        <span className="brand-tag adidas">Adidas</span>
                        <span className="brand-tag nike">Nike</span>
                        <span className="brand-tag converse">Converse</span>
                    </div>
                </div>
                <button className="start-button" onClick={startGame} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <div className="spinner"></div> Iniciando...
                        </>
                    ) : (
                        <>
                            <span>🚀</span> Iniciar Partida
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default WelcomeScreen;
