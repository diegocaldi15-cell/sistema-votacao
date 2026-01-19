const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
require("dotenv").config();
require("./models");

const { initializeDatabaseIfNeeded } = require("./utils/database");
const { pollsRoute } = require("./routes/polls");
const setupSocketHandlers = require("./handlers/socketHandlers");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

// Função principal para iniciar o servidor
async function bootstrap() {
  app.use(cors());
  app.use(express.json({ charset: "utf-8" }));
  app.use((req, _, next) => {
    req.io = io;
    next();
  });

  app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    next();
  });

  // Inicializar banco antes de iniciar servidor
  await initializeDatabaseIfNeeded();

  // Setup de rotas
  app.use("/api/polls", pollsRoute);

  // Setup de listeners de WebSocket
  setupSocketHandlers(io);

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}

bootstrap();
