/**
 * AI Age Calculator - Core Algorithm
 * Calculates Real Age, Mental Age, and Energy Age
 */

// ============================================
// AGE CALCULATION FUNCTIONS
// ============================================

/**
 * Calculate real (chronological) age from birthday
 */
function calculateRealAge(birthYear, birthMonth, birthDay) {
    const today = new Date();
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return Math.max(0, age);
}

/**
 * Calculate mental age based on answers
 * Mental age reflects mindset, adaptability, and outlook
 */
function calculateMentalAge(realAge, answers) {
    let mentalAgeModifier = 0;

    // Q2: Technology adoption (strong mental age indicator)
    const techScores = { eager: -5, curious: -2, cautious: 2, resistant: 5 };
    mentalAgeModifier += techScores[answers.q2] || 0;

    // Q4: Future outlook (optimism/pessimism)
    const futureScores = { excited: -4, neutral: 0, worried: 3, anxious: 5 };
    mentalAgeModifier += futureScores[answers.q4] || 0;

    // Q5: "Kids these days" frequency (generational mindset)
    const kidsScores = { never: -4, rarely: -1, often: 3, always: 6 };
    mentalAgeModifier += kidsScores[answers.q5] || 0;

    // Q7: New Year's resolution style
    const resolutionScores = { ambitious: -3, practical: 0, none: 2, same: 4 };
    mentalAgeModifier += resolutionScores[answers.q7] || 0;

    // Calculate mental age with bounds
    let mentalAge = realAge + mentalAgeModifier;

    // Apply some randomness for variety (-2 to +2)
    const randomFactor = Math.floor(Math.random() * 5) - 2;
    mentalAge += randomFactor;

    // Bound mental age between 15 and 80
    mentalAge = Math.max(15, Math.min(80, mentalAge));

    return Math.round(mentalAge);
}

/**
 * Calculate energy age based on answers
 * Energy age reflects vitality, activity level, and lifestyle
 */
function calculateEnergyAge(realAge, answers) {
    let energyAgeModifier = 0;

    // Q1: Weekend wake-up time (sleep/energy patterns)
    const wakeScores = { early: 2, morning: -1, late: -3, noon: -5 };
    energyAgeModifier += wakeScores[answers.q1] || 0;

    // Q3: Stress relief method (activity level)
    const stressScores = { active: -5, social: -2, passive: 2, rest: 4 };
    energyAgeModifier += stressScores[answers.q3] || 0;

    // Q6: Late night call response (energy/spontaneity)
    const nightScores = { excited: -5, maybe: -1, reluctant: 3, asleep: 5 };
    energyAgeModifier += nightScores[answers.q6] || 0;

    // Birth month seasonal factor (subtle influence)
    const birthMonth = parseInt(answers.birthMonth);
    if ([3, 4, 5].includes(birthMonth)) energyAgeModifier -= 1; // Spring babies
    if ([6, 7, 8].includes(birthMonth)) energyAgeModifier -= 2; // Summer babies
    if ([9, 10, 11].includes(birthMonth)) energyAgeModifier += 0; // Fall babies
    if ([12, 1, 2].includes(birthMonth)) energyAgeModifier += 1; // Winter babies

    // Calculate energy age with bounds
    let energyAge = realAge + energyAgeModifier;

    // Apply some randomness for variety (-2 to +2)
    const randomFactor = Math.floor(Math.random() * 5) - 2;
    energyAge += randomFactor;

    // Bound energy age between 15 and 80
    energyAge = Math.max(15, Math.min(80, energyAge));

    return Math.round(energyAge);
}

// ============================================
// DESCRIPTION DATABASE
// ============================================

const mentalAgeDescriptions = {
    en: {
        veryYoung: [ // -10 or more younger
            "Your mind is incredibly youthful! You embrace change with open arms and see the world with fresh eyes.",
            "You have an exceptionally young mindset! Your curiosity and adaptability are truly remarkable.",
            "Your mental age shows a beautifully youthful spirit! You approach life with wonder and enthusiasm."
        ],
        young: [ // -5 to -9 younger
            "You think younger than your years! Your open-minded approach keeps you mentally agile.",
            "Your mindset is refreshingly youthful! You stay curious and embrace new ideas easily.",
            "You have a young-at-heart mentality! Your flexibility and positivity shine through."
        ],
        slightlyYoung: [ // -1 to -4 younger
            "Your mind stays a bit younger than your age. You maintain a good balance of wisdom and openness.",
            "You have a slightly youthful mindset! You blend experience with fresh perspectives well.",
            "Your mental age reflects a nicely balanced outlook with a touch of youthful energy."
        ],
        balanced: [ // 0 to +2
            "Your mental age aligns well with your real age. You have a balanced and grounded mindset.",
            "You think exactly as expected for your age - mature yet adaptable when needed.",
            "Your mindset perfectly matches your life experience. Well-balanced and thoughtful!"
        ],
        slightlyOlder: [ // +3 to +5
            "Your mind carries a bit more wisdom than average. You tend to think carefully before acting.",
            "You have a slightly mature mindset. Your thoughtfulness and caution serve you well.",
            "Your mental age shows extra wisdom. You value stability and proven approaches."
        ],
        older: [ // +6 to +9
            "You have an old soul! Your mindset values tradition and established ways of doing things.",
            "Your thinking style is quite mature. You prefer the familiar and time-tested approaches.",
            "You have a notably mature mindset. Change comes slowly, but your wisdom runs deep."
        ],
        veryOld: [ // +10 or more older
            "You're an old soul in the truest sense! Your mindset values tradition and stability above all.",
            "Your mental age reflects deep-rooted wisdom. You strongly prefer what's proven and familiar.",
            "You have an exceptionally mature mindset. The old ways feel most comfortable to you."
        ]
    },
    ko: {
        veryYoung: [
            "당신의 정신은 놀라울 정도로 젊습니다! 변화를 열린 마음으로 받아들이고 세상을 새로운 눈으로 봅니다.",
            "예외적으로 젊은 마인드셋을 가지고 계시네요! 호기심과 적응력이 정말 뛰어납니다.",
            "아름다울 정도로 젊은 정신을 보여주고 있어요! 삶을 경이로움과 열정으로 대하시네요."
        ],
        young: [
            "나이보다 젊게 생각하시네요! 열린 마음가짐이 정신적으로 민첩하게 해줍니다.",
            "상쾌할 정도로 젊은 마인드셋이에요! 호기심을 유지하고 새로운 아이디어를 쉽게 받아들이시네요.",
            "마음이 젊은 분이시네요! 유연함과 긍정적인 면이 빛나고 있어요."
        ],
        slightlyYoung: [
            "마음이 나이보다 조금 젊게 유지되고 있어요. 지혜와 열린 마음의 좋은 균형을 유지하고 계시네요.",
            "약간 젊은 마인드셋을 가지고 계시네요! 경험과 새로운 관점을 잘 조화시키고 있어요.",
            "젊은 에너지가 살짝 느껴지는 균형 잡힌 시각을 보여주고 있어요."
        ],
        balanced: [
            "정신 나이가 실제 나이와 잘 맞아요. 균형 잡히고 현실적인 마인드셋을 가지고 계시네요.",
            "나이에 딱 맞게 생각하시네요 - 성숙하면서도 필요할 때 적응력을 발휘해요.",
            "마인드셋이 삶의 경험과 완벽하게 일치해요. 균형 잡히고 사려 깊으시네요!"
        ],
        slightlyOlder: [
            "평균보다 조금 더 많은 지혜를 가지고 계시네요. 행동하기 전에 신중하게 생각하는 경향이 있어요.",
            "약간 성숙한 마인드셋을 가지고 계시네요. 사려 깊음과 신중함이 도움이 될 거예요.",
            "정신 나이에서 여분의 지혜가 보여요. 안정성과 검증된 접근 방식을 중요시하시네요."
        ],
        older: [
            "오래된 영혼을 가지고 계시네요! 전통과 확립된 방식을 중요하게 생각하시는군요.",
            "꽤 성숙한 사고 방식을 가지고 계시네요. 익숙하고 검증된 접근 방식을 선호하시네요.",
            "눈에 띄게 성숙한 마인드셋이에요. 변화는 천천히 오지만, 지혜는 깊이 있어요."
        ],
        veryOld: [
            "진정한 의미의 오래된 영혼이시네요! 전통과 안정성을 무엇보다 중요하게 여기시는군요.",
            "깊이 뿌리내린 지혜를 반영하는 정신 나이에요. 검증되고 익숙한 것을 강하게 선호하시네요.",
            "예외적으로 성숙한 마인드셋을 가지고 계시네요. 오래된 방식이 가장 편안하게 느껴지시죠."
        ]
    }
};

const energyAgeDescriptions = {
    en: {
        veryYoung: [ // -10 or more younger
            "Your energy is off the charts! You have the vitality of someone much younger - keep that spark alive!",
            "Wow! Your energy levels are incredibly youthful. You're bursting with life and spontaneity!",
            "Your vitality is remarkable! You have boundless energy that defies your actual age."
        ],
        young: [ // -5 to -9 younger
            "You've got great energy! Your active lifestyle keeps you feeling vibrant and alive.",
            "Your vitality is impressive! You maintain excellent energy through your lifestyle choices.",
            "You're full of life! Your energy levels suggest an active and engaged lifestyle."
        ],
        slightlyYoung: [ // -1 to -4 younger
            "Your energy is nicely balanced with a youthful edge. You stay active and engaged with life.",
            "You maintain good energy levels! A healthy mix of activity and rest keeps you going.",
            "Your vitality shows a nice balance - energetic when needed, restful when appropriate."
        ],
        balanced: [ // 0 to +2
            "Your energy matches your age well. You know when to be active and when to rest.",
            "You have well-balanced energy levels. Your lifestyle suits your current life stage perfectly.",
            "Your vitality is right where it should be - sustainable and appropriate for your age."
        ],
        slightlyOlder: [ // +3 to +5
            "Your energy tends toward the calmer side. You prefer steady rhythms over bursts of activity.",
            "You have a more measured energy level. Quality rest and routine suit you well.",
            "Your vitality favors conservation over expenditure. You know the value of pacing yourself."
        ],
        older: [ // +6 to +9
            "Your energy prefers the slower lane. Rest and relaxation are important priorities for you.",
            "You have a notably calm energy pattern. You value peace and quiet over excitement.",
            "Your vitality runs at a gentler pace. You've learned that rest is productive too."
        ],
        veryOld: [ // +10 or more older
            "Your energy strongly favors rest and routine. Quiet evenings are your happy place.",
            "You have very calm, settled energy. The couch and early bedtime call your name!",
            "Your vitality is all about conservation. Why rush when you can rest?"
        ]
    },
    ko: {
        veryYoung: [
            "에너지가 대단해요! 훨씬 젊은 사람의 활력을 가지고 계시네요 - 그 불꽃을 계속 살려두세요!",
            "와우! 에너지 레벨이 믿을 수 없을 정도로 젊어요. 삶과 자발성으로 가득 차 있으시네요!",
            "활력이 놀라워요! 실제 나이를 무색하게 하는 무한한 에너지를 가지고 계시네요."
        ],
        young: [
            "에너지가 좋으시네요! 활동적인 라이프스타일이 생기 있고 활기차게 해줘요.",
            "활력이 인상적이에요! 라이프스타일 선택을 통해 훌륭한 에너지를 유지하고 계시네요.",
            "삶으로 가득 차 있으시네요! 에너지 레벨이 활동적이고 참여적인 라이프스타일을 보여줘요."
        ],
        slightlyYoung: [
            "에너지가 젊은 느낌으로 잘 균형 잡혀 있어요. 활동적이고 삶에 참여하고 계시네요.",
            "좋은 에너지 레벨을 유지하고 계시네요! 활동과 휴식의 건강한 조합이 당신을 움직이게 해요.",
            "활력이 좋은 균형을 보여줘요 - 필요할 때 에너지 넘치고, 적절할 때 휴식을 취하시네요."
        ],
        balanced: [
            "에너지가 나이와 잘 맞아요. 언제 활동하고 언제 쉬어야 할지 알고 계시네요.",
            "균형 잡힌 에너지 레벨을 가지고 계시네요. 라이프스타일이 현재 인생 단계에 완벽하게 맞아요.",
            "활력이 딱 적절한 수준이에요 - 지속 가능하고 나이에 적합해요."
        ],
        slightlyOlder: [
            "에너지가 차분한 쪽으로 기울어요. 활동 폭발보다 꾸준한 리듬을 선호하시네요.",
            "좀 더 절제된 에너지 레벨을 가지고 계시네요. 질 좋은 휴식과 루틴이 잘 맞아요.",
            "활력이 소비보다 보존을 선호해요. 페이스 조절의 가치를 알고 계시네요."
        ],
        older: [
            "에너지가 느린 레인을 선호해요. 휴식과 이완이 중요한 우선순위시네요.",
            "눈에 띄게 차분한 에너지 패턴을 가지고 계시네요. 흥분보다 평화와 고요함을 중요시해요.",
            "활력이 더 부드러운 페이스로 흘러요. 휴식도 생산적이라는 것을 배우셨네요."
        ],
        veryOld: [
            "에너지가 휴식과 루틴을 강하게 선호해요. 조용한 저녁이 당신의 행복한 장소네요.",
            "매우 차분하고 안정된 에너지를 가지고 계시네요. 소파와 이른 취침 시간이 부르고 있어요!",
            "활력이 모두 보존에 관한 것이에요. 쉴 수 있는데 왜 서두르나요?"
        ]
    }
};

// ============================================
// DESCRIPTION GETTER FUNCTIONS
// ============================================

function getMentalAgeDescription(gap, lang = 'en') {
    const descriptions = mentalAgeDescriptions[lang] || mentalAgeDescriptions.en;
    let category;

    if (gap <= -10) category = 'veryYoung';
    else if (gap <= -5) category = 'young';
    else if (gap <= -1) category = 'slightlyYoung';
    else if (gap <= 2) category = 'balanced';
    else if (gap <= 5) category = 'slightlyOlder';
    else if (gap <= 9) category = 'older';
    else category = 'veryOld';

    const options = descriptions[category];
    return options[Math.floor(Math.random() * options.length)];
}

function getEnergyAgeDescription(gap, lang = 'en') {
    const descriptions = energyAgeDescriptions[lang] || energyAgeDescriptions.en;
    let category;

    if (gap <= -10) category = 'veryYoung';
    else if (gap <= -5) category = 'young';
    else if (gap <= -1) category = 'slightlyYoung';
    else if (gap <= 2) category = 'balanced';
    else if (gap <= 5) category = 'slightlyOlder';
    else if (gap <= 9) category = 'older';
    else category = 'veryOld';

    const options = descriptions[category];
    return options[Math.floor(Math.random() * options.length)];
}

// ============================================
// DETAILED ANALYSIS GENERATOR
// ============================================

function generateDetailedAnalysis(results, lang = 'en') {
    const { realAge, mentalAge, energyAge } = results;
    const mentalGap = mentalAge - realAge;
    const energyGap = energyAge - realAge;

    const analysis = {
        en: {
            mental: generateMentalAnalysis(mentalGap, realAge, mentalAge, 'en'),
            energy: generateEnergyAnalysis(energyGap, realAge, energyAge, 'en'),
            overall: generateOverallAnalysis(mentalGap, energyGap, 'en')
        },
        ko: {
            mental: generateMentalAnalysis(mentalGap, realAge, mentalAge, 'ko'),
            energy: generateEnergyAnalysis(energyGap, realAge, energyAge, 'ko'),
            overall: generateOverallAnalysis(mentalGap, energyGap, 'ko')
        }
    };

    return analysis[lang] || analysis.en;
}

function generateMentalAnalysis(gap, realAge, mentalAge, lang) {
    if (lang === 'ko') {
        if (gap <= -5) {
            return `당신의 정신 나이 ${mentalAge}세는 실제 나이 ${realAge}세보다 ${Math.abs(gap)}세나 젊습니다! 이는 당신이 새로운 아이디어에 열린 마음을 가지고, 변화를 두려워하지 않으며, 젊은 세대와 잘 소통할 수 있다는 것을 의미합니다. 당신의 적응력과 호기심은 큰 자산이며, 이러한 젊은 마인드셋을 유지하면 인생의 도전을 더 유연하게 대처할 수 있습니다.`;
        } else if (gap <= 2) {
            return `당신의 정신 나이 ${mentalAge}세는 실제 나이 ${realAge}세와 균형을 이루고 있습니다. 이는 당신이 나이에 맞는 지혜와 경험을 가지면서도, 필요할 때 새로운 것을 받아들일 수 있는 유연성을 갖추고 있다는 것을 보여줍니다. 이러한 균형은 직장과 개인 생활 모두에서 신뢰할 수 있는 사람으로 인식되게 합니다.`;
        } else {
            return `당신의 정신 나이 ${mentalAge}세는 실제 나이 ${realAge}세보다 ${gap}세 더 성숙합니다. 이는 당신이 깊은 지혜와 경험을 바탕으로 신중하게 결정을 내린다는 것을 의미합니다. 전통과 안정성을 중요시하는 성향이 있으며, 이는 많은 상황에서 귀중한 자질입니다. 때로는 새로운 것에 도전해 보는 것도 좋은 경험이 될 수 있습니다.`;
        }
    } else {
        if (gap <= -5) {
            return `Your mental age of ${mentalAge} is ${Math.abs(gap)} years younger than your real age of ${realAge}! This indicates that you're open to new ideas, unafraid of change, and can connect well with younger generations. Your adaptability and curiosity are valuable assets, and maintaining this youthful mindset can help you navigate life's challenges with greater flexibility.`;
        } else if (gap <= 2) {
            return `Your mental age of ${mentalAge} is well-balanced with your real age of ${realAge}. This shows that you possess age-appropriate wisdom and experience while maintaining the flexibility to embrace new things when needed. This balance makes you appear trustworthy and reliable in both professional and personal settings.`;
        } else {
            return `Your mental age of ${mentalAge} is ${gap} years more mature than your real age of ${realAge}. This means you make careful, experience-based decisions and value tradition and stability. While this is a valuable quality in many situations, occasionally challenging yourself with something new could bring refreshing perspectives to your life.`;
        }
    }
}

function generateEnergyAnalysis(gap, realAge, energyAge, lang) {
    if (lang === 'ko') {
        if (gap <= -5) {
            return `당신의 에너지 나이 ${energyAge}세는 실제 나이 ${realAge}세보다 ${Math.abs(gap)}세나 젊습니다! 당신의 활동적인 라이프스타일, 사교적인 성격, 그리고 자발적인 에너지는 정말 인상적입니다. 운동, 친구 만남, 또는 늦은 밤 활동에 대한 당신의 열정은 신체적, 정신적 건강 모두에 긍정적인 영향을 미칩니다. 이 에너지를 잘 유지하세요!`;
        } else if (gap <= 2) {
            return `당신의 에너지 나이 ${energyAge}세는 실제 나이 ${realAge}세와 적절하게 균형을 이루고 있습니다. 당신은 언제 활동적이어야 하고 언제 휴식을 취해야 하는지 잘 알고 있습니다. 이러한 균형 잡힌 접근 방식은 지속 가능한 건강과 웰빙을 유지하는 데 이상적입니다. 활동과 회복 사이의 좋은 균형을 유지하고 계시네요.`;
        } else {
            return `당신의 에너지 나이 ${energyAge}세는 실제 나이 ${realAge}세보다 ${gap}세 더 많습니다. 이는 당신이 휴식과 안정적인 루틴을 선호한다는 것을 나타냅니다. 차분한 저녁과 규칙적인 수면 패턴을 중요시하는 것은 나쁜 것이 아닙니다! 다만, 가끔 가벼운 운동이나 친구들과의 활동을 추가하면 전반적인 활력이 향상될 수 있습니다.`;
        }
    } else {
        if (gap <= -5) {
            return `Your energy age of ${energyAge} is ${Math.abs(gap)} years younger than your real age of ${realAge}! Your active lifestyle, social nature, and spontaneous energy are truly impressive. Your enthusiasm for exercise, meeting friends, or late-night activities positively impacts both your physical and mental health. Keep that energy going!`;
        } else if (gap <= 2) {
            return `Your energy age of ${energyAge} is well-balanced with your real age of ${realAge}. You know when to be active and when to rest. This balanced approach is ideal for maintaining sustainable health and well-being. You're maintaining a good equilibrium between activity and recovery.`;
        } else {
            return `Your energy age of ${energyAge} is ${gap} years older than your real age of ${realAge}. This indicates that you prefer rest and stable routines. Valuing calm evenings and regular sleep patterns isn't a bad thing! However, occasionally adding light exercise or activities with friends could boost your overall vitality.`;
        }
    }
}

function generateOverallAnalysis(mentalGap, energyGap, lang) {
    const avgGap = (mentalGap + energyGap) / 2;

    if (lang === 'ko') {
        if (avgGap <= -5) {
            return "종합적으로, 당신은 나이에 비해 매우 젊은 마음과 에너지를 가지고 있습니다! 이러한 젊음의 비결을 잘 유지하세요.";
        } else if (avgGap <= 2) {
            return "종합적으로, 당신의 정신과 에너지 나이는 실제 나이와 잘 균형을 이루고 있습니다. 건강한 균형을 유지하고 계시네요!";
        } else {
            return "종합적으로, 당신은 차분하고 성숙한 에너지를 가지고 있습니다. 때로는 새로운 활동에 도전해보는 것도 좋습니다!";
        }
    } else {
        if (avgGap <= -5) {
            return "Overall, you have a remarkably young mind and energy for your age! Keep maintaining this secret to youth.";
        } else if (avgGap <= 2) {
            return "Overall, your mental and energy ages are well-balanced with your real age. You're maintaining a healthy equilibrium!";
        } else {
            return "Overall, you have calm and mature energy. Sometimes trying new activities can be refreshing!";
        }
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getAgeGapLabel(gap, lang = 'en') {
    if (lang === 'ko') {
        if (gap < 0) return `${Math.abs(gap)}세 젊음`;
        if (gap > 0) return `${gap}세 많음`;
        return '동일';
    } else {
        if (gap < 0) return `${Math.abs(gap)} years younger`;
        if (gap > 0) return `${gap} years older`;
        return 'Same';
    }
}

function getAgeGapColor(gap) {
    if (gap <= -5) return '#10b981'; // Green - very young
    if (gap <= -1) return '#34d399'; // Light green - young
    if (gap <= 2) return '#fbbf24';  // Yellow - balanced
    if (gap <= 5) return '#f97316';  // Orange - older
    return '#ef4444'; // Red - much older
}
