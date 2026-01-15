import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import styles from "../styles/PollDetail.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function PollDetail({ pollId, onBack, socket }) {
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const loadResults = useCallback(() => {
    axios
      .get(`${API_URL}/api/polls/${pollId}/results`)
      .then((res) => {
        setResults(res.data.results);
      })
      .catch((err) => console.error("Erro ao carregar resultados:", err));
  }, [pollId]);

  useEffect(() => {
    // Carregar detalhes da enquete e resultados
    axios
      .get(`${API_URL}/api/polls/${pollId}`)
      .then((res) => {
        setPoll(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar detalhes:", err);
        setError("Erro ao carregar enquete");
        setLoading(false);
      });

    // Carregar resultados
    loadResults();

    // Listener para atualizações de votos em tempo real
    const handleUpdateVotes = (data) => {
      if (data.pollId === pollId) {
        loadResults();
      }
    };

    socket.off("updateVotes", handleUpdateVotes);
    socket.on("updateVotes", handleUpdateVotes);

    return () => socket.off("updateVotes", handleUpdateVotes);
  }, [pollId, socket, loadResults]);

  const handleVote = (optionId) => {
    axios
      .post(`${API_URL}/api/polls/${pollId}/vote`, {
        optionId: optionId,
      })
      .then(() => {
        // Recarrega resultados
        loadResults();
        setError(null);
      })
      .catch((err) => {
        console.error("Erro ao votar:", err);
        setError(err.response?.data?.message || "Erro ao registrar voto");
      });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Carregando enquete...</p>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className={styles.container}>
        <p>Enquete não encontrada</p>
        <button onClick={onBack}>Voltar</button>
      </div>
    );
  }

  const getPollStatus = () => {
    const now = new Date();
    const startDate = new Date(poll.startDate);
    const endDate = new Date(poll.endDate);

    if (now < startDate) return "não-iniciada";
    if (now > endDate) return "finalizada";
    return "em-andamento";
  };

  const isActive = getPollStatus() === "em-andamento";

  return (
    <div className={styles.container}>
      <button className={styles.btnBack} onClick={onBack}>
        ← Voltar
      </button>

      <div className={styles.pollDetailCard}>
        <h2>{poll.title}</h2>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.dateInfo}>
          <p>
            <strong>Início:</strong>{" "}
            {new Date(poll.startDate).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p>
            <strong>Término:</strong>{" "}
            {new Date(poll.endDate).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className={styles.statusBanner}>
          {getPollStatus() === "não-iniciada" && (
            <p>Esta enquete ainda não começou</p>
          )}
          {getPollStatus() === "em-andamento" && (
            <p>Esta enquete está em andamento</p>
          )}
          {getPollStatus() === "finalizada" && (
            <p>Esta enquete foi finalizada</p>
          )}
        </div>

        <div className={styles.optionsContainer}>
          {poll.Options && poll.Options.length > 0 ? (
            poll.Options.map((option) => {
              const voteCount = results ? results[option.id]?.votes || 0 : 0;
              return (
                <div
                  key={option.id}
                  className={`${styles.optionCard} ${
                    !isActive ? styles.disabled : ""
                  }`}
                >
                  <div className={styles.optionContent}>
                    <label className={styles.optionLabel}>
                      <input
                        type="radio"
                        name="poll-option"
                        value={option.id}
                        onChange={() => handleVote(option.id)}
                        disabled={!isActive}
                      />
                      <span>{option.text}</span>
                    </label>
                    <div className={styles.voteCount}>
                      <strong>{voteCount}</strong>{" "}
                      {voteCount === 1 ? "voto" : "votos"}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Nenhuma opção disponível</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PollDetail;
