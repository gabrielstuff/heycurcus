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

defineProps<{
  cv: CV
}>()

const fullName = computed(() => {
  const props = defineProps<{ cv: CV }>()
  return [props.cv.firstName, props.cv.lastName].filter(Boolean).join(' ') || 'Ton nom'
})
</script>

<script lang="ts">
export default {
  name: 'ClassicTemplate',
  computed: {
    fullName() {
      return [this.cv.firstName, this.cv.lastName].filter(Boolean).join(' ') || 'Ton nom'
    }
  }
}
</script>

<template>
  <div class="cv-classic">
    <header class="cv-header">
      <h1 class="cv-name">{{ fullName }}</h1>
      <p v-if="cv.title" class="cv-title">{{ cv.title }}</p>
      <div class="cv-contact">
        <span v-if="cv.email">{{ cv.email }}</span>
        <span v-if="cv.phone">{{ cv.phone }}</span>
      </div>
    </header>

    <section v-if="cv.summary" class="cv-section">
      <p class="cv-summary">{{ cv.summary }}</p>
    </section>

    <section v-if="cv.experiences.some(e => e.company || e.role)" class="cv-section">
      <h2 class="cv-section-title">Expérience</h2>
      <article v-for="exp in cv.experiences" :key="exp.id" class="cv-item">
        <template v-if="exp.company || exp.role">
          <div class="cv-item-header">
            <strong>{{ exp.role || 'Poste' }}</strong>
            <span class="cv-date">{{ exp.startDate }} - {{ exp.current ? 'Présent' : exp.endDate }}</span>
          </div>
          <p class="cv-item-sub">{{ exp.company }}</p>
          <p v-if="exp.description" class="cv-item-desc">{{ exp.description }}</p>
        </template>
      </article>
    </section>

    <section v-if="cv.education.some(e => e.school || e.degree)" class="cv-section">
      <h2 class="cv-section-title">Formation</h2>
      <article v-for="edu in cv.education" :key="edu.id" class="cv-item">
        <template v-if="edu.school || edu.degree">
          <div class="cv-item-header">
            <strong>{{ edu.degree || 'Diplôme' }}{{ edu.field ? ` - ${edu.field}` : '' }}</strong>
            <span class="cv-date">{{ edu.startDate }} - {{ edu.endDate }}</span>
          </div>
          <p class="cv-item-sub">{{ edu.school }}</p>
        </template>
      </article>
    </section>

    <section v-if="cv.skills.length" class="cv-section">
      <h2 class="cv-section-title">Compétences</h2>
      <p class="cv-skills">{{ cv.skills.join(' • ') }}</p>
    </section>

    <!-- Empty state -->
    <div v-if="!cv.firstName && !cv.lastName" class="cv-empty">
      <p>👈 Commence à remplir ton CV</p>
      <p class="cv-empty-sub">Les changements s'affichent en temps réel</p>
    </div>
  </div>
</template>

<style scoped>
.cv-classic {
  width: 100%;
  background: white;
  padding: 48px;
  min-height: 800px;
  font-family: 'Inter', system-ui, sans-serif;
}

.cv-header {
  text-align: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid #1c1917;
}

.cv-name {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1c1917;
  margin-bottom: 4px;
}

.cv-title {
  font-size: 1.1rem;
  color: #78716c;
  margin-bottom: 12px;
}

.cv-contact {
  display: flex;
  justify-content: center;
  gap: 16px;
  font-size: 0.9rem;
  color: #78716c;
}

.cv-section {
  margin-bottom: 24px;
}

.cv-section-title {
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #1c1917;
  margin-bottom: 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e7e5e4;
}

.cv-summary {
  font-size: 0.95rem;
  color: #57534e;
  line-height: 1.6;
}

.cv-item {
  margin-bottom: 16px;
}

.cv-item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 2px;
}

.cv-item-header strong {
  font-weight: 600;
  color: #1c1917;
}

.cv-date {
  font-size: 0.85rem;
  color: #a8a29e;
}

.cv-item-sub {
  font-size: 0.9rem;
  color: #78716c;
  margin-bottom: 4px;
}

.cv-item-desc {
  font-size: 0.9rem;
  color: #57534e;
  line-height: 1.5;
}

.cv-skills {
  font-size: 0.9rem;
  color: #57534e;
}

.cv-empty {
  text-align: center;
  padding: 60px 20px;
  color: #a8a29e;
}

.cv-empty p {
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.cv-empty-sub {
  font-size: 0.9rem;
}
</style>
