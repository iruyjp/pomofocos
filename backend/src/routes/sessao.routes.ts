import { Router } from "express";
import { calcularXP, calcularNivel } from "../services/xp.service";

const router = Router();

// Exemplo de endpoint para concluir uma sessão de foco e calcular o XP (mock, sem persistência ainda)
router.post("/:id/concluir", (req, res) => {
  const { duracaoPlanejadaMin, duracaoCumpridaMin, estado, temMissaoVinculada, diasDeStreak, xpAtual } = req.body;

  const xpGanho = calcularXP({
    duracaoPlanejadaMin,
    duracaoCumpridaMin,
    estado,
    temMissaoVinculada,
    diasDeStreak,
  });

  const xpTotal = (xpAtual ?? 0) + xpGanho;
  const nivel = calcularNivel(xpTotal);

  res.json({ xpGanho, xpTotal, nivel });
});

export default router;
