const Poll = require("../models/Poll");
const Option = require("../models/Option");

module.exports = function setupSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log("Usuário conectado:", socket.id);

    socket.on("disconnect", () => {
      console.log("Usuário desconectado:", socket.id);
    });

    socket.on("getPollUpdates", async () => {
      const polls = await Poll.findAll({
        include: Option,
        raw: false,
        order: [["id", "DESC"]],
      });
      socket.emit("pollsData", polls);
    });
  });
};
