// Implementa as Regras de Pontuação de XP (ver DRPS - Regras de Negócio / XP)

export type EstadoSessao = "concluida" | "interrompida";

export interface CalculoXPInput {
  duracaoPlanejadaMin: number;
  duracaoCumpridaMin: number;
  estado: EstadoSessao;
  temMissaoVinculada: boolean;
  diasDeStreak: number; // dias consecutivos com sessão concluída, antes desta sessão
}

const XP_POR_MINUTO = 2;
const BONUS_MISSAO = 0.2;
const BONUS_STREAK_POR_DIA = 0.05;
const TETO_BONUS_STREAK = 0.5; // 10 dias

export function calcularXP(input: CalculoXPInput): number {
  const {
    duracaoPlanejadaMin,
    duracaoCumpridaMin,
    estado,
    temMissaoVinculada,
    diasDeStreak,
  } = input;

  const percentualCumprido = duracaoCumpridaMin / duracaoPlanejadaMin;

  // fator de conclusão (RN-XP02)
  let fatorConclusao = 0;
  if (estado === "concluida") {
    fatorConclusao = 1;
  } else if (estado === "interrompida" && percentualCumprido >= 0.5) {
    fatorConclusao = 0.5;
  }

  if (fatorConclusao === 0) return 0;

  const xpBase = duracaoCumpridaMin * XP_POR_MINUTO;
  const bonusMissao = temMissaoVinculada ? BONUS_MISSAO : 0;
  const bonusStreak = Math.min(diasDeStreak * BONUS_STREAK_POR_DIA, TETO_BONUS_STREAK);

  const xpFinal = Math.floor(xpBase * (1 + bonusMissao + bonusStreak) * fatorConclusao);
  return Math.max(xpFinal, 0);
}

// Progressão de nível (RF07) - incremento aritmético (+50 XP de custo por nível)
export function calcularNivel(xpTotal: number): number {
  let nivel = 1;
  let xpNecessario = 0;
  let custoProximo = 100;

  while (xpTotal >= xpNecessario + custoProximo) {
    xpNecessario += custoProximo;
    custoProximo += 50;
    nivel += 1;
  }
  return nivel;
}
