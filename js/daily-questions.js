/**
 * Daily Questions Data - 30+ days of rotating questions
 * Each question has multi-language support and result type mapping
 */

const DAILY_QUESTIONS = [
  // Day 1
  {
    id: "day-001",
    date: "2026-01-21",
    question: {
      ko: "당신에게 가장 소중한 시간은 언제인가요?",
      en: "When is the most precious time for you?",
      ja: "あなたにとって最も大切な時間はいつですか？",
      zh: "对你来说最珍贵的时间是什么时候？",
      es: "¿Cuál es el momento más preciado para ti?"
    },
    options: [
      {
        id: "morning",
        text: {
          ko: "☀️ 상쾌한 아침 시간",
          en: "☀️ Fresh morning time",
          ja: "☀️ 爽やかな朝の時間",
          zh: "☀️ 清新的早晨时光",
          es: "☀️ Tiempo fresco de la mañana"
        },
        emoji: "☀️"
      },
      {
        id: "evening",
        text: {
          ko: "🌙 여유로운 저녁 시간",
          en: "🌙 Relaxing evening time",
          ja: "🌙 ゆったりとした夜の時間",
          zh: "🌙 悠闲的晚间时光",
          es: "🌙 Tiempo relajante de la noche"
        },
        emoji: "🌙"
      },
      {
        id: "night",
        text: {
          ko: "🌌 고요한 새벽 시간",
          en: "🌌 Quiet dawn hours",
          ja: "🌌 静かな夜明けの時間",
          zh: "🌌 宁静的黎明时分",
          es: "🌌 Horas tranquilas del amanecer"
        },
        emoji: "🌌"
      },
      {
        id: "flow",
        text: {
          ko: "⚡ 무언가에 몰입하는 순간",
          en: "⚡ Moments of deep focus",
          ja: "⚡ 何かに没頭する瞬間",
          zh: "⚡ 沉浸于某事的时刻",
          es: "⚡ Momentos de concentración profunda"
        },
        emoji: "⚡"
      }
    ],
    resultTypes: {
      morning: { type: "early-bird", trait: "규칙적", traitEn: "Disciplined" },
      evening: { type: "social-soul", trait: "사교적", traitEn: "Social" },
      night: { type: "night-owl", trait: "창의적", traitEn: "Creative" },
      flow: { type: "flow-master", trait: "집중력", traitEn: "Focused" }
    }
  },
  // Day 2
  {
    id: "day-002",
    date: "2026-01-22",
    question: {
      ko: "스트레스를 받으면 당신은?",
      en: "What do you do when stressed?",
      ja: "ストレスを感じたらどうしますか？",
      zh: "当你感到压力时会怎么做？",
      es: "¿Qué haces cuando estás estresado?"
    },
    options: [
      {
        id: "exercise",
        text: {
          ko: "🏃 운동으로 에너지 발산",
          en: "🏃 Release energy through exercise",
          ja: "🏃 運動でエネルギーを発散",
          zh: "🏃 通过运动释放能量",
          es: "🏃 Liberar energía con ejercicio"
        },
        emoji: "🏃"
      },
      {
        id: "talk",
        text: {
          ko: "💬 친구와 수다로 해소",
          en: "💬 Chat with friends",
          ja: "💬 友達とおしゃべりで解消",
          zh: "💬 与朋友聊天解压",
          es: "💬 Charlar con amigos"
        },
        emoji: "💬"
      },
      {
        id: "music",
        text: {
          ko: "🎵 음악 듣기",
          en: "🎵 Listen to music",
          ja: "🎵 音楽を聴く",
          zh: "🎵 听音乐",
          es: "🎵 Escuchar música"
        },
        emoji: "🎵"
      },
      {
        id: "sleep",
        text: {
          ko: "😴 일단 자고 본다",
          en: "😴 Just sleep it off",
          ja: "😴 とりあえず寝る",
          zh: "😴 先睡一觉再说",
          es: "😴 Simplemente dormir"
        },
        emoji: "😴"
      }
    ],
    resultTypes: {
      exercise: { type: "action-hero", trait: "활동적", traitEn: "Active" },
      talk: { type: "social-butterfly", trait: "외향적", traitEn: "Extroverted" },
      music: { type: "artistic-soul", trait: "감성적", traitEn: "Emotional" },
      sleep: { type: "zen-master", trait: "평온함", traitEn: "Calm" }
    }
  },
  // Day 3
  {
    id: "day-003",
    date: "2026-01-23",
    question: {
      ko: "여행을 간다면 어떤 스타일?",
      en: "What's your travel style?",
      ja: "旅行に行くならどんなスタイル？",
      zh: "你的旅行风格是什么？",
      es: "¿Cuál es tu estilo de viaje?"
    },
    options: [
      {
        id: "planner",
        text: {
          ko: "📋 완벽한 계획형",
          en: "📋 Perfect planner",
          ja: "📋 完璧な計画型",
          zh: "📋 完美计划型",
          es: "📋 Planificador perfecto"
        },
        emoji: "📋"
      },
      {
        id: "spontaneous",
        text: {
          ko: "🎲 즉흥 모험가",
          en: "🎲 Spontaneous adventurer",
          ja: "🎲 即興の冒険家",
          zh: "🎲 即兴冒险家",
          es: "🎲 Aventurero espontáneo"
        },
        emoji: "🎲"
      },
      {
        id: "relaxation",
        text: {
          ko: "🏖️ 힐링 추구형",
          en: "🏖️ Relaxation seeker",
          ja: "🏖️ 癒しを求める型",
          zh: "🏖️ 追求放松型",
          es: "🏖️ Buscador de relajación"
        },
        emoji: "🏖️"
      },
      {
        id: "explorer",
        text: {
          ko: "🗺️ 숨은 명소 탐험가",
          en: "🗺️ Hidden gem explorer",
          ja: "🗺️ 隠れた名所探検家",
          zh: "🗺️ 隐藏景点探险家",
          es: "🗺️ Explorador de joyas ocultas"
        },
        emoji: "🗺️"
      }
    ],
    resultTypes: {
      planner: { type: "strategist", trait: "체계적", traitEn: "Systematic" },
      spontaneous: { type: "free-spirit", trait: "자유로움", traitEn: "Free-spirited" },
      relaxation: { type: "peace-seeker", trait: "여유로움", traitEn: "Relaxed" },
      explorer: { type: "curious-cat", trait: "호기심", traitEn: "Curious" }
    }
  },
  // Day 4
  {
    id: "day-004",
    date: "2026-01-24",
    question: {
      ko: "주말 아침, 당신의 모습은?",
      en: "What's your weekend morning like?",
      ja: "週末の朝、あなたはどんな感じ？",
      zh: "周末早上你是什么样的？",
      es: "¿Cómo es tu mañana de fin de semana?"
    },
    options: [
      {
        id: "early",
        text: {
          ko: "🌅 일찍 일어나 활동 시작",
          en: "🌅 Wake up early and start activities",
          ja: "🌅 早起きして活動開始",
          zh: "🌅 早起开始活动",
          es: "🌅 Levantarse temprano y empezar actividades"
        },
        emoji: "🌅"
      },
      {
        id: "lazy",
        text: {
          ko: "🛏️ 늦잠 자며 뒹굴뒹굴",
          en: "🛏️ Sleep in and lounge around",
          ja: "🛏️ 寝坊してゴロゴロ",
          zh: "🛏️ 睡懒觉",
          es: "🛏️ Dormir hasta tarde y holgazanear"
        },
        emoji: "🛏️"
      },
      {
        id: "productive",
        text: {
          ko: "✅ 밀린 일 처리하기",
          en: "✅ Catch up on tasks",
          ja: "✅ 溜まった仕事を処理",
          zh: "✅ 处理积压的事务",
          es: "✅ Ponerse al día con las tareas"
        },
        emoji: "✅"
      },
      {
        id: "social",
        text: {
          ko: "👥 친구/가족과 시간 보내기",
          en: "👥 Spend time with friends/family",
          ja: "👥 友達/家族と過ごす",
          zh: "👥 与朋友/家人共度时光",
          es: "👥 Pasar tiempo con amigos/familia"
        },
        emoji: "👥"
      }
    ],
    resultTypes: {
      early: { type: "go-getter", trait: "열정적", traitEn: "Passionate" },
      lazy: { type: "comfort-lover", trait: "여유로움", traitEn: "Laid-back" },
      productive: { type: "achiever", trait: "성실함", traitEn: "Diligent" },
      social: { type: "connector", trait: "관계중시", traitEn: "Relationship-oriented" }
    }
  },
  // Day 5
  {
    id: "day-005",
    date: "2026-01-25",
    question: {
      ko: "당신의 이상적인 데이트는?",
      en: "What's your ideal date?",
      ja: "あなたの理想的なデートは？",
      zh: "你理想的约会是什么？",
      es: "¿Cuál es tu cita ideal?"
    },
    options: [
      {
        id: "outdoor",
        text: {
          ko: "🏔️ 야외 액티비티",
          en: "🏔️ Outdoor activities",
          ja: "🏔️ アウトドアアクティビティ",
          zh: "🏔️ 户外活动",
          es: "🏔️ Actividades al aire libre"
        },
        emoji: "🏔️"
      },
      {
        id: "cultural",
        text: {
          ko: "🎭 문화/예술 감상",
          en: "🎭 Cultural/art appreciation",
          ja: "🎭 文化/芸術鑑賞",
          zh: "🎭 文化/艺术欣赏",
          es: "🎭 Apreciación cultural/artística"
        },
        emoji: "🎭"
      },
      {
        id: "food",
        text: {
          ko: "🍽️ 맛있는 음식 탐방",
          en: "🍽️ Food exploration",
          ja: "🍽️ 美味しい食べ物巡り",
          zh: "🍽️ 美食探索",
          es: "🍽️ Exploración gastronómica"
        },
        emoji: "🍽️"
      },
      {
        id: "home",
        text: {
          ko: "🏠 집에서 편하게",
          en: "🏠 Cozy time at home",
          ja: "🏠 家でゆっくり",
          zh: "🏠 在家舒适地度过",
          es: "🏠 Tiempo acogedor en casa"
        },
        emoji: "🏠"
      }
    ],
    resultTypes: {
      outdoor: { type: "adventurer", trait: "모험심", traitEn: "Adventurous" },
      cultural: { type: "intellectual", trait: "지적호기심", traitEn: "Intellectually curious" },
      food: { type: "epicurean", trait: "미식가", traitEn: "Epicurean" },
      home: { type: "homebody", trait: "아늑함추구", traitEn: "Comfort-seeking" }
    }
  },
  // Day 6
  {
    id: "day-006",
    date: "2026-01-26",
    question: {
      ko: "갑자기 100만원이 생겼다면?",
      en: "If you suddenly got $1000?",
      ja: "突然100万円が手に入ったら？",
      zh: "如果突然有了100万韩元？",
      es: "¿Si de repente tuvieras $1000?"
    },
    options: [
      {
        id: "save",
        text: {
          ko: "💰 저축한다",
          en: "💰 Save it",
          ja: "💰 貯金する",
          zh: "💰 存起来",
          es: "💰 Ahorrarlo"
        },
        emoji: "💰"
      },
      {
        id: "invest",
        text: {
          ko: "📈 투자한다",
          en: "📈 Invest it",
          ja: "📈 投資する",
          zh: "📈 投资",
          es: "📈 Invertirlo"
        },
        emoji: "📈"
      },
      {
        id: "spend",
        text: {
          ko: "🛍️ 쇼핑한다",
          en: "🛍️ Go shopping",
          ja: "🛍️ 買い物する",
          zh: "🛍️ 购物",
          es: "🛍️ Ir de compras"
        },
        emoji: "🛍️"
      },
      {
        id: "experience",
        text: {
          ko: "✈️ 경험에 쓴다",
          en: "✈️ Spend on experiences",
          ja: "✈️ 経験に使う",
          zh: "✈️ 用于体验",
          es: "✈️ Gastar en experiencias"
        },
        emoji: "✈️"
      }
    ],
    resultTypes: {
      save: { type: "security-seeker", trait: "안정추구", traitEn: "Security-seeking" },
      invest: { type: "growth-minded", trait: "성장지향", traitEn: "Growth-oriented" },
      spend: { type: "present-liver", trait: "현재충실", traitEn: "Present-focused" },
      experience: { type: "memory-maker", trait: "경험중시", traitEn: "Experience-oriented" }
    }
  },
  // Day 7
  {
    id: "day-007",
    date: "2026-01-27",
    question: {
      ko: "팀 프로젝트에서 당신의 역할은?",
      en: "What's your role in a team project?",
      ja: "チームプロジェクトでのあなたの役割は？",
      zh: "在团队项目中你的角色是？",
      es: "¿Cuál es tu rol en un proyecto de equipo?"
    },
    options: [
      {
        id: "leader",
        text: {
          ko: "👑 리더/총괄",
          en: "👑 Leader/Manager",
          ja: "👑 リーダー/総括",
          zh: "👑 领导/总管",
          es: "👑 Líder/Gerente"
        },
        emoji: "👑"
      },
      {
        id: "idea",
        text: {
          ko: "💡 아이디어 뱅크",
          en: "💡 Idea generator",
          ja: "💡 アイデアバンク",
          zh: "💡 创意银行",
          es: "💡 Generador de ideas"
        },
        emoji: "💡"
      },
      {
        id: "executor",
        text: {
          ko: "⚙️ 실행/실무 담당",
          en: "⚙️ Executor/Worker",
          ja: "⚙️ 実行/実務担当",
          zh: "⚙️ 执行/实务负责",
          es: "⚙️ Ejecutor/Trabajador"
        },
        emoji: "⚙️"
      },
      {
        id: "mediator",
        text: {
          ko: "🤝 중재/조율자",
          en: "🤝 Mediator/Coordinator",
          ja: "🤝 仲裁/調整役",
          zh: "🤝 调解/协调者",
          es: "🤝 Mediador/Coordinador"
        },
        emoji: "🤝"
      }
    ],
    resultTypes: {
      leader: { type: "natural-leader", trait: "리더십", traitEn: "Leadership" },
      idea: { type: "creative-thinker", trait: "창의성", traitEn: "Creativity" },
      executor: { type: "reliable-doer", trait: "실행력", traitEn: "Execution" },
      mediator: { type: "harmonizer", trait: "조화로움", traitEn: "Harmonious" }
    }
  },
  // Day 8
  {
    id: "day-008",
    date: "2026-01-28",
    question: {
      ko: "당신이 가장 싫어하는 것은?",
      en: "What do you dislike the most?",
      ja: "あなたが最も嫌いなものは？",
      zh: "你最讨厌的是什么？",
      es: "¿Qué es lo que más te disgusta?"
    },
    options: [
      {
        id: "waiting",
        text: {
          ko: "⏰ 기다리는 것",
          en: "⏰ Waiting",
          ja: "⏰ 待つこと",
          zh: "⏰ 等待",
          es: "⏰ Esperar"
        },
        emoji: "⏰"
      },
      {
        id: "chaos",
        text: {
          ko: "🌀 무질서/혼란",
          en: "🌀 Disorder/Chaos",
          ja: "🌀 無秩序/混乱",
          zh: "🌀 无序/混乱",
          es: "🌀 Desorden/Caos"
        },
        emoji: "🌀"
      },
      {
        id: "injustice",
        text: {
          ko: "⚖️ 불공정함",
          en: "⚖️ Injustice",
          ja: "⚖️ 不公平",
          zh: "⚖️ 不公正",
          es: "⚖️ Injusticia"
        },
        emoji: "⚖️"
      },
      {
        id: "boredom",
        text: {
          ko: "😐 지루함/반복",
          en: "😐 Boredom/Repetition",
          ja: "😐 退屈/繰り返し",
          zh: "😐 无聊/重复",
          es: "😐 Aburrimiento/Repetición"
        },
        emoji: "😐"
      }
    ],
    resultTypes: {
      waiting: { type: "action-taker", trait: "즉각적", traitEn: "Immediate" },
      chaos: { type: "order-lover", trait: "체계적", traitEn: "Systematic" },
      injustice: { type: "justice-seeker", trait: "정의로움", traitEn: "Just" },
      boredom: { type: "novelty-seeker", trait: "새로움추구", traitEn: "Novelty-seeking" }
    }
  },
  // Day 9
  {
    id: "day-009",
    date: "2026-01-29",
    question: {
      ko: "어려운 결정을 내릴 때 당신은?",
      en: "When making a difficult decision, you?",
      ja: "難しい決断をするとき、あなたは？",
      zh: "做困难决定时你会？",
      es: "¿Cómo tomas decisiones difíciles?"
    },
    options: [
      {
        id: "logic",
        text: {
          ko: "🧠 논리적으로 분석",
          en: "🧠 Analyze logically",
          ja: "🧠 論理的に分析",
          zh: "🧠 逻辑分析",
          es: "🧠 Analizar lógicamente"
        },
        emoji: "🧠"
      },
      {
        id: "intuition",
        text: {
          ko: "💫 직감을 따른다",
          en: "💫 Follow intuition",
          ja: "💫 直感に従う",
          zh: "💫 跟随直觉",
          es: "💫 Seguir la intuición"
        },
        emoji: "💫"
      },
      {
        id: "advice",
        text: {
          ko: "👥 주변 조언을 구한다",
          en: "👥 Seek advice from others",
          ja: "👥 周りにアドバイスを求める",
          zh: "👥 寻求他人建议",
          es: "👥 Buscar consejos de otros"
        },
        emoji: "👥"
      },
      {
        id: "time",
        text: {
          ko: "⏳ 시간을 두고 생각",
          en: "⏳ Take time to think",
          ja: "⏳ 時間をかけて考える",
          zh: "⏳ 花时间思考",
          es: "⏳ Tomar tiempo para pensar"
        },
        emoji: "⏳"
      }
    ],
    resultTypes: {
      logic: { type: "analyst", trait: "분석적", traitEn: "Analytical" },
      intuition: { type: "intuitive", trait: "직관적", traitEn: "Intuitive" },
      advice: { type: "collaborator", trait: "협력적", traitEn: "Collaborative" },
      time: { type: "contemplator", trait: "신중함", traitEn: "Careful" }
    }
  },
  // Day 10
  {
    id: "day-010",
    date: "2026-01-30",
    question: {
      ko: "당신의 에너지 충전 방법은?",
      en: "How do you recharge your energy?",
      ja: "あなたのエネルギー充電方法は？",
      zh: "你如何充电恢复精力？",
      es: "¿Cómo recargas tu energía?"
    },
    options: [
      {
        id: "alone",
        text: {
          ko: "🧘 혼자만의 시간",
          en: "🧘 Time alone",
          ja: "🧘 一人の時間",
          zh: "🧘 独处时光",
          es: "🧘 Tiempo a solas"
        },
        emoji: "🧘"
      },
      {
        id: "people",
        text: {
          ko: "🎉 사람들과 어울리기",
          en: "🎉 Being with people",
          ja: "🎉 人と交流",
          zh: "🎉 与人交往",
          es: "🎉 Estar con gente"
        },
        emoji: "🎉"
      },
      {
        id: "nature",
        text: {
          ko: "🌿 자연 속에서",
          en: "🌿 In nature",
          ja: "🌿 自然の中で",
          zh: "🌿 在大自然中",
          es: "🌿 En la naturaleza"
        },
        emoji: "🌿"
      },
      {
        id: "hobby",
        text: {
          ko: "🎨 취미 활동",
          en: "🎨 Hobbies",
          ja: "🎨 趣味活動",
          zh: "🎨 兴趣爱好",
          es: "🎨 Hobbies"
        },
        emoji: "🎨"
      }
    ],
    resultTypes: {
      alone: { type: "introvert", trait: "내향적", traitEn: "Introverted" },
      people: { type: "extrovert", trait: "외향적", traitEn: "Extroverted" },
      nature: { type: "nature-lover", trait: "자연친화", traitEn: "Nature-loving" },
      hobby: { type: "passionate", trait: "열정적", traitEn: "Passionate" }
    }
  },
  // Day 11
  {
    id: "day-011",
    date: "2026-01-31",
    question: {
      ko: "친구에게 듣고 싶은 말은?",
      en: "What do you want to hear from friends?",
      ja: "友達から聞きたい言葉は？",
      zh: "你想从朋友那里听到什么？",
      es: "¿Qué quieres escuchar de tus amigos?"
    },
    options: [
      {
        id: "support",
        text: {
          ko: "💪 넌 할 수 있어!",
          en: "💪 You can do it!",
          ja: "💪 君ならできる！",
          zh: "💪 你可以的！",
          es: "💪 ¡Tú puedes hacerlo!"
        },
        emoji: "💪"
      },
      {
        id: "comfort",
        text: {
          ko: "🤗 괜찮아, 힘들었지?",
          en: "🤗 It's okay, it was hard, wasn't it?",
          ja: "🤗 大丈夫、辛かったよね？",
          zh: "🤗 没关系，很辛苦吧？",
          es: "🤗 Está bien, fue difícil, ¿verdad?"
        },
        emoji: "🤗"
      },
      {
        id: "honest",
        text: {
          ko: "🎯 솔직한 피드백",
          en: "🎯 Honest feedback",
          ja: "🎯 率直なフィードバック",
          zh: "🎯 诚实的反馈",
          es: "🎯 Retroalimentación honesta"
        },
        emoji: "🎯"
      },
      {
        id: "fun",
        text: {
          ko: "😄 그냥 같이 웃자!",
          en: "😄 Let's just laugh together!",
          ja: "😄 一緒に笑おう！",
          zh: "😄 一起笑吧！",
          es: "😄 ¡Riamos juntos!"
        },
        emoji: "😄"
      }
    ],
    resultTypes: {
      support: { type: "achiever", trait: "성취지향", traitEn: "Achievement-oriented" },
      comfort: { type: "sensitive-soul", trait: "감성적", traitEn: "Sensitive" },
      honest: { type: "truth-seeker", trait: "진실추구", traitEn: "Truth-seeking" },
      fun: { type: "optimist", trait: "낙천적", traitEn: "Optimistic" }
    }
  },
  // Day 12
  {
    id: "day-012",
    date: "2026-02-01",
    question: {
      ko: "새해 첫날, 당신은 무엇을 하나요?",
      en: "What do you do on New Year's Day?",
      ja: "元日、あなたは何をしますか？",
      zh: "新年第一天你会做什么？",
      es: "¿Qué haces en Año Nuevo?"
    },
    options: [
      {
        id: "goals",
        text: {
          ko: "📝 새해 목표 세우기",
          en: "📝 Set new year goals",
          ja: "📝 新年の目標を立てる",
          zh: "📝 制定新年目标",
          es: "📝 Establecer metas de año nuevo"
        },
        emoji: "📝"
      },
      {
        id: "family",
        text: {
          ko: "👨‍👩‍👧‍👦 가족과 시간 보내기",
          en: "👨‍👩‍👧‍👦 Spend time with family",
          ja: "👨‍👩‍👧‍👦 家族と過ごす",
          zh: "👨‍👩‍👧‍👦 与家人共度",
          es: "👨‍👩‍👧‍👦 Pasar tiempo con la familia"
        },
        emoji: "👨‍👩‍👧‍👦"
      },
      {
        id: "rest",
        text: {
          ko: "😴 푹 쉬기",
          en: "😴 Rest well",
          ja: "😴 ゆっくり休む",
          zh: "😴 好好休息",
          es: "😴 Descansar bien"
        },
        emoji: "😴"
      },
      {
        id: "party",
        text: {
          ko: "🎊 파티/축하 모임",
          en: "🎊 Party/Celebration",
          ja: "🎊 パーティー/お祝い",
          zh: "🎊 派对/庆祝",
          es: "🎊 Fiesta/Celebración"
        },
        emoji: "🎊"
      }
    ],
    resultTypes: {
      goals: { type: "planner", trait: "계획적", traitEn: "Planned" },
      family: { type: "family-person", trait: "가족중심", traitEn: "Family-centered" },
      rest: { type: "self-carer", trait: "자기관리", traitEn: "Self-caring" },
      party: { type: "celebrator", trait: "축제적", traitEn: "Festive" }
    }
  },
  // Day 13
  {
    id: "day-013",
    date: "2026-02-02",
    question: {
      ko: "당신의 학습 스타일은?",
      en: "What's your learning style?",
      ja: "あなたの学習スタイルは？",
      zh: "你的学习风格是什么？",
      es: "¿Cuál es tu estilo de aprendizaje?"
    },
    options: [
      {
        id: "visual",
        text: {
          ko: "👀 보면서 배우기",
          en: "👀 Learning by watching",
          ja: "👀 見て学ぶ",
          zh: "👀 通过观看学习",
          es: "👀 Aprender viendo"
        },
        emoji: "👀"
      },
      {
        id: "practice",
        text: {
          ko: "🔨 직접 해보며 배우기",
          en: "🔨 Learning by doing",
          ja: "🔨 実践して学ぶ",
          zh: "🔨 通过实践学习",
          es: "🔨 Aprender haciendo"
        },
        emoji: "🔨"
      },
      {
        id: "reading",
        text: {
          ko: "📚 책/자료 읽기",
          en: "📚 Reading books/materials",
          ja: "📚 本/資料を読む",
          zh: "📚 阅读书籍/资料",
          es: "📚 Leer libros/materiales"
        },
        emoji: "📚"
      },
      {
        id: "discuss",
        text: {
          ko: "💬 토론하며 배우기",
          en: "💬 Learning through discussion",
          ja: "💬 議論しながら学ぶ",
          zh: "💬 通过讨论学习",
          es: "💬 Aprender a través de la discusión"
        },
        emoji: "💬"
      }
    ],
    resultTypes: {
      visual: { type: "visual-learner", trait: "시각적", traitEn: "Visual" },
      practice: { type: "kinesthetic", trait: "실천적", traitEn: "Practical" },
      reading: { type: "theoretical", trait: "이론적", traitEn: "Theoretical" },
      discuss: { type: "social-learner", trait: "사회적", traitEn: "Social" }
    }
  },
  // Day 14
  {
    id: "day-014",
    date: "2026-02-03",
    question: {
      ko: "요리할 때 당신은?",
      en: "When cooking, you?",
      ja: "料理するとき、あなたは？",
      zh: "做饭时你会？",
      es: "¿Cómo cocinas?"
    },
    options: [
      {
        id: "recipe",
        text: {
          ko: "📖 레시피 정확히 따라하기",
          en: "📖 Follow recipe exactly",
          ja: "📖 レシピ通りに作る",
          zh: "📖 严格按照食谱",
          es: "📖 Seguir la receta exactamente"
        },
        emoji: "📖"
      },
      {
        id: "creative",
        text: {
          ko: "🎨 나만의 방식으로 변형",
          en: "🎨 Add my own twist",
          ja: "🎨 自分なりにアレンジ",
          zh: "🎨 加入自己的创意",
          es: "🎨 Añadir mi toque personal"
        },
        emoji: "🎨"
      },
      {
        id: "simple",
        text: {
          ko: "🍳 간단하게 대충",
          en: "🍳 Keep it simple",
          ja: "🍳 簡単に適当に",
          zh: "🍳 简单随意",
          es: "🍳 Mantenerlo simple"
        },
        emoji: "🍳"
      },
      {
        id: "order",
        text: {
          ko: "📱 배달이 최고!",
          en: "📱 Delivery is the best!",
          ja: "📱 デリバリーが最高！",
          zh: "📱 外卖最棒！",
          es: "📱 ¡La entrega es lo mejor!"
        },
        emoji: "📱"
      }
    ],
    resultTypes: {
      recipe: { type: "perfectionist", trait: "완벽주의", traitEn: "Perfectionist" },
      creative: { type: "innovator", trait: "혁신적", traitEn: "Innovative" },
      simple: { type: "pragmatist", trait: "실용적", traitEn: "Pragmatic" },
      order: { type: "efficiency-lover", trait: "효율추구", traitEn: "Efficiency-seeking" }
    }
  },
  // Day 15
  {
    id: "day-015",
    date: "2026-02-04",
    question: {
      ko: "SNS 사용 스타일은?",
      en: "What's your social media style?",
      ja: "SNSの使い方は？",
      zh: "你的社交媒体使用风格是？",
      es: "¿Cuál es tu estilo en redes sociales?"
    },
    options: [
      {
        id: "active",
        text: {
          ko: "📸 적극적으로 포스팅",
          en: "📸 Actively posting",
          ja: "📸 積極的に投稿",
          zh: "📸 积极发布内容",
          es: "📸 Publicar activamente"
        },
        emoji: "📸"
      },
      {
        id: "lurker",
        text: {
          ko: "👀 보기만 하는 편",
          en: "👀 Just watching",
          ja: "👀 見る専門",
          zh: "👀 只看不发",
          es: "👀 Solo mirar"
        },
        emoji: "👀"
      },
      {
        id: "selective",
        text: {
          ko: "✨ 가끔 특별한 순간만",
          en: "✨ Only special moments",
          ja: "✨ 特別な瞬間だけ",
          zh: "✨ 只发特别的时刻",
          es: "✨ Solo momentos especiales"
        },
        emoji: "✨"
      },
      {
        id: "minimal",
        text: {
          ko: "🚫 거의 안 함",
          en: "🚫 Rarely use it",
          ja: "🚫 ほとんど使わない",
          zh: "🚫 几乎不用",
          es: "🚫 Casi no lo uso"
        },
        emoji: "🚫"
      }
    ],
    resultTypes: {
      active: { type: "influencer", trait: "표현력", traitEn: "Expressive" },
      lurker: { type: "observer", trait: "관찰자", traitEn: "Observer" },
      selective: { type: "curator", trait: "선별적", traitEn: "Selective" },
      minimal: { type: "private-person", trait: "프라이버시중시", traitEn: "Privacy-focused" }
    }
  },
  // Day 16
  {
    id: "day-016",
    date: "2026-02-05",
    question: {
      ko: "가장 좋아하는 계절은?",
      en: "What's your favorite season?",
      ja: "一番好きな季節は？",
      zh: "你最喜欢的季节是？",
      es: "¿Cuál es tu estación favorita?"
    },
    options: [
      { id: "spring", text: { ko: "🌸 봄 - 새로운 시작", en: "🌸 Spring - New beginnings", ja: "🌸 春 - 新しい始まり", zh: "🌸 春天 - 新的开始", es: "🌸 Primavera - Nuevos comienzos" }, emoji: "🌸" },
      { id: "summer", text: { ko: "☀️ 여름 - 뜨거운 열정", en: "☀️ Summer - Hot passion", ja: "☀️ 夏 - 熱い情熱", zh: "☀️ 夏天 - 热情似火", es: "☀️ Verano - Pasión ardiente" }, emoji: "☀️" },
      { id: "autumn", text: { ko: "🍂 가을 - 풍요로운 결실", en: "🍂 Autumn - Abundant harvest", ja: "🍂 秋 - 豊かな実り", zh: "🍂 秋天 - 丰收的季节", es: "🍂 Otoño - Cosecha abundante" }, emoji: "🍂" },
      { id: "winter", text: { ko: "❄️ 겨울 - 고요한 휴식", en: "❄️ Winter - Quiet rest", ja: "❄️ 冬 - 静かな休息", zh: "❄️ 冬天 - 宁静的休息", es: "❄️ Invierno - Descanso tranquilo" }, emoji: "❄️" }
    ],
    resultTypes: {
      spring: { type: "optimist", trait: "희망적", traitEn: "Hopeful" },
      summer: { type: "energetic", trait: "에너지넘침", traitEn: "Energetic" },
      autumn: { type: "mature", trait: "성숙함", traitEn: "Mature" },
      winter: { type: "reflective", trait: "성찰적", traitEn: "Reflective" }
    }
  },
  // Day 17
  {
    id: "day-017",
    date: "2026-02-06",
    question: {
      ko: "약속 시간에 늦을 것 같을 때?",
      en: "When you might be late for an appointment?",
      ja: "約束の時間に遅れそうなとき？",
      zh: "可能要迟到时你会？",
      es: "¿Cuando podrías llegar tarde a una cita?"
    },
    options: [
      { id: "panic", text: { ko: "😰 엄청 스트레스 받음", en: "😰 Get very stressed", ja: "😰 とてもストレスを感じる", zh: "😰 非常焦虑", es: "😰 Me estreso mucho" }, emoji: "😰" },
      { id: "contact", text: { ko: "📱 미리 연락하고 천천히", en: "📱 Contact in advance and take it slow", ja: "📱 事前に連絡してゆっくり", zh: "📱 提前联系然后慢慢来", es: "📱 Contactar antes y tomármelo con calma" }, emoji: "📱" },
      { id: "rush", text: { ko: "🏃 어떻게든 맞춰 도착!", en: "🏃 Arrive on time somehow!", ja: "🏃 なんとか間に合わせる！", zh: "🏃 想办法准时到达！", es: "🏃 ¡Llegar a tiempo de alguna manera!" }, emoji: "🏃" },
      { id: "calm", text: { ko: "😌 늦으면 늦는 거지", en: "😌 If I'm late, I'm late", ja: "😌 遅れたら遅れたで", zh: "😌 迟到就迟到吧", es: "😌 Si llego tarde, llego tarde" }, emoji: "😌" }
    ],
    resultTypes: {
      panic: { type: "perfectionist", trait: "완벽주의", traitEn: "Perfectionist" },
      contact: { type: "considerate", trait: "배려심", traitEn: "Considerate" },
      rush: { type: "determined", trait: "의지력", traitEn: "Determined" },
      calm: { type: "easy-going", trait: "여유로움", traitEn: "Easy-going" }
    }
  },
  // Day 18
  {
    id: "day-018",
    date: "2026-02-07",
    question: {
      ko: "갈등이 생겼을 때 당신은?",
      en: "When conflict arises, you?",
      ja: "衝突が起きたとき、あなたは？",
      zh: "发生冲突时你会？",
      es: "¿Cuando surge un conflicto, tú?"
    },
    options: [
      { id: "confront", text: { ko: "🗣️ 바로 대화로 해결", en: "🗣️ Resolve through direct conversation", ja: "🗣️ すぐ話し合いで解決", zh: "🗣️ 直接对话解决", es: "🗣️ Resolver mediante conversación directa" }, emoji: "🗣️" },
      { id: "avoid", text: { ko: "🚶 일단 피하고 본다", en: "🚶 Avoid it first", ja: "🚶 とりあえず避ける", zh: "🚶 先回避", es: "🚶 Evitarlo primero" }, emoji: "🚶" },
      { id: "compromise", text: { ko: "🤝 중간점을 찾는다", en: "🤝 Find a middle ground", ja: "🤝 妥協点を探す", zh: "🤝 寻找中间立场", es: "🤝 Encontrar un punto medio" }, emoji: "🤝" },
      { id: "yield", text: { ko: "🙏 내가 양보한다", en: "🙏 I give in", ja: "🙏 私が譲る", zh: "🙏 我让步", es: "🙏 Yo cedo" }, emoji: "🙏" }
    ],
    resultTypes: {
      confront: { type: "direct", trait: "직접적", traitEn: "Direct" },
      avoid: { type: "peace-keeper", trait: "평화추구", traitEn: "Peace-seeking" },
      compromise: { type: "diplomat", trait: "외교적", traitEn: "Diplomatic" },
      yield: { type: "harmonious", trait: "조화로움", traitEn: "Harmonious" }
    }
  },
  // Day 19
  {
    id: "day-019",
    date: "2026-02-08",
    question: {
      ko: "집에서 가장 좋아하는 활동은?",
      en: "What's your favorite activity at home?",
      ja: "家で一番好きな活動は？",
      zh: "在家最喜欢的活动是？",
      es: "¿Tu actividad favorita en casa?"
    },
    options: [
      { id: "media", text: { ko: "📺 영상/드라마 보기", en: "📺 Watching videos/dramas", ja: "📺 動画/ドラマを見る", zh: "📺 看视频/电视剧", es: "📺 Ver videos/dramas" }, emoji: "📺" },
      { id: "game", text: { ko: "🎮 게임하기", en: "🎮 Playing games", ja: "🎮 ゲームをする", zh: "🎮 玩游戏", es: "🎮 Jugar videojuegos" }, emoji: "🎮" },
      { id: "read", text: { ko: "📚 책/웹툰 읽기", en: "📚 Reading books/webtoons", ja: "📚 本/ウェブトゥーン読む", zh: "📚 看书/网漫", es: "📚 Leer libros/webtoons" }, emoji: "📚" },
      { id: "create", text: { ko: "🎨 창작 활동", en: "🎨 Creative activities", ja: "🎨 創作活動", zh: "🎨 创作活动", es: "🎨 Actividades creativas" }, emoji: "🎨" }
    ],
    resultTypes: {
      media: { type: "relaxer", trait: "휴식추구", traitEn: "Relaxation-seeking" },
      game: { type: "competitor", trait: "경쟁심", traitEn: "Competitive" },
      read: { type: "intellectual", trait: "지적", traitEn: "Intellectual" },
      create: { type: "creator", trait: "창작자", traitEn: "Creator" }
    }
  },
  // Day 20
  {
    id: "day-020",
    date: "2026-02-09",
    question: {
      ko: "당신의 운동 스타일은?",
      en: "What's your exercise style?",
      ja: "あなたの運動スタイルは？",
      zh: "你的运动风格是？",
      es: "¿Cuál es tu estilo de ejercicio?"
    },
    options: [
      { id: "team", text: { ko: "⚽ 팀 스포츠", en: "⚽ Team sports", ja: "⚽ チームスポーツ", zh: "⚽ 团队运动", es: "⚽ Deportes de equipo" }, emoji: "⚽" },
      { id: "solo", text: { ko: "🏃 혼자 운동", en: "🏃 Solo exercise", ja: "🏃 一人で運動", zh: "🏃 独自运动", es: "🏃 Ejercicio en solitario" }, emoji: "🏃" },
      { id: "class", text: { ko: "🧘 수업/그룹 운동", en: "🧘 Class/group exercise", ja: "🧘 クラス/グループ運動", zh: "🧘 课程/团体运动", es: "🧘 Clases/ejercicio en grupo" }, emoji: "🧘" },
      { id: "none", text: { ko: "🛋️ 운동은 내 스타일 아님", en: "🛋️ Exercise isn't my style", ja: "🛋️ 運動は苦手", zh: "🛋️ 运动不是我的风格", es: "🛋️ El ejercicio no es mi estilo" }, emoji: "🛋️" }
    ],
    resultTypes: {
      team: { type: "team-player", trait: "협동적", traitEn: "Cooperative" },
      solo: { type: "independent", trait: "독립적", traitEn: "Independent" },
      class: { type: "social-exerciser", trait: "사교적", traitEn: "Social" },
      none: { type: "comfort-seeker", trait: "편안함추구", traitEn: "Comfort-seeking" }
    }
  },
  // Day 21
  {
    id: "day-021",
    date: "2026-02-10",
    question: {
      ko: "선물을 받을 때 가장 좋은 것은?",
      en: "What's the best gift to receive?",
      ja: "もらって一番嬉しいプレゼントは？",
      zh: "收到什么礼物最开心？",
      es: "¿Cuál es el mejor regalo que puedes recibir?"
    },
    options: [
      { id: "practical", text: { ko: "🎁 실용적인 물건", en: "🎁 Practical items", ja: "🎁 実用的な物", zh: "🎁 实用的东西", es: "🎁 Cosas prácticas" }, emoji: "🎁" },
      { id: "experience", text: { ko: "🎫 경험/체험권", en: "🎫 Experience/tickets", ja: "🎫 体験/チケット", zh: "🎫 体验/门票", es: "🎫 Experiencias/entradas" }, emoji: "🎫" },
      { id: "money", text: { ko: "💵 현금/상품권", en: "💵 Cash/gift cards", ja: "💵 現金/商品券", zh: "💵 现金/礼品卡", es: "💵 Efectivo/tarjetas regalo" }, emoji: "💵" },
      { id: "heartfelt", text: { ko: "💝 정성이 담긴 것", en: "💝 Something heartfelt", ja: "💝 心のこもったもの", zh: "💝 用心准备的", es: "💝 Algo con cariño" }, emoji: "💝" }
    ],
    resultTypes: {
      practical: { type: "pragmatist", trait: "실용적", traitEn: "Practical" },
      experience: { type: "experiencer", trait: "경험추구", traitEn: "Experience-seeking" },
      money: { type: "freedom-lover", trait: "자유추구", traitEn: "Freedom-loving" },
      heartfelt: { type: "sentimental", trait: "감성적", traitEn: "Sentimental" }
    }
  },
  // Day 22
  {
    id: "day-022",
    date: "2026-02-11",
    question: {
      ko: "실수했을 때 당신의 반응은?",
      en: "How do you react when you make a mistake?",
      ja: "失敗したときの反応は？",
      zh: "犯错时你的反应是？",
      es: "¿Cómo reaccionas cuando cometes un error?"
    },
    options: [
      { id: "fix", text: { ko: "🔧 바로 고치려고 한다", en: "🔧 Try to fix it immediately", ja: "🔧 すぐに直そうとする", zh: "🔧 立即尝试修复", es: "🔧 Intento arreglarlo inmediatamente" }, emoji: "🔧" },
      { id: "analyze", text: { ko: "🔍 원인을 분석한다", en: "🔍 Analyze the cause", ja: "🔍 原因を分析する", zh: "🔍 分析原因", es: "🔍 Analizar la causa" }, emoji: "🔍" },
      { id: "accept", text: { ko: "🤷 실수는 누구나 한다", en: "🤷 Everyone makes mistakes", ja: "🤷 誰でも失敗する", zh: "🤷 谁都会犯错", es: "🤷 Todos cometemos errores" }, emoji: "🤷" },
      { id: "regret", text: { ko: "😔 계속 생각난다", en: "😔 Keep thinking about it", ja: "😔 ずっと気になる", zh: "😔 一直在想", es: "😔 Sigo pensando en ello" }, emoji: "😔" }
    ],
    resultTypes: {
      fix: { type: "action-oriented", trait: "행동지향", traitEn: "Action-oriented" },
      analyze: { type: "analytical", trait: "분석적", traitEn: "Analytical" },
      accept: { type: "resilient", trait: "회복탄력성", traitEn: "Resilient" },
      regret: { type: "reflective", trait: "성찰적", traitEn: "Reflective" }
    }
  },
  // Day 23
  {
    id: "day-023",
    date: "2026-02-12",
    question: {
      ko: "이상적인 직장 환경은?",
      en: "What's your ideal work environment?",
      ja: "理想の職場環境は？",
      zh: "你理想的工作环境是？",
      es: "¿Cuál es tu ambiente de trabajo ideal?"
    },
    options: [
      { id: "startup", text: { ko: "🚀 역동적인 스타트업", en: "🚀 Dynamic startup", ja: "🚀 ダイナミックなスタートアップ", zh: "🚀 充满活力的创业公司", es: "🚀 Startup dinámica" }, emoji: "🚀" },
      { id: "corporate", text: { ko: "🏢 안정적인 대기업", en: "🏢 Stable corporation", ja: "🏢 安定した大企業", zh: "🏢 稳定的大公司", es: "🏢 Corporación estable" }, emoji: "🏢" },
      { id: "remote", text: { ko: "🏠 자유로운 재택근무", en: "🏠 Free remote work", ja: "🏠 自由なリモートワーク", zh: "🏠 自由的远程工作", es: "🏠 Trabajo remoto libre" }, emoji: "🏠" },
      { id: "freelance", text: { ko: "💼 독립적인 프리랜서", en: "💼 Independent freelancer", ja: "💼 独立したフリーランサー", zh: "💼 独立的自由职业", es: "💼 Freelancer independiente" }, emoji: "💼" }
    ],
    resultTypes: {
      startup: { type: "risk-taker", trait: "도전적", traitEn: "Challenging" },
      corporate: { type: "stability-seeker", trait: "안정추구", traitEn: "Stability-seeking" },
      remote: { type: "flexible", trait: "유연함", traitEn: "Flexible" },
      freelance: { type: "autonomous", trait: "자율적", traitEn: "Autonomous" }
    }
  },
  // Day 24
  {
    id: "day-024",
    date: "2026-02-13",
    question: {
      ko: "당신이 가장 자랑스러워하는 것은?",
      en: "What are you most proud of?",
      ja: "あなたが最も誇りに思うことは？",
      zh: "你最引以为豪的是什么？",
      es: "¿De qué estás más orgulloso?"
    },
    options: [
      { id: "achievement", text: { ko: "🏆 달성한 성과", en: "🏆 Achievements", ja: "🏆 達成した成果", zh: "🏆 取得的成就", es: "🏆 Logros alcanzados" }, emoji: "🏆" },
      { id: "relationship", text: { ko: "❤️ 인간관계", en: "❤️ Relationships", ja: "❤️ 人間関係", zh: "❤️ 人际关系", es: "❤️ Relaciones" }, emoji: "❤️" },
      { id: "growth", text: { ko: "🌱 개인적 성장", en: "🌱 Personal growth", ja: "🌱 個人的な成長", zh: "🌱 个人成长", es: "🌱 Crecimiento personal" }, emoji: "🌱" },
      { id: "values", text: { ko: "⭐ 지켜온 가치관", en: "⭐ Values I've upheld", ja: "⭐ 守ってきた価値観", zh: "⭐ 坚守的价值观", es: "⭐ Valores que he mantenido" }, emoji: "⭐" }
    ],
    resultTypes: {
      achievement: { type: "achiever", trait: "성취지향", traitEn: "Achievement-oriented" },
      relationship: { type: "connector", trait: "관계중심", traitEn: "Relationship-oriented" },
      growth: { type: "grower", trait: "성장지향", traitEn: "Growth-oriented" },
      values: { type: "principled", trait: "원칙적", traitEn: "Principled" }
    }
  },
  // Day 25
  {
    id: "day-025",
    date: "2026-02-14",
    question: {
      ko: "발렌타인데이! 당신의 사랑 표현 방식은?",
      en: "Valentine's Day! How do you express love?",
      ja: "バレンタインデー！愛の表現方法は？",
      zh: "情人节！你如何表达爱意？",
      es: "¡San Valentín! ¿Cómo expresas el amor?"
    },
    options: [
      { id: "words", text: { ko: "💬 말로 직접 표현", en: "💬 Express with words", ja: "💬 言葉で直接表現", zh: "💬 用言语直接表达", es: "💬 Expresar con palabras" }, emoji: "💬" },
      { id: "actions", text: { ko: "🤲 행동으로 보여주기", en: "🤲 Show through actions", ja: "🤲 行動で示す", zh: "🤲 用行动表现", es: "🤲 Mostrar con acciones" }, emoji: "🤲" },
      { id: "gifts", text: { ko: "🎁 선물로 마음 전달", en: "🎁 Give gifts", ja: "🎁 プレゼントで気持ちを伝える", zh: "🎁 用礼物传达心意", es: "🎁 Dar regalos" }, emoji: "🎁" },
      { id: "time", text: { ko: "⏰ 함께하는 시간", en: "⏰ Quality time together", ja: "⏰ 一緒に過ごす時間", zh: "⏰ 在一起的时光", es: "⏰ Tiempo de calidad juntos" }, emoji: "⏰" }
    ],
    resultTypes: {
      words: { type: "communicator", trait: "표현력", traitEn: "Expressive" },
      actions: { type: "doer", trait: "실천적", traitEn: "Action-oriented" },
      gifts: { type: "giver", trait: "관대함", traitEn: "Generous" },
      time: { type: "present", trait: "현재중심", traitEn: "Present-focused" }
    }
  },
  // Day 26
  {
    id: "day-026",
    date: "2026-02-15",
    question: {
      ko: "새로운 기술/트렌드에 대한 당신의 태도는?",
      en: "Your attitude toward new tech/trends?",
      ja: "新しい技術/トレンドに対する態度は？",
      zh: "你对新技术/趋势的态度是？",
      es: "¿Tu actitud hacia nuevas tecnologías/tendencias?"
    },
    options: [
      { id: "early", text: { ko: "🚀 빨리 시도해본다", en: "🚀 Try it early", ja: "🚀 早く試してみる", zh: "🚀 尽早尝试", es: "🚀 Probarlo pronto" }, emoji: "🚀" },
      { id: "watch", text: { ko: "👀 지켜보다가 도입", en: "👀 Watch then adopt", ja: "👀 様子を見てから導入", zh: "👀 观望后再采用", es: "👀 Observar y luego adoptar" }, emoji: "👀" },
      { id: "skeptic", text: { ko: "🤔 필요할 때만", en: "🤔 Only when needed", ja: "🤔 必要な時だけ", zh: "🤔 只在需要时", es: "🤔 Solo cuando sea necesario" }, emoji: "🤔" },
      { id: "traditional", text: { ko: "🏛️ 익숙한 게 좋다", en: "🏛️ Prefer what's familiar", ja: "🏛️ 慣れたものがいい", zh: "🏛️ 喜欢熟悉的", es: "🏛️ Prefiero lo familiar" }, emoji: "🏛️" }
    ],
    resultTypes: {
      early: { type: "early-adopter", trait: "혁신적", traitEn: "Innovative" },
      watch: { type: "pragmatic", trait: "실용적", traitEn: "Pragmatic" },
      skeptic: { type: "cautious", trait: "신중함", traitEn: "Cautious" },
      traditional: { type: "traditionalist", trait: "전통적", traitEn: "Traditional" }
    }
  },
  // Day 27
  {
    id: "day-027",
    date: "2026-02-16",
    question: {
      ko: "당신의 옷장 스타일은?",
      en: "What's your closet style?",
      ja: "あなたのクローゼットスタイルは？",
      zh: "你的衣柜风格是？",
      es: "¿Cuál es el estilo de tu armario?"
    },
    options: [
      { id: "minimal", text: { ko: "🤍 미니멀 - 적지만 질 좋은", en: "🤍 Minimal - few but quality", ja: "🤍 ミニマル - 少ないが質の良い", zh: "🤍 极简 - 少而精", es: "🤍 Minimalista - poco pero de calidad" }, emoji: "🤍" },
      { id: "trendy", text: { ko: "✨ 트렌디 - 최신 유행", en: "✨ Trendy - latest fashion", ja: "✨ トレンディ - 最新流行", zh: "✨ 时尚 - 最新潮流", es: "✨ A la moda - última tendencia" }, emoji: "✨" },
      { id: "comfort", text: { ko: "👕 편안함이 최고", en: "👕 Comfort is best", ja: "👕 快適さが一番", zh: "👕 舒适最重要", es: "👕 La comodidad es lo mejor" }, emoji: "👕" },
      { id: "unique", text: { ko: "🎨 나만의 독특한 스타일", en: "🎨 My unique style", ja: "🎨 自分だけのユニークなスタイル", zh: "🎨 我独特的风格", es: "🎨 Mi estilo único" }, emoji: "🎨" }
    ],
    resultTypes: {
      minimal: { type: "minimalist", trait: "간결함", traitEn: "Minimalist" },
      trendy: { type: "fashionista", trait: "트렌드추구", traitEn: "Trend-following" },
      comfort: { type: "comfort-first", trait: "편안함중시", traitEn: "Comfort-first" },
      unique: { type: "individualist", trait: "개성적", traitEn: "Individualistic" }
    }
  },
  // Day 28
  {
    id: "day-028",
    date: "2026-02-17",
    question: {
      ko: "어떤 음악을 주로 듣나요?",
      en: "What kind of music do you listen to?",
      ja: "どんな音楽をよく聴きますか？",
      zh: "你主要听什么类型的音乐？",
      es: "¿Qué tipo de música escuchas?"
    },
    options: [
      { id: "pop", text: { ko: "🎤 팝/댄스", en: "🎤 Pop/Dance", ja: "🎤 ポップ/ダンス", zh: "🎤 流行/舞曲", es: "🎤 Pop/Dance" }, emoji: "🎤" },
      { id: "ballad", text: { ko: "🎹 발라드/감성", en: "🎹 Ballad/Emotional", ja: "🎹 バラード/感性", zh: "🎹 抒情/感性", es: "🎹 Balada/Emocional" }, emoji: "🎹" },
      { id: "hiphop", text: { ko: "🎧 힙합/R&B", en: "🎧 Hip-hop/R&B", ja: "🎧 ヒップホップ/R&B", zh: "🎧 嘻哈/R&B", es: "🎧 Hip-hop/R&B" }, emoji: "🎧" },
      { id: "indie", text: { ko: "🎸 인디/락", en: "🎸 Indie/Rock", ja: "🎸 インディー/ロック", zh: "🎸 独立/摇滚", es: "🎸 Indie/Rock" }, emoji: "🎸" }
    ],
    resultTypes: {
      pop: { type: "mainstream", trait: "대중적", traitEn: "Mainstream" },
      ballad: { type: "emotional", trait: "감성적", traitEn: "Emotional" },
      hiphop: { type: "trendy", trait: "힙함", traitEn: "Hip" },
      indie: { type: "alternative", trait: "개성적", traitEn: "Alternative" }
    }
  },
  // Day 29
  {
    id: "day-029",
    date: "2026-02-18",
    question: {
      ko: "당신의 아침 루틴은?",
      en: "What's your morning routine?",
      ja: "あなたの朝のルーティンは？",
      zh: "你的早晨日程是？",
      es: "¿Cuál es tu rutina matutina?"
    },
    options: [
      { id: "structured", text: { ko: "📋 정해진 루틴 실행", en: "📋 Follow structured routine", ja: "📋 決まったルーティンを実行", zh: "📋 按固定流程进行", es: "📋 Seguir rutina estructurada" }, emoji: "📋" },
      { id: "flexible", text: { ko: "🌊 그때그때 다름", en: "🌊 It varies", ja: "🌊 その時々で違う", zh: "🌊 随时变化", es: "🌊 Varía" }, emoji: "🌊" },
      { id: "rushed", text: { ko: "⏰ 항상 시간에 쫓김", en: "⏰ Always rushed", ja: "⏰ いつも時間に追われる", zh: "⏰ 总是很赶", es: "⏰ Siempre con prisa" }, emoji: "⏰" },
      { id: "slow", text: { ko: "☕ 여유롭게 천천히", en: "☕ Slow and leisurely", ja: "☕ ゆっくりと", zh: "☕ 悠闲缓慢", es: "☕ Lento y tranquilo" }, emoji: "☕" }
    ],
    resultTypes: {
      structured: { type: "disciplined", trait: "규율적", traitEn: "Disciplined" },
      flexible: { type: "adaptable", trait: "적응력", traitEn: "Adaptable" },
      rushed: { type: "busy-bee", trait: "바쁜", traitEn: "Busy" },
      slow: { type: "mindful", trait: "마음챙김", traitEn: "Mindful" }
    }
  },
  // Day 30
  {
    id: "day-030",
    date: "2026-02-19",
    question: {
      ko: "인생에서 가장 중요한 것은?",
      en: "What's most important in life?",
      ja: "人生で最も大切なことは？",
      zh: "人生中最重要的是什么？",
      es: "¿Qué es lo más importante en la vida?"
    },
    options: [
      { id: "happiness", text: { ko: "😊 행복", en: "😊 Happiness", ja: "😊 幸福", zh: "😊 幸福", es: "😊 Felicidad" }, emoji: "😊" },
      { id: "success", text: { ko: "🏆 성공", en: "🏆 Success", ja: "🏆 成功", zh: "🏆 成功", es: "🏆 Éxito" }, emoji: "🏆" },
      { id: "love", text: { ko: "❤️ 사랑", en: "❤️ Love", ja: "❤️ 愛", zh: "❤️ 爱", es: "❤️ Amor" }, emoji: "❤️" },
      { id: "freedom", text: { ko: "🕊️ 자유", en: "🕊️ Freedom", ja: "🕊️ 自由", zh: "🕊️ 自由", es: "🕊️ Libertad" }, emoji: "🕊️" }
    ],
    resultTypes: {
      happiness: { type: "hedonist", trait: "행복추구", traitEn: "Happiness-seeking" },
      success: { type: "ambitious", trait: "야심적", traitEn: "Ambitious" },
      love: { type: "romantic", trait: "사랑중심", traitEn: "Love-centered" },
      freedom: { type: "free-spirit", trait: "자유로움", traitEn: "Free-spirited" }
    }
  },
  // Day 31
  {
    id: "day-031",
    date: "2026-02-20",
    question: {
      ko: "당신의 쇼핑 스타일은?",
      en: "What's your shopping style?",
      ja: "あなたの買い物スタイルは？",
      zh: "你的购物风格是？",
      es: "¿Cuál es tu estilo de compras?"
    },
    options: [
      { id: "research", text: { ko: "🔍 꼼꼼히 비교 후 구매", en: "🔍 Research then buy", ja: "🔍 しっかり比較してから購入", zh: "🔍 仔细比较后购买", es: "🔍 Investigar y luego comprar" }, emoji: "🔍" },
      { id: "impulse", text: { ko: "💫 직감적 구매", en: "💫 Impulse buy", ja: "💫 直感で購入", zh: "💫 凭直觉购买", es: "💫 Compra impulsiva" }, emoji: "💫" },
      { id: "deal", text: { ko: "🏷️ 할인/세일만!", en: "🏷️ Sales only!", ja: "🏷️ セールだけ！", zh: "🏷️ 只买打折的！", es: "🏷️ ¡Solo ofertas!" }, emoji: "🏷️" },
      { id: "quality", text: { ko: "💎 가격보다 품질", en: "💎 Quality over price", ja: "💎 価格より品質", zh: "💎 质量胜过价格", es: "💎 Calidad sobre precio" }, emoji: "💎" }
    ],
    resultTypes: {
      research: { type: "researcher", trait: "분석적", traitEn: "Analytical" },
      impulse: { type: "spontaneous", trait: "즉흥적", traitEn: "Spontaneous" },
      deal: { type: "saver", trait: "절약형", traitEn: "Frugal" },
      quality: { type: "quality-seeker", trait: "품질추구", traitEn: "Quality-seeking" }
    }
  }
];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DAILY_QUESTIONS };
}
