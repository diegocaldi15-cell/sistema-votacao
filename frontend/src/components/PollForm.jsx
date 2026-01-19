import React, { useState } from "react";
import { pollAPI } from "../utils/pollAPI";
import styles from "../styles/PollForm.module.css";

function PollForm({ poll, edit, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: edit ? poll.title : "",
    startDate: edit ? new Date(poll.startDate).toISOString().slice(0, 16) : "",
    endDate: edit ? new Date(poll.endDate).toISOString().slice(0, 16) : "",
    options: edit
      ? poll.options.map((opt) => ({ id: opt.id, text: opt.text }))
      : [{ text: "" }, { text: "" }, { text: "" }],
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Inputs Simples
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Opções
  const handleOptionChange = (index, value) => {
    setFormData((prev) => {
      const options = [...prev.options];
      options[index] = { ...options[index], text: value };
      return { ...prev, options };
    });
  };

  // Adiciona nova opção
  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, { text: "" }],
    }));
  };

  // Remove opção
  const removeOption = (index) => {
    if (formData.options.length <= 3) {
      setError("Mínimo de 3 opções é obrigatório");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  // Drag and Drop
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetIndex) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const newOptions = [...formData.options];
    const draggedItem = newOptions[draggedIndex];

    // Remove o item arrastado
    newOptions.splice(draggedIndex, 1);
    // Insere na nova posição
    newOptions.splice(targetIndex, 0, draggedItem);

    const newOrderedOptions = newOptions.map((opt, order) => ({
      ...opt,
      order,
    }));

    setFormData((prev) => ({
      ...prev,
      options: newOrderedOptions,
    }));
    setDraggedIndex(null);
  };

  // Validações
  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Título é obrigatório");
      return false;
    }
    if (!formData.startDate) {
      setError("Data de início é obrigatória");
      return false;
    }
    if (!formData.endDate) {
      setError("Data de término é obrigatória");
      return false;
    }
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError("Data de início deve ser anterior à data de término");
      return false;
    }
    if (formData.options.length < 3) {
      setError("Mínimo de 3 opções é obrigatório");
      return false;
    }
    if (formData.options.some((opt) => !opt.text.trim())) {
      setError("Todas as opções devem ser preenchidas");
      return false;
    }
    return true;
  };

  // Envia formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;
    setLoading(true);

    console.log(formData);

    const request = poll
      ? pollAPI.update(poll.id, formData)
      : pollAPI.create(formData);

    request
      .then(() => {
        console.log("Enquete salva com sucesso!");
        onSuccess?.();
      })
      .catch((err) => {
        console.error("Erro ao salvar enquete:", err);
        setError(err.response?.data?.message || "Erro ao salvar enquete");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={styles.container}>
      <button className={styles.btnBack} onClick={onCancel}>
        ← Cancelar
      </button>

      <form className={styles.formCard} onSubmit={handleSubmit}>
        <h2>{edit ? "Editar Enquete" : "Nova Enquete"}</h2>

        {error && <p className={styles.error}>{error}</p>}

        {/* Campo Título */}
        <div className={styles.formGroup}>
          <label htmlFor="title">Título da Enquete *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Ex: Qual é sua linguagem favorita?"
            disabled={loading}
          />
        </div>

        {/* Datas */}
        <div className={styles.datesContainer}>
          <div className={styles.formGroup}>
            <label htmlFor="startDate">Data de Início *</label>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="endDate">Data de Término *</label>
            <input
              type="datetime-local"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>
        </div>

        {/* Opções */}
        <div className={styles.optionsSection}>
          <div className={styles.optionsHeader}>
            <h3>Opções de Resposta *</h3>
            <p className={styles.hint}>
              Mínimo 3 opções • Arraste para reordenar
            </p>
          </div>

          <div className={styles.optionsList}>
            {formData.options.map((opt, index) => (
              <div
                key={index}
                className={`${styles.optionInputGroup} ${
                  draggedIndex === index ? styles.dragging : ""
                }`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
              >
                <div className={styles.dragHandle}>⋮⋮</div>
                <input
                  type="text"
                  value={opt.text}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Opção ${index + 1}`}
                  disabled={loading}
                />
                {formData.options.length > 3 && (
                  <button
                    type="button"
                    className={styles.btnRemoveOption}
                    onClick={() => removeOption(index)}
                    disabled={loading}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            className={styles.btnAddOption}
            onClick={addOption}
            disabled={loading}
          >
            + Adicionar Opção
          </button>
        </div>

        {/* Botões de Ação */}
        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.btnCancel}
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button type="submit" className={styles.btnSubmit} disabled={loading}>
            {loading ? "Salvando..." : edit ? "Atualizar" : "Criar"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PollForm;
