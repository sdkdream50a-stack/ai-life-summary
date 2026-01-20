/**
 * AI Compatibility Test - Core Algorithm
 * Calculates romantic compatibility based on birth dates
 * DETERMINISTIC: Same inputs always produce same results
 */

// ============================================
// ZODIAC DATA
// ============================================

const ZODIAC_SIGNS = [
    { name: 'Capricorn', element: 'Earth', start: [12, 22], end: [1, 19] },
    { name: 'Aquarius', element: 'Air', start: [1, 20], end: [2, 18] },
    { name: 'Pisces', element: 'Water', start: [2, 19], end: [3, 20] },
    { name: 'Aries', element: 'Fire', start: [3, 21], end: [4, 19] },
    { name: 'Taurus', element: 'Earth', start: [4, 20], end: [5, 20] },
    { name: 'Gemini', element: 'Air', start: [5, 21], end: [6, 20] },
    { name: 'Cancer', element: 'Water', start: [6, 21], end: [7, 22] },
    { name: 'Leo', element: 'Fire', start: [7, 23], end: [8, 22] },
    { name: 'Virgo', element: 'Earth', start: [8, 23], end: [9, 22] },
    { name: 'Libra', element: 'Air', start: [9, 23], end: [10, 22] },
    { name: 'Scorpio', element: 'Water', start: [10, 23], end: [11, 21] },
    { name: 'Sagittarius', element: 'Fire', start: [11, 22], end: [12, 21] }
];

// Element compatibility matrix (0-100 base score)
const ELEMENT_COMPATIBILITY = {
    'Fire-Fire': 85,
    'Fire-Earth': 55,
    'Fire-Air': 90,
    'Fire-Water': 50,
    'Earth-Earth': 80,
    'Earth-Air': 60,
    'Earth-Water': 85,
    'Air-Air': 85,
    'Air-Water': 60,
    'Water-Water': 90
};

// ============================================
// DETERMINISTIC HASH FUNCTION
// ============================================

/**
 * Create a deterministic hash from two birthdays
 * Order-independent: A+B gives same result as B+A
 */
function hashBirthdays(birthdayA, birthdayB) {
    // Create sortable date strings
    const dateA = `${birthdayA.year}${String(birthdayA.month).padStart(2, '0')}${String(birthdayA.day).padStart(2, '0')}`;
    const dateB = `${birthdayB.year}${String(birthdayB.month).padStart(2, '0')}${String(birthdayB.day).padStart(2, '0')}`;

    // Sort to ensure order independence
    const sorted = [dateA, dateB].sort();
    const combined = sorted[0] + sorted[1];

    // Simple hash function (djb2 algorithm)
    let hash = 5381;
    for (let i = 0; i < combined.length; i++) {
        hash = ((hash << 5) + hash) + combined.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
    }

    return Math.abs(hash);
}

/**
 * Seeded random number generator (deterministic)
 */
function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

/**
 * Get deterministic random in range based on seed and category
 */
function getSeededValue(seed, category, min, max) {
    const categoryHash = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const combinedSeed = seed + categoryHash;
    const random = seededRandom(combinedSeed);
    return Math.floor(min + random * (max - min + 1));
}

// ============================================
// ZODIAC FUNCTIONS
// ============================================

/**
 * Get zodiac sign from birthday
 */
function getZodiacSign(month, day) {
    for (const sign of ZODIAC_SIGNS) {
        const [startMonth, startDay] = sign.start;
        const [endMonth, endDay] = sign.end;

        if (startMonth > endMonth) {
            // Capricorn case (Dec-Jan)
            if ((month === startMonth && day >= startDay) ||
                (month === endMonth && day <= endDay)) {
                return sign;
            }
        } else {
            if ((month === startMonth && day >= startDay) ||
                (month === endMonth && day <= endDay) ||
                (month > startMonth && month < endMonth)) {
                return sign;
            }
        }
    }
    return ZODIAC_SIGNS[0]; // Default to Capricorn
}

/**
 * Get element compatibility base score
 */
function getElementCompatibility(elementA, elementB) {
    const key = [elementA, elementB].sort().join('-');
    return ELEMENT_COMPATIBILITY[key] || 70;
}

// ============================================
// MAIN COMPATIBILITY CALCULATION
// ============================================

/**
 * Calculate full compatibility analysis
 * @param {Object} personA - { name, year, month, day }
 * @param {Object} personB - { name, year, month, day }
 * @returns {Object} Full compatibility results
 */
function calculateCompatibility(personA, personB) {
    // Get zodiac signs
    const zodiacA = getZodiacSign(personA.month, personA.day);
    const zodiacB = getZodiacSign(personB.month, personB.day);

    // Create deterministic seed
    const seed = hashBirthdays(personA, personB);

    // Get element base compatibility
    const elementBase = getElementCompatibility(zodiacA.element, zodiacB.element);

    // Calculate category scores
    const categories = {
        communication: calculateCategoryScore(seed, 'communication', elementBase, personA, personB),
        values: calculateCategoryScore(seed, 'values', elementBase, personA, personB),
        energy: calculateCategoryScore(seed, 'energy', elementBase, personA, personB),
        emotional: calculateCategoryScore(seed, 'emotional', elementBase, personA, personB),
        growth: calculateCategoryScore(seed, 'growth', elementBase, personA, personB)
    };

    // Calculate overall score (weighted average)
    const weights = {
        communication: 0.20,
        values: 0.25,
        energy: 0.15,
        emotional: 0.25,
        growth: 0.15
    };

    const overallScore = Math.round(
        categories.communication * weights.communication +
        categories.values * weights.values +
        categories.energy * weights.energy +
        categories.emotional * weights.emotional +
        categories.growth * weights.growth
    );

    // Get animal matching
    const animalA = getAnimalForPerson(zodiacA, seed, 0);
    const animalB = getAnimalForPerson(zodiacB, seed, 1);
    const animalCouple = getAnimalCouple(animalA, animalB);

    // Get enhanced relationship type with animal couple
    const relationshipType = getEnhancedRelationshipType(overallScore, animalCouple);

    return {
        personA: {
            name: personA.name || 'Person A',
            zodiac: zodiacA.name,
            element: zodiacA.element,
            birthday: `${personA.year}-${String(personA.month).padStart(2, '0')}-${String(personA.day).padStart(2, '0')}`,
            animal: animalA
        },
        personB: {
            name: personB.name || 'Person B',
            zodiac: zodiacB.name,
            element: zodiacB.element,
            birthday: `${personB.year}-${String(personB.month).padStart(2, '0')}-${String(personB.day).padStart(2, '0')}`,
            animal: animalB
        },
        overallScore,
        categories,
        relationshipType,
        animalCouple,
        elementCompatibility: elementBase,
        seed // For verification/debugging
    };
}

/**
 * Calculate individual category score
 */
function calculateCategoryScore(seed, category, baseScore, personA, personB) {
    // Base from element compatibility
    let score = baseScore;

    // Add deterministic variation based on category
    const variation = getSeededValue(seed, category, -15, 15);
    score += variation;

    // Age difference factor
    const ageA = new Date().getFullYear() - personA.year;
    const ageB = new Date().getFullYear() - personB.year;
    const ageDiff = Math.abs(ageA - ageB);

    // Different age impacts per category
    switch (category) {
        case 'communication':
            // Smaller age gap = better communication
            if (ageDiff <= 3) score += 5;
            else if (ageDiff >= 10) score -= 5;
            break;
        case 'values':
            // Similar generation = similar values
            if (ageDiff <= 5) score += 3;
            else if (ageDiff >= 15) score -= 8;
            break;
        case 'energy':
            // Similar age = similar energy
            if (ageDiff <= 2) score += 5;
            else if (ageDiff >= 10) score -= 3;
            break;
        case 'emotional':
            // Emotional connection less affected by age
            score += getSeededValue(seed, 'emotional_bonus', 0, 8);
            break;
        case 'growth':
            // Different ages can bring growth
            if (ageDiff >= 5 && ageDiff <= 12) score += 5;
            break;
    }

    // Birth month harmony bonus
    const monthDiff = Math.abs(personA.month - personB.month);
    if (monthDiff === 0 || monthDiff === 4 || monthDiff === 8) {
        score += 3; // Trine aspect bonus
    }

    // Ensure score is within bounds (60-98)
    score = Math.max(60, Math.min(98, score));

    return score;
}

// ============================================
// RELATIONSHIP TYPE CLASSIFICATION
// ============================================

/**
 * Get relationship type based on overall score
 */
function getRelationshipType(score) {
    if (score >= 90) {
        return {
            level: 'perfect',
            emoji: '💕',
            labels: {
                en: 'Perfect Soulmates',
                ko: '완벽한 소울메이트',
                ja: '完璧なソウルメイト',
                zh: '完美灵魂伴侣',
                es: 'Almas Gemelas Perfectas'
            }
        };
    } else if (score >= 80) {
        return {
            level: 'destined',
            emoji: '💖',
            labels: {
                en: 'Destined Match',
                ko: '천생연분',
                ja: '運命の相手',
                zh: '天生一对',
                es: 'Pareja Destinada'
            }
        };
    } else if (score >= 70) {
        return {
            level: 'great',
            emoji: '❤️',
            labels: {
                en: 'Great Match',
                ko: '좋은 궁합',
                ja: '素晴らしい相性',
                zh: '绝配',
                es: 'Gran Pareja'
            }
        };
    } else if (score >= 60) {
        return {
            level: 'good',
            emoji: '💛',
            labels: {
                en: 'Good Potential',
                ko: '괜찮은 관계',
                ja: '良い可能性',
                zh: '不错的潜力',
                es: 'Buen Potencial'
            }
        };
    } else if (score >= 50) {
        return {
            level: 'average',
            emoji: '🤍',
            labels: {
                en: 'Average Match',
                ko: '평범한 궁합',
                ja: '普通の相性',
                zh: '一般配对',
                es: 'Pareja Promedio'
            }
        };
    } else if (score >= 40) {
        return {
            level: 'effort',
            emoji: '🤔',
            labels: {
                en: 'Needs Effort',
                ko: '노력 필요',
                ja: '努力が必要',
                zh: '需要努力',
                es: 'Necesita Esfuerzo'
            }
        };
    } else {
        return {
            level: 'challenging',
            emoji: '😅',
            labels: {
                en: 'Challenging',
                ko: '도전적인 관계',
                ja: 'チャレンジング',
                zh: '充满挑战',
                es: 'Desafiante'
            }
        };
    }
}

// ============================================
// CATEGORY DESCRIPTIONS
// ============================================

const CATEGORY_DESCRIPTIONS = {
    communication: {
        en: {
            name: 'Communication',
            icon: '💬',
            high: 'You two have excellent communication skills together. Conversations flow naturally and you understand each other\'s unspoken words.',
            medium: 'Your communication is good with room for growth. Make an effort to listen actively and express feelings openly.',
            low: 'Communication may require extra effort. Practice patience and try different approaches to connect.'
        },
        ko: {
            name: '소통',
            icon: '💬',
            high: '두 분은 훌륭한 소통 능력을 가지고 있어요. 대화가 자연스럽게 흐르고 서로의 말하지 않은 감정도 이해합니다.',
            medium: '소통은 좋지만 발전의 여지가 있어요. 적극적으로 경청하고 감정을 솔직하게 표현해보세요.',
            low: '소통에 추가적인 노력이 필요할 수 있어요. 인내심을 가지고 다양한 방법으로 연결을 시도해보세요.'
        },
        ja: {
            name: 'コミュニケーション',
            icon: '💬',
            high: 'お二人は素晴らしいコミュニケーション能力を持っています。会話は自然に流れ、言葉にしない感情も理解し合えます。',
            medium: 'コミュニケーションは良好ですが、成長の余地があります。積極的に聞き、感情をオープンに表現しましょう。',
            low: 'コミュニケーションには追加の努力が必要かもしれません。忍耐を持ち、様々なアプローチを試してみてください。'
        },
        zh: {
            name: '沟通',
            icon: '💬',
            high: '你们两个有很好的沟通能力。对话自然流畅，你们能理解彼此未说出口的话。',
            medium: '沟通良好但还有成长空间。努力积极倾听并坦诚表达感受。',
            low: '沟通可能需要额外努力。保持耐心，尝试不同的方式来建立联系。'
        },
        es: {
            name: 'Comunicacion',
            icon: '💬',
            high: 'Ustedes dos tienen excelentes habilidades de comunicacion. Las conversaciones fluyen naturalmente y entienden las palabras no dichas del otro.',
            medium: 'Su comunicacion es buena con espacio para crecer. Hagan un esfuerzo por escuchar activamente y expresar sentimientos abiertamente.',
            low: 'La comunicacion puede requerir un esfuerzo extra. Practiquen la paciencia y prueben diferentes enfoques para conectar.'
        }
    },
    values: {
        en: {
            name: 'Values',
            icon: '⚖️',
            high: 'You share deeply aligned core values. Your fundamental beliefs about life, family, and future goals harmonize beautifully.',
            medium: 'Your values align in many areas. Some differences exist but can be bridged through understanding and respect.',
            low: 'Your values may differ significantly. This isn\'t necessarily bad - it can bring diverse perspectives to the relationship.'
        },
        ko: {
            name: '가치관',
            icon: '⚖️',
            high: '핵심 가치관이 깊이 일치해요. 삶, 가족, 미래 목표에 대한 근본적인 신념이 아름답게 조화를 이룹니다.',
            medium: '많은 영역에서 가치관이 일치해요. 일부 차이점이 있지만 이해와 존중을 통해 극복할 수 있어요.',
            low: '가치관이 크게 다를 수 있어요. 이것이 반드시 나쁜 것은 아니에요 - 관계에 다양한 관점을 가져다 줄 수 있어요.'
        },
        ja: {
            name: '価値観',
            icon: '⚖️',
            high: '核心的な価値観が深く一致しています。人生、家族、将来の目標に対する基本的な信念が美しく調和しています。',
            medium: '多くの分野で価値観が一致しています。いくつかの違いはありますが、理解と尊重で乗り越えられます。',
            low: '価値観が大きく異なる可能性があります。これは必ずしも悪いことではありません - 関係に多様な視点をもたらすことができます。'
        },
        zh: {
            name: '价值观',
            icon: '⚖️',
            high: '你们的核心价值观高度一致。关于生活、家庭和未来目标的基本信念完美和谐。',
            medium: '你们的价值观在很多方面一致。存在一些差异但可以通过理解和尊重来弥合。',
            low: '你们的价值观可能有很大不同。这不一定是坏事 - 它可以为关系带来多元视角。'
        },
        es: {
            name: 'Valores',
            icon: '⚖️',
            high: 'Comparten valores fundamentales profundamente alineados. Sus creencias sobre la vida, familia y metas futuras armonizan bellamente.',
            medium: 'Sus valores se alinean en muchas areas. Existen algunas diferencias pero pueden superarse con comprension y respeto.',
            low: 'Sus valores pueden diferir significativamente. Esto no es necesariamente malo - puede traer perspectivas diversas a la relacion.'
        }
    },
    energy: {
        en: {
            name: 'Energy',
            icon: '⚡',
            high: 'Your energy levels sync wonderfully! You match each other\'s pace for activities, rest, and adventure.',
            medium: 'Your energy compatibility is balanced. Sometimes you\'ll need to compromise on activity levels.',
            low: 'Your energy levels differ. One may prefer adventure while the other needs more rest - finding balance is key.'
        },
        ko: {
            name: '에너지',
            icon: '⚡',
            high: '에너지 레벨이 훌륭하게 동기화돼요! 활동, 휴식, 모험에서 서로의 페이스가 맞아요.',
            medium: '에너지 호환성이 균형 잡혀 있어요. 때때로 활동 수준에서 타협이 필요할 거예요.',
            low: '에너지 레벨이 달라요. 한 사람은 모험을 선호하고 다른 사람은 휴식이 더 필요할 수 있어요 - 균형을 찾는 것이 중요해요.'
        },
        ja: {
            name: 'エネルギー',
            icon: '⚡',
            high: 'エネルギーレベルが見事にシンクロしています！活動、休息、冒険でお互いのペースが合います。',
            medium: 'エネルギーの相性はバランスが取れています。時には活動レベルで妥協が必要かもしれません。',
            low: 'エネルギーレベルが異なります。一方は冒険を好み、他方はより多くの休息が必要かもしれません - バランスを見つけることが鍵です。'
        },
        zh: {
            name: '能量',
            icon: '⚡',
            high: '你们的能量水平完美同步！在活动、休息和冒险方面你们的节奏一致。',
            medium: '你们的能量兼容性平衡。有时需要在活动水平上做出妥协。',
            low: '你们的能量水平不同。一个可能喜欢冒险而另一个需要更多休息 - 找到平衡是关键。'
        },
        es: {
            name: 'Energia',
            icon: '⚡',
            high: 'Sus niveles de energia sincronizan maravillosamente! Coinciden en el ritmo para actividades, descanso y aventura.',
            medium: 'Su compatibilidad de energia esta equilibrada. A veces necesitaran comprometerse en niveles de actividad.',
            low: 'Sus niveles de energia difieren. Uno puede preferir la aventura mientras el otro necesita mas descanso - encontrar el equilibrio es clave.'
        }
    },
    emotional: {
        en: {
            name: 'Emotional',
            icon: '💗',
            high: 'Your emotional connection runs deep. You intuitively understand each other\'s feelings and provide excellent support.',
            medium: 'Your emotional bond is solid. Continue nurturing this connection through vulnerability and presence.',
            low: 'Emotional connection may need cultivation. Be patient and create safe spaces for sharing feelings.'
        },
        ko: {
            name: '정서적 유대',
            icon: '💗',
            high: '감정적 연결이 깊어요. 직관적으로 서로의 감정을 이해하고 훌륭한 지지를 제공해요.',
            medium: '정서적 유대가 탄탄해요. 취약함을 드러내고 함께하며 이 연결을 계속 가꿔나가세요.',
            low: '정서적 연결에 노력이 필요할 수 있어요. 인내심을 갖고 감정을 나눌 수 있는 안전한 공간을 만들어보세요.'
        },
        ja: {
            name: '感情的つながり',
            icon: '💗',
            high: '感情的なつながりが深いです。直感的にお互いの感情を理解し、素晴らしいサポートを提供します。',
            medium: '感情的な絆はしっかりしています。弱さを見せ、一緒にいることでこのつながりを育て続けてください。',
            low: '感情的なつながりには育成が必要かもしれません。忍耐強く、感情を共有できる安全な空間を作ってください。'
        },
        zh: {
            name: '情感联系',
            icon: '💗',
            high: '你们的情感联系很深。你们直觉地理解彼此的感受并提供出色的支持。',
            medium: '你们的情感纽带稳固。通过展现脆弱和陪伴继续培养这种联系。',
            low: '情感联系可能需要培养。保持耐心，创造分享感受的安全空间。'
        },
        es: {
            name: 'Emocional',
            icon: '💗',
            high: 'Su conexion emocional es profunda. Entienden intuitivamente los sentimientos del otro y brindan excelente apoyo.',
            medium: 'Su vinculo emocional es solido. Continuen nutriendo esta conexion a traves de la vulnerabilidad y presencia.',
            low: 'La conexion emocional puede necesitar cultivo. Sean pacientes y creen espacios seguros para compartir sentimientos.'
        }
    },
    growth: {
        en: {
            name: 'Growth',
            icon: '🌱',
            high: 'You inspire incredible growth in each other. Together, you become better versions of yourselves.',
            medium: 'You support each other\'s growth well. Keep encouraging dreams and celebrating achievements.',
            low: 'Growth together may require intentional effort. Focus on supporting individual aspirations while building shared goals.'
        },
        ko: {
            name: '성장',
            icon: '🌱',
            high: '서로에게 놀라운 성장을 영감을 줘요. 함께하면서 더 나은 자신이 됩니다.',
            medium: '서로의 성장을 잘 지지해요. 계속해서 꿈을 격려하고 성취를 축하해주세요.',
            low: '함께 성장하려면 의도적인 노력이 필요할 수 있어요. 개인의 열망을 지지하면서 공동의 목표를 세우는 데 집중하세요.'
        },
        ja: {
            name: '成長',
            icon: '🌱',
            high: 'お互いに素晴らしい成長をもたらします。一緒にいることで、より良い自分になれます。',
            medium: 'お互いの成長を良くサポートしています。夢を励まし、成果を祝い続けてください。',
            low: '一緒に成長するには意図的な努力が必要かもしれません。個人の願望をサポートしながら、共有の目標を築くことに焦点を当ててください。'
        },
        zh: {
            name: '成长',
            icon: '🌱',
            high: '你们激励彼此取得惊人的成长。在一起，你们变成更好的自己。',
            medium: '你们很好地支持彼此的成长。继续鼓励梦想并庆祝成就。',
            low: '共同成长可能需要刻意努力。专注于支持个人抱负，同时建立共同目标。'
        },
        es: {
            name: 'Crecimiento',
            icon: '🌱',
            high: 'Se inspiran un crecimiento increible mutuamente. Juntos, se convierten en mejores versiones de si mismos.',
            medium: 'Se apoyan bien en el crecimiento mutuo. Sigan alentando suenos y celebrando logros.',
            low: 'El crecimiento juntos puede requerir esfuerzo intencional. Enfoquense en apoyar aspiraciones individuales mientras construyen metas compartidas.'
        }
    }
};

/**
 * Get category description based on score
 */
function getCategoryDescription(category, score, lang = 'en') {
    const desc = CATEGORY_DESCRIPTIONS[category];
    if (!desc) return '';

    const langData = desc[lang] || desc.en;

    if (score >= 80) return langData.high;
    if (score >= 65) return langData.medium;
    return langData.low;
}

/**
 * Get category info (name, icon)
 */
function getCategoryInfo(category, lang = 'en') {
    const desc = CATEGORY_DESCRIPTIONS[category];
    if (!desc) return { name: category, icon: '📊' };

    const langData = desc[lang] || desc.en;
    return { name: langData.name, icon: langData.icon };
}

// ============================================
// OVERALL ANALYSIS GENERATION
// ============================================

/**
 * Generate detailed overall analysis
 */
function generateOverallAnalysis(results, lang = 'en') {
    const { overallScore, categories, personA, personB, relationshipType } = results;

    // Find strongest and weakest areas
    const categoryScores = Object.entries(categories);
    categoryScores.sort((a, b) => b[1] - a[1]);
    const strongest = categoryScores[0];
    const weakest = categoryScores[categoryScores.length - 1];

    const strongestInfo = getCategoryInfo(strongest[0], lang);
    const weakestInfo = getCategoryInfo(weakest[0], lang);

    const analyses = {
        en: {
            intro: `${personA.name} (${personA.zodiac}) and ${personB.name} (${personB.zodiac}) have a ${overallScore}% compatibility score!`,
            type: `Your relationship type: ${relationshipType.labels.en} ${relationshipType.emoji}`,
            strength: `Your strongest area is ${strongestInfo.name} (${strongest[1]}%) - this is where your connection truly shines.`,
            growth: `${weakestInfo.name} (${weakest[1]}%) has the most room for growth. Focus here to strengthen your bond.`,
            elements: `As ${personA.element} and ${personB.element} signs, you have a natural ${results.elementCompatibility >= 80 ? 'harmony' : results.elementCompatibility >= 60 ? 'balance' : 'dynamic tension'} in your relationship.`
        },
        ko: {
            intro: `${personA.name} (${personA.zodiac})님과 ${personB.name} (${personB.zodiac})님의 궁합 점수는 ${overallScore}%입니다!`,
            type: `관계 유형: ${relationshipType.labels.ko} ${relationshipType.emoji}`,
            strength: `가장 강한 영역은 ${strongestInfo.name} (${strongest[1]}%)입니다 - 이 부분에서 두 분의 연결이 빛나요.`,
            growth: `${weakestInfo.name} (${weakest[1]}%)에 성장의 여지가 가장 많아요. 이 부분에 집중하면 유대가 강해질 거예요.`,
            elements: `${personA.element}와 ${personB.element} 별자리로서, 두 분의 관계에는 자연스러운 ${results.elementCompatibility >= 80 ? '조화' : results.elementCompatibility >= 60 ? '균형' : '역동적 긴장'}가 있어요.`
        },
        ja: {
            intro: `${personA.name}さん（${personA.zodiac}）と${personB.name}さん（${personB.zodiac}）の相性スコアは${overallScore}%です！`,
            type: `関係タイプ: ${relationshipType.labels.ja} ${relationshipType.emoji}`,
            strength: `最も強い分野は${strongestInfo.name}（${strongest[1]}%）です - ここでお二人のつながりが輝いています。`,
            growth: `${weakestInfo.name}（${weakest[1]}%）に最も成長の余地があります。ここに集中することで絆が強まります。`,
            elements: `${personA.element}と${personB.element}の星座として、お二人の関係には自然な${results.elementCompatibility >= 80 ? '調和' : results.elementCompatibility >= 60 ? 'バランス' : 'ダイナミックな緊張'}があります。`
        },
        zh: {
            intro: `${personA.name}（${personA.zodiac}）和${personB.name}（${personB.zodiac}）的配对分数是${overallScore}%！`,
            type: `关系类型：${relationshipType.labels.zh} ${relationshipType.emoji}`,
            strength: `最强的领域是${strongestInfo.name}（${strongest[1]}%）- 这是你们的连接最闪耀的地方。`,
            growth: `${weakestInfo.name}（${weakest[1]}%）有最大的成长空间。专注于此可以加强你们的纽带。`,
            elements: `作为${personA.element}和${personB.element}星座，你们的关系有一种自然的${results.elementCompatibility >= 80 ? '和谐' : results.elementCompatibility >= 60 ? '平衡' : '动态张力'}。`
        },
        es: {
            intro: `${personA.name} (${personA.zodiac}) y ${personB.name} (${personB.zodiac}) tienen un ${overallScore}% de compatibilidad!`,
            type: `Tipo de relacion: ${relationshipType.labels.es} ${relationshipType.emoji}`,
            strength: `Su area mas fuerte es ${strongestInfo.name} (${strongest[1]}%) - aqui es donde su conexion brilla.`,
            growth: `${weakestInfo.name} (${weakest[1]}%) tiene mas espacio para crecer. Enfoquense aqui para fortalecer su vinculo.`,
            elements: `Como signos de ${personA.element} y ${personB.element}, tienen una ${results.elementCompatibility >= 80 ? 'armonia' : results.elementCompatibility >= 60 ? 'equilibrio' : 'tension dinamica'} natural en su relacion.`
        }
    };

    return analyses[lang] || analyses.en;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get score color gradient
 */
function getScoreColor(score) {
    if (score >= 90) return '#ec4899'; // Pink
    if (score >= 80) return '#f43f5e'; // Rose
    if (score >= 70) return '#f97316'; // Orange
    if (score >= 60) return '#eab308'; // Yellow
    if (score >= 50) return '#84cc16'; // Lime
    return '#6b7280'; // Gray
}

/**
 * Get score gradient for background
 */
function getScoreGradient(score) {
    if (score >= 90) return ['#ec4899', '#f43f5e'];
    if (score >= 80) return ['#f43f5e', '#fb7185'];
    if (score >= 70) return ['#f97316', '#fb923c'];
    if (score >= 60) return ['#eab308', '#facc15'];
    if (score >= 50) return ['#84cc16', '#a3e635'];
    return ['#6b7280', '#9ca3af'];
}

// ============================================
// ANIMAL COUPLE MATCHING SYSTEM
// ============================================

/**
 * Animal data with personality traits and couple pairings
 */
const ANIMALS = [
    { id: 'lion', emoji: '🦁', traits: ['leadership', 'confident', 'protective'] },
    { id: 'cat', emoji: '🐱', traits: ['independent', 'curious', 'playful'] },
    { id: 'bear', emoji: '🐻', traits: ['nurturing', 'strong', 'calm'] },
    { id: 'rabbit', emoji: '🐰', traits: ['gentle', 'quick', 'social'] },
    { id: 'fox', emoji: '🦊', traits: ['clever', 'adaptable', 'charming'] },
    { id: 'dog', emoji: '🐶', traits: ['loyal', 'friendly', 'energetic'] },
    { id: 'wolf', emoji: '🐺', traits: ['mysterious', 'intuitive', 'devoted'] },
    { id: 'dolphin', emoji: '🐬', traits: ['playful', 'smart', 'social'] },
    { id: 'owl', emoji: '🦉', traits: ['wise', 'observant', 'thoughtful'] },
    { id: 'eagle', emoji: '🦅', traits: ['ambitious', 'visionary', 'free'] },
    { id: 'panda', emoji: '🐼', traits: ['peaceful', 'gentle', 'balanced'] },
    { id: 'tiger', emoji: '🐯', traits: ['passionate', 'bold', 'independent'] },
    { id: 'deer', emoji: '🦌', traits: ['graceful', 'sensitive', 'gentle'] },
    { id: 'penguin', emoji: '🐧', traits: ['devoted', 'resilient', 'family-oriented'] },
    { id: 'butterfly', emoji: '🦋', traits: ['transformative', 'free-spirited', 'beautiful'] },
    { id: 'koala', emoji: '🐨', traits: ['relaxed', 'cuddly', 'peaceful'] }
];

/**
 * Animal couple pairings with descriptions
 * Each combination has unique chemistry descriptions
 */
const ANIMAL_COUPLES = {
    'lion-cat': {
        title: {
            en: 'Lion & Cat Couple', ko: '사자와 고양이 커플',
            ja: 'ライオンと猫カップル', zh: '狮子与猫咪情侣', es: 'Pareja León y Gato'
        },
        desc: {
            en: 'Charismatic outside, cuddly inside! The protector meets the charmer.',
            ko: '밖에선 카리스마, 집에선 애교쟁이! 보호자와 매력쟁이의 만남.',
            ja: '外ではカリスマ、家では甘えん坊！守護者と魅力的な者の出会い。',
            zh: '外面有魅力，家里撒娇！保护者与迷人者的相遇。',
            es: '¡Carismáticos afuera, tiernos adentro! El protector conoce al encantador.'
        },
        chemistry: '🔥'
    },
    'bear-rabbit': {
        title: {
            en: 'Bear & Rabbit Couple', ko: '곰과 토끼 커플',
            ja: 'クマとうさぎカップル', zh: '熊与兔子情侣', es: 'Pareja Oso y Conejo'
        },
        desc: {
            en: 'The gentle giant and the energetic sweetheart. Ultimate comfort duo!',
            ko: '듬직한 보호자와 귀여운 활력소. 최고의 힐링 조합!',
            ja: '頼もしい守護者と可愛いエネルギー源。最高の癒しコンビ！',
            zh: '可靠的保护者与可爱的活力源。最佳治愈组合！',
            es: '¡El gigante gentil y el corazón energético. Dúo de confort!'
        },
        chemistry: '💕'
    },
    'fox-dog': {
        title: {
            en: 'Fox & Dog Couple', ko: '여우와 강아지 커플',
            ja: 'キツネと犬カップル', zh: '狐狸与狗狗情侣', es: 'Pareja Zorro y Perro'
        },
        desc: {
            en: 'The clever strategist and the loyal companion. Brains meet heart!',
            ko: '영리한 전략가와 충직한 동반자. 머리와 마음의 만남!',
            ja: '賢い戦略家と忠実な仲間。頭脳と心の出会い！',
            zh: '聪明的战略家与忠诚的伙伴。智慧与真心相遇！',
            es: '¡El estratega astuto y el compañero leal. Cerebro conoce corazón!'
        },
        chemistry: '⚡'
    },
    'wolf-deer': {
        title: {
            en: 'Wolf & Deer Couple', ko: '늑대와 사슴 커플',
            ja: 'オオカミと鹿カップル', zh: '狼与鹿情侣', es: 'Pareja Lobo y Ciervo'
        },
        desc: {
            en: 'The mysterious protector and the graceful soul. An unexpected match!',
            ko: '신비로운 수호자와 우아한 영혼. 의외의 운명적 만남!',
            ja: '神秘的な守護者と優雅な魂。意外な運命の出会い！',
            zh: '神秘的守护者与优雅的灵魂。意想不到的命运相遇！',
            es: '¡El protector misterioso y el alma elegante. Una pareja inesperada!'
        },
        chemistry: '🌙'
    },
    'dolphin-penguin': {
        title: {
            en: 'Dolphin & Penguin Couple', ko: '돌고래와 펭귄 커플',
            ja: 'イルカとペンギンカップル', zh: '海豚与企鹅情侣', es: 'Pareja Delfín y Pingüino'
        },
        desc: {
            en: 'The playful adventurer and the devoted partner. Ocean love story!',
            ko: '장난꾸러기 모험가와 헌신적인 파트너. 바다의 러브스토리!',
            ja: 'いたずら好きな冒険家と献身的なパートナー。海のラブストーリー！',
            zh: '爱玩的冒险家与专一的伴侣。海洋爱情故事！',
            es: '¡El aventurero juguetón y la pareja devota. Historia de amor oceánica!'
        },
        chemistry: '🌊'
    },
    'owl-eagle': {
        title: {
            en: 'Owl & Eagle Couple', ko: '부엉이와 독수리 커플',
            ja: 'フクロウと鷲カップル', zh: '猫头鹰与鹰情侣', es: 'Pareja Búho y Águila'
        },
        desc: {
            en: 'The wise observer and the ambitious visionary. Power couple goals!',
            ko: '현명한 관찰자와 야망있는 비전가. 파워커플의 정석!',
            ja: '賢明な観察者と野心的なビジョナリー。パワーカップルの定番！',
            zh: '睿智的观察者与雄心勃勃的远见者。权力情侣典范！',
            es: '¡El sabio observador y el visionario ambicioso. Metas de pareja poderosa!'
        },
        chemistry: '👑'
    },
    'panda-koala': {
        title: {
            en: 'Panda & Koala Couple', ko: '판다와 코알라 커플',
            ja: 'パンダとコアラカップル', zh: '熊猫与考拉情侣', es: 'Pareja Panda y Koala'
        },
        desc: {
            en: 'The chill masters! Two peaceful souls finding comfort together.',
            ko: '힐링의 달인들! 평화로운 두 영혼의 안식처.',
            ja: '癒しの達人たち！平和な二つの魂が安らぎを見つける。',
            zh: '治愈大师！两个平和的灵魂相互慰藉。',
            es: '¡Los maestros de la calma! Dos almas pacíficas encontrando confort.'
        },
        chemistry: '☁️'
    },
    'tiger-butterfly': {
        title: {
            en: 'Tiger & Butterfly Couple', ko: '호랑이와 나비 커플',
            ja: 'トラと蝶カップル', zh: '老虎与蝴蝶情侣', es: 'Pareja Tigre y Mariposa'
        },
        desc: {
            en: 'The bold warrior and the free spirit. Beauty tames the beast!',
            ko: '대담한 전사와 자유로운 영혼. 미녀와 야수의 로맨스!',
            ja: '大胆な戦士と自由な精神。美女と野獣のロマンス！',
            zh: '大胆的战士与自由的灵魂。美女与野兽的浪漫！',
            es: '¡El guerrero audaz y el espíritu libre. La belleza doma a la bestia!'
        },
        chemistry: '🦋'
    },
    'lion-wolf': {
        title: {
            en: 'Lion & Wolf Couple', ko: '사자와 늑대 커플',
            ja: 'ライオンとオオカミカップル', zh: '狮子与狼情侣', es: 'Pareja León y Lobo'
        },
        desc: {
            en: 'Two alphas, one love! Powerful and passionate connection.',
            ko: '두 리더, 하나의 사랑! 강렬하고 열정적인 연결.',
            ja: '二人のリーダー、一つの愛！力強く情熱的なつながり。',
            zh: '两个领袖，一份爱！强大而热情的连接。',
            es: '¡Dos alfas, un amor! Conexión poderosa y apasionada.'
        },
        chemistry: '🔥'
    },
    'cat-owl': {
        title: {
            en: 'Cat & Owl Couple', ko: '고양이와 부엉이 커플',
            ja: '猫とフクロウカップル', zh: '猫咪与猫头鹰情侣', es: 'Pareja Gato y Búho'
        },
        desc: {
            en: 'The curious explorer and the wise guardian. Night owls in love!',
            ko: '호기심 많은 탐험가와 현명한 수호자. 올빼미족의 사랑!',
            ja: '好奇心旺盛な探検家と賢明な守護者。夜型カップルの愛！',
            zh: '好奇的探索者与睿智的守护者。夜猫子的爱情！',
            es: '¡El explorador curioso y el guardián sabio. Búhos nocturnos enamorados!'
        },
        chemistry: '🌙'
    },
    'bear-panda': {
        title: {
            en: 'Bear & Panda Couple', ko: '곰과 판다 커플',
            ja: 'クマとパンダカップル', zh: '熊与熊猫情侣', es: 'Pareja Oso y Panda'
        },
        desc: {
            en: 'Double the hugs! Warm, cozy, and endlessly comforting.',
            ko: '포옹 두 배! 따뜻하고 포근한 최고의 안식처.',
            ja: 'ハグ2倍！温かく居心地の良い最高の安らぎ。',
            zh: '双倍拥抱！温暖、舒适、无限治愈。',
            es: '¡Doble abrazo! Cálido, acogedor e infinitamente reconfortante.'
        },
        chemistry: '🤗'
    },
    'dog-penguin': {
        title: {
            en: 'Dog & Penguin Couple', ko: '강아지와 펭귄 커플',
            ja: '犬とペンギンカップル', zh: '狗狗与企鹅情侣', es: 'Pareja Perro y Pingüino'
        },
        desc: {
            en: 'Loyalty meets devotion! The most faithful couple ever.',
            ko: '충성과 헌신의 만남! 역대급 믿음직한 커플.',
            ja: '忠誠心と献身の出会い！史上最も信頼できるカップル。',
            zh: '忠诚遇见奉献！史上最可靠的情侣。',
            es: '¡Lealtad conoce devoción! La pareja más fiel de todas.'
        },
        chemistry: '💖'
    },
    'fox-cat': {
        title: {
            en: 'Fox & Cat Couple', ko: '여우와 고양이 커플',
            ja: 'キツネと猫カップル', zh: '狐狸与猫咪情侣', es: 'Pareja Zorro y Gato'
        },
        desc: {
            en: 'Double trouble! Clever, playful, and endlessly entertaining.',
            ko: '말썽꾸러기 듀오! 똑똑하고 장난기 넘치는 조합.',
            ja: 'いたずらコンビ！賢くて遊び心満載の組み合わせ。',
            zh: '调皮二人组！聪明、爱玩、永远有趣。',
            es: '¡Doble problema! Astutos, juguetones e infinitamente entretenidos.'
        },
        chemistry: '😼'
    },
    'rabbit-deer': {
        title: {
            en: 'Rabbit & Deer Couple', ko: '토끼와 사슴 커플',
            ja: 'うさぎと鹿カップル', zh: '兔子与鹿情侣', es: 'Pareja Conejo y Ciervo'
        },
        desc: {
            en: 'Gentle souls in sync! Pure, sweet, and wonderfully harmonious.',
            ko: '부드러운 영혼의 만남! 순수하고 달콤한 완벽 조화.',
            ja: '優しい魂の出会い！純粋で甘く、素晴らしい調和。',
            zh: '温柔灵魂的相遇！纯洁、甜蜜、完美和谐。',
            es: '¡Almas gentiles en sintonía! Puros, dulces y maravillosamente armoniosos.'
        },
        chemistry: '🌸'
    },
    'tiger-eagle': {
        title: {
            en: 'Tiger & Eagle Couple', ko: '호랑이와 독수리 커플',
            ja: 'トラと鷲カップル', zh: '老虎与鹰情侣', es: 'Pareja Tigre y Águila'
        },
        desc: {
            en: 'Land meets sky! Bold adventurers conquering the world together.',
            ko: '땅과 하늘의 만남! 세상을 정복하는 대담한 모험가들.',
            ja: '大地と空の出会い！世界を征服する大胆な冒険家たち。',
            zh: '陆地与天空相遇！一起征服世界的大胆冒险家。',
            es: '¡La tierra conoce el cielo! Aventureros audaces conquistando el mundo juntos.'
        },
        chemistry: '🦅'
    },
    'dolphin-butterfly': {
        title: {
            en: 'Dolphin & Butterfly Couple', ko: '돌고래와 나비 커플',
            ja: 'イルカと蝶カップル', zh: '海豚与蝴蝶情侣', es: 'Pareja Delfín y Mariposa'
        },
        desc: {
            en: 'Free spirits unite! Playful, beautiful, and full of wonder.',
            ko: '자유로운 영혼의 만남! 장난스럽고 아름다운 경이로움.',
            ja: '自由な精神の出会い！遊び心があり、美しく、驚きに満ちている。',
            zh: '自由灵魂相遇！爱玩、美丽、充满惊喜。',
            es: '¡Espíritus libres unidos! Juguetones, hermosos y llenos de asombro.'
        },
        chemistry: '✨'
    },
    'koala-rabbit': {
        title: {
            en: 'Koala & Rabbit Couple', ko: '코알라와 토끼 커플',
            ja: 'コアラとうさぎカップル', zh: '考拉与兔子情侣', es: 'Pareja Koala y Conejo'
        },
        desc: {
            en: 'Adorable overload! The cutest, most heartwarming duo.',
            ko: '귀여움 폭발! 가장 사랑스러운 힐링 조합.',
            ja: '可愛さ爆発！最も愛らしい癒しコンビ。',
            zh: '可爱爆棚！最萌最暖心的组合。',
            es: '¡Sobrecarga de ternura! El dúo más lindo y reconfortante.'
        },
        chemistry: '💗'
    },
    'wolf-fox': {
        title: {
            en: 'Wolf & Fox Couple', ko: '늑대와 여우 커플',
            ja: 'オオカミとキツネカップル', zh: '狼与狐狸情侣', es: 'Pareja Lobo y Zorro'
        },
        desc: {
            en: 'Street smart meets book smart! Cunning duo with deep bonds.',
            ko: '본능과 지능의 만남! 깊은 유대의 영리한 듀오.',
            ja: '本能と知性の出会い！深い絆の賢いデュオ。',
            zh: '直觉与智慧相遇！深厚纽带的聪明二人组。',
            es: '¡La inteligencia callejera conoce la académica! Dúo astuto con lazos profundos.'
        },
        chemistry: '🌟'
    },
    'lion-eagle': {
        title: {
            en: 'Lion & Eagle Couple', ko: '사자와 독수리 커플',
            ja: 'ライオンと鷲カップル', zh: '狮子与鹰情侣', es: 'Pareja León y Águila'
        },
        desc: {
            en: 'King of beasts meets king of birds! Ultimate power couple.',
            ko: '백수의 왕과 하늘의 왕! 최강의 파워커플.',
            ja: '獣の王と鳥の王！最強のパワーカップル。',
            zh: '兽中之王遇见鸟中之王！终极权力情侣。',
            es: '¡El rey de las bestias conoce al rey de los pájaros! La pareja más poderosa.'
        },
        chemistry: '👑'
    },
    'cat-rabbit': {
        title: {
            en: 'Cat & Rabbit Couple', ko: '고양이와 토끼 커플',
            ja: '猫とうさぎカップル', zh: '猫咪与兔子情侣', es: 'Pareja Gato y Conejo'
        },
        desc: {
            en: 'Playful chase forever! Energetic and adorably mischievous.',
            ko: '영원한 술래잡기! 에너지 넘치는 귀여운 장난꾸러기들.',
            ja: '永遠の追いかけっこ！エネルギッシュで愛らしいいたずらっ子たち。',
            zh: '永远的追逐游戏！精力充沛的可爱淘气鬼。',
            es: '¡Persecución eterna! Energéticos y adorablemente traviesos.'
        },
        chemistry: '🎀'
    },
    'dog-koala': {
        title: {
            en: 'Dog & Koala Couple', ko: '강아지와 코알라 커플',
            ja: '犬とコアラカップル', zh: '狗狗与考拉情侣', es: 'Pareja Perro y Koala'
        },
        desc: {
            en: 'Loyal energy meets cozy vibes! The perfect balance of active and chill.',
            ko: '충직한 에너지와 포근한 감성의 만남! 활동과 휴식의 완벽한 균형.',
            ja: '忠実なエネルギーと居心地の良い雰囲気の出会い！活動と癒しの完璧なバランス。',
            zh: '忠诚的能量遇上舒适的氛围！活力与悠闲的完美平衡。',
            es: '¡La energía leal conoce las vibraciones acogedoras! El equilibrio perfecto.'
        },
        chemistry: '🏠'
    },
    'fox-lion': {
        title: {
            en: 'Fox & Lion Couple', ko: '여우와 사자 커플',
            ja: 'キツネとライオンカップル', zh: '狐狸与狮子情侣', es: 'Pareja Zorro y León'
        },
        desc: {
            en: 'Cunning charm meets royal charisma! A power duo ruling with wit and strength.',
            ko: '영리한 매력과 왕의 카리스마! 지혜와 힘으로 세상을 지배하는 듀오.',
            ja: '狡猾な魅力と王室のカリスマの出会い！知恵と力で君臨するデュオ。',
            zh: '狡黠的魅力遇上王者气质！用智慧和力量统治的二人组。',
            es: '¡El encanto astuto conoce el carisma real! Un dúo que reina con ingenio y fuerza.'
        },
        chemistry: '👑'
    },
    'dog-lion': {
        title: {
            en: 'Dog & Lion Couple', ko: '강아지와 사자 커플',
            ja: '犬とライオンカップル', zh: '狗狗与狮子情侣', es: 'Pareja Perro y León'
        },
        desc: {
            en: 'The loyal knight and the brave king! An unbreakable bond of trust.',
            ko: '충직한 기사와 용감한 왕! 깨지지 않는 신뢰의 유대.',
            ja: '忠実な騎士と勇敢な王！壊れない信頼の絆。',
            zh: '忠诚的骑士与勇敢的国王！牢不可破的信任纽带。',
            es: '¡El caballero leal y el rey valiente! Un vínculo inquebrantable de confianza.'
        },
        chemistry: '⚔️'
    },
    'eagle-penguin': {
        title: {
            en: 'Eagle & Penguin Couple', ko: '독수리와 펭귄 커플',
            ja: '鷲とペンギンカップル', zh: '鹰与企鹅情侣', es: 'Pareja Águila y Pingüino'
        },
        desc: {
            en: 'Sky high ambition meets grounded devotion! Opposites that complete each other.',
            ko: '하늘 높은 야망과 땅 위의 헌신! 서로를 완성하는 반대 매력.',
            ja: '空高い野望と地に足のついた献身！互いを完成させる正反対の魅力。',
            zh: '高飞的雄心遇上脚踏实地的奉献！互补的反差魅力。',
            es: '¡La ambición del cielo conoce la devoción firme! Opuestos que se complementan.'
        },
        chemistry: '🌍'
    },
    'tiger-wolf': {
        title: {
            en: 'Tiger & Wolf Couple', ko: '호랑이와 늑대 커플',
            ja: 'トラとオオカミカップル', zh: '老虎与狼情侣', es: 'Pareja Tigre y Lobo'
        },
        desc: {
            en: 'Wild hearts unite! Two fierce souls with intense passion.',
            ko: '야생의 심장이 만나다! 강렬한 열정의 두 맹수.',
            ja: '野生の心が出会う！激しい情熱を持つ二つの猛獣の魂。',
            zh: '狂野之心相遇！两颗炽热灵魂的激烈碰撞。',
            es: '¡Corazones salvajes unidos! Dos almas feroces con pasión intensa.'
        },
        chemistry: '🔥'
    },
    'bear-dog': {
        title: {
            en: 'Bear & Dog Couple', ko: '곰과 강아지 커플',
            ja: 'クマと犬カップル', zh: '熊与狗狗情侣', es: 'Pareja Oso y Perro'
        },
        desc: {
            en: 'Big hugs and wagging tails! The most loyal and warm-hearted duo.',
            ko: '큰 포옹과 흔들리는 꼬리! 가장 충직하고 따뜻한 조합.',
            ja: '大きなハグと振れる尻尾！最も忠実で温かい心のデュオ。',
            zh: '大大的拥抱和摇摆的尾巴！最忠诚最温暖的组合。',
            es: '¡Grandes abrazos y colas meneando! El dúo más leal y cálido.'
        },
        chemistry: '🤗'
    },
    'owl-dolphin': {
        title: {
            en: 'Owl & Dolphin Couple', ko: '부엉이와 돌고래 커플',
            ja: 'フクロウとイルカカップル', zh: '猫头鹰与海豚情侣', es: 'Pareja Búho y Delfín'
        },
        desc: {
            en: 'Wisdom meets playfulness! Deep conversations and endless fun.',
            ko: '지혜와 장난기의 만남! 깊은 대화와 끝없는 재미.',
            ja: '知恵と遊び心の出会い！深い会話と終わりなき楽しさ。',
            zh: '智慧遇上玩乐！深入交流与无尽欢乐。',
            es: '¡La sabiduría conoce la diversión! Conversaciones profundas y diversión infinita.'
        },
        chemistry: '🌟'
    },
    'panda-dog': {
        title: {
            en: 'Panda & Dog Couple', ko: '판다와 강아지 커플',
            ja: 'パンダと犬カップル', zh: '熊猫与狗狗情侣', es: 'Pareja Panda y Perro'
        },
        desc: {
            en: 'Pure happiness! The most cheerful and adorable combination.',
            ko: '순수한 행복! 가장 밝고 사랑스러운 조합.',
            ja: '純粋な幸せ！最も陽気で愛らしい組み合わせ。',
            zh: '纯粹的快乐！最欢乐最可爱的组合。',
            es: '¡Pura felicidad! La combinación más alegre y adorable.'
        },
        chemistry: '🌈'
    },
    'butterfly-deer': {
        title: {
            en: 'Butterfly & Deer Couple', ko: '나비와 사슴 커플',
            ja: '蝶と鹿カップル', zh: '蝴蝶与鹿情侣', es: 'Pareja Mariposa y Ciervo'
        },
        desc: {
            en: 'Graceful dreamers! A fairy-tale romance full of gentle beauty.',
            ko: '우아한 몽상가들! 부드러운 아름다움이 가득한 동화 같은 로맨스.',
            ja: '優雅な夢想家たち！優しい美しさに満ちた童話のようなロマンス。',
            zh: '优雅的梦想家！充满温柔之美的童话般浪漫。',
            es: '¡Soñadores elegantes! Un romance de cuento lleno de belleza gentil.'
        },
        chemistry: '🌸'
    },
    'lion-owl': {
        title: {
            en: 'Lion & Owl Couple', ko: '사자와 부엉이 커플',
            ja: 'ライオンとフクロウカップル', zh: '狮子与猫头鹰情侣', es: 'Pareja León y Búho'
        },
        desc: {
            en: 'The king and the advisor! Strength guided by wisdom.',
            ko: '왕과 현자의 만남! 지혜가 이끄는 힘.',
            ja: '王と賢者の出会い！知恵に導かれる力。',
            zh: '国王与智者相遇！智慧引导力量。',
            es: '¡El rey y el consejero! La fuerza guiada por la sabiduría.'
        },
        chemistry: '🏛️'
    },
    'tiger-fox': {
        title: {
            en: 'Tiger & Fox Couple', ko: '호랑이와 여우 커플',
            ja: 'トラとキツネカップル', zh: '老虎与狐狸情侣', es: 'Pareja Tigre y Zorro'
        },
        desc: {
            en: 'Bold power meets clever charm! An unstoppable strategic duo.',
            ko: '대담한 힘과 영리한 매력의 만남! 막을 수 없는 전략적 듀오.',
            ja: '大胆な力と賢い魅力の出会い！止められない戦略的デュオ。',
            zh: '大胆的力量遇上聪明的魅力！势不可挡的战略组合。',
            es: '¡El poder audaz conoce el encanto astuto! Un dúo estratégico imparable.'
        },
        chemistry: '⚡'
    },
    'penguin-deer': {
        title: {
            en: 'Penguin & Deer Couple', ko: '펭귄과 사슴 커플',
            ja: 'ペンギンと鹿カップル', zh: '企鹅与鹿情侣', es: 'Pareja Pingüino y Ciervo'
        },
        desc: {
            en: 'Devoted hearts and gentle souls! A tender love story.',
            ko: '헌신적인 마음과 부드러운 영혼! 따뜻한 사랑 이야기.',
            ja: '献身的な心と優しい魂！温かいラブストーリー。',
            zh: '专一的心与温柔的灵魂！温馨的爱情故事。',
            es: '¡Corazones devotos y almas gentiles! Una tierna historia de amor.'
        },
        chemistry: '💝'
    },
    'wolf-dolphin': {
        title: {
            en: 'Wolf & Dolphin Couple', ko: '늑대와 돌고래 커플',
            ja: 'オオカミとイルカカップル', zh: '狼与海豚情侣', es: 'Pareja Lobo y Delfín'
        },
        desc: {
            en: 'Mystery meets joy! Depth and playfulness in perfect harmony.',
            ko: '신비와 즐거움의 만남! 깊이와 유쾌함의 완벽한 조화.',
            ja: '神秘と喜びの出会い！深さと遊び心の完璧な調和。',
            zh: '神秘遇上欢乐！深度与趣味的完美和谐。',
            es: '¡El misterio conoce la alegría! Profundidad y alegría en perfecta armonía.'
        },
        chemistry: '🌊'
    }
};

// Default pairing for combinations not explicitly defined
const DEFAULT_COUPLE = {
    title: {
        en: 'Unique Duo', ko: '유니크한 듀오',
        ja: 'ユニークなデュオ', zh: '独特二人组', es: 'Dúo Único'
    },
    desc: {
        en: 'A one-of-a-kind pairing! Your chemistry creates its own magic.',
        ko: '세상에 단 하나뿐인 조합! 둘만의 특별한 케미.',
        ja: '世界に一つだけの組み合わせ！二人だけの特別なケミストリー。',
        zh: '独一无二的组合！你们的化学反应创造独特的魔法。',
        es: '¡Una pareja única! Tu química crea su propia magia.'
    },
    chemistry: '💫'
};

/**
 * Determine animal type based on zodiac element and personality seed
 */
function getAnimalForPerson(zodiac, seed, personIndex) {
    // Map elements to animal groups
    const elementAnimalGroups = {
        'Fire': ['lion', 'tiger', 'eagle', 'fox'],
        'Earth': ['bear', 'panda', 'koala', 'dog'],
        'Air': ['butterfly', 'owl', 'eagle', 'dolphin'],
        'Water': ['dolphin', 'penguin', 'wolf', 'deer']
    };

    // Get animal group based on element
    const group = elementAnimalGroups[zodiac.element] || elementAnimalGroups['Earth'];

    // Use seed to deterministically select animal from group
    const animalIndex = (seed + personIndex * 7) % group.length;
    const animalId = group[animalIndex];

    return ANIMALS.find(a => a.id === animalId) || ANIMALS[0];
}

/**
 * Get animal couple pairing info
 */
function getAnimalCouple(animalA, animalB) {
    // Create key (order-independent)
    const ids = [animalA.id, animalB.id].sort();
    const key = ids.join('-');
    const reverseKey = ids.reverse().join('-');

    // Look up pairing
    const pairing = ANIMAL_COUPLES[key] || ANIMAL_COUPLES[reverseKey] || DEFAULT_COUPLE;

    return {
        animalA,
        animalB,
        ...pairing
    };
}

/**
 * Enhanced relationship type with animal couple
 */
function getEnhancedRelationshipType(score, animalCouple) {
    const baseType = getRelationshipType(score);

    // Add new creative labels based on score ranges
    const creativeLabels = {
        perfect: {
            en: 'Legendary Soulmates', ko: '전설의 소울메이트',
            ja: '伝説のソウルメイト', zh: '传说中的灵魂伴侣', es: 'Almas Gemelas Legendarias'
        },
        destined: {
            en: 'Red String of Fate', ko: '운명의 빨간실',
            ja: '運命の赤い糸', zh: '命运红线', es: 'Hilo Rojo del Destino'
        },
        great: {
            en: 'Perfect Match Duo', ko: '찰떡궁합 콤비',
            ja: '相性抜群コンビ', zh: '绝配组合', es: 'Dúo Perfecto'
        },
        good: {
            en: 'Bickering Lovebirds', ko: '티격태격 러브버드',
            ja: 'ケンカするほど仲良し', zh: '欢喜冤家', es: 'Tortolitos Juguetones'
        },
        average: {
            en: 'Growth Partners', ko: '성장형 파트너',
            ja: '成長型パートナー', zh: '成长型伴侣', es: 'Socios de Crecimiento'
        },
        effort: {
            en: 'Mystery Couple', ko: '미스터리 커플',
            ja: 'ミステリーカップル', zh: '神秘情侣', es: 'Pareja Misteriosa'
        },
        challenging: {
            en: 'Plot Twist Duo', ko: '반전매력 조합',
            ja: '逆転の魅力コンビ', zh: '反转魅力组合', es: 'Dúo de Giros Inesperados'
        }
    };

    return {
        ...baseType,
        creativeLabels: creativeLabels[baseType.level] || creativeLabels.good,
        animalCouple
    };
}
