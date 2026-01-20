const analyzeSustainability = (product) => {
    let score = 50; // Base score
    const report = [];
    const credentials = {
        materials: 'Unknown',
        productionMethod: 'Standard Mass Production',
        certification: 'Pending Verification'
    };

    // 1. Category Baselines
    const category = product.category ? product.category.toLowerCase() : '';
    if (category.includes('grocer') || category.includes('food')) {
        score = 65;
        credentials.materials = 'Organic/Natural';
        report.push('Category Bonus: Consumable/Food products often have lower carbon footprint than electronics.');
    } else if (category.includes('laptop') || category.includes('smart') || category.includes('phone') || category.includes('electronic')) {
        score = 35; // E-waste risk
        credentials.materials = 'Composite (Metals/Plastics)';
        report.push('Category Penalty: High-tech electronics have significant carbon footprint and e-waste risk.');
    } else if (category.includes('furniture') || category.includes('home')) {
        score = 60;
        credentials.materials = 'Wood/Fabric';
    } else if (category.includes('beauty') || category.includes('skin')) {
        score = 55;
        credentials.materials = 'Chemical/Natural Mix';
    }

    // 2. Keyword Analysis (Description & Title)
    const text = (product.description + ' ' + product.title).toLowerCase();

    const goodKeywords = [
        'organic', 'natural', 'recycled', 'sustainable', 'eco-friendly',
        'wood', 'bamboo', 'cotton', 'glass', 'solar', 'energy efficient', 'biodegradable', 'handmade'
    ];

    const badKeywords = [
        'plastic', 'polyester', 'synthetic', 'disposable', 'battery', 'chemical', 'artificial'
    ];

    goodKeywords.forEach(word => {
        if (text.includes(word)) {
            score += 5;
            report.push(`Positive Keyword Found: "${word}" (+5)`);
            if (['wood', 'bamboo', 'glass', 'cotton'].includes(word)) credentials.materials = word.charAt(0).toUpperCase() + word.slice(1);
        }
    });

    badKeywords.forEach(word => {
        if (text.includes(word)) {
            score -= 5;
            report.push(`Negative Keyword Found: "${word}" (-5)`);
            if (['plastic', 'polyester', 'synthetic'].includes(word)) credentials.materials = word.charAt(0).toUpperCase() + word.slice(1);
        }
    });

    // 3. Normalize Score
    score = Math.min(100, Math.max(0, score));

    // 4. Generate Final Verdict
    if (score >= 80) credentials.certification = 'Eco-Champion (Automated)';
    else if (score >= 60) credentials.certification = 'Sustainable Choice (Automated)';
    else if (score >= 40) credentials.certification = 'Standard';
    else credentials.certification = 'Low Sustainability Score';

    return {
        ecoScore: score,
        ecoCredentials: credentials,
        verificationReport: report,
        isVerified: score >= 50 // Auto-verify if score is decent
    };
};

module.exports = { analyzeSustainability };
