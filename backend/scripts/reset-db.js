/**
 * Script para Resetar o Banco de Dados
 * Remove todas as tabelas e recria do zero
 *
 * ⚠️  AVISO: Este script remove TODOS os dados!
 * Usar apenas em desenvolvimento
 *
 * Uso: node scripts/reset-db.js
 */

require("dotenv").config();
const sequelize = require("../config/database");
const Poll = require("../models/Poll");
const Option = require("../models/Option");
const Vote = require("../models/Vote");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function resetDatabase() {
  console.log(
    "\n⚠️  AVISO: Este comando irá DELETAR TODOS os dados do banco!\n"
  );

  // Pedir confirmação
  rl.question(
    "Digite 'sim' para confirmar o reset do banco: ",
    async (answer) => {
      if (answer.toLowerCase() !== "sim") {
        console.log("❌ Reset cancelado.\n");
        rl.close();
        process.exit(0);
      }

      try {
        console.log("\n🔧 Resetando banco de dados...\n");

        // Autenticar
        console.log("🔗 Conectando ao banco de dados...");
        await sequelize.authenticate();
        console.log("✓ Conexão estabelecida\n");

        // Definir associações
        Option.belongsTo(Poll);
        Poll.hasMany(Option, { onDelete: "CASCADE" });
        Vote.belongsTo(Option);
        Option.hasMany(Vote, { onDelete: "CASCADE" });

        // Sincronizar com force: true (apaga e recria)
        console.log("🗑️  Removendo tabelas antigas...");
        await sequelize.sync({ force: true });
        console.log("✓ Tabelas removidas\n");

        console.log("📊 Criando novas tabelas...");
        await sequelize.sync();
        console.log("✓ Novas tabelas criadas\n");

        console.log("✅ Banco de dados resetado com sucesso!");
        console.log("   Todas as tabelas foram recreadas vazias.\n");

        rl.close();
        process.exit(0);
      } catch (err) {
        console.error("❌ Erro ao resetar o banco de dados:");
        console.error(err.message);
        console.error("\n");
        rl.close();
        process.exit(1);
      }
    }
  );
}

resetDatabase();
