# PomoFocos

Aplicativo web que combina a técnica Pomodoro com gamificação estilo RPG (XP, níveis, missões e inventário) para combater a procrastinação.

## Stack
- **Frontend:** React + TypeScript (Vite)
- **Backend:** Node.js (v20+) + Express + TypeScript
- **Banco de dados:** PostgreSQL + Prisma ORM

## Estrutura do repositório
```
pomofocos/
├── frontend/     # aplicação React (Vite)
├── backend/      # API Express + Prisma
└── .github/      # workflows de CI
```

## Como rodar localmente

### Backend
```bash
cd backend
npm install
cp .env.example .env   # configure DATABASE_URL
npx prisma migrate dev
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Regras de negócio principais
Ver `Documento de Requisitos e Projeto de Software (DRPS)` — seções 4.3 (Regras de Negócio),
XP e Missões (ver `PomoFocos_XP_Missoes_Diferencial.docx`).

## Equipe
Mariana Yuri Okabayashi Teodózio · Nayara Maria de Jesus · Iara Beatriz da Silva Ricieri · Sabrina Lima Robert

IFMS — Campus Naviraí — 2026
