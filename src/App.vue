<template>
  <div id="app">
    <nav id="nav" ref="navbar"
    class="navbar is-fixed-top" :class="{ 'is-colored': ($route.name === 'about') }"
    role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <router-link id="app-title" to="/" class="button">
          <span class="icon">B</span>
        </router-link>
      </div>

      <search-bar ref="searchBar" class="navbar-item"></search-bar>

      <div class="navbar-menu">
        <div class="navbar-end">
          <router-link class="navbar-item" :to="{ name: 'settings' }">
            <span class="icon">
              <ion-icon class="ion-ionic" name="options-outline" size="large">
                <span>&#9881;</span>
              </ion-icon>
            </span>
            <span class="item-label ml-1">Préférences</span>
          </router-link>

          <router-link class="navbar-item" :to="{ name: 'about' }">
            <span class="icon">
              <ion-icon class="ion-ionic" name="information-outline" size="large">
                <span>&#105;</span>
              </ion-icon>
            </span>
            <span class="item-label ml-1">À propos</span>
          </router-link>
        </div>
      </div>
    </nav>

    <router-view />
  </div>
</template>

<script>
import SearchBar from '@/components/SearchBar.vue'

export default {
  components: {
    SearchBar
  },

  data () {
    return {
      lastScrollPosition: 0
    }
  },

  beforeCreate () {
    this.$store.commit('_initializeStore')
  },

  mounted () {
    // Masquer le visuel de chargement (v. `public/index.html`).
    document.getElementById('splash').style.visibility = 'hidden'
    // Attacher la classe `is-colored` à la barre de navigation sur mobile.
    if (window.innerWidth <= 768) this.$refs.navbar.classList.add('is-colored')

    window.addEventListener('scroll', this.onScroll)
  },

  destroyed () {
    window.removeEventListener('scroll', this.onScroll)
  },

  methods: {
    /**
     * Place des classes utilitaires pour afficher/masquer l'arrière-plan
     * de la barre de navigation et afficher/masquer la barre de navigation
     * elle-même en foncion de la valeur de défilement.
     * 
     * N.B. Sur mobile, la barre de navigation est toujours colorée.
     */
    onScroll () {
      const navbar = this.$refs.navbar
      const scrollY = window.scrollY

      if (window.innerWidth <= 768 || this.$route.name === 'about') {
        navbar.classList.add('is-colored')
      } else {
        if (scrollY > 0) {
          navbar.classList.add('is-colored')
        } else {
          navbar.classList.remove('is-colored')
        }
      }

      // Afficher/masquer la barre de navigation sur les mobiles et tablettes.
      if (scrollY > (navbar.clientHeight * 5) && scrollY > this.lastScrollPosition) {
        navbar.classList.add('is-hidden-scroll')
      } else {
        navbar.classList.remove('is-hidden-scroll')
      }

      this.lastScrollPosition = scrollY
    }
  }
}
</script>
