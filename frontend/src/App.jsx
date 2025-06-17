import React, {useState} from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000/api"; // ajuste conforme necessário

function App() {
    const [gameStarted, setGameStarted] = useState(false);
    const [images, setImages] = useState([]);
    const [round, setRound] = useState(1);
    const [playerScore, setPlayerScore] = useState(0);
    const [aiScore, setAiScore] = useState(0);
    const [message, setMessage] = useState("");
    const [gameOver, setGameOver] = useState(false);
    const [finalWinner, setFinalWinner] = useState("");
    const [hoveredIndex, setHoveredIndex] = useState(null);

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
        setGameOver(data.game_over);
        setFinalWinner(data.final_winner || "");
    };

    const play = async (imageName) => {
        try {
            const res = await axios.post(`${API_BASE}/play`, {
                image_chosen: imageName,
            });
            updateStateFromResponse(res.data);
            setMessage(
                `Você escolheu: ${imageName}. Resultado: ${res.data.winner === "player" ? "Você ganhou!" : "A IA ganhou!"}`
            );
        } catch (err) {
            alert(err.response?.data?.detail || "Erro ao jogar");
        }
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
                    <h2 className="text-xl font-bold text-red-600">
                        Fim de jogo! Vencedor: {finalWinner}
                    </h2>
                    <button
                        onClick={startGame}
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                    >
                        Jogar novamente
                    </button>
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
                                    width: "160px",
                                    height: "160px",
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