# Learnings: Initial Setup heycurcus.com

**Date:** 2025-02-15
**Phase:** 0 - Landing Page + Waitlist
**Duration:** ~25 minutes

---

## What Worked ✅

### 1. Nuxt 4 Minimal Template
- `npx nuxi@latest init . --force` avec template "minimal" = setup propre et rapide
- Nuxt 4 compatible par défaut, pas de config complexe

### 2. CSS-in-file vs Tailwind
- Pour une landing page simple, CSS custom dans `/assets/css/main.css` suffit
- Avantage: contrôle total sur le design, pas de dépendance externe
- Inconvénient: plus verbeux pour des projets plus gros

### 3. Design System Linear/Vercel
- Variables CSS pour les couleurs = facile à maintenir
- Gradient orbs en background avec `filter: blur(100px)` = effet premium
- Glassmorphism sur nav avec `backdrop-filter: blur(12px)`

### 4. Double Waitlist Pattern
- Tabs pour switch candidat/employeur = UX claire
- Un seul formulaire avec champs conditionnels (`v-if`)
- Compteur social proof (fake pour MVP)

---

## What Didn't Work / Obstacles ❌

### 1. Claude Code dans container sandbox
- **Problème:** Claude Code CLI bloque sans output en mode `-p` (print)
- **Cause:** Probablement lié au workspace trust ou TTY requirements
- **Workaround:** Faire le dev manuellement ou utiliser Claude Code localement
- **Future:** Tester avec `--dangerously-skip-permissions` + PTY

### 2. npm install lenteur
- **Problème:** npm install Nuxt = ~3-4 minutes dans le container
- **Cause:** Beaucoup de dépendances, réseau container
- **Workaround:** Patience, ou utiliser pnpm/bun localement

### 3. Interactive prompts avec nuxi
- **Problème:** `nuxi init` nécessite des réponses interactives
- **Solution:** Utiliser `process.send-keys` pour simuler les touches
- **Future:** Trouver flags pour mode non-interactif

---

## Decisions Made

### Stack
| Choice | Reason |
|--------|--------|
| Nuxt 4 | Modern, SSR ready, Cloudflare Workers compatible |
| Cloudflare Workers | Plus flexible que Pages, support bindings (D1, R2, KV) |
| bun | Package manager par défaut — plus rapide que npm |
| CSS custom | Contrôle total pour landing, pas de bloat |
| No UI framework | Landing simple, pas besoin de Nuxt UI/Vuetify |

### Architecture
- `app/pages/index.vue` = landing page unique
- `app/assets/css/main.css` = styles globaux
- `CLAUDE.md` = contexte projet pour AI assistants

### Design
- Palette: Purple (#8b5cf6) + Blue (#3b82f6) gradient
- Dark mode only (cible jeunes/tech)
- Mobile-first responsive

---

## Patterns to Reuse

### 1. Landing Page Structure
```
Hero → Features Grid → Waitlist CTA → Testimonials → FAQ → Footer
```

### 2. Gradient Background
```css
.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.4;
}
```

### 3. Glassmorphism Nav
```css
nav {
  backdrop-filter: blur(12px);
  background: rgba(10, 10, 15, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
```

### 4. Interactive FAQ
```vue
<div class="faq-item" :class="{ open: faq.open }">
  <button @click="toggleFaq(index)">{{ faq.question }}</button>
  <p class="faq-answer">{{ faq.answer }}</p>
</div>
```

---

## Next Steps

1. [ ] Acheter domaine heycurcus.com sur Cloudflare
2. [ ] Deploy sur Cloudflare Pages
3. [ ] Connecter waitlist à un backend (D1 ou simple Google Sheets)
4. [ ] Ajouter analytics (Plausible ou Cloudflare Analytics)
5. [ ] Phase 1: Éditeur CV

---

## Time Breakdown

| Task | Time |
|------|------|
| Setup Nuxt + npm install | 8 min |
| Création landing page | 10 min |
| Styles CSS | 5 min |
| Build + commit | 2 min |
| **Total** | **~25 min** |

---

*Documented following Compound Engineering methodology*
