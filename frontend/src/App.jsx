import React, { useEffect, useState } from "react";
import axios from "axios";
import './App.css';

const API_BASE = "http://localhost:8000/api";

function App() {
    const [gameStarted, setGameStarted] = useState(false);
    const [images, setImages] = useState([]);
    const [round, setRound] = useState(1);
    const [playerScore, setPlayerScore] = useState(0);
    const [aiScore, setAiScore] = useState(0);
    const [predictedClass, setPredictedClass] = useState("");
    const [expectedClass, setExpectedClass] = useState("");
    const [message, setMessage] = useState("");
    const [gameOver, setGameOver] = useState(false);
    const [finalWinner, setFinalWinner] = useState("");
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const brands = ["Adidas", "Converse", "Nike"];

    const startGame = async () => {
        setIsLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/start-game`);
            updateStateFromResponse(res.data);
            setGameStarted(true);
            setMessage("Jogo iniciado!");
        } catch (err) {
            alert("Erro ao iniciar o jogo.");
        } finally {
            setIsLoading(false);
        }
    };

    const updateStateFromResponse = (data) => {
        setRound(data.round);
        setPlayerScore(data.player_score);
        setAiScore(data.ai_score);
        setImages(data.images);
        data.predicted_class ? setPredictedClass(data.predicted_class) : null;
        data.expected_class ? setExpectedClass(data.expected_class) : null;
        setGameOver(data.game_over);
        setFinalWinner(data.final_winner || "");
    };

    useEffect(() => {
        if (round > 1) {
            if (predictedClass === expectedClass) {
                setMessage(`🎯 IA acertou! Marca identificada: ${brands[predictedClass]}`);
            } else {
                setMessage(`🎉 Você enganou a IA! Esperado: ${brands[expectedClass]} | Identificado: ${brands[predictedClass]}`);
            }
        }
    }, [round, predictedClass, expectedClass]);

    const play = async (imageName) => {
        setIsLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/play`, {
                image_chosen: imageName,
            });
            updateStateFromResponse(res.data);
        } catch (err) {
            alert(err.response?.data?.detail || "Erro ao jogar");
        } finally {
            setIsLoading(false);
        }
    };

    const goBack = () => {
        setGameStarted(false);
        setRound(1);
        setPlayerScore(0);
        setAiScore(0);
        setMessage("");
        setGameOver(false);
        setFinalWinner("");
    };

    if (!gameStarted) {
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
                    <button
                        className="start-button"
                        onClick={startGame}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <div className="spinner"></div>
                                Iniciando...
                            </>
                        ) : (
                            <>
                                <span>🚀</span>
                                Iniciar Jogo
                            </>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="game-screen">
            <div className="game-header">
                <h1 className="game-title-small">
                    <span className="ai-icon">🤖</span>
                    Deceive the AI
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
                            <div className="winner-icon">
                                {finalWinner === "Jogador" ? "🏆" : "🤖"}
                            </div>
                            <h2 className="winner-title">
                                {finalWinner === "Jogador" ? "Parabéns!" : "IA Venceu!"}
                            </h2>
                            <p className="winner-subtitle">
                                {finalWinner === "Jogador"
                                    ? "Você conseguiu enganar a IA!"
                                    : "A IA foi mais esperta desta vez!"
                                }
                            </p>
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
                            <button
                                className="play-again-button"
                                onClick={startGame}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="spinner"></div>
                                        Iniciando...
                                    </>
                                ) : (
                                    <>
                                        <span>🔄</span>
                                        Jogar Novamente
                                    </>
                                )}
                            </button>
                            <button className="back-button" onClick={goBack}>
                                <span>🏠</span>
                                Voltar ao Início
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

export default App;