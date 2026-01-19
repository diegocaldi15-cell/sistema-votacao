const sequelize = require("../config/database");
const express = require("express");
const Poll = require("../models/Poll");
const Option = require("../models/Option");
const Vote = require("../models/Vote");
const { Sequelize } = require("sequelize");

// Define o roteador de enquetes
const app = express.Router();

// GET todas as enquetes
app.get("/", async (req, res) => {
  try {
    const polls = await Poll.findAll({
      include: { model: Option, include: Vote },
      raw: false,
      order: [
        ["id", "DESC"],
        [Option, "order", "ASC"],
      ],
    });
    res.json(polls);
  } catch (err) {
    console.error("Erro ao buscar polls:", err);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// POST uma nova enquete
app.post("/", async (req, res) => {
  try {
    const { title, startDate, endDate, options } = req.body;

    // Validações
    if (!title || !startDate || !endDate || !options || options.length < 3) {
      return res.status(400).json({
        message: "O corpo da requisição está incorreto",
      });
    }
    if (new Date(startDate) >= new Date(endDate)) {
      return res
        .status(400)
        .json({ message: "Data de início deve ser anterior à de término" });
    }

    // Cria poll
    const poll = await Poll.create(
      {
        title,
        startDate,
        endDate,
        options: options.map(({ text }, order) => ({ text, order })),
      },
      {
        include: Option,
      },
    );

    // Busca a poll criada com as opções incluídas
    const pollWithOptions = await Poll.findByPk(poll.id, {
      include: Option,
    });

    req.io.emit("pollsUpdated");

    res
      .status(201)
      .json({ message: "Enquete criada com sucesso", poll: pollWithOptions });
  } catch (err) {
    console.error("Erro ao criar enquete:", err);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// GET uma enquete específica
app.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const poll = await Poll.findByPk(id, {
      include: { model: Option, include: Vote },
      order: [[Option, "order", "ASC"]],
    });

    // Verifica se a enquete existe
    if (!poll) {
      return res.status(404).json({ message: "Enquete não encontrada" });
    }

    res.json(poll);
  } catch (err) {
    console.error("Erro ao buscar enquete:", err);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

//  PUT para atualizar uma enquete
app.put("/:id", async (req, res) => {
  const { id } = req.params;
  let { title, startDate, endDate, options } = req.body;

  // Busca a enquete existente e valida
  const poll = await Poll.findByPk(id, { include: Option });

  if (!poll) {
    return res.status(404).json({ message: "Enquete não encontrada" });
  }

  if (!title?.trim()) {
    return res.status(400).json({ message: "Deve-se colocar um título" });
  }

  title = title.trim();

  if (new Date(startDate) >= new Date(endDate)) {
    return res
      .status(400)
      .json({ message: "Data de início deve ser anterior à de término" });
  }

  Object.assign(poll, { title, startDate, endDate });

  const trx = await sequelize.transaction();

  try {
    // Atualiza opções
    if (options && Array.isArray(options) && options.length >= 3) {
      const removableOptions = poll.options.filter((opt) => {
        const hasOption = options.some((o) => o.id === opt.id);
        return hasOption === false;
      });

      for (const removeOption of removableOptions) {
        await Option.destroy({ where: { id: removeOption.id } });
      }

      for (const option of options) {
        if (!option.text && !option.order) {
          throw new Error("A opção devem conter texto e ordem");
        }

        if ("id" in option) {
          await Option.update(option, { where: { id: option.id } });
          continue;
        }

        const { text, order } = option;

        await Option.create({ text, order, pollId: poll.id });
      }
    } else {
      throw new Error("As opções não são válidas");
    }

    await poll.save();
    await trx.commit();

    return res.json({ message: "Enquete atualizada com sucesso" });
  } catch (error) {
    await trx.rollback();
    if (error instanceof Error) {
      const { message } = error;
      res.json({ message });
    }
  }
});

// DELETE uma enquete
app.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const poll = await Poll.findByPk(id);
    if (!poll) {
      return res.status(404).json({ message: "Enquete não encontrada" });
    }

    // Deleta enquete (CASCADE cuida do resto)
    await poll.destroy();

    // Emitir evento de atualização via WebSocket
    req.io.emit("pollsUpdated");

    res.json({ message: "Enquete deletada com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar enquete:", err);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// POST um voto
app.post("/:id/vote", async (req, res) => {
  try {
    const { id } = req.params;
    const { optionId } = req.body;

    if (!optionId) {
      return res.status(400).json({ message: "OptionId é obrigatório" });
    }

    const poll = await Poll.findByPk(id, {
      include: { model: Option, where: { id: optionId }, required: true },
    });
    if (!poll) {
      return res.status(404).json({ message: "Enquete não encontrada" });
    }

    // Verifica se a enquete está ativa
    const now = new Date();
    if (now < new Date(poll.startDate) || now > new Date(poll.endDate)) {
      return res.status(400).json({ message: "Enquete não está ativa" });
    }

    // Cria o voto
    const vote = await Vote.create({ optionId, pollId: id });

    // Emite atualização em tempo real
    req.io.emit("updateVotes", { pollId: +id });

    res.status(201).json({ message: "Voto registrado com sucesso", vote });
  } catch (err) {
    console.error("Erro ao registrar voto:", err);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// GET resultados de uma enquete
app.get("/:id/results", async (req, res) => {
  try {
    const { id } = req.params;

    const poll = await Poll.findByPk(id);
    if (!poll) {
      return res.status(404).json({ message: "Enquete não encontrada" });
    }

    // Busca resultados agregados
    const results = await Option.findAll({
      where: { pollId: id },
      attributes: [
        "id",
        "text",
        [Sequelize.fn("COUNT", Sequelize.col("votes.id")), "votes"],
      ],
      include: [
        {
          model: Vote,
          attributes: [],
        },
      ],
      group: ["Option.id"],
      order: [["order", "ASC"]],
      raw: true,
    });

    res.json({
      pollId: poll.id,
      title: poll.title,
      results,
    });
  } catch (err) {
    console.error("Erro ao buscar resultados:", err);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

module.exports = { pollsRoute: app };
