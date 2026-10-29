// API del acortador. Reúne en un solo servidor lo que antes eran
// 3 Lambdas detrás de API Gateway, con los mismos endpoints y respuestas.
const path = require("path");
const express = require("express");


function generateCode() {
  return Math.random().toString(36).substring(2, 8);
}

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// Valida el cuerpo de POST /shorten. Devuelve el mensaje de error o null.
function validarSolicitud(body) {
  if (body) {
    if (body.url) {
      if (typeof body.url === "string") {
        if (body.url.length <= 2048) {
          if (isValidUrl(body.url)) {
            return null;
          } else {
            return "URL inválida";
          }
        } else {
          return "URL demasiado larga";
        }
      } else {
        return "La URL debe ser texto";
      }
    } else {
      return "Falta el campo url";
    }
  } else {
    return "Cuerpo vacío";
  }
}

function createApp(store, baseUrl) {
  const app = express();

  
  app.use(express.json());

  // Frontend (antes en S3 + CloudFront)
  app.use(express.static(path.join(__dirname, "..", "frontend")));

  // POST /shorten  (antes: url-shortener-lambda)
  app.post("/shorten", (req, res) => {
    const error = validarSolicitud(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    const originalUrl = req.body.url;

    let code = generateCode();
    while (store.get(code)) {
      code = generateCode();
    }

    store.put({
      code,
      originalUrl,
      createdAt: new Date().toISOString(),
      clicks: 0,
      visits: []
    });

    return res.status(200).json({ shortUrl: `${baseUrl(req)}/${code}`, code });
  });

  // GET /stats/:codigo?date=YYYY-MM-DD  (antes: stast-lambda)
  app.get("/stats/:codigo", (req, res) => {
    const item = store.get(req.params.codigo);

    if (!item) {
      return res.status(404).json({ message: "URL no encontrada" });
    }

    const queryDate = req.query.date;
    const visits = queryDate
      ? item.visits.filter((visit) => visit === queryDate)
      : item.visits;

    return res.status(200).json({
      code: item.code,
      originalUrl: item.originalUrl,
      totalClicks: item.clicks,
      visits,
      filteredDate: queryDate || null
    });
  });

  // GET /:codigo -> 302  (antes: redirect-lambda)
  app.get("/:codigo", (req, res) => {
    const item = store.get(req.params.codigo);

    if (!item) {
      return res.status(404).json({ message: "URL no encontrada" });
    }

    const today = new Date().toISOString().split("T")[0];
    store.registerVisit(item.code, today);

    return res.redirect(302, item.originalUrl);
  });

  return app;
}

module.exports = { createApp };
