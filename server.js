import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const DB_FILE = "./apps.json";

// Função auxiliar: lê os apps salvos
function lerApps() {
  try {
    if (!fs.existsSync(DB_FILE)) return [];
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Erro ao ler apps.json:", err);
    return [];
  }
}

// Função auxiliar: salva os apps no arquivo
function salvarApps(lista) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(lista, null, 2));
  } catch (err) {
    console.error("Erro ao salvar apps.json:", err);
  }
}

// rota para listar apps
app.get("/api/apps", (req, res) => {
  const apps = lerApps();
  res.json(apps);
});

// rota para publicar novo app
app.post("/api/publicar", (req, res) => {
  const { nome, descricao, link, icone } = req.body;
  if (!nome || !descricao || !link) {
    return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
  }

  const apps = lerApps();
  const novo = {
    id: Date.now(),
    nome,
    descricao,
    link,
    icone: icone || "",
    data: new Date().toISOString(),
  };
  apps.unshift(novo);
  salvarApps(apps);

  res.json({ message: "App publicado com sucesso!" });
});

// health check
app.get("/health", (req, res) => res.status(200).send("OK"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("InfinityStore rodando na porta " + port));