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

    // Get relationship type
    const relationshipType = getRelationshipType(overallScore);

    return {
        personA: {
            name: personA.name || 'Person A',
            zodiac: zodiacA.name,
            element: zodiacA.element,
            birthday: `${personA.year}-${String(personA.month).padStart(2, '0')}-${String(personA.day).padStart(2, '0')}`
        },
        personB: {
            name: personB.name || 'Person B',
            zodiac: zodiacB.name,
            element: zodiacB.element,
            birthday: `${personB.year}-${String(personB.month).padStart(2, '0')}-${String(personB.day).padStart(2, '0')}`
        },
        overallScore,
        categories,
        relationshipType,
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
