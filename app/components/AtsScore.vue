<script setup lang="ts">
interface Experience {
  id: number
  company: string
  role: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

interface Education {
  id: number
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
}

interface CV {
  firstName: string
  lastName: string
  email: string
  phone: string
  title: string
  summary: string
  experiences: Experience[]
  education: Education[]
  skills: string[]
}

const props = defineProps<{
  cv: CV
}>()

// Mots-clés métier courants (français)
const businessKeywords = [
  'gestion', 'management', 'projet', 'équipe', 'client', 'développement',
  'analyse', 'stratégie', 'marketing', 'communication', 'vente', 'commercial',
  'budget', 'objectif', 'résultat', 'performance', 'optimisation', 'innovation',
  'leadership', 'coordination', 'planification', 'négociation', 'relation',
  'digital', 'data', 'agile', 'scrum', 'kpi', 'roi', 'b2b', 'b2c',
  'formation', 'accompagnement', 'conseil', 'audit', 'qualité', 'process'
]

// Calcul des métriques
const summaryWordCount = computed(() => {
  return props.cv.summary.trim().split(/\s+/).filter(w => w.length > 0).length
})

const filledExperiences = computed(() => {
  return props.cv.experiences.filter(e => e.company || e.role)
})

const experiencesWithDates = computed(() => {
  return filledExperiences.value.filter(e => e.startDate)
})

const experiencesWithDescription = computed(() => {
  return filledExperiences.value.filter(e => e.description && e.description.length > 20)
})

const detectedKeywords = computed(() => {
  const allText = [
    props.cv.summary,
    props.cv.title,
    ...props.cv.experiences.map(e => `${e.role} ${e.description}`),
    ...props.cv.skills
  ].join(' ').toLowerCase()
  
  return businessKeywords.filter(kw => allText.includes(kw))
})

// Calcul du score ATS (0-100)
const atsScore = computed(() => {
  let score = 0
  
  // Résumé: 0-25 points (50-200 mots idéal)
  if (summaryWordCount.value > 0) {
    if (summaryWordCount.value >= 50 && summaryWordCount.value <= 200) {
      score += 25
    } else if (summaryWordCount.value >= 30 && summaryWordCount.value <= 250) {
      score += 18
    } else if (summaryWordCount.value >= 10) {
      score += 10
    } else {
      score += 5
    }
  }
  
  // Expériences: 0-25 points (min 1 remplie avec dates)
  if (filledExperiences.value.length >= 3) {
    score += 15
  } else if (filledExperiences.value.length >= 1) {
    score += 10
  }
  
  // Bonus pour dates dans expériences
  if (experiencesWithDates.value.length >= 2) {
    score += 10
  } else if (experiencesWithDates.value.length >= 1) {
    score += 5
  }
  
  // Compétences: 0-25 points (5-15 idéal)
  const skillCount = props.cv.skills.length
  if (skillCount >= 5 && skillCount <= 15) {
    score += 25
  } else if (skillCount >= 3 && skillCount <= 20) {
    score += 18
  } else if (skillCount >= 1) {
    score += 10
  }
  
  // Mots-clés métier: 0-15 points
  const keywordCount = detectedKeywords.value.length
  if (keywordCount >= 8) {
    score += 15
  } else if (keywordCount >= 5) {
    score += 12
  } else if (keywordCount >= 3) {
    score += 8
  } else if (keywordCount >= 1) {
    score += 4
  }
  
  // Bonus: infos complètes (0-10 points)
  if (props.cv.firstName && props.cv.lastName) score += 2
  if (props.cv.email) score += 2
  if (props.cv.phone) score += 2
  if (props.cv.title) score += 2
  if (experiencesWithDescription.value.length >= 1) score += 2
  
  return Math.min(100, score)
})

// Niveau de score
const scoreLevel = computed(() => {
  if (atsScore.value >= 80) return { label: 'Excellent', color: '#22c55e', bg: '#dcfce7' }
  if (atsScore.value >= 60) return { label: 'Bon', color: '#f97316', bg: '#ffedd5' }
  if (atsScore.value >= 40) return { label: 'À améliorer', color: '#eab308', bg: '#fef9c3' }
  return { label: 'Faible', color: '#ef4444', bg: '#fee2e2' }
})

// Suggestions d'amélioration
const suggestions = computed(() => {
  const tips: { icon: string; text: string; priority: 'high' | 'medium' | 'low' }[] = []
  
  // Résumé
  if (summaryWordCount.value === 0) {
    tips.push({ icon: '📝', text: 'Ajoute un résumé pour te présenter', priority: 'high' })
  } else if (summaryWordCount.value < 50) {
    tips.push({ icon: '📝', text: `Résumé trop court (${summaryWordCount.value} mots). Vise 50-200 mots.`, priority: 'medium' })
  } else if (summaryWordCount.value > 200) {
    tips.push({ icon: '📝', text: `Résumé trop long (${summaryWordCount.value} mots). Vise 50-200 mots.`, priority: 'low' })
  }
  
  // Expériences
  if (filledExperiences.value.length === 0) {
    tips.push({ icon: '💼', text: 'Ajoute au moins une expérience', priority: 'high' })
  } else {
    if (experiencesWithDates.value.length < filledExperiences.value.length) {
      tips.push({ icon: '📅', text: 'Ajoute les dates à toutes tes expériences', priority: 'medium' })
    }
    if (experiencesWithDescription.value.length < filledExperiences.value.length) {
      tips.push({ icon: '✍️', text: 'Détaille les missions de chaque expérience', priority: 'medium' })
    }
  }
  
  // Compétences
  const skillCount = props.cv.skills.length
  if (skillCount === 0) {
    tips.push({ icon: '🎯', text: 'Ajoute tes compétences clés (5-15 recommandé)', priority: 'high' })
  } else if (skillCount < 5) {
    tips.push({ icon: '🎯', text: `Seulement ${skillCount} compétence(s). Vise 5-15.`, priority: 'medium' })
  } else if (skillCount > 15) {
    tips.push({ icon: '🎯', text: `${skillCount} compétences c'est beaucoup. Garde les plus pertinentes.`, priority: 'low' })
  }
  
  // Mots-clés
  if (detectedKeywords.value.length < 3) {
    tips.push({ icon: '🔑', text: 'Utilise plus de mots-clés métier dans tes descriptions', priority: 'medium' })
  }
  
  // Infos de base
  if (!props.cv.firstName || !props.cv.lastName) {
    tips.push({ icon: '👤', text: 'Renseigne ton nom complet', priority: 'high' })
  }
  if (!props.cv.email) {
    tips.push({ icon: '📧', text: 'Ajoute ton email', priority: 'high' })
  }
  if (!props.cv.title) {
    tips.push({ icon: '🏷️', text: 'Ajoute un titre professionnel', priority: 'medium' })
  }
  
  // Trier par priorité
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  return tips.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
})

// État du panel
const isExpanded = ref(true)
</script>

<template>
  <div class="ats-panel" :class="{ collapsed: !isExpanded }">
    <button class="ats-toggle" @click="isExpanded = !isExpanded">
      <span class="toggle-icon">{{ isExpanded ? '▶' : '◀' }}</span>
    </button>
    
    <div v-if="isExpanded" class="ats-content">
      <div class="ats-header">
        <h3 class="ats-title">Score ATS</h3>
        <span class="ats-info" title="Les ATS (Applicant Tracking Systems) filtrent les CV automatiquement">ℹ️</span>
      </div>
      
      <!-- Jauge circulaire -->
      <div class="score-gauge">
        <svg viewBox="0 0 100 100" class="gauge-svg">
          <!-- Cercle de fond -->
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke="#e7e5e4"
            stroke-width="8"
          />
          <!-- Cercle de progression -->
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            :stroke="scoreLevel.color"
            stroke-width="8"
            stroke-linecap="round"
            :stroke-dasharray="`${atsScore * 2.64} 264`"
            transform="rotate(-90 50 50)"
            class="gauge-progress"
          />
        </svg>
        <div class="score-value">
          <span class="score-number">{{ atsScore }}</span>
          <span class="score-label">/ 100</span>
        </div>
      </div>
      
      <!-- Badge niveau -->
      <div 
        class="score-badge"
        :style="{ background: scoreLevel.bg, color: scoreLevel.color }"
      >
        {{ scoreLevel.label }}
      </div>
      
      <!-- Métriques rapides -->
      <div class="metrics">
        <div class="metric">
          <span class="metric-value">{{ summaryWordCount }}</span>
          <span class="metric-label">mots résumé</span>
        </div>
        <div class="metric">
          <span class="metric-value">{{ filledExperiences.length }}</span>
          <span class="metric-label">expérience(s)</span>
        </div>
        <div class="metric">
          <span class="metric-value">{{ cv.skills.length }}</span>
          <span class="metric-label">compétence(s)</span>
        </div>
        <div class="metric">
          <span class="metric-value">{{ detectedKeywords.length }}</span>
          <span class="metric-label">mots-clés</span>
        </div>
      </div>
      
      <!-- Suggestions -->
      <div v-if="suggestions.length > 0" class="suggestions">
        <h4 class="suggestions-title">Suggestions</h4>
        <ul class="suggestions-list">
          <li 
            v-for="(tip, i) in suggestions.slice(0, 5)" 
            :key="i"
            class="suggestion-item"
            :class="tip.priority"
          >
            <span class="suggestion-icon">{{ tip.icon }}</span>
            <span class="suggestion-text">{{ tip.text }}</span>
          </li>
        </ul>
        <p v-if="suggestions.length > 5" class="suggestions-more">
          +{{ suggestions.length - 5 }} autre(s) suggestion(s)
        </p>
      </div>
      
      <!-- État parfait -->
      <div v-else class="perfect-state">
        <span class="perfect-icon">🎉</span>
        <p>Excellent ! Ton CV est bien optimisé.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ats-panel {
  position: fixed;
  top: 80px;
  right: 16px;
  width: 260px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  z-index: 100;
  transition: width 0.3s ease;
}

.ats-panel.collapsed {
  width: 48px;
}

.ats-toggle {
  position: absolute;
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 48px;
  background: white;
  border: 1px solid #e7e5e4;
  border-radius: 6px 0 0 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #78716c;
  box-shadow: -2px 0 8px rgba(0,0,0,0.06);
}

.ats-toggle:hover {
  background: #f5f5f4;
}

.ats-content {
  padding: 20px;
}

.ats-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.ats-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1c1917;
  margin: 0;
}

.ats-info {
  cursor: help;
  font-size: 14px;
}

/* Jauge */
.score-gauge {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 12px;
}

.gauge-svg {
  width: 100%;
  height: 100%;
}

.gauge-progress {
  transition: stroke-dasharray 0.5s ease;
}

.score-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.score-number {
  font-size: 2rem;
  font-weight: 700;
  color: #1c1917;
  line-height: 1;
}

.score-label {
  display: block;
  font-size: 0.75rem;
  color: #a8a29e;
}

.score-badge {
  text-align: center;
  padding: 6px 16px;
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 20px;
}

/* Métriques */
.metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 20px;
}

.metric {
  background: #fafaf9;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
}

.metric-value {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1c1917;
}

.metric-label {
  font-size: 0.7rem;
  color: #78716c;
}

/* Suggestions */
.suggestions-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1c1917;
  margin: 0 0 12px;
}

.suggestions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px;
  margin-bottom: 6px;
  background: #fafaf9;
  border-radius: 8px;
  font-size: 0.8rem;
  color: #57534e;
  border-left: 3px solid transparent;
}

.suggestion-item.high {
  border-left-color: #ef4444;
  background: #fef2f2;
}

.suggestion-item.medium {
  border-left-color: #f97316;
  background: #fff7ed;
}

.suggestion-item.low {
  border-left-color: #a8a29e;
}

.suggestion-icon {
  flex-shrink: 0;
  font-size: 14px;
}

.suggestion-text {
  line-height: 1.4;
}

.suggestions-more {
  font-size: 0.75rem;
  color: #a8a29e;
  text-align: center;
  margin: 8px 0 0;
}

/* État parfait */
.perfect-state {
  text-align: center;
  padding: 16px;
  background: #dcfce7;
  border-radius: 8px;
}

.perfect-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 8px;
}

.perfect-state p {
  margin: 0;
  font-size: 0.85rem;
  color: #166534;
}

/* Responsive */
@media (max-width: 900px) {
  .ats-panel {
    display: none;
  }
}
</style>
