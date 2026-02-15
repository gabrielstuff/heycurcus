<script setup lang="ts">
const jobPosting = ref('')
const cvText = ref('')
const isAnalyzing = ref(false)
const result = ref<MatchResult | null>(null)

interface MatchResult {
  score: number
  matches: { skill: string; status: 'match' | 'partial' | 'missing'; detail: string }[]
  suggestions: string[]
  summary: string
}

async function analyzeMatch() {
  if (!jobPosting.value.trim() || !cvText.value.trim()) return
  
  isAnalyzing.value = true
  result.value = null
  
  try {
    // Call API with Workers AI
    const response = await $fetch('/api/analyze', {
      method: 'POST',
      body: {
        cvText: cvText.value,
        jobPosting: jobPosting.value,
        type: 'match'
      }
    })
    result.value = response as MatchResult
  } catch (error) {
    console.error('API error, falling back to local:', error)
    // Fallback to local analysis
    result.value = analyzeLocally(jobPosting.value, cvText.value)
  } finally {
    isAnalyzing.value = false
  }
}

function analyzeLocally(job: string, cv: string): MatchResult {
  const jobLower = job.toLowerCase()
  const cvLower = cv.toLowerCase()
  
  // Extraction basique des compétences techniques courantes
  const techSkills = [
    'javascript', 'typescript', 'react', 'vue', 'angular', 'node', 'python',
    'java', 'php', 'ruby', 'go', 'rust', 'sql', 'mongodb', 'postgresql',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'ci/cd',
    'html', 'css', 'sass', 'tailwind', 'figma', 'photoshop',
    'agile', 'scrum', 'jira', 'management', 'leadership'
  ]
  
  // Extraction des années d'expérience
  const expMatch = job.match(/(\d+)\s*(?:ans?|years?|yr)/i)
  const requiredExp = expMatch ? parseInt(expMatch[1]) : 0
  
  const cvExpMatch = cv.match(/(\d+)\s*(?:ans?|years?|yr)/i)
  const candidateExp = cvExpMatch ? parseInt(cvExpMatch[1]) : 0
  
  const matches: MatchResult['matches'] = []
  let matchCount = 0
  let totalRequired = 0
  
  // Analyser chaque skill
  for (const skill of techSkills) {
    const inJob = jobLower.includes(skill)
    const inCv = cvLower.includes(skill)
    
    if (inJob) {
      totalRequired++
      if (inCv) {
        matches.push({ skill, status: 'match', detail: 'Présent dans ton CV' })
        matchCount++
      } else {
        matches.push({ skill, status: 'missing', detail: 'Requis mais absent de ton CV' })
      }
    }
  }
  
  // Expérience
  if (requiredExp > 0) {
    totalRequired++
    if (candidateExp >= requiredExp) {
      matches.push({ 
        skill: `${requiredExp} ans d'expérience`, 
        status: 'match', 
        detail: `Tu as ${candidateExp} ans` 
      })
      matchCount++
    } else if (candidateExp > 0) {
      matches.push({ 
        skill: `${requiredExp} ans d'expérience`, 
        status: 'partial', 
        detail: `Tu as ${candidateExp} ans (${requiredExp - candidateExp} ans de moins)` 
      })
      matchCount += 0.5
    } else {
      matches.push({ 
        skill: `${requiredExp} ans d'expérience`, 
        status: 'missing', 
        detail: 'Non mentionné dans ton CV' 
      })
    }
  }
  
  // Calculer le score
  const score = totalRequired > 0 ? Math.round((matchCount / totalRequired) * 100) : 50
  
  // Générer des suggestions
  const suggestions: string[] = []
  const missingSkills = matches.filter(m => m.status === 'missing').map(m => m.skill)
  
  if (missingSkills.length > 0) {
    suggestions.push(`Ajoute ces compétences si tu les as : ${missingSkills.slice(0, 3).join(', ')}`)
  }
  if (candidateExp < requiredExp && requiredExp > 0) {
    suggestions.push(`Mets en avant tes projets perso/stages pour compenser le manque d'expérience`)
  }
  if (matches.filter(m => m.status === 'match').length < 3) {
    suggestions.push(`Personnalise ton CV avec les mots-clés de l'annonce`)
  }
  
  // Résumé
  let summary = ''
  if (score >= 80) {
    summary = '🎯 Excellent match ! Tu corresponds très bien à cette offre.'
  } else if (score >= 60) {
    summary = '👍 Bon potentiel. Quelques ajustements et tu peux postuler.'
  } else if (score >= 40) {
    summary = '🤔 Match partiel. Ça vaut le coup de postuler avec une bonne lettre de motivation.'
  } else {
    summary = '⚠️ Match faible. Considère de développer les compétences manquantes.'
  }
  
  return { score, matches: matches.slice(0, 10), suggestions, summary }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'match': return '✅'
    case 'partial': return '⚠️'
    case 'missing': return '❌'
    default: return '•'
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'match': return 'text-green-600'
    case 'partial': return 'text-yellow-600'
    case 'missing': return 'text-red-600'
    default: return 'text-gray-600'
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <NuxtLink to="/" class="text-blue-600 hover:underline mb-4 inline-block">← Retour</NuxtLink>
        <h1 class="text-3xl font-bold text-gray-900">📊 Job Matcher</h1>
        <p class="text-gray-600 mt-2">Colle une annonce et ton CV pour voir si ça matche</p>
      </div>

      <!-- Input Section -->
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <!-- Job Posting -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            📋 L'annonce (copie-colle le texte)
          </label>
          <textarea
            v-model="jobPosting"
            placeholder="Collez ici le texte de l'offre d'emploi..."
            class="w-full h-64 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <!-- CV -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            📄 Ton CV (copie-colle le texte)
          </label>
          <textarea
            v-model="cvText"
            placeholder="Collez ici le contenu de votre CV..."
            class="w-full h-64 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>
      </div>

      <!-- Analyze Button -->
      <div class="text-center mb-8">
        <button
          @click="analyzeMatch"
          :disabled="isAnalyzing || !jobPosting.trim() || !cvText.trim()"
          class="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <span v-if="isAnalyzing">Analyse en cours...</span>
          <span v-else>🔍 Analyser le match</span>
        </button>
      </div>

      <!-- Results -->
      <div v-if="result" class="bg-white rounded-xl shadow-sm p-8">
        <!-- Score -->
        <div class="text-center mb-8">
          <div class="text-6xl font-bold" :class="result.score >= 60 ? 'text-green-600' : result.score >= 40 ? 'text-yellow-600' : 'text-red-600'">
            {{ result.score }}%
          </div>
          <div class="text-gray-600 mt-2">{{ result.summary }}</div>
          
          <!-- Progress bar -->
          <div class="w-full max-w-md mx-auto h-4 bg-gray-200 rounded-full mt-4 overflow-hidden">
            <div 
              class="h-full rounded-full transition-all duration-500"
              :class="result.score >= 60 ? 'bg-green-500' : result.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'"
              :style="{ width: result.score + '%' }"
            />
          </div>
        </div>

        <!-- Matches -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold mb-4">Analyse détaillée</h3>
          <div class="space-y-2">
            <div 
              v-for="match in result.matches" 
              :key="match.skill"
              class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <span class="text-xl">{{ getStatusIcon(match.status) }}</span>
              <span class="font-medium">{{ match.skill }}</span>
              <span :class="getStatusColor(match.status)" class="text-sm ml-auto">
                {{ match.detail }}
              </span>
            </div>
          </div>
        </div>

        <!-- Suggestions -->
        <div v-if="result.suggestions.length > 0">
          <h3 class="text-lg font-semibold mb-4">💡 Pour améliorer ton score</h3>
          <ul class="space-y-2">
            <li 
              v-for="(suggestion, i) in result.suggestions" 
              :key="i"
              class="flex items-start gap-2 text-gray-700"
            >
              <span class="text-blue-500">→</span>
              {{ suggestion }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
