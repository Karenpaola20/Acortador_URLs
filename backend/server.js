const path = require("path");
const { createApp } = require("./app");
const { createStore } = require("./store");

const PORT = process.env.PORT || 3000;
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, "data", "urls.json");

const store = createStore(DATA_FILE);

// La URL corta usa el mismo host desde el que se hizo la petición
const baseUrl = (req) => process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

createApp(store, baseUrl).listen(PORT, () => {
  console.log(`Acortador corriendo en http://localhost:${PORT}`);
});
