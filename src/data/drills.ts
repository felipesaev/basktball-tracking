import { Drill } from "@/lib/types";

export const drills: Drill[] = [
  // === SEGUNDA & QUINTA: Lance Livre + Meia Distancia ===
  {
    id: "ft-form-basics",
    name: "Fundamentos do Lance Livre",
    description:
      "Trabalhe a mecanica do lance livre: posicionamento dos pes, cotovelo alinhado, follow-through. 10 arremessos consecutivos focando na forma.",
    youtube_url: "https://www.youtube.com/watch?v=tLLibi_YQGY",
    shot_type: "free_throw",
    sets: 3,
    reps: 10,
    day_of_week: [1, 4],
  },
  {
    id: "ft-pressure",
    name: "Lance Livre sob Pressao",
    description:
      "Simule situacao de jogo: faca 2 lances livres, descanse 30s. Repita. Objetivo: 80%+ de acerto.",
    youtube_url: "https://www.youtube.com/watch?v=GWbtqBXYjx4",
    shot_type: "free_throw",
    sets: 5,
    reps: 2,
    day_of_week: [1, 4],
  },
  {
    id: "mr-elbow",
    name: "Meia Distancia - Cotovelo",
    description:
      "Arremessos da regiao do cotovelo (elbow). Trabalhe dos dois lados. Foco no footwork e balance.",
    youtube_url: "https://www.youtube.com/watch?v=v7RGXwqJB7E",
    shot_type: "mid_range",
    sets: 3,
    reps: 10,
    day_of_week: [1, 4],
  },
  {
    id: "mr-baseline",
    name: "Meia Distancia - Baseline",
    description:
      "Arremessos da linha de fundo. Pratique o pull-up jumper vindo do baseline dos dois lados.",
    youtube_url: "https://www.youtube.com/watch?v=K3wgpJMbRHs",
    shot_type: "mid_range",
    sets: 3,
    reps: 8,
    day_of_week: [1, 4],
  },

  // === TERCA & SEXTA: 3 Pontos + Combos ===
  {
    id: "3pt-catch-shoot",
    name: "Catch & Shoot - 3 Pontos",
    description:
      "Pratique o catch-and-shoot dos 5 spots do arco. Foco na recepcao e arremesso rapido com boa forma.",
    youtube_url: "https://www.youtube.com/watch?v=f1CnGTwc-eo",
    shot_type: "three_pointer",
    sets: 3,
    reps: 5,
    day_of_week: [2, 5],
  },
  {
    id: "3pt-off-dribble",
    name: "3 Pontos do Drible",
    description:
      "Drible para a linha de 3 e arremesse. Pratique step-back e pull-up three de diferentes posicoes.",
    youtube_url: "https://www.youtube.com/watch?v=GKFBVHJfGKM",
    shot_type: "three_pointer",
    sets: 3,
    reps: 8,
    day_of_week: [2, 5],
  },
  {
    id: "3pt-corner",
    name: "Corner Three Specialist",
    description:
      "Foco nos arremessos de 3 do corner (canto). Posicao mais curta, trabalhe consistencia.",
    youtube_url: "https://www.youtube.com/watch?v=8_XFnMdWeyQ",
    shot_type: "three_pointer",
    sets: 4,
    reps: 5,
    day_of_week: [2, 5],
  },
  {
    id: "combo-crossover-pull",
    name: "Crossover + Pull-up",
    description:
      "Combo: crossover dribble seguido de pull-up jumper da meia distancia. Trabalhe dos dois lados.",
    youtube_url: "https://www.youtube.com/watch?v=Y2mOfCKSyEQ",
    shot_type: "combo",
    sets: 3,
    reps: 6,
    day_of_week: [2, 5],
  },

  // === QUARTA & SABADO: Bandejas + Post ===
  {
    id: "layup-package",
    name: "Pacote de Bandejas",
    description:
      "Pratique diferentes finalizacoes: finger roll, reverse layup, euro step. Alterne esquerda e direita.",
    youtube_url: "https://www.youtube.com/watch?v=rGcoQMHEUS0",
    shot_type: "layup",
    sets: 3,
    reps: 10,
    day_of_week: [3, 6],
  },
  {
    id: "layup-contact",
    name: "Bandejas com Contato",
    description:
      "Finalizacoes simulando contato. Use uma bola de basquete e pratique and-one finishes.",
    youtube_url: "https://www.youtube.com/watch?v=XzSSHGJKzSs",
    shot_type: "layup",
    sets: 3,
    reps: 8,
    day_of_week: [3, 6],
  },
  {
    id: "post-hook",
    name: "Hook Shot - Post",
    description:
      "Pratique o gancho (hook shot) dos dois lados do garrafao. Foco no footwork e finalizacao suave.",
    youtube_url: "https://www.youtube.com/watch?v=1AtRRqMTJcY",
    shot_type: "post",
    sets: 3,
    reps: 8,
    day_of_week: [3, 6],
  },
  {
    id: "post-fadeaway",
    name: "Fadeaway - Post",
    description:
      "Trabalhe o fadeaway do post. Comece com as costas para a cesta, gire e arremesse com fade.",
    youtube_url: "https://www.youtube.com/watch?v=b0gMz-cGzXk",
    shot_type: "post",
    sets: 3,
    reps: 6,
    day_of_week: [3, 6],
  },

  // === DOMINGO: Sessao Leve ===
  {
    id: "sun-shootaround",
    name: "Shootaround Livre",
    description:
      "Sessao livre de arremessos. Sem pressao, foque em sentir a bola e trabalhar sua confianca.",
    youtube_url: "https://www.youtube.com/watch?v=TaCnwHS3fMI",
    shot_type: "free_throw",
    sets: 1,
    reps: 20,
    day_of_week: [0],
  },
  {
    id: "sun-spot-shooting",
    name: "Spot Shooting Relaxado",
    description:
      "Escolha 5 spots favoritos e faca 5 arremessos de cada. Ritmo tranquilo, foco na forma.",
    youtube_url: "https://www.youtube.com/watch?v=GsZDHgVGiII",
    shot_type: "mid_range",
    sets: 5,
    reps: 5,
    day_of_week: [0],
  },

  // === WARMUP (Todos os dias) ===
  {
    id: "warmup-mikan",
    name: "Mikan Drill - Aquecimento",
    description:
      "Classico drill de aquecimento: bandejas alternadas debaixo da cesta. Esquerda, direita, sem parar.",
    youtube_url: "https://www.youtube.com/watch?v=Wr5HQpBcKBo",
    shot_type: "warmup",
    sets: 2,
    reps: 10,
    day_of_week: [0, 1, 2, 3, 4, 5, 6],
  },
  {
    id: "warmup-form-shooting",
    name: "Form Shooting - Aquecimento",
    description:
      "Arremessos curtos para aquecer. Comece perto da cesta e va se afastando gradualmente.",
    youtube_url: "https://www.youtube.com/watch?v=FPn_rKHGKNQ",
    shot_type: "warmup",
    sets: 1,
    reps: 15,
    day_of_week: [0, 1, 2, 3, 4, 5, 6],
  },
];

export function getDrillsForDay(dayOfWeek: number): Drill[] {
  return drills.filter((drill) => drill.day_of_week.includes(dayOfWeek));
}
