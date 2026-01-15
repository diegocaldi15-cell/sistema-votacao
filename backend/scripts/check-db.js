require("dotenv").config();
const sequelize = require("../config/database");
const Poll = require("../models/Poll");
const Option = require("../models/Option");
const Vote = require("../models/Vote");

async function checkDatabase() {
  try {
    // Definir associações
    Option.belongsTo(Poll);
    Poll.hasMany(Option, { onDelete: "CASCADE" });
    Vote.belongsTo(Option);
    Option.hasMany(Vote, { onDelete: "CASCADE" });

    // Autenticar
    await sequelize.authenticate();
    console.log("✓ Conexão estabelecida\n");

    // Buscar todas as enquetes com opções
    const polls = await Poll.findAll({ include: Option });

    console.log("📊 Enquetes no banco de dados:\n");
    polls.forEach((poll) => {
      console.log(`Poll ID: ${poll.id}`);
      console.log(`Título: ${poll.title}`);
      console.log(`Opções (${poll.Options.length}):`);

      if (poll.Options.length === 0) {
        console.log("  ❌ NENHUMA OPÇÃO");
      } else {
        poll.Options.forEach((option) => {
          console.log(`  - ${option.text}`);
        });
      }
      console.log("");
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Erro:", err.message);
    process.exit(1);
  }
}

checkDatabase();
