<template>
  <div class="definition">
    <history-button></history-button>

    <section v-if="!errorMessage" class="section">
      <div v-if="current.word" class="container">
        <div class="tabs greek is-toggle is-centered">
          <ul>
            <li v-if="previous.uri">
              <router-link :to="{ name: 'definition', params: { uri: previous.uri }}">
                {{ previous.word }}
              </router-link>
            </li>

            <li :class="{ 'is-hidden-mobile': previous.uri && next.uri }" class="is-active has-text-weight-bold">
              <a>{{ current.word }}</a>
            </li>

            <li v-if="next.uri">
              <router-link :to="{ name: 'definition', params: { uri: next.uri }}">
                {{ next.word }}
              </router-link>
            </li>
          </ul>
        </div>

        <word-definition class="box is-size-4 is-hidden-mobile" v-bind="current"></word-definition>
        <word-definition class="is-size-5 is-hidden-tablet" v-bind="current"></word-definition>
      </div>
    </section>

    <error-message v-else isFullHeight :message="errorMessage"></error-message>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '@/api'
import ErrorMessage from '@/components/ErrorMessage.vue'
import HistoryButton from '@/components/HistoryButton.vue'
import WordDefinition from '@/components/WordDefinition.vue'

export default {
  name: 'Definition',

  components: {
    ErrorMessage,
    HistoryButton,
    WordDefinition
  },

  data () {
    return {
      errorMessage: undefined,
      current: {},
      previous: {},
      next: {}
    }
  },

  computed: {
    ...mapGetters([
      'lastWords'
    ])
  },

  beforeRouteUpdate (to, from, next) {
    this.getDefinition(to.params.uri)
    next()
  },

  mounted () {
    window.addEventListener('keyup', this.goToSibling)
  },

  destroyed () {
    window.removeEventListener('keyup', this.goToSibling)
  },

  created () {
    this.getDefinition(this.$route.params.uri).catch((error) => this.errorMessage = error)
  },

  methods: {
    async getDefinition (uri) {
      this.errorMessage = undefined

      let word = this.lastWords(uri)
      if (!word) word = await api.definitionByURI(uri).catch((error) => this.errorMessage = error)

      this.current = word.definition
      this.previous = word.siblings.previous || {}
      this.next = word.siblings.next || {}

      document.title = this.current.word

      this.$store.commit('updateHistory', word)
    },

    goToSibling (event) {
      if (event.code === 'ArrowRight') this.nextDefinition()
      if (event.code === 'ArrowLeft') this.previousDefinition()
    },

    nextDefinition () {
      if (this.next.uri && this.next.uri !== this.$router.history.current.params.uri) {
        const args = {
          name: 'definition',
          params: { uri: this.next.uri }
        }

        this.$router.push(args)
      }
    },

    previousDefinition () {
      if (this.previous.uri && this.previous.uri !== this.$router.history.current.params.uri) {
        const args = {
          name: 'definition',
          params: { uri: this.previous.uri }
        }

        this.$router.push(args)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs,
.word-definition {
  max-width: $static-width;
  margin: auto;
}

.tabs {
  margin-bottom: $gap;
}

.tabs li {
  flex-basis: 1 0 0px;
  flex-flow: column wrap;
  width: 100%;
  min-width: 100px;
}

.tabs li.is-active a {
  cursor: default;
}
</style>
