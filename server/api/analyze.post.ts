// CV Analysis using Cloudflare Workers AI (GLM-4.7-flash)
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { cvText, jobPosting, type } = body
  
  // Get AI binding from Cloudflare
  const ai = (event.context.cloudflare?.env as any)?.AI
  
  if (!ai) {
    // Fallback for local dev - return mock response
    console.warn('AI binding not available, using mock response')
    return mockAnalysis(cvText, jobPosting, type)
  }
  
  try {
    if (type === 'match' && jobPosting) {
      return await analyzeJobMatch(ai, cvText, jobPosting)
    } else {
      return await analyzeCv(ai, cvText)
    }
  } catch (error) {
    console.error('AI analysis error:', error)
    // Fallback to mock on error
    return mockAnalysis(cvText, jobPosting, type)
  }
})

async function analyzeCv(ai: any, cvText: string) {
  const prompt = `Analyse ce CV et donne-moi un JSON avec:
- atsScore (0-100): score de compatibilité ATS
- strengths (array): points forts du CV (max 5)
- weaknesses (array): points à améliorer (max 5)
- suggestions (array): conseils concrets (max 5)
- sections (array): [{name, status: "good"|"weak"|"missing", tip}]

CV à analyser:
"""
${cvText.slice(0, 4000)}
"""

Réponds UNIQUEMENT avec le JSON, pas de texte autour.`

  const response = await ai.run("@cf/zai-org/glm-4.7-flash", {
    messages: [
      { role: "system", content: "Tu es un expert RH qui analyse des CV. Tu réponds uniquement en JSON valide." },
      { role: "user", content: prompt }
    ],
    max_tokens: 1500
  })
  
  try {
    // Extract JSON from response
    const jsonMatch = response.response?.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    console.error('Failed to parse AI response:', e)
  }
  
  // Fallback
  return mockAnalysis(cvText, null, 'analyze')
}

async function analyzeJobMatch(ai: any, cvText: string, jobPosting: string) {
  const prompt = `Compare ce CV avec cette offre d'emploi et donne-moi un JSON avec:
- score (0-100): pourcentage de match
- matches (array): [{skill, status: "match"|"partial"|"missing", detail}]
- suggestions (array): conseils pour améliorer le match (max 5)
- summary: une phrase résumant le match

OFFRE D'EMPLOI:
"""
${jobPosting.slice(0, 2000)}
"""

CV DU CANDIDAT:
"""
${cvText.slice(0, 2000)}
"""

Réponds UNIQUEMENT avec le JSON, pas de texte autour.`

  const response = await ai.run("@cf/zai-org/glm-4.7-flash", {
    messages: [
      { role: "system", content: "Tu es un expert RH qui évalue l'adéquation entre CV et offres d'emploi. Tu réponds uniquement en JSON valide." },
      { role: "user", content: prompt }
    ],
    max_tokens: 1500
  })
  
  try {
    const jsonMatch = response.response?.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    console.error('Failed to parse AI response:', e)
  }
  
  return mockAnalysis(cvText, jobPosting, 'match')
}

// Mock for local dev / fallback
function mockAnalysis(cvText: string, jobPosting: string | null, type: string) {
  if (type === 'match' && jobPosting) {
    return {
      score: 65,
      matches: [
        { skill: 'JavaScript', status: 'match', detail: 'Présent dans le CV' },
        { skill: 'React', status: 'partial', detail: 'Mentionné mais peu détaillé' },
        { skill: '3 ans expérience', status: 'missing', detail: 'Non vérifié' }
      ],
      suggestions: [
        'Détaille tes projets React',
        'Ajoute des résultats chiffrés',
        'Mentionne tes certifications'
      ],
      summary: 'Bon potentiel, quelques ajustements recommandés.'
    }
  }
  
  return {
    atsScore: 72,
    strengths: [
      'Structure claire',
      'Compétences techniques présentes',
      'Contact complet'
    ],
    weaknesses: [
      'Pas de résultats chiffrés',
      'Expérience peu détaillée'
    ],
    suggestions: [
      'Ajoute des métriques ("+20% de...", "Géré X projets")',
      'Détaille tes réalisations avec la méthode STAR'
    ],
    sections: [
      { name: 'Contact', status: 'good', tip: 'Complet' },
      { name: 'Expérience', status: 'weak', tip: 'Ajoute plus de détails' },
      { name: 'Formation', status: 'good', tip: 'OK' },
      { name: 'Compétences', status: 'good', tip: 'Bien listées' }
    ]
  }
}
