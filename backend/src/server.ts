import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sessaoRoutes from "./routes/sessao.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/sessoes", sessaoRoutes);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`PomoFocos API rodando na porta ${PORT}`));
