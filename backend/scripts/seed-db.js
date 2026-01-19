/**
 * Script para Popular o Banco com Dados de Teste
 * Cria exemplos de enquetes, opções e votos
 *
 * Uso: node scripts/seed-db.js
 */

require("dotenv").config();
const sequelize = require("../config/database");
require("../models");
const Poll = require("../models/Poll");
const Option = require("../models/Option");
const Vote = require("../models/Vote");

// Função principal para popular o banco de dados
async function seedDatabase() {
  console.log("🌱 Populando banco de dados com dados de teste...\n");

  try {
    // Autenticar
    console.log("🔗 Conectando ao banco de dados...");
    await sequelize.authenticate();
    console.log("✓ Conexão estabelecida\n");

    console.log("📊 Sincronizando tabelas...");
    await sequelize.sync({ force: false });
    console.log("✓ Tabelas sincronizadas\n");

    // Limpar dados anteriores
    console.log("🗑️  Limpando dados antigos...");
    await Vote.destroy({ where: {} });
    await Option.destroy({ where: {} });
    await Poll.destroy({ where: {} });
    console.log("✓ Dados antigos removidos\n");

    // Criar enquetes de exemplo
    console.log("📝 Criando enquetes de exemplo...");

    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Enquete 1: Finalizada
    await Poll.create(
      {
        title: "📚 Qual é o melhor framework web?",
        description: null,
        startDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        endDate: yesterday,
        options: [
          { text: "React", order: 0, votes: [{}, {}] },
          { text: "Vue.js", order: 1, votes: [{}] },
          { text: "Angular", order: 2, votes: [{}] },
          { text: "Svelte", order: 3, votes: [] },
        ],
      },
      {
        include: {
          model: Option,
          include: Vote,
        },
      },
    );

    // Enquete 2: Não iniciada
    await Poll.create(
      {
        title: "💻 Qual sistema operacional você usa?",
        description: null,
        startDate: tomorrow,
        endDate: nextWeek,
        options: [
          { text: "Windows", order: 0, votes: [] },
          { text: "macOS", order: 1, votes: [] },
          { text: "Linux", order: 2, votes: [] },
          { text: "Outro", order: 3, votes: [] },
        ],
      },
      {
        include: {
          model: Option,
          include: Vote,
        },
      },
    );

    // Enquete 3: Em andamento
    await Poll.create(
      {
        title: "🎨 Qual é sua linguagem de programação favorita?",
        description: null,
        startDate: yesterday,
        endDate: nextWeek,
        options: [
          { text: "JavaScript / TypeScript", order: 0, votes: [] },
          { text: "Python", order: 1, votes: [] },
          { text: "Java", order: 2, votes: [] },
          { text: "C / C++", order: 3, votes: [] },
        ],
      },
      {
        include: {
          model: Option,
          include: Vote,
        },
      },
    );

    console.log("✓ Enquetes criadas com sucesso\n");

    console.log("✅ Banco de dados populado com sucesso!");
    console.log("   Você pode iniciar o servidor com: npm start\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Erro ao popular o banco de dados:");
    console.error(err.message);
    console.error("\n");
    process.exit(1);
  }
}

seedDatabase();
