import React, { useState } from "react";
import { socket } from "./utils/socketClient";
import { usePollsData } from "./hooks/usePollsData";
import PollList from "./components/PollList";
import PollDetail from "./components/PollDetail";
import PollForm from "./components/PollForm";
import styles from "./styles/App.module.css";
import { pollAPI } from "./utils/pollAPI";

function App() {
  const { polls, loading, error, loadPolls, handleDeletePoll } = usePollsData();
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [edit, toggleEdit] = useState(false);

  // Editar enquete
  const handleEditPoll = (poll) => {
    setSelectedPoll(poll);
    toggleEdit(true);
    setShowForm(true);
  };

  // Criar nova enquete
  const handleCreatePoll = () => {
    toggleEdit(false);
    setShowForm(true);
  };

  // Clicar em enquete para votar
  const handlePollClick = (poll) => {
    setSelectedPoll(poll);
  };

  // Voltar da tela de detalhes
  const handleBackToPollList = () => {
    setSelectedPoll(null);
    loadPolls();
  };

  // Sucesso ao salvar formulário
  const handleFormSuccess = () => {
    setSelectedPoll(null);
    setShowForm(false);
    toggleEdit(false);
    loadPolls();
  };

  // Cancelar formulário
  const handleFormCancel = () => {
    setSelectedPoll(null);
    setShowForm(false);
    toggleEdit(false);
  };

  // Atualiza os votos
  const handleUpdatePoll = () => {
    pollAPI.getById(selectedPoll.id).then((res) => setSelectedPoll(res.data));
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h1>Sistema de Votação</h1>
        <p>Carregando enquetes...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Sistema de Votação</h1>
      {error && <p className={styles.error}>{error}</p>}

      {showForm ? (
        <PollForm
          edit={edit}
          poll={selectedPoll}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      ) : selectedPoll ? (
        <PollDetail
          poll={selectedPoll}
          onBack={handleBackToPollList}
          onPollUpdate={handleUpdatePoll}
          socket={socket}
        />
      ) : (
        <PollList
          polls={polls}
          onPollClick={handlePollClick}
          onDeletePoll={handleDeletePoll}
          onEditPoll={handleEditPoll}
          onCreatePoll={handleCreatePoll}
        />
      )}
    </div>
  );
}

export default App;
