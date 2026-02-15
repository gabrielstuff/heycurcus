<script setup lang="ts">
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const isExporting = ref(false)

const downloadPDF = async () => {
  const previewElement = document.querySelector('.cv-preview') as HTMLElement
  if (!previewElement) return

  isExporting.value = true

  try {
    // A4 dimensions in mm
    const a4Width = 210
    const a4Height = 297
    
    // Scale factor for better quality (2x)
    const scale = 2
    
    // Capture the preview element
    const canvas = await html2canvas(previewElement, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false
    })

    // Calculate dimensions
    const imgWidth = a4Width
    const imgHeight = (canvas.height * a4Width) / canvas.width
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    // Handle multi-page if content is too long
    const pageHeight = a4Height
    let heightLeft = imgHeight
    let position = 0
    
    // Add first page
    pdf.addImage(
      canvas.toDataURL('image/jpeg', 0.95),
      'JPEG',
      0,
      position,
      imgWidth,
      imgHeight
    )
    heightLeft -= pageHeight

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.95),
        'JPEG',
        0,
        position,
        imgWidth,
        imgHeight
      )
      heightLeft -= pageHeight
    }

    // Generate filename
    const firstName = cv.firstName.trim() || 'Prenom'
    const lastName = cv.lastName.trim() || 'Nom'
    const filename = `CV-${firstName}-${lastName}.pdf`

    // Download
    pdf.save(filename)
  } catch (error) {
    console.error('Erreur export PDF:', error)
    alert('Erreur lors de l\'export PDF')
  } finally {
    isExporting.value = false
  }
}

const cv = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  title: '',
  summary: '',
  experiences: [
    { id: 1, company: '', role: '', startDate: '', endDate: '', current: false, description: '' }
  ],
  education: [
    { id: 1, school: '', degree: '', field: '', startDate: '', endDate: '' }
  ],
  skills: [] as string[],
  newSkill: ''
})

const addExperience = () => {
  cv.experiences.push({
    id: Date.now(),
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  })
}

const removeExperience = (id: number) => {
  cv.experiences = cv.experiences.filter(e => e.id !== id)
}

const addEducation = () => {
  cv.education.push({
    id: Date.now(),
    school: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: ''
  })
}

const removeEducation = (id: number) => {
  cv.education = cv.education.filter(e => e.id !== id)
}

const addSkill = () => {
  if (cv.newSkill.trim() && !cv.skills.includes(cv.newSkill.trim())) {
    cv.skills.push(cv.newSkill.trim())
    cv.newSkill = ''
  }
}

const removeSkill = (skill: string) => {
  cv.skills = cv.skills.filter(s => s !== skill)
}

const fullName = computed(() => {
  return [cv.firstName, cv.lastName].filter(Boolean).join(' ') || 'Ton nom'
})
</script>

<template>
  <div class="editor">
    <!-- ATS Score Panel -->
    <AtsScore :cv="cv" />
    <!-- Header -->
    <header class="editor-header">
      <a href="/" class="logo">heycurcus</a>
      <div class="header-actions">
        <button class="btn btn-secondary">Sauvegarder</button>
        <button class="btn btn-primary" :disabled="isExporting" @click="downloadPDF">
          {{ isExporting ? 'Export...' : 'Télécharger PDF' }}
        </button>
      </div>
    </header>

    <div class="editor-layout">
      <!-- Form Panel -->
      <aside class="form-panel">
        <div class="form-section">
          <h2 class="section-title">Infos personnelles</h2>
          <div class="form-grid">
            <input v-model="cv.firstName" type="text" class="input" placeholder="Prénom" />
            <input v-model="cv.lastName" type="text" class="input" placeholder="Nom" />
            <input v-model="cv.email" type="email" class="input" placeholder="Email" />
            <input v-model="cv.phone" type="tel" class="input" placeholder="Téléphone" />
          </div>
          <input v-model="cv.title" type="text" class="input input-full" placeholder="Titre (ex: Étudiant en marketing)" />
          <textarea v-model="cv.summary" class="textarea" placeholder="Résumé en 2-3 phrases..." rows="3"></textarea>
        </div>

        <div class="form-section">
          <div class="section-header">
            <h2 class="section-title">Expériences</h2>
            <button class="btn-add" @click="addExperience">+ Ajouter</button>
          </div>
          
          <div v-for="exp in cv.experiences" :key="exp.id" class="card">
            <button class="card-remove" @click="removeExperience(exp.id)">×</button>
            <div class="form-grid">
              <input v-model="exp.company" type="text" class="input" placeholder="Entreprise" />
              <input v-model="exp.role" type="text" class="input" placeholder="Poste" />
              <input v-model="exp.startDate" type="text" class="input" placeholder="Début (ex: Sept 2023)" />
              <input v-model="exp.endDate" type="text" class="input" placeholder="Fin" :disabled="exp.current" />
            </div>
            <label class="checkbox">
              <input v-model="exp.current" type="checkbox" />
              <span>Poste actuel</span>
            </label>
            <textarea v-model="exp.description" class="textarea" placeholder="Décris tes missions..." rows="2"></textarea>
          </div>
        </div>

        <div class="form-section">
          <div class="section-header">
            <h2 class="section-title">Formation</h2>
            <button class="btn-add" @click="addEducation">+ Ajouter</button>
          </div>
          
          <div v-for="edu in cv.education" :key="edu.id" class="card">
            <button class="card-remove" @click="removeEducation(edu.id)">×</button>
            <input v-model="edu.school" type="text" class="input input-full" placeholder="École / Université" />
            <div class="form-grid">
              <input v-model="edu.degree" type="text" class="input" placeholder="Diplôme" />
              <input v-model="edu.field" type="text" class="input" placeholder="Domaine" />
              <input v-model="edu.startDate" type="text" class="input" placeholder="Début" />
              <input v-model="edu.endDate" type="text" class="input" placeholder="Fin" />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2 class="section-title">Compétences</h2>
          <div class="skills-input">
            <input 
              v-model="cv.newSkill" 
              type="text" 
              class="input" 
              placeholder="Ajoute une compétence..."
              @keyup.enter="addSkill"
            />
            <button class="btn btn-secondary" @click="addSkill">Ajouter</button>
          </div>
          <div class="skills-list">
            <span v-for="skill in cv.skills" :key="skill" class="skill-tag">
              {{ skill }}
              <button class="skill-remove" @click="removeSkill(skill)">×</button>
            </span>
            <span v-if="!cv.skills.length" class="skills-empty">
              Ajoute tes compétences clés
            </span>
          </div>
        </div>
      </aside>

      <!-- Preview Panel -->
      <main class="preview-panel">
        <div class="cv-preview">
          <div class="cv-header">
            <h1 class="cv-name">{{ fullName }}</h1>
            <p v-if="cv.title" class="cv-title">{{ cv.title }}</p>
            <div class="cv-contact">
              <span v-if="cv.email">{{ cv.email }}</span>
              <span v-if="cv.phone">{{ cv.phone }}</span>
            </div>
          </div>

          <div v-if="cv.summary" class="cv-section">
            <p class="cv-summary">{{ cv.summary }}</p>
          </div>

          <div v-if="cv.experiences.some(e => e.company || e.role)" class="cv-section">
            <h2 class="cv-section-title">Expérience</h2>
            <div v-for="exp in cv.experiences" :key="exp.id" class="cv-item">
              <template v-if="exp.company || exp.role">
                <div class="cv-item-header">
                  <strong>{{ exp.role || 'Poste' }}</strong>
                  <span class="cv-date">{{ exp.startDate }} - {{ exp.current ? 'Présent' : exp.endDate }}</span>
                </div>
                <p class="cv-item-sub">{{ exp.company }}</p>
                <p v-if="exp.description" class="cv-item-desc">{{ exp.description }}</p>
              </template>
            </div>
          </div>

          <div v-if="cv.education.some(e => e.school || e.degree)" class="cv-section">
            <h2 class="cv-section-title">Formation</h2>
            <div v-for="edu in cv.education" :key="edu.id" class="cv-item">
              <template v-if="edu.school || edu.degree">
                <div class="cv-item-header">
                  <strong>{{ edu.degree || 'Diplôme' }}{{ edu.field ? ` - ${edu.field}` : '' }}</strong>
                  <span class="cv-date">{{ edu.startDate }} - {{ edu.endDate }}</span>
                </div>
                <p class="cv-item-sub">{{ edu.school }}</p>
              </template>
            </div>
          </div>

          <div v-if="cv.skills.length" class="cv-section">
            <h2 class="cv-section-title">Compétences</h2>
            <p class="cv-skills">{{ cv.skills.join(' • ') }}</p>
          </div>

          <!-- Empty state -->
          <div v-if="!cv.firstName && !cv.lastName" class="cv-empty">
            <p>👈 Commence à remplir ton CV</p>
            <p class="cv-empty-sub">Les changements s'affichent en temps réel</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.editor {
  min-height: 100vh;
  background: #f5f5f4;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #e7e5e4;
}

.logo {
  font-family: 'Fraunces', serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1c1917;
  text-decoration: none;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.editor-layout {
  display: grid;
  grid-template-columns: 420px 1fr;
  min-height: calc(100vh - 65px);
}

/* Form Panel */
.form-panel {
  background: white;
  border-right: 1px solid #e7e5e4;
  padding: 24px;
  overflow-y: auto;
}

.form-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1c1917;
  margin-bottom: 16px;
}

.section-header .section-title {
  margin-bottom: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.input, .textarea {
  width: 100%;
  padding: 12px 14px;
  font-size: 0.9rem;
  border: 1px solid #e7e5e4;
  border-radius: 8px;
  background: #fafaf9;
  color: #1c1917;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input:focus, .textarea:focus {
  outline: none;
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.input::placeholder, .textarea::placeholder {
  color: #a8a29e;
}

.input-full {
  margin-bottom: 12px;
}

.textarea {
  resize: vertical;
  min-height: 80px;
}

.btn {
  padding: 10px 18px;
  font-size: 0.9rem;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #f97316;
  color: white;
}

.btn-primary:hover {
  background: #ea580c;
}

.btn-secondary {
  background: #f5f5f4;
  color: #1c1917;
  border: 1px solid #e7e5e4;
}

.btn-secondary:hover {
  background: #e7e5e4;
}

.btn-add {
  font-size: 0.85rem;
  font-weight: 500;
  color: #f97316;
  background: none;
  border: none;
  cursor: pointer;
}

.btn-add:hover {
  text-decoration: underline;
}

.card {
  position: relative;
  background: #fafaf9;
  border: 1px solid #e7e5e4;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 12px;
}

.card-remove {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  color: #a8a29e;
  font-size: 1.2rem;
  cursor: pointer;
}

.card-remove:hover {
  color: #ef4444;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #78716c;
  margin: 8px 0 12px;
  cursor: pointer;
}

.checkbox input {
  accent-color: #f97316;
}

.skills-input {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.skills-input .input {
  flex: 1;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: 100px;
  font-size: 0.85rem;
  color: #c2410c;
}

.skill-remove {
  background: none;
  border: none;
  color: #c2410c;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
}

.skills-empty {
  font-size: 0.85rem;
  color: #a8a29e;
}

/* Preview Panel */
.preview-panel {
  padding: 32px;
  display: flex;
  justify-content: center;
  overflow-y: auto;
}

.cv-preview {
  width: 100%;
  max-width: 600px;
  background: white;
  padding: 48px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  border-radius: 4px;
  min-height: 800px;
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

/* Responsive */
@media (max-width: 900px) {
  .editor-layout {
    grid-template-columns: 1fr;
  }
  
  .preview-panel {
    display: none;
  }
}
</style>
