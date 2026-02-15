<script setup lang="ts">
const cvText = ref('')
const isAnalyzing = ref(false)
const result = ref<AnalysisResult | null>(null)

interface AnalysisResult {
  atsScore: number
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  sections: { name: string; status: 'good' | 'missing' | 'weak'; tip: string }[]
}

async function analyzeCV() {
  if (!cvText.value.trim()) return
  
  isAnalyzing.value = true
  result.value = null
  
  try {
    // Call API with Workers AI (GLM-4.7-flash)
    const response = await $fetch('/api/analyze', {
      method: 'POST',
      body: {
        cvText: cvText.value,
        type: 'analyze'
      }
    })
    result.value = response as AnalysisResult
  } catch (error) {
    console.error('API error, falling back to local:', error)
    // Fallback to local analysis
    result.value = analyzeLocally(cvText.value)
  } finally {
    isAnalyzing.value = false
  }
}

function analyzeLocally(cv: string): AnalysisResult {
  const cvLower = cv.toLowerCase()
  const lines = cv.split('\n').filter(l => l.trim())
  
  const strengths: string[] = []
  const weaknesses: string[] = []
  const suggestions: string[] = []
  
  // Analyse des sections
  const sections: AnalysisResult['sections'] = []
  
  // Contact
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(cv)
  const hasPhone = /(?:\+33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/.test(cv)
  if (hasEmail && hasPhone) {
    sections.push({ name: 'Contact', status: 'good', tip: 'Email et téléphone présents' })
  } else {
    sections.push({ name: 'Contact', status: hasEmail || hasPhone ? 'weak' : 'missing', tip: 'Ajoute email ET téléphone' })
    weaknesses.push('Informations de contact incomplètes')
  }
  
  // Expérience
  const hasExperience = /expérience|experience|poste|emploi|stage|job/i.test(cv)
  const expCount = (cv.match(/\d{4}\s*[-–]\s*(?:\d{4}|présent|actuel|aujourd)/gi) || []).length
  if (expCount >= 2) {
    sections.push({ name: 'Expérience', status: 'good', tip: `${expCount} expériences détectées` })
    strengths.push(`${expCount} expériences professionnelles listées`)
  } else if (hasExperience) {
    sections.push({ name: 'Expérience', status: 'weak', tip: 'Ajoute plus de détails (dates, résultats)' })
  } else {
    sections.push({ name: 'Expérience', status: 'missing', tip: 'Ajoute tes stages, jobs étudiants, projets' })
    weaknesses.push('Section expérience manquante ou faible')
  }
  
  // Formation
  const hasEducation = /formation|éducation|education|diplôme|master|licence|bac|école|université|university/i.test(cv)
  if (hasEducation) {
    sections.push({ name: 'Formation', status: 'good', tip: 'Formation mentionnée' })
    strengths.push('Parcours de formation présent')
  } else {
    sections.push({ name: 'Formation', status: 'missing', tip: 'Ajoute ton parcours scolaire' })
    weaknesses.push('Formation non mentionnée')
  }
  
  // Compétences
  const techSkills = ['javascript', 'python', 'react', 'vue', 'node', 'sql', 'java', 'php', 'excel', 'word', 'photoshop', 'figma']
  const foundSkills = techSkills.filter(s => cvLower.includes(s))
  if (foundSkills.length >= 3) {
    sections.push({ name: 'Compétences', status: 'good', tip: `${foundSkills.length} compétences techniques détectées` })
    strengths.push(`Compétences techniques variées (${foundSkills.slice(0, 3).join(', ')}...)`)
  } else if (foundSkills.length > 0) {
    sections.push({ name: 'Compétences', status: 'weak', tip: 'Ajoute plus de compétences spécifiques' })
  } else {
    sections.push({ name: 'Compétences', status: 'missing', tip: 'Liste tes compétences techniques et soft skills' })
    weaknesses.push('Compétences techniques non listées')
  }
  
  // Mots d'action
  const actionWords = ['développé', 'créé', 'géré', 'organisé', 'augmenté', 'réduit', 'amélioré', 'lancé', 'dirigé', 'conçu', 'implemented', 'managed', 'led', 'created']
  const foundActions = actionWords.filter(w => cvLower.includes(w))
  if (foundActions.length >= 3) {
    strengths.push('Utilisation de verbes d\'action percutants')
  } else {
    suggestions.push('Utilise plus de verbes d\'action : "Développé", "Géré", "Augmenté de X%"')
  }
  
  // Chiffres et résultats
  const hasNumbers = /\d+\s*%|\+\s*\d+|€\s*\d+|\d+\s*€|\d+\s*(?:utilisateurs|clients|projets)/i.test(cv)
  if (hasNumbers) {
    strengths.push('Résultats quantifiés présents')
  } else {
    suggestions.push('Quantifie tes résultats : "+20% de ventes", "Géré 5 projets", etc.')
  }
  
  // Longueur
  const wordCount = cv.split(/\s+/).length
  if (wordCount < 150) {
    weaknesses.push('CV trop court — développe tes expériences')
  } else if (wordCount > 800) {
    weaknesses.push('CV trop long — synthétise (1 page max pour étudiant)')
  }
  
  // LinkedIn / Portfolio
  const hasLinks = /linkedin|github|portfolio|behance|dribbble/i.test(cv)
  if (hasLinks) {
    strengths.push('Liens professionnels présents (LinkedIn, GitHub...)')
  } else {
    suggestions.push('Ajoute ton LinkedIn et/ou GitHub si pertinent')
  }
  
  // Calcul score ATS
  let atsScore = 50
  atsScore += sections.filter(s => s.status === 'good').length * 10
  atsScore -= sections.filter(s => s.status === 'missing').length * 10
  atsScore += strengths.length * 3
  atsScore -= weaknesses.length * 5
  atsScore = Math.max(0, Math.min(100, atsScore))
  
  return { atsScore, strengths, weaknesses, suggestions, sections }
}

function getSectionIcon(status: string) {
  switch (status) {
    case 'good': return '✅'
    case 'weak': return '⚠️'
    case 'missing': return '❌'
    default: return '•'
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <NuxtLink to="/" class="text-purple-600 hover:underline mb-4 inline-block">← Retour</NuxtLink>
        <h1 class="text-3xl font-bold text-gray-900">🔍 CV Analyzer</h1>
        <p class="text-gray-600 mt-2">Comprends tes forces et faiblesses en 30 secondes</p>
      </div>

      <!-- Input -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          📄 Colle ton CV ici
        </label>
        <textarea
          v-model="cvText"
          placeholder="Copie-colle le contenu de ton CV..."
          class="w-full h-64 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
        />
        
        <div class="text-center mt-4">
          <button
            @click="analyzeCV"
            :disabled="isAnalyzing || !cvText.trim()"
            class="px-8 py-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <span v-if="isAnalyzing">Analyse en cours...</span>
            <span v-else>🔍 Analyser mon CV</span>
          </button>
        </div>
      </div>

      <!-- Results -->
      <div v-if="result" class="space-y-6">
        <!-- ATS Score -->
        <div class="bg-white rounded-xl shadow-sm p-8 text-center">
          <div class="text-sm text-gray-500 mb-2">Score ATS</div>
          <div class="text-6xl font-bold" :class="result.atsScore >= 70 ? 'text-green-600' : result.atsScore >= 50 ? 'text-yellow-600' : 'text-red-600'">
            {{ result.atsScore }}%
          </div>
          <p class="text-gray-600 mt-2">
            {{ result.atsScore >= 70 ? 'Ton CV passera la plupart des filtres ATS' : result.atsScore >= 50 ? 'Quelques améliorations recommandées' : 'Des ajustements importants sont nécessaires' }}
          </p>
          <div class="w-full max-w-md mx-auto h-4 bg-gray-200 rounded-full mt-4 overflow-hidden">
            <div 
              class="h-full rounded-full transition-all duration-500"
              :class="result.atsScore >= 70 ? 'bg-green-500' : result.atsScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'"
              :style="{ width: result.atsScore + '%' }"
            />
          </div>
        </div>

        <!-- Sections Check -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold mb-4">📋 Sections essentielles</h3>
          <div class="grid gap-3">
            <div 
              v-for="section in result.sections" 
              :key="section.name"
              class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <span class="text-xl">{{ getSectionIcon(section.status) }}</span>
              <span class="font-medium">{{ section.name }}</span>
              <span class="text-sm text-gray-500 ml-auto">{{ section.tip }}</span>
            </div>
          </div>
        </div>

        <!-- Strengths & Weaknesses -->
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Strengths -->
          <div class="bg-green-50 rounded-xl p-6">
            <h3 class="text-lg font-semibold text-green-800 mb-4">💪 Tes forces</h3>
            <ul class="space-y-2">
              <li v-for="(strength, i) in result.strengths" :key="i" class="flex items-start gap-2 text-green-700">
                <span>✓</span>
                {{ strength }}
              </li>
              <li v-if="result.strengths.length === 0" class="text-green-600 italic">
                Continue à enrichir ton CV !
              </li>
            </ul>
          </div>

          <!-- Weaknesses -->
          <div class="bg-red-50 rounded-xl p-6">
            <h3 class="text-lg font-semibold text-red-800 mb-4">⚠️ À améliorer</h3>
            <ul class="space-y-2">
              <li v-for="(weakness, i) in result.weaknesses" :key="i" class="flex items-start gap-2 text-red-700">
                <span>•</span>
                {{ weakness }}
              </li>
              <li v-if="result.weaknesses.length === 0" class="text-green-600 italic">
                Rien de critique détecté 🎉
              </li>
            </ul>
          </div>
        </div>

        <!-- Suggestions -->
        <div v-if="result.suggestions.length > 0" class="bg-blue-50 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-blue-800 mb-4">💡 Suggestions</h3>
          <ul class="space-y-2">
            <li v-for="(suggestion, i) in result.suggestions" :key="i" class="flex items-start gap-2 text-blue-700">
              <span>→</span>
              {{ suggestion }}
            </li>
          </ul>
        </div>

        <!-- CTA -->
        <div class="text-center pt-4">
          <NuxtLink 
            to="/create"
            class="inline-block px-8 py-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all"
          >
            🛠️ Créer un CV optimisé
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
