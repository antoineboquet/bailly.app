<template>
  <div class="home">
    <div class="field has-addons">
      <p class="control">
        <button class="button"
        :class="{ 'is-active': (selectedComponent === 'home') || activeButton === 'home' }"
        @click="selectedComponent = 'home'">
          <span class="icon is-small">
            <ion-icon class="ion-ionic" name="home"></ion-icon>
          </span>
          <span class="is-hidden-mobile">Accueil</span>
        </button>
      </p>

      <p class="control">
        <button class="button"
        :class="{ 'is-active': (selectedComponent === 'history') || activeButton === 'history' }"
        @click="selectedComponent = 'history'">
          <span class="icon is-small">
            <ion-icon class="ion-ionic" name="time"></ion-icon>
          </span>
          <span class="is-hidden-mobile">Historique</span>
        </button>
      </p>

      <p class="control">
        <button class="button"
        :class="{ 'is-active': (selectedComponent === 'documents') || activeButton === 'documents' }"
        @click="selectedComponent = 'documents'">
          <span class="icon is-small">
            <ion-icon class="ion-ionic" name="document-text"></ion-icon>
          </span>
          <span class="is-hidden-mobile">Documents</span>
        </button>
      </p>
    </div>

    <homeHistory @hook:created="activeButton = 'history'" v-if="selectedComponent === 'history'"></homeHistory>
    <homeDocuments @hook:created="activeButton = 'documents'" v-else-if="selectedComponent === 'documents'"></homeDocuments>
    <homeIntroduction @hook:created="activeButton = 'home'" v-else></homeIntroduction>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import HomeDocuments from '@/views/home/Documents.vue'
import HomeHistory from '@/views/home/History.vue'
import HomeIntroduction from '@/views/home/Introduction.vue'

export default {
  name: 'Home',

  components: {
    HomeDocuments,
    HomeHistory,
    HomeIntroduction
  },

  data () {
    return {
      activeButton: undefined
    }
  },

  computed: {
    ...mapState({
      lastWords: state => state.lastWords
    }),

    selectedComponent: {
      get () {
        return this.$store.state.settings.homeComponent
      },

      set (value) {
        this.$store.commit('homeComponentSetting', value)
      }
    }
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!vm.$store.state.settings.homeComponent && vm.$store.state.lastWords.length >= 3) {
        vm.$store.commit('homeComponentSetting', 'history')
      }

      vm.queryParam = vm.$route.params.query || Object.keys(vm.$route.query)[0] || ''
      vm.$store.state.triggers.updateSearchValueWithQueryParam = true
    })
  }
}
</script>

<style lang="scss" scoped>
.field {
  position: fixed;
  z-index: 9999;
  left: 1rem;
  bottom: 1.2rem;
  margin: 0 !important;

  @media only screen and (min-width: $desktop) {
    left: 1.5rem;
  }

  .button {
    border: 0;

    &, &:hover {
      background: $grey-lighter;
      color: $text-strong;
      font-weight: bold;
    }

    @media only screen and (max-width: $tablet) {
      .icon {
        margin: 0 !important;
      }
    }
  }

  .button.is-active {
    background: $grey-dark;
    color: $grey-lightest;
  }
}
</style>
