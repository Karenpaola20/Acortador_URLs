// Almacenamiento local en un archivo JSON.
// Reemplaza a la tabla DynamoDB "urls" (misma estructura de items:
// code, originalUrl, createdAt, clicks, visits).
const fs = require("fs");
const path = require("path");

function createStore(filePath) {
  function readAll() {
    if (!fs.existsSync(filePath)) {
      return {};
    }
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  }

  function writeAll(data) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  return {
    get(code) {
      return readAll()[code] || null;
    },

    put(item) {
      const data = readAll();
      data[item.code] = item;
      writeAll(data);
    },

    // Equivale al UpdateCommand: clicks + 1 y agrega la fecha a visits
    registerVisit(code, date) {
      const data = readAll();
      data[code].clicks += 1;
      data[code].visits.push(date);
      writeAll(data);
    }
  };
}

module.exports = { createStore };
