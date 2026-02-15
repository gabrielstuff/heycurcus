<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const templates = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Centré, élégant, bordures noires'
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Sidebar colorée, 2 colonnes'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra clean, typographie forte'
  }
]

const selectTemplate = (id: string) => {
  emit('update:modelValue', id)
}
</script>

<template>
  <div class="template-selector">
    <span class="selector-label">Template</span>
    <div class="templates-grid">
      <button
        v-for="template in templates"
        :key="template.id"
        :class="['template-option', { active: modelValue === template.id }]"
        @click="selectTemplate(template.id)"
      >
        <div :class="['template-preview', `preview-${template.id}`]">
          <!-- Mini preview representation -->
          <div class="preview-header"></div>
          <div class="preview-lines">
            <div class="preview-line"></div>
            <div class="preview-line short"></div>
            <div class="preview-line"></div>
          </div>
        </div>
        <span class="template-name">{{ template.name }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.template-selector {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.selector-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #78716c;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.templates-grid {
  display: flex;
  gap: 8px;
}

.template-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px;
  border: 2px solid transparent;
  border-radius: 10px;
  background: #fafaf9;
  cursor: pointer;
  transition: all 0.2s ease;
}

.template-option:hover {
  background: #f5f5f4;
  border-color: #e7e5e4;
}

.template-option.active {
  border-color: #f97316;
  background: #fff7ed;
}

.template-preview {
  width: 56px;
  height: 72px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Classic preview - centered header with border */
.preview-classic .preview-header {
  height: 12px;
  background: #e7e5e4;
  border-radius: 2px;
  margin: 0 auto 4px;
  width: 70%;
  border-bottom: 1px solid #1c1917;
  padding-bottom: 4px;
}

.preview-classic .preview-lines {
  display: flex;
  flex-direction: column;
  gap: 3px;
  align-items: center;
}

.preview-classic .preview-line {
  height: 3px;
  background: #d6d3d1;
  border-radius: 1px;
  width: 80%;
}

.preview-classic .preview-line.short {
  width: 50%;
}

/* Modern preview - sidebar */
.preview-modern {
  flex-direction: row;
  padding: 0;
  overflow: hidden;
}

.preview-modern .preview-header {
  width: 18px;
  height: 100%;
  background: linear-gradient(180deg, #1e3a5f 0%, #2d5a87 100%);
  border-radius: 4px 0 0 4px;
}

.preview-modern .preview-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 8px 6px;
  justify-content: flex-start;
}

.preview-modern .preview-line {
  height: 3px;
  background: #d6d3d1;
  border-radius: 1px;
  width: 100%;
}

.preview-modern .preview-line.short {
  width: 60%;
}

/* Minimal preview - large typography */
.preview-minimal .preview-header {
  height: 10px;
  background: #1c1917;
  border-radius: 2px;
  width: 65%;
  margin-bottom: 6px;
}

.preview-minimal .preview-lines {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.preview-minimal .preview-line {
  height: 2px;
  background: #a8a29e;
  border-radius: 1px;
  width: 90%;
}

.preview-minimal .preview-line.short {
  width: 45%;
}

.template-name {
  font-size: 0.7rem;
  font-weight: 500;
  color: #57534e;
}

.template-option.active .template-name {
  color: #c2410c;
  font-weight: 600;
}
</style>
