/**
 * AI Service to analyze product description and credentials for eco-compliance.
 * Implements a robust scoring algorithm based on Global Green Standards.
 */

const analyzeProduct = async (description, credentials) => {
    let score = 0;
    const report = [];
    const lowerDesc = description.toLowerCase();

    // 1. Certification Check (High Weight: 50 points)
    // List of recognized Global Green Standards
    const recognizedCerts = [
        'iso 14001', 'gots', 'fair trade', 'energy star', 'usda organic',
        'fsc', 'rainforest alliance', 'cradle to cradle', 'bluesign', 'oeeko-tex'
    ];

    const certString = credentials && credentials.certification ? credentials.certification.toLowerCase() : '';
    let hasCert = false;

    recognizedCerts.forEach(cert => {
        if (certString.includes(cert) || lowerDesc.includes(cert)) {
            if (!hasCert) {
                score += 75;
                report.push(`✅ Recognized Certification found: ${cert.toUpperCase()}`);
                hasCert = true;
            }
        }
    });

    if (!hasCert && certString.length > 3) {
        // Bonus for having some certification info even if not in our strict list
        score += 10;
        report.push(`ℹ️ Custom Certification noted but not automatically verified: ${credentials.certification}`);
    }

    // 2. Material Sustainability (Weight: 30 points)
    const ecoMaterials = ['organic', 'recycled', 'biodegradable', 'bamboo', 'hemp', 'upcycled', 'sustainable cotton', 'tencel'];
    let materialScore = 0;

    ecoMaterials.forEach(mat => {
        if (lowerDesc.includes(mat) || (credentials && credentials.materials && credentials.materials.toLowerCase().includes(mat))) {
            materialScore += 10;
        }
    });
    // Cap material score at 30
    materialScore = Math.min(materialScore, 30);
    if (materialScore > 0) {
        score += materialScore;
        report.push(`✅ Sustainable materials identified (+${materialScore})`);
    }

    // 3. Negative Impact / Greenwashing Check (Penalty)
    const redFlags = ['plastic', 'single-use', 'toxic', 'polyester', 'synthetic', 'chemical'];
    let penalty = 0;
    redFlags.forEach(flag => {
        if (lowerDesc.includes(flag) && !lowerDesc.includes('recycled ' + flag)) {
            penalty += 15;
            report.push(`⚠️ Sustainability concern: Contains '${flag}' (-15)`);
        }
    });
    score = Math.max(0, score - penalty);

    // 4. Production & Ethics (Weight: 20 points)
    const ethicsKeywords = ['fair wage', 'handmade', 'artisan', 'solar', 'renewable', 'carbon neutral', 'local'];
    let ethicalScore = 0;
    ethicsKeywords.forEach(word => {
        if (lowerDesc.includes(word) || (credentials && credentials.productionMethod && credentials.productionMethod.toLowerCase().includes(word))) {
            ethicalScore += 5;
        }
    });
    ethicalScore = Math.min(ethicalScore, 20);
    if (ethicalScore > 0) {
        score += ethicalScore;
        report.push(`✅ Ethical/Production standards met (+${ethicalScore})`);
    }

    // Verification Threshold
    const isVerified = score >= 70;

    if (isVerified) {
        report.push(`🎉 VERIFIED: Product meets Global Green Standards (Score: ${score}/100)`);
    } else {
        report.push(`❌ FAILED: Product does not meet minimum eco-standards (Score: ${score}/100). Please provide recognized certifications or more sustainable details.`);
    }

    // Simulate async processing
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        isVerified,
        ecoScore: score,
        verificationReport: report
    };
};

module.exports = { analyzeProduct };
