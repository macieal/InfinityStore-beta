import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // onde fica seu index.html

// Rota RÁPIDA de Health Check para o Render
app.get("/health", (req, res) => {
    // Apenas diz "OK" com status 200 (Sucesso)
    res.status(200).send("OK");
});

// 🔧 coloque aqui suas chaves do Supabase
const supabase = createClient(
  "https://SEU_PROJETO.supabase.co",
  "SEU_SUPABASE_ANON_KEY"
);

// rota para receber publicações
app.post("/api/publicar", async (req, res) => {
  const { nome, descricao, link, icone } = req.body;

  if (!nome || !descricao || !link) {
    return res.status(400).json({ message: "Campos obrigatórios faltando!" });
  }

  const { error } = await supabase.from("apps").insert([
    { nome, descricao, link, icone }
  ]);

  if (error) return res.status(500).json({ message: "Erro ao salvar: " + error.message });
  res.json({ message: "App publicado com sucesso!" });
});

// rota para listar apps
app.get("/api/apps", async (req, res) => {
  const { data, error } = await supabase.from("apps").select("*").order("id", { ascending: false });
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("InfinityStore rodando na porta " + port));