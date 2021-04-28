<template>
  <div class="home-introduction hero is-fullheight-with-navbar">
    <history-button></history-button>

    <div class="hero-body" :class="{ 'pt-0': (!isExampleLoading && !example) }">
      <div class="container">
        <div class="columns is-multiline is-vcentered is-desktop">
          <div
            class="column intro is-8-tablet is-offset-2-tablet is-6-widescreen is-offset-0-widescreen"
            :class="{ 'is-offset-3-widescreen has-text-centered': (!isExampleLoading && !example) }"
          >
            <p class="title mb-2 is-size-3-widescreen is-size-4-tablet is-size-5-mobile">
              Consultez le dictionnaire<br><mark>grec&ndash;français</mark>
              d'Anatole Bailly<br>
            </p>

            <p class="title is-size-5-tablet is-size-6-mobile">Dans l'édition Bailly 2020 Hugo Chávez (<router-link :to="{ name: 'about' }">à&nbsp;propos</router-link>).</p>

            <p v-html="hint" class="subtitle is-size-4-tablet is-size-5-mobile mt-5"></p>
          </div>

          <div
            v-if="!isExampleLoading && example"
            @animationend="removeExampleAnimation"
            class="column example"
            :class="{ 'grow': animateExample }"
          >
            <div class="emoji">{{ example.emoji }}</div>
            <word-definition class="box is-size-5-mobile is-size-4" v-bind="example"></word-definition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api'
import { mapState } from 'vuex'
import HistoryButton from '@/components/HistoryButton.vue'
import WordDefinition from '@/components/WordDefinition.vue'

export default {
  name: 'HomeIntroduction',

  components: {
    HistoryButton,
    WordDefinition
  },

  data () {
    return {
      examples: [
        { emoji: '🐏', uri: 'krios' },
        { emoji: '🐐', uri: 'aix' },
        { emoji: '🦊', uri: 'alôpêx' },
        { emoji: '🦏', uri: 'rhinokerôs' },
        { emoji: '🐟', uri: 'ichthus' },
        { emoji: '👨‍🌾', uri: 'geôrgos' },
        { emoji: '🧓🏼', uri: 'Sôkratês' },
        { emoji: '🧓🏽', uri: 'Diogenês' },
        { emoji: '🪑', uri: 'kathedra' },
        { emoji: '🥁', uri: 'tumpanon' },
        { emoji: '🗡️', uri: 'xiphos' },
        { emoji: '🪝', uri: 'ankistron' },
        { emoji: '🏛️', uri: 'parthenôn' },
        { emoji: '🎭', uri: 'theatron' },
        { emoji: '🔭', uri: 'têleskopos' },
        { emoji: '🏝️', uri: 'nêsos' },
        { emoji: '🌟', uri: 'astêr' }
      ],

      hints: [
        `Trouvez le mot que vous cherchez en quelques secondes, sans avoir à tourner les pages.`,
        `Les résultats correspondant exactement à la recherche sont affichés en surbrillance.`,
        `Grâce à l'historique, retrouvez des mots consultés précédemment.`,
        `Comprend plusieurs <a href="/préférences">modes de saisie</a> du grec afin d'épouser vos habitudes.`
      ],

      isExampleLoading: true
    }
  },

  computed: {
    ...mapState({
      animateExample: state => state.home.animateExample,
      example: state => state.home.example
    }),

    hint () {
      const randomIndex = Math.floor(Math.random() * this.hints.length)
      return this.hints[randomIndex]
    }
  },

  async created () {
    if (this.example) {
      this.isExampleLoading = false
      return
    }

    const randomIndex = Math.floor(Math.random() * this.examples.length)
    const randomExample = this.examples[randomIndex]

    const result = await api.definitionByURI(randomExample.uri).catch((error) => {}) /* eslint-disable-line */

    if (result) {
      let data = result.definition
      data.emoji = randomExample.emoji

      this.$store.commit('setHomeExample', data)
    }

    this.isExampleLoading = false
  },

  methods: {
    removeExampleAnimation () {
      this.$store.commit('unsetHomeExampleAnimation')
    }
  }
}
</script>

<style lang="scss" scoped>
.intro {
  text-align: center;
}

.title, .subtitle {
  line-height: 150%;
}

.emoji {
  user-select: none;
  margin: auto;
  height: 96px;
  width: 96px;
  border: 5px solid $white;
  border-radius: 50%;
  font-size: 96px;
}

@media only screen and (max-width: $widescreen) {
  .intro {
    padding-bottom: 0;
  }

  .example {
    padding-top: 0;
  }

  .emoji {
    position: relative;
    top: 48px;
    line-height: 96px;
    background-color: $white;
    box-shadow: 0 0px 0 1px rgba($scheme-invert, 0.1);
  }

  .word-definition {
    padding-top: 5rem;
  }
}

@media only screen and (min-width: $widescreen) {
  .emoji {
    height: 128px;
    width: 128px;
    float: right;
    margin-top: -48px;
    margin-right: -48px;
    margin-left: 15px;
    margin-bottom: 15px;
    font-size: 128px;
    line-height: 128px;
    box-shadow: 0.25em 0.25em 0.5em -0.125em rgba($scheme-invert, 0.25),
                0 0px 0 1px rgba($scheme-invert, 0.1);
  }

  .grow {
    animation: grow 1s;
  }

  .hero-body > .container {
    padding-left: 3rem;
    padding-right: 3rem;
  }

  .intro {
    padding-right: $gap;
    text-align: left;
  }
}
</style>
