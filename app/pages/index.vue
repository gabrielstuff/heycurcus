<script setup lang="ts">
// Direct action - no email capture, immediate value
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
    <!-- Nav -->
    <nav class="flex justify-between items-center px-6 py-4 max-w-6xl mx-auto">
      <a href="/" class="text-xl font-bold">heycurcus</a>
      <div class="flex gap-4">
        <NuxtLink to="/create" class="text-white/70 hover:text-white transition">Créer</NuxtLink>
        <NuxtLink to="/match" class="text-white/70 hover:text-white transition">Matcher</NuxtLink>
        <NuxtLink to="/analyze" class="text-white/70 hover:text-white transition">Analyser</NuxtLink>
      </div>
    </nav>

    <!-- Hero -->
    <main class="px-6 py-16 max-w-6xl mx-auto">
      <div class="text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Outils carrière.<br/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Valeur immédiate.
          </span>
        </h1>
        
        <p class="text-xl text-white/70 max-w-2xl mx-auto mb-8">
          Crée ton CV. Analyse tes chances. Comprends tes forces.
          <br/>
          <strong class="text-white">Pas de compte. Pas d'email. Juste des résultats.</strong>
        </p>
      </div>

      <!-- 3 Tools Grid -->
      <div class="grid md:grid-cols-3 gap-6 mb-16">
        <!-- CV Builder -->
        <NuxtLink 
          to="/create" 
          class="group bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-purple-500/50 transition-all"
        >
          <div class="text-4xl mb-4">🛠️</div>
          <h2 class="text-xl font-bold mb-2">CV Builder</h2>
          <p class="text-white/60 mb-4">
            Crée un CV pro en 5 min. 3 templates ATS-friendly. Export PDF instantané.
          </p>
          <span class="text-purple-400 group-hover:text-purple-300 font-medium">
            Créer mon CV →
          </span>
        </NuxtLink>

        <!-- Job Matcher -->
        <NuxtLink 
          to="/match" 
          class="group bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-blue-500/50 transition-all"
        >
          <div class="text-4xl mb-4">📊</div>
          <h2 class="text-xl font-bold mb-2">Job Matcher</h2>
          <p class="text-white/60 mb-4">
            Colle une annonce + ton CV. Vois ton score de match et les gaps à combler.
          </p>
          <span class="text-blue-400 group-hover:text-blue-300 font-medium">
            Tester le match →
          </span>
        </NuxtLink>

        <!-- CV Analyzer -->
        <NuxtLink 
          to="/analyze" 
          class="group bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-pink-500/50 transition-all"
        >
          <div class="text-4xl mb-4">🔍</div>
          <h2 class="text-xl font-bold mb-2">CV Analyzer</h2>
          <p class="text-white/60 mb-4">
            Analyse ton CV existant. Découvre tes forces, faiblesses et score ATS.
          </p>
          <span class="text-pink-400 group-hover:text-pink-300 font-medium">
            Analyser mon CV →
          </span>
        </NuxtLink>
      </div>

      <!-- Value Props -->
      <div class="flex flex-wrap justify-center gap-8 text-center text-white/60 mb-16">
        <div class="flex items-center gap-2">
          <span class="text-green-400">✓</span> 100% gratuit
        </div>
        <div class="flex items-center gap-2">
          <span class="text-green-400">✓</span> Pas de compte requis
        </div>
        <div class="flex items-center gap-2">
          <span class="text-green-400">✓</span> Résultats instantanés
        </div>
        <div class="flex items-center gap-2">
          <span class="text-green-400">✓</span> ATS-optimisé
        </div>
      </div>

      <!-- Social Proof -->
      <div class="text-center">
        <div class="flex justify-center -space-x-2 mb-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold border-2 border-slate-900">M</div>
          <div class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-sm font-bold border-2 border-slate-900">T</div>
          <div class="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-sm font-bold border-2 border-slate-900">S</div>
          <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm border-2 border-slate-900">+</div>
        </div>
        <p class="text-white/50">
          <strong class="text-white">1,247</strong> CV créés cette semaine
        </p>
      </div>
    </main>

    <!-- Footer -->
    <footer class="px-6 py-8 border-t border-white/10">
      <div class="max-w-6xl mx-auto flex justify-between items-center text-white/40 text-sm">
        <span>© 2026 heycurcus</span>
        <div class="flex gap-4">
          <a href="#" class="hover:text-white/60">Mentions légales</a>
          <a href="#" class="hover:text-white/60">Confidentialité</a>
        </div>
      </div>
    </footer>
  </div>
</template>
