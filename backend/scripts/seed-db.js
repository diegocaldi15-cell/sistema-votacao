/**
 * Script para Popular o Banco com Dados de Teste
 * Cria exemplos de enquetes, opções e votos
 *
 * Uso: node scripts/seed-db.js
 */

require("dotenv").config();
const sequelize = require("../config/database");
const Poll = require("../models/Poll");
const Option = require("../models/Option");
const Vote = require("../models/Vote");

async function seedDatabase() {
  console.log("🌱 Populando banco de dados com dados de teste...\n");

  try {
    // Autenticar
    console.log("🔗 Conectando ao banco de dados...");
    await sequelize.authenticate();
    console.log("✓ Conexão estabelecida\n");

    // Definir associações
    Option.belongsTo(Poll);
    Poll.hasMany(Option, { onDelete: "CASCADE" });
    Vote.belongsTo(Option);
    Option.hasMany(Vote, { onDelete: "CASCADE" });

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

    // Enquete 1: Em andamento
    const poll1 = await Poll.create({
      title: "🎨 Qual é sua linguagem de programação favorita?",
      startDate: yesterday,
      endDate: nextWeek,
    });

    try {
      await Option.create({
        text: "JavaScript / TypeScript",
        PollId: poll1.id,
      });
      await Option.create({ text: "Python", PollId: poll1.id });
      await Option.create({ text: "Java", PollId: poll1.id });
      await Option.create({ text: "C / C++", PollId: poll1.id });
    } catch (err) {
      console.error("Erro ao criar opções para poll1:", err.message);
    }

    // Enquete 2: Não iniciada
    const poll2 = await Poll.create({
      title: "💻 Qual sistema operacional você usa?",
      startDate: tomorrow,
      endDate: nextWeek,
    });

    try {
      await Option.create({ text: "Windows", PollId: poll2.id });
      await Option.create({ text: "macOS", PollId: poll2.id });
      await Option.create({ text: "Linux", PollId: poll2.id });
      await Option.create({ text: "Outro", PollId: poll2.id });
    } catch (err) {
      console.error("Erro ao criar opções para poll2:", err.message);
    }

    // Enquete 3: Finalizada
    const poll3 = await Poll.create({
      title: "📚 Qual é o melhor framework web?",
      startDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
      endDate: yesterday,
    });

    let opt1, opt2, opt3, opt4;
    try {
      opt1 = await Option.create({ text: "React", PollId: poll3.id });
      opt2 = await Option.create({ text: "Vue.js", PollId: poll3.id });
      opt3 = await Option.create({ text: "Angular", PollId: poll3.id });
      opt4 = await Option.create({ text: "Svelte", PollId: poll3.id });
    } catch (err) {
      console.error("Erro ao criar opções para poll3:", err.message);
    }

    // Adicionar alguns votos na enquete finalizada
    if (opt1 && opt2 && opt3 && opt4) {
      for (let i = 0; i < 10; i++) {
        await Vote.create({ OptionId: opt1.id });
      }
      for (let i = 0; i < 7; i++) {
        await Vote.create({ OptionId: opt2.id });
      }
      for (let i = 0; i < 5; i++) {
        await Vote.create({ OptionId: opt3.id });
      }
      for (let i = 0; i < 3; i++) {
        await Vote.create({ OptionId: opt4.id });
      }
    }

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
