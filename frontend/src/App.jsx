import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import WelcomeScreen from "./WelcomeScreen";
import GameScreen from "./GameScreen";
import "./App.css";

const API_BASE = "http://localhost:8000/api";

function App() {
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

    const navigate = useNavigate();

    const startGame = async () => {
        setIsLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/start-game`);
            updateStateFromResponse(res.data);
            setMessage("Jogo iniciado!");
            navigate("/jogo");
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
        if (data.predicted_class !== undefined) setPredictedClass(data.predicted_class);
        if (data.expected_class !== undefined) setExpectedClass(data.expected_class);
        setGameOver(data.game_over);
        setFinalWinner(data.final_winner || "");
    };

    useEffect(() => {
        if (round > 1 && predictedClass !== "" && expectedClass !== "") {
            setMessage(
                predictedClass === expectedClass
                    ? `🎯 IA acertou! Marca identificada: ${["Adidas", "Converse", "Nike"][predictedClass]}`
                    : `🎉 Você enganou a IA! Esperado: ${["Adidas", "Converse", "Nike"][expectedClass]} | Identificado: ${["Adidas", "Converse", "Nike"][predictedClass]}`
            );
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
        // Reset e volta para a tela inicial
        setRound(1);
        setPlayerScore(0);
        setAiScore(0);
        setMessage("");
        setGameOver(false);
        setFinalWinner("");
        setImages([]);
        setPredictedClass("");
        setExpectedClass("");
        navigate("/");
    };

    return (
        <Routes>
            <Route
                path="/"
                element={<WelcomeScreen startGame={startGame} isLoading={isLoading} />}
            />
            <Route
                path="/jogo"
                element={
                    <GameScreen
                        round={round}
                        playerScore={playerScore}
                        aiScore={aiScore}
                        predictedClass={predictedClass}
                        expectedClass={expectedClass}
                        message={message}
                        images={images}
                        gameOver={gameOver}
                        finalWinner={finalWinner}
                        isLoading={isLoading}
                        play={play}
                        startGame={startGame}
                        goBack={goBack}
                        hoveredIndex={hoveredIndex}
                        setHoveredIndex={setHoveredIndex}
                    />
                }
            />
        </Routes>
    );
}

export default App;