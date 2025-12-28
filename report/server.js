const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

function loadItems(jsonPath) {
  const full = path.join(__dirname, jsonPath);
  const raw = fs.readFileSync(full, "utf-8");
  return JSON.parse(raw);
}

const apps = {
  cit: { data: "cit-facilities/items.json" },
  chiba: { data: "chiba-municipalities/items.json" },
  npb: { data: "npb-teams/items.json" },
};

app.get("/api/:app/items", (req, res) => {
  const cfg = apps[req.params.app];
  if (!cfg) return res.status(404).json({ error: "unknown app" });

  try {
    const items = loadItems(cfg.data);
    return res.json(items);
  } catch (e) {
    return res.status(500).json({ error: "failed to load items.json" });
  }
});

app.get("/api/:app/items/:id", (req, res) => {
  const cfg = apps[req.params.app];
  if (!cfg) return res.status(404).json({ error: "unknown app" });

  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "invalid id" });

  try {
    const items = loadItems(cfg.data);
    const item = items.find((x) => x.id === id);
    if (!item) return res.status(404).json({ error: "not found" });
    return res.json(item);
  } catch (e) {
    return res.status(500).json({ error: "failed to load items.json" });
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
  console.log(`CIT:   http://localhost:${PORT}/cit/index.html`);
  console.log(`Chiba: http://localhost:${PORT}/chiba/index.html`);
  console.log(`NPB:   http://localhost:${PORT}/npb/index.html`);
});
