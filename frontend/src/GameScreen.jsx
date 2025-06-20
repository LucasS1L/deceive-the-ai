import React from "react";

function GameScreen({
                        round,
                        playerScore,
                        aiScore,
                        predictedClass,
                        expectedClass,
                        message,
                        images,
                        gameOver,
                        finalWinner,
                        isLoading,
                        play,
                        startGame,
                        goBack,
                        hoveredIndex,
                        setHoveredIndex,
                    }) {

    return (
        <div className="game-screen">
            <div className="game-header">
                <h1 className="game-title-small">
                    <span className="ai-icon">🤖</span> Deceive the AI
                </h1>
                <div className="game-stats">
                    <div className="round-info">
                        <span className="round-label">Rodada</span>
                        <span className="round-number">{round}</span>
                    </div>
                    <div className="score-board">
                        <div className="score-item player">
                            <span className="score-label">👤 Você</span>
                            <span className="score-value">{playerScore}</span>
                        </div>
                        <div className="score-divider">×</div>
                        <div className="score-item ai">
                            <span className="score-label">🤖 IA</span>
                            <span className="score-value">{aiScore}</span>
                        </div>
                    </div>
                </div>
            </div>

            {message && (
                <div className={`message-box ${predictedClass === expectedClass ? 'ai-win' : 'player-win'}`}>
                <p>{message}</p>
                </div>
            )}

            {gameOver ? (
                <div className="game-over-screen">
                    <div className="game-over-content">
                        <div className="winner-announcement">
                            <div className="winner-icon">{finalWinner === "player" ? "🏆" : "🤖"}</div>
                            <h2 className="winner-title">
                                {finalWinner === "player" ? "Você Venceu!" : "IA Venceu!"}
                            </h2>
                        </div>
                        <div className="final-score">
                            <div className="final-score-item">
                                <span>👤 Você</span>
                                <span>{playerScore}</span>
                            </div>
                            <div className="final-score-item">
                                <span>🤖 IA</span>
                                <span>{aiScore}</span>
                            </div>
                        </div>
                        <div className="game-over-buttons">
                            <button className="play-again-button" onClick={startGame} disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <div className="spinner"></div> Iniciando...
                                    </>
                                ) : (
                                    <>
                                        <span>🔄</span> Jogar Novamente
                                    </>
                                )}
                            </button>
                            <button className="back-button" onClick={goBack}>
                                <span>🏠</span> Voltar ao Início
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="images-section">
                    <h3 className="images-title">Escolha uma imagem para enganar a IA:</h3>
                    <div className="images-grid">
                        {images.map((img, index) => (
                            <div
                                key={img}
                                className={`image-card ${hoveredIndex === index ? 'hovered' : ''} ${isLoading ? 'disabled' : ''}`}
                                onClick={() => !isLoading && play(img)}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <div className="image-container">
                                    <img
                                        src={`http://localhost:8000/images/${img}`}
                                        alt={`Tênis ${index + 1}`}
                                        className="sneaker-image"
                                    />
                                    <div className="image-overlay">
                                        <span className="click-hint">Clique para escolher</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {isLoading && (
                        <div className="loading-overlay">
                            <div className="loading-content">
                                <div className="spinner large"></div>
                                <p>IA analisando sua escolha...</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default GameScreen;