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

const fullName = computed(() => {
  return [props.cv.firstName, props.cv.lastName].filter(Boolean).join(' ') || 'Ton nom'
})

const hasContent = computed(() => {
  return props.cv.firstName || props.cv.lastName
})
</script>

<template>
  <div class="cv-minimal">
    <header class="cv-header">
      <h1 class="cv-name">{{ fullName }}</h1>
      <p v-if="cv.title" class="cv-title">{{ cv.title }}</p>
      <div class="cv-contact">
        <span v-if="cv.email">{{ cv.email }}</span>
        <span v-if="cv.email && cv.phone" class="separator">—</span>
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
          <div class="cv-item-line">
            <span class="cv-item-main">
              <strong>{{ exp.role || 'Poste' }}</strong>
              <span v-if="exp.company" class="at-company">chez {{ exp.company }}</span>
            </span>
            <span class="cv-date">{{ exp.startDate }} — {{ exp.current ? 'Présent' : exp.endDate }}</span>
          </div>
          <p v-if="exp.description" class="cv-item-desc">{{ exp.description }}</p>
        </template>
      </article>
    </section>

    <section v-if="cv.education.some(e => e.school || e.degree)" class="cv-section">
      <h2 class="cv-section-title">Formation</h2>
      <article v-for="edu in cv.education" :key="edu.id" class="cv-item">
        <template v-if="edu.school || edu.degree">
          <div class="cv-item-line">
            <span class="cv-item-main">
              <strong>{{ edu.degree || 'Diplôme' }}{{ edu.field ? `, ${edu.field}` : '' }}</strong>
              <span v-if="edu.school" class="at-company">— {{ edu.school }}</span>
            </span>
            <span class="cv-date">{{ edu.startDate }} — {{ edu.endDate }}</span>
          </div>
        </template>
      </article>
    </section>

    <section v-if="cv.skills.length" class="cv-section cv-section-skills">
      <h2 class="cv-section-title">Compétences</h2>
      <p class="cv-skills">{{ cv.skills.join(' / ') }}</p>
    </section>

    <!-- Empty state -->
    <div v-if="!hasContent" class="cv-empty">
      <p>👈 Commence à remplir ton CV</p>
      <p class="cv-empty-sub">Les changements s'affichent en temps réel</p>
    </div>
  </div>
</template>

<style scoped>
.cv-minimal {
  width: 100%;
  background: white;
  padding: 56px 48px;
  min-height: 800px;
  font-family: 'Inter', system-ui, sans-serif;
}

.cv-header {
  margin-bottom: 40px;
}

.cv-name {
  font-size: 2.5rem;
  font-weight: 800;
  color: #0a0a0a;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
  line-height: 1;
}

.cv-title {
  font-size: 1.15rem;
  color: #525252;
  font-weight: 400;
  margin-bottom: 16px;
}

.cv-contact {
  font-size: 0.9rem;
  color: #737373;
}

.separator {
  margin: 0 8px;
}

.cv-section {
  margin-bottom: 32px;
}

.cv-section-title {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #a3a3a3;
  margin-bottom: 16px;
}

.cv-summary {
  font-size: 1rem;
  color: #404040;
  line-height: 1.7;
  max-width: 540px;
}

.cv-item {
  margin-bottom: 20px;
}

.cv-item-line {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 6px;
}

.cv-item-main {
  color: #171717;
}

.cv-item-main strong {
  font-weight: 600;
}

.at-company {
  color: #525252;
  font-weight: 400;
}

.cv-date {
  font-size: 0.8rem;
  color: #a3a3a3;
  font-weight: 500;
}

.cv-item-desc {
  font-size: 0.9rem;
  color: #525252;
  line-height: 1.6;
  padding-left: 0;
}

.cv-section-skills {
  margin-top: 36px;
}

.cv-skills {
  font-size: 0.9rem;
  color: #404040;
  line-height: 1.8;
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
