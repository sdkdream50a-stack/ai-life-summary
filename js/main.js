/**
 * AI Life Summary - Main Sentence Generation Logic
 * Contains 800+ sentence components for generating unique life summaries
 */

// Sentence Templates (50+)
const templates = [
    "You are someone who {trait} and {context}.",
    "Your journey is marked by {trait}, especially when {context}.",
    "Strength comes naturally when you {trait}, for you are {context}.",
    "In life, you {trait}—this is how you {context}.",
    "You find purpose through {trait}, and {context} guides your way.",
    "What defines you is how you {trait} while {context}.",
    "Your essence lies in {trait}, always {context}.",
    "You navigate life by {trait}, naturally {context}.",
    "The world sees someone who {trait}, yet beneath this, you are {context}.",
    "Your gift is {trait}, paired with the ability to {context}.",
    "You embody {trait}, which allows you to {context}.",
    "Life has taught you to {trait}, and now you {context}.",
    "At your core, you {trait}, and this helps you {context}.",
    "You were born to {trait}, destined to {context}.",
    "Your path is illuminated by {trait}, leading you to {context}.",
    "Others admire how you {trait} while effortlessly {context}.",
    "You carry within you {trait}, which empowers you to {context}.",
    "Your spirit is defined by {trait}, always seeking to {context}.",
    "The universe aligned to make you someone who {trait} and {context}.",
    "Deep inside, you {trait}, which naturally allows you to {context}.",
    "Your life story is one of {trait}, beautifully interwoven with {context}.",
    "You possess the rare ability to {trait}, enabling you to {context}.",
    "What makes you unique is how you {trait}, combined with {context}.",
    "Your destiny unfolds through {trait}, guiding you to {context}.",
    "You transform challenges by {trait}, ultimately {context}.",
    "The essence of your being is to {trait}, forever {context}.",
    "You illuminate the world by {trait}, gracefully {context}.",
    "Your heart knows how to {trait}, which is why you {context}.",
    "Life reveals itself to you through {trait}, as you continue to {context}.",
    "You are blessed with {trait}, allowing you to constantly {context}.",
    "Your authentic self shines when you {trait}, naturally {context}.",
    "The stars aligned for someone who {trait} and {context}.",
    "You have mastered {trait}, which enables you to {context}.",
    "Your inner light comes from {trait}, radiating outward as you {context}.",
    "You walk through life {trait}, always finding ways to {context}.",
    "Your presence is marked by {trait}, inspiring others to {context}.",
    "You create meaning by {trait}, while simultaneously {context}.",
    "The magic within you is {trait}, manifesting as you {context}.",
    "You stand apart because you {trait}, gracefully {context}.",
    "Your wisdom flows from {trait}, teaching you to {context}.",
    "You touch lives through {trait}, endlessly {context}.",
    "Your power comes from {trait}, which guides you to {context}.",
    "You heal the world by {trait}, compassionately {context}.",
    "Your legacy is built on {trait}, as you continue to {context}.",
    "You inspire others to {trait}, showing them how to {context}.",
    "The depth of your soul reveals {trait}, always {context}.",
    "You lead with {trait}, teaching others to {context}.",
    "Your journey celebrates {trait}, forever {context}.",
    "You embrace life by {trait}, joyfully {context}.",
    "Your truth is found in {trait}, expressed through {context}."
];

// Traits (200+)
const traits = [
    // Resilience Category
    "bounce back from challenges with remarkable grace",
    "find strength in moments of adversity",
    "grow through difficult times with wisdom",
    "transform setbacks into stepping stones",
    "rise stronger after every fall",
    "embrace obstacles as opportunities for growth",
    "maintain hope even in darkness",
    "persist when others would give up",
    "turn pain into purpose",
    "weather storms with unwavering spirit",
    "rebuild yourself from the ground up",
    "face fears with courage and determination",
    "stand firm when life tests you",
    "find the silver lining in every cloud",
    "emerge from trials transformed",
    "carry scars as badges of honor",
    "refuse to be defined by setbacks",
    "discover inner resources you never knew existed",
    "thrive under pressure",
    "turn wounds into wisdom",

    // Creativity Category
    "see beauty in unexpected places",
    "turn imagination into reality",
    "paint life with unique colors",
    "find creative solutions to complex problems",
    "express yourself through multiple mediums",
    "connect ideas that others overlook",
    "bring fresh perspectives to old situations",
    "create something from nothing",
    "dream in vivid possibilities",
    "think outside conventional boundaries",
    "transform the ordinary into extraordinary",
    "weave stories from everyday moments",
    "see the world through an artist's eyes",
    "innovate where others imitate",
    "bring ideas to life with passion",
    "find inspiration in unexpected sources",
    "craft beauty from chaos",
    "envision possibilities others cannot see",
    "approach life as a creative canvas",
    "merge logic with imagination",

    // Empathy Category
    "understand others at a profound level",
    "feel the world's emotions deeply",
    "connect hearts across distances",
    "sense what others need before they ask",
    "offer comfort without needing words",
    "walk in others' shoes naturally",
    "create safe spaces for vulnerability",
    "listen with your whole being",
    "recognize the humanity in everyone",
    "bridge divides with compassion",
    "hold space for others' pain",
    "celebrate others' joys as your own",
    "intuit the unspoken feelings around you",
    "heal through presence alone",
    "bring people together through understanding",
    "see beyond surface appearances",
    "respond to emotional undercurrents",
    "nurture those who need it most",
    "transform conflict through empathy",
    "carry others' burdens with grace",

    // Wisdom Category
    "learn from every experience",
    "see patterns others miss",
    "find meaning in silence",
    "apply knowledge with discernment",
    "balance heart and mind perfectly",
    "know when to speak and when to listen",
    "see the bigger picture clearly",
    "make decisions with foresight",
    "understand timing and patience",
    "recognize truth in complexity",
    "distill wisdom from chaos",
    "guide others with gentle insight",
    "know yourself deeply",
    "accept what cannot be changed",
    "choose battles worth fighting",
    "find peace in uncertainty",
    "recognize lessons in disguise",
    "balance idealism with pragmatism",
    "trust the journey even without the map",
    "embrace paradox and complexity",

    // Adventure Category
    "seek new horizons fearlessly",
    "embrace the unknown with excitement",
    "write your own story boldly",
    "explore uncharted territories",
    "say yes to new experiences",
    "break free from comfort zones",
    "discover yourself through travel",
    "find magic in the unfamiliar",
    "collect experiences over possessions",
    "live life as an expedition",
    "chase dreams across boundaries",
    "turn life into an adventure",
    "explore both inner and outer worlds",
    "seek thrills that expand your soul",
    "embrace spontaneity with joy",
    "find freedom in movement",
    "let curiosity guide your path",
    "discover wonder in new places",
    "transform routine into discovery",
    "explore the edges of possibility",

    // Leadership Category
    "inspire others through example",
    "lead with integrity and purpose",
    "bring out the best in people",
    "unite diverse groups toward common goals",
    "make tough decisions with grace",
    "serve those you lead",
    "communicate vision clearly",
    "empower others to grow",
    "take responsibility for outcomes",
    "create positive change around you",
    "stand for what you believe",
    "guide without dominating",
    "build teams that thrive",
    "navigate complexity with clarity",
    "inspire loyalty through authenticity",
    "lead through service",
    "create environments where others flourish",
    "balance confidence with humility",
    "make others feel valued",
    "chart courses others follow",

    // Connection Category
    "build bridges between people",
    "create lasting relationships",
    "bring people together naturally",
    "maintain bonds across time and distance",
    "communicate with authenticity",
    "make others feel seen and heard",
    "cultivate community wherever you go",
    "turn strangers into friends",
    "nurture relationships with care",
    "find common ground with anyone",
    "weave networks of support",
    "remember what matters to others",
    "show up for people consistently",
    "create belonging for the isolated",
    "strengthen bonds through trust",
    "connect generations and cultures",
    "build family wherever you are",
    "make meaningful connections quickly",
    "keep relationships alive across years",
    "bring warmth to every interaction",

    // Authenticity Category
    "stay true to yourself always",
    "express your genuine nature",
    "live according to your values",
    "refuse to wear masks for others",
    "embrace your unique quirks",
    "honor your inner truth",
    "speak your mind with kindness",
    "live without pretense",
    "accept yourself fully",
    "show up as your real self",
    "own your story without shame",
    "celebrate your individuality",
    "align actions with beliefs",
    "trust your inner voice",
    "be comfortable in your own skin",
    "express vulnerability courageously",
    "reject conformity for authenticity",
    "honor your needs without guilt",
    "embrace all parts of yourself",
    "live your truth boldly",

    // Growth Category
    "embrace continuous improvement",
    "learn from mistakes gracefully",
    "seek growth in every situation",
    "evolve beyond your limitations",
    "transform through self-reflection",
    "push boundaries regularly",
    "invest in personal development",
    "welcome feedback openly",
    "stretch beyond comfort",
    "become better each day",
    "unlock hidden potential",
    "pursue mastery in your craft",
    "expand your capabilities constantly",
    "embrace the journey of becoming",
    "set goals that challenge you",
    "learn from everyone you meet",
    "refine yourself through experience",
    "grow through conscious effort",
    "evolve in response to life",
    "pursue excellence relentlessly",

    // Intuition Category
    "trust your gut instincts",
    "sense what logic cannot explain",
    "read between the lines naturally",
    "know things before they happen",
    "follow your inner compass",
    "perceive hidden truths",
    "navigate by inner knowing",
    "feel the energy of situations",
    "make decisions from the heart",
    "sense opportunities others miss",
    "trust the whispers of your soul",
    "recognize signs and synchronicities",
    "follow hunches that prove right",
    "understand without explanation",
    "feel your way through darkness",
    "tap into deeper knowledge",
    "honor your sixth sense",
    "let instinct guide you",
    "perceive the invisible connections",
    "trust what you feel to be true"
];

// Contexts (200+)
const contexts = [
    // Finding meaning
    "finding meaning in the smallest moments",
    "discovering purpose in unexpected places",
    "creating significance from ordinary days",
    "understanding the deeper layers of life",
    "seeking truth in everything you do",
    "illuminating darkness for others",
    "transforming experiences into wisdom",
    "building a legacy of love",
    "making each moment count",
    "living with intention and purpose",
    "finding your unique path",
    "creating your own definition of success",
    "pursuing what truly matters",
    "aligning with your higher purpose",
    "discovering your life's calling",
    "contributing to something greater",
    "leaving the world better than you found it",
    "making a difference in quiet ways",
    "living a life of significance",
    "crafting a meaningful existence",

    // Relationships
    "nurturing the relationships that matter most",
    "creating a family of choice and love",
    "building connections that transcend time",
    "being the person others can rely on",
    "spreading kindness wherever you go",
    "touching lives in profound ways",
    "building bridges across differences",
    "creating harmony in your circles",
    "being a source of support for many",
    "cultivating deep and lasting bonds",
    "inspiring those fortunate to know you",
    "leading others toward their potential",
    "healing relationships around you",
    "bringing people together",
    "being someone's anchor in storms",
    "creating a ripple effect of positivity",
    "mentoring the next generation",
    "being present for those who need you",
    "celebrating others' successes genuinely",
    "making everyone feel valued",

    // Personal growth
    "becoming the best version of yourself",
    "evolving through every experience",
    "embracing transformation courageously",
    "learning from each chapter of life",
    "growing stronger with every challenge",
    "expanding your horizons continuously",
    "developing wisdom through reflection",
    "refining your character daily",
    "unlocking your hidden potential",
    "pursuing excellence in all you do",
    "pushing past your perceived limits",
    "welcoming change as a teacher",
    "transforming obstacles into opportunities",
    "embracing the journey of self-discovery",
    "building resilience through experience",
    "cultivating your unique gifts",
    "honoring your personal evolution",
    "walking the path of continuous learning",
    "becoming who you were meant to be",
    "growing through conscious effort",

    // Living fully
    "embracing life's adventures wholeheartedly",
    "living each day with gratitude",
    "finding joy in simple pleasures",
    "creating beautiful memories",
    "experiencing life to its fullest",
    "savoring every precious moment",
    "dancing through life with grace",
    "celebrating existence itself",
    "making every day an adventure",
    "finding wonder in the ordinary",
    "living with passion and purpose",
    "embracing both light and shadow",
    "creating a life you love",
    "finding balance in chaos",
    "thriving in your own unique way",
    "writing your own rules for happiness",
    "living authentically and freely",
    "pursuing dreams without apology",
    "creating space for what matters",
    "designing a life of intention",

    // Impact and legacy
    "making the world a little brighter",
    "leaving a positive mark on humanity",
    "creating change that ripples outward",
    "building something that outlasts you",
    "inspiring future generations",
    "contributing to collective progress",
    "being a force for good",
    "championing causes close to your heart",
    "creating solutions that help many",
    "being remembered for kindness",
    "building bridges for others to cross",
    "planting seeds you may never see bloom",
    "making lasting contributions",
    "being part of something larger",
    "creating positive change around you",
    "standing up for what's right",
    "using your gifts to serve others",
    "building a better tomorrow",
    "leaving places better than you found them",
    "being the change you wish to see",

    // Inner peace
    "maintaining inner calm amid chaos",
    "finding peace within yourself",
    "creating stillness in a busy world",
    "accepting what cannot be changed",
    "finding contentment in the present",
    "releasing what no longer serves you",
    "embracing serenity as a practice",
    "balancing action with reflection",
    "finding your center always",
    "cultivating inner harmony",
    "letting go with grace",
    "finding strength in stillness",
    "creating sanctuary within",
    "practicing acceptance daily",
    "finding calm in any storm",
    "trusting life's unfolding",
    "embracing impermanence peacefully",
    "finding freedom in letting go",
    "maintaining equanimity through change",
    "resting in your true nature",

    // Creativity and expression
    "expressing your unique voice",
    "creating beauty wherever you go",
    "sharing your gifts with the world",
    "bringing ideas to life",
    "transforming vision into reality",
    "inspiring creativity in others",
    "painting your world with imagination",
    "crafting experiences that matter",
    "building something meaningful",
    "expressing truth through art",
    "creating with passion and purpose",
    "bringing fresh perspectives to life",
    "manifesting your dreams",
    "sharing your inner world",
    "creating what only you can create",
    "giving form to the formless",
    "translating feelings into expression",
    "building bridges through creativity",
    "inspiring through your unique vision",
    "making the intangible tangible",

    // Courage and authenticity
    "walking your own path bravely",
    "standing in your truth",
    "facing life with courage",
    "being unapologetically yourself",
    "following your heart fearlessly",
    "breaking free from expectations",
    "charting your own course",
    "living on your own terms",
    "embracing your authentic self",
    "defying limitations with grace",
    "pursuing your unique destiny",
    "honoring your individual journey",
    "being true to your values",
    "standing firm in your beliefs",
    "living without regret",
    "choosing courage over comfort",
    "owning your story completely",
    "being real in a filtered world",
    "walking tall in your truth",
    "living with integrity always",

    // Love and compassion
    "spreading love wherever you go",
    "being a source of compassion",
    "opening hearts around you",
    "healing through unconditional love",
    "being kind without expectation",
    "loving deeply and completely",
    "showing compassion to all beings",
    "being a beacon of warmth",
    "nurturing with your whole heart",
    "loving even when it's hard",
    "being gentle with yourself and others",
    "forgiving freely and fully",
    "holding space for others' pain",
    "loving without conditions",
    "being a safe harbor for many",
    "radiating warmth to everyone",
    "caring deeply about others' wellbeing",
    "loving through actions more than words",
    "being someone's reason to smile",
    "spreading kindness like wildflowers",

    // Wisdom and insight
    "sharing wisdom gained through experience",
    "seeing what others overlook",
    "guiding with gentle insight",
    "understanding life's deeper currents",
    "recognizing patterns and connections",
    "offering perspective when needed",
    "navigating complexity with clarity",
    "distilling truth from noise",
    "knowing when silence speaks loudest",
    "teaching through your example",
    "understanding the rhythm of life",
    "perceiving hidden truths",
    "offering counsel with care",
    "seeing beyond surface appearances",
    "understanding human nature deeply",
    "recognizing wisdom in unexpected places",
    "learning from every experience",
    "growing wiser with each year",
    "sharing lessons learned gracefully",
    "understanding life's greater patterns"
];

// Core Traits (for insights section)
const coreTraits = [
    "Resilience", "Creativity", "Empathy", "Wisdom", "Adventure",
    "Leadership", "Connection", "Authenticity", "Growth", "Intuition",
    "Compassion", "Courage", "Curiosity", "Determination", "Harmony",
    "Innovation", "Kindness", "Patience", "Passion", "Serenity",
    "Vision", "Adaptability", "Balance", "Depth", "Energy",
    "Focus", "Generosity", "Hope", "Integrity", "Joy",
    "Knowledge", "Love", "Mindfulness", "Nurturing", "Optimism",
    "Perseverance", "Quest", "Reflection", "Strength", "Trust"
];

// Life Phases
const lifePhases = [
    "Discovery", "Growth", "Transformation", "Integration", "Mastery",
    "Expansion", "Renewal", "Deepening", "Awakening", "Flourishing",
    "Exploration", "Creation", "Foundation", "Evolution", "Illumination",
    "Emergence", "Ascension", "Cultivation", "Revelation", "Transcendence"
];

// Lucky Elements
const elements = [
    "Water", "Fire", "Earth", "Air", "Ether",
    "Wood", "Metal", "Light", "Shadow", "Crystal",
    "Storm", "Moon", "Sun", "Star", "Ocean"
];

/**
 * Create a hash from birthdate string
 * @param {string} birthdate - Date string in YYYY-MM-DD format
 * @returns {number} - Hash value
 */
function createHash(birthdate) {
    const date = new Date(birthdate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Create a deterministic hash
    let hash = 0;
    const dateString = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;

    for (let i = 0; i < dateString.length; i++) {
        const char = dateString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }

    // Make it positive
    return Math.abs(hash);
}

/**
 * Generate secondary hash for more variation
 * @param {number} primaryHash - Primary hash value
 * @param {number} modifier - Modifier for variation
 * @returns {number} - Secondary hash value
 */
function secondaryHash(primaryHash, modifier) {
    return Math.abs((primaryHash * 31 + modifier * 17) % 2147483647);
}

/**
 * Generate life summary based on birthdate and gender
 * @param {string} birthdate - Date string in YYYY-MM-DD format
 * @param {string} gender - Gender selection
 * @returns {object} - Result object containing sentence and insights
 */
function generateLifeSummary(birthdate, gender) {
    const hash = createHash(birthdate);

    // Select components using hash
    const templateIndex = hash % templates.length;
    const traitIndex = secondaryHash(hash, 1) % traits.length;
    const contextIndex = secondaryHash(hash, 2) % contexts.length;

    // Generate the sentence
    let sentence = templates[templateIndex]
        .replace('{trait}', traits[traitIndex])
        .replace('{context}', contexts[contextIndex]);

    // Capitalize first letter after "You"
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);

    // Generate insights
    const coreTraitIndex = secondaryHash(hash, 3) % coreTraits.length;
    const lifePhaseIndex = secondaryHash(hash, 4) % lifePhases.length;
    const elementIndex = secondaryHash(hash, 5) % elements.length;

    return {
        sentence: sentence,
        coreTrait: coreTraits[coreTraitIndex],
        lifePhase: lifePhases[lifePhaseIndex],
        element: elements[elementIndex],
        hash: hash
    };
}

/**
 * Get all sentences for a specific birth month/year (for archive)
 * @param {number} year - Year
 * @param {number} month - Month (1-12)
 * @returns {array} - Array of sentences for each day
 */
function getMonthSentences(year, month) {
    const sentences = [];
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const result = generateLifeSummary(dateStr, 'prefer-not-to-say');
        sentences.push({
            day: day,
            sentence: result.sentence
        });
    }

    return sentences;
}

/**
 * Get example sentences for display
 * @param {number} count - Number of examples to generate
 * @returns {array} - Array of example sentences
 */
function getExampleSentences(count = 6) {
    const examples = [];
    const sampleDates = [
        '1990-03-15', '1985-09-22', '1995-07-08',
        '1988-12-01', '1992-02-14', '1998-05-30',
        '1982-11-11', '1975-04-25', '2000-08-19',
        '1993-06-07', '1987-01-28', '1996-10-12'
    ];

    for (let i = 0; i < Math.min(count, sampleDates.length); i++) {
        const result = generateLifeSummary(sampleDates[i], 'prefer-not-to-say');
        examples.push({
            sentence: result.sentence,
            month: new Date(sampleDates[i]).toLocaleString('en-US', { month: 'long' })
        });
    }

    return examples;
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateLifeSummary,
        getMonthSentences,
        getExampleSentences,
        createHash
    };
}
