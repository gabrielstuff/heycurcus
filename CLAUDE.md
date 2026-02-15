# heycurcus.com — Outils Carrière pour Étudiants

## Philosophie

**Valeur immédiate. Pas de promesses, de l'action.**

```
L'utilisateur arrive → Il repart avec quelque chose d'utile
       PAS de "laisse ton email"
       PAS de "crée un compte pour voir"
       PAS de paywall sur les fonctions de base
```

Les profils se construisent naturellement quand les gens utilisent les outils.
La CVthèque est une **conséquence**, pas l'objectif affiché.

## Les 3 Outils (Valeur Immédiate)

### 1. 🛠️ CV Builder
- Input: Infos personnelles
- Output: **PDF téléchargeable instantanément**
- Templates ATS-native (pas de colonnes, pas d'icônes)
- Sections étudiants : projets, asso, bénévolat, jobs étudiants

### 2. 📊 Job Matcher
- Input: Colle une annonce + ton CV
- Output: **Score de match instantané** (ex: "72%")
- Détail des gaps : ✅ React, ⚠️ Node (partiel), ❌ 5 ans exp
- Suggestions concrètes pour améliorer le match

### 3. 🔍 CV Analyzer
- Input: Upload/colle ton CV
- Output: **Bilan forces/faiblesses instantané**
- Score ATS
- Points forts à mettre en avant
- Lacunes à combler
- Comparaison avec les profils similaires (anonymisé)

## Stack Technique

- **Framework**: Nuxt 4
- **Hosting**: Cloudflare Pages
- **Database**: D1 (Cloudflare)
- **Storage**: R2 (Cloudflare)
- **PDF**: pdfme ou pdf-lib (texte natif ATS-friendly)
- **LLM**: Anthropic Claude (parsing annonces/CV, matching)

## Roadmap

### Phase 1 — MVP Outils (NOW)
- [x] Setup Nuxt 4 + Cloudflare
- [x] CV Builder basique (3 templates)
- [x] Score ATS basique
- [ ] **Job Matcher** (colle annonce → match score)
- [ ] **CV Analyzer** (forces/faiblesses)
- [ ] Export PDF avec pdfme (ATS-perfect)
- [ ] Landing page qui montre les outils

### Phase 2 — Polish & Growth
- [ ] 5+ templates
- [ ] Suggestions IA contextuelles
- [ ] Partage social (lien CV public optionnel)
- [ ] Guides intégrés ("Premier CV", "Lettre de motivation")

### Phase 3 — CVthèque (organique)
- [ ] Compte optionnel pour sauvegarder
- [ ] Opt-in "visible aux recruteurs"
- [ ] Alertes jobs personnalisées

### Phase 4 — Monétisation Employeurs
- [ ] Dashboard recruteur
- [ ] Accès CVthèque (payant)
- [ ] Matching candidats triés par score

## Principes Non-Négociables

1. **Valeur immédiate** — L'utilisateur repart avec quelque chose
2. **0€ pour les candidats. Toujours.**
3. **Pas de dark patterns** — Pas de compte forcé, pas de paywall trompeur
4. **ATS-first** — Templates qui passent les robots
5. **Privacy** — Pas de data mining, suppression = immédiate

## Fichiers Clés

```
app/
├── pages/
│   ├── index.vue          # Landing + accès outils
│   ├── create.vue         # CV Builder
│   ├── match.vue          # Job Matcher (À CRÉER)
│   └── analyze.vue        # CV Analyzer (À CRÉER)
├── components/
│   ├── templates/         # 3 templates CV
│   ├── AtsScore.vue       # Scoring ATS
│   ├── JobMatcher.vue     # (À CRÉER)
│   └── CvAnalyzer.vue     # (À CRÉER)
```
