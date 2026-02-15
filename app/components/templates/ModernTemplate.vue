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
  <div class="cv-modern">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h1 class="cv-name">{{ fullName }}</h1>
        <p v-if="cv.title" class="cv-title">{{ cv.title }}</p>
      </div>

      <div class="sidebar-section">
        <h3 class="sidebar-title">Contact</h3>
        <div class="contact-list">
          <p v-if="cv.email" class="contact-item">
            <span class="contact-icon">✉</span>
            {{ cv.email }}
          </p>
          <p v-if="cv.phone" class="contact-item">
            <span class="contact-icon">☎</span>
            {{ cv.phone }}
          </p>
        </div>
      </div>

      <div v-if="cv.skills.length" class="sidebar-section">
        <h3 class="sidebar-title">Compétences</h3>
        <ul class="skills-list">
          <li v-for="skill in cv.skills" :key="skill" class="skill-item">
            {{ skill }}
          </li>
        </ul>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <section v-if="cv.summary" class="content-section">
        <h2 class="section-title">Profil</h2>
        <p class="summary-text">{{ cv.summary }}</p>
      </section>

      <section v-if="cv.experiences.some(e => e.company || e.role)" class="content-section">
        <h2 class="section-title">Expérience Professionnelle</h2>
        <article v-for="exp in cv.experiences" :key="exp.id" class="experience-item">
          <template v-if="exp.company || exp.role">
            <div class="exp-header">
              <div class="exp-title-group">
                <h3 class="exp-role">{{ exp.role || 'Poste' }}</h3>
                <p class="exp-company">{{ exp.company }}</p>
              </div>
              <span class="exp-date">{{ exp.startDate }} - {{ exp.current ? 'Présent' : exp.endDate }}</span>
            </div>
            <p v-if="exp.description" class="exp-desc">{{ exp.description }}</p>
          </template>
        </article>
      </section>

      <section v-if="cv.education.some(e => e.school || e.degree)" class="content-section">
        <h2 class="section-title">Formation</h2>
        <article v-for="edu in cv.education" :key="edu.id" class="education-item">
          <template v-if="edu.school || edu.degree">
            <div class="edu-header">
              <div class="edu-title-group">
                <h3 class="edu-degree">{{ edu.degree || 'Diplôme' }}{{ edu.field ? ` - ${edu.field}` : '' }}</h3>
                <p class="edu-school">{{ edu.school }}</p>
              </div>
              <span class="edu-date">{{ edu.startDate }} - {{ edu.endDate }}</span>
            </div>
          </template>
        </article>
      </section>

      <!-- Empty state -->
      <div v-if="!hasContent" class="cv-empty">
        <p>👈 Commence à remplir ton CV</p>
        <p class="cv-empty-sub">Les changements s'affichent en temps réel</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.cv-modern {
  width: 100%;
  background: white;
  min-height: 800px;
  display: flex;
  font-family: 'Inter', system-ui, sans-serif;
}

/* Sidebar - ATS friendly: using simple flexbox, not CSS columns */
.sidebar {
  width: 200px;
  flex-shrink: 0;
  background: linear-gradient(180deg, #1e3a5f 0%, #2d5a87 100%);
  color: white;
  padding: 32px 20px;
}

.sidebar-header {
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.2);
}

.cv-name {
  font-size: 1.35rem;
  font-weight: 700;
  margin-bottom: 8px;
  line-height: 1.2;
}

.cv-title {
  font-size: 0.85rem;
  opacity: 0.9;
  font-weight: 400;
}

.sidebar-section {
  margin-bottom: 28px;
}

.sidebar-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 12px;
  opacity: 0.8;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-item {
  font-size: 0.8rem;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  word-break: break-word;
}

.contact-icon {
  opacity: 0.7;
  flex-shrink: 0;
}

.skills-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.skill-item {
  font-size: 0.8rem;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.skill-item:last-child {
  border-bottom: none;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 32px 36px;
}

.content-section {
  margin-bottom: 28px;
}

.section-title {
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #1e3a5f;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #1e3a5f;
}

.summary-text {
  font-size: 0.9rem;
  color: #4b5563;
  line-height: 1.65;
}

.experience-item,
.education-item {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.experience-item:last-child,
.education-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.exp-header,
.edu-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 16px;
}

.exp-title-group,
.edu-title-group {
  flex: 1;
}

.exp-role,
.edu-degree {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 2px;
}

.exp-company,
.edu-school {
  font-size: 0.85rem;
  color: #6b7280;
}

.exp-date,
.edu-date {
  font-size: 0.8rem;
  color: #9ca3af;
  white-space: nowrap;
}

.exp-desc {
  font-size: 0.85rem;
  color: #4b5563;
  line-height: 1.55;
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
