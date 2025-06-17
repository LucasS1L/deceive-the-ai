import React, {useEffect, useState} from "react";
import axios from "axios";
import './App.css';

const API_BASE = "http://localhost:8000/api"; // ajuste conforme necessário

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

    const brands = ["Adidas", "Converse", "Nike"];

    const startGame = async () => {
        try {
            const res = await axios.post(`${API_BASE}/start-game`);
            updateStateFromResponse(res.data);
            setGameStarted(true);
            setMessage("Jogo iniciado! Escolha uma imagem.");
        } catch (err) {
            alert("Erro ao iniciar o jogo.");
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
        console.log("Round atual:", round);
        if (round > 1) {
            if (predictedClass === expectedClass) {
                setMessage(`Marca Identificada: ${brands[predictedClass]}`);
            } else {
                setMessage(`Marca Esperada: ${brands[predictedClass]}        Marca Identificada: ${brands[expectedClass]}`);
            }
        }
    }, [round, predictedClass, expectedClass]);

    const play = async (imageName) => {
        try {
            const res = await axios.post(`${API_BASE}/play`, {
                image_chosen: imageName,
            });
            updateStateFromResponse(res.data);
        } catch (err) {
            alert(err.response?.data?.detail || "Erro ao jogar");
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
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    fontFamily: "sans-serif",
                    padding: "1.5rem",
                }}
            >
                <h1 className="text-4xl font-bold mb-6">Bem-vindo ao Jogo!</h1>
                <p className="text-lg mb-4">Tente enganar a IA escolhendo a imagem certa.</p>
                <button
                    onClick={startGame}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Iniciar Jogo
                </button>
            </div>
        );
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                fontFamily: "sans-serif",
                padding: "1.5rem",
            }}
        >
            <h1 className="text-3xl font-bold mb-4">Deceive the AI</h1>
            <p className="mb-2">Rodada: {round}</p>
            <p className="mb-2">Placar - Jogador: {playerScore} | IA: {aiScore}</p>
            <p className="mb-4 text-blue-600">{message}</p>

            {gameOver ? (
                <div>
                    <h2 className="game-over">
                        Fim de jogo! Vencedor: {finalWinner}
                    </h2>
                    <div className="buttons">
                        <button onClick={startGame} className="btn-play-again">
                            Jogar novamente
                        </button>
                        <button onClick={goBack} className="btn-go-back">
                            Voltar ao início
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{display: "flex", justifyContent: "center", gap: "16px", marginTop: "20px"}}>
                    {images.map((img, index) => (
                        <div key={img} style={{textAlign: "center"}}>
                            <img
                                src={`http://localhost:8000/images/${img}`}
                                alt={img}
                                onClick={() => play(img)}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                style={{
                                    width: "200px",
                                    height: "200px",
                                    objectFit: "cover",
                                    cursor: "pointer",
                                    border: "1px solid #ccc",
                                    borderRadius: "8px",
                                    opacity: hoveredIndex === index ? 0.75 : 1,
                                    transition: "opacity 0.3s ease",
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default App;