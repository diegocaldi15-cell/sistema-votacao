import React, { useEffect, useState } from "react";
import { pollAPI } from "../utils/pollAPI";
import styles from "../styles/PollDetail.module.css";

// Componente de Detalhes da Enquete
function PollDetail({ poll, onBack, onPollUpdate, socket }) {
  const [error, setError] = useState(null);
  const [pendingVote, setPendingVote] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Configura listener para atualizações de votos via WebSocket
  useEffect(() => {
    socket.off("updateVotes", onPollUpdate);
    socket.on("updateVotes", onPollUpdate);
    return () => socket.off("updateVotes", onPollUpdate);
  }, [socket, onPollUpdate]);

  const handleVote = (optionId) => {
    setPendingVote(optionId);
    setShowConfirmation(true);
  };

  const confirmVote = () => {
    if (!pendingVote) return;

    pollAPI
      .vote(poll.id, pendingVote)
      .then(() => {
        setError(null);
        setShowConfirmation(false);
        setPendingVote(null);
      })
      .catch((err) => {
        console.error("Erro ao votar:", err);
        setError(err.response?.data?.message || "Erro ao registrar voto");
        setShowConfirmation(false);
        setPendingVote(null);
      });
  };

  const cancelVote = () => {
    setShowConfirmation(false);
    setPendingVote(null);
  };

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

  // Renderiza os detalhes da enquete
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
          {poll.options && poll.options.length > 0 ? (
            poll.options.map((option) => {
              const voteCount = option.votes.reduce((total) => total + 1, 0);
              return (
                <div
                  key={option.id}
                  className={`${styles.optionCard} ${
                    !isActive ? styles.disabled : ""
                  }`}
                  onClick={() => isActive && handleVote(option.id)}
                >
                  <div className={styles.optionContent}>
                    <label className={styles.optionLabel}>
                      <input
                        type="radio"
                        name="poll-option"
                        value={option.id}
                        onChange={() => handleVote(option.id)}
                        disabled={!isActive}
                        onClick={(e) => e.stopPropagation()}
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

      {showConfirmation && pendingVote && (
        <div className={styles.confirmationOverlay}>
          <div className={styles.confirmationModal}>
            <h3>Confirmar Voto</h3>
            <p>
              Tem certeza que deseja votar em:{" "}
              <strong>
                {poll.options.find((opt) => opt.id === pendingVote)?.text}
              </strong>
              ?
            </p>
            <div className={styles.confirmationButtons}>
              <button className={styles.btnConfirm} onClick={confirmVote}>
                Confirmar
              </button>
              <button className={styles.btnCancel} onClick={cancelVote}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PollDetail;
