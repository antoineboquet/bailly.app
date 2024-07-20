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
            <!-- Tablette/ordinateur uniquement -->
            <p class="title mb-2 has-text-black is-size-3-widescreen is-size-4-tablet is-hidden-mobile">Consultez le dictionnaire<br><span class="gradient">grec&ndash;français</span> d'Anatole Bailly<br></p>
            <p class="is-size-4-widescreen is-size-5-tablet is-hidden-mobile">Dans l'édition Bailly 2020 Hugo Chávez (<router-link :to="{ name: 'about' }">à&nbsp;propos</router-link>).</p>

            <!-- Mobile uniquement -->
            <p class="mt-5 is-size-5-mobile is-hidden-tablet">Consultez le dictionnaire <strong><span class="gradient">grec&ndash;français</span></strong> d'Anatole Bailly dans l'édition Bailly 2020 Hugo Chávez (<router-link :to="{ name: 'about' }">à&nbsp;propos</router-link>).
            </p>

            <!-- Tablette/ordinateur uniquement -->
            <p v-html="hint" class="subtitle is-size-5-tablet mt-5 is-hidden-touch is-hidden-desktop-only"></p>
          </div>

          <div
            v-if="!isExampleLoading && example"
            @animationend="removeExampleAnimation"
            class="column example"
            :class="{ 'grow': animateExample }"
          >
            <div class="emoji-container">
              <Icon :icon="example.emoji" style="width: 100%;" />
            </div>
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
import { Icon } from '@iconify/vue2'
import HistoryButton from '@/components/HistoryButton.vue'
import WordDefinition from '@/components/WordDefinition.vue'

export default {
  name: 'HomeIntroduction',

  components: {
    Icon,
    HistoryButton,
    WordDefinition
  },

  data () {
    return {
      examples: [
        { emoji: this.getTwemoji('ewe'), uri: 'krios' },
        { emoji: this.getTwemoji('goat'), uri: 'aix' },
        { emoji: this.getTwemoji('fox'), uri: 'alôpêx' },
        { emoji: this.getTwemoji('rhinoceros'), uri: 'rhinokerôs' },
        { emoji: this.getTwemoji('fish'), uri: 'ichthus' },
        { emoji: this.getTwemoji('farmer'), uri: 'geôrgos' },
        { emoji: this.getTwemoji('old-man-light-skin-tone'), uri: 'Sôkratês' },
        { emoji: this.getTwemoji('old-man-medium-skin-tone'), uri: 'Diogenês' },
        { emoji: this.getTwemoji('chair'), uri: 'kathedra' },
        { emoji: this.getTwemoji('drum'), uri: 'tumpanon' },
        { emoji: this.getTwemoji('dagger'), uri: 'xiphos' },
        { emoji: this.getTwemoji('hook'), uri: 'ankistron' },
        { emoji: this.getTwemoji('classical-building'), uri: 'parthenôn' },
        { emoji: this.getTwemoji('performing-arts'), uri: 'theatron' },
        { emoji: this.getTwemoji('telescope'), uri: 'têleskopos' },
        { emoji: this.getTwemoji('desert-island'), uri: 'nêsos' },
        { emoji: this.getTwemoji('glowing-star'), uri: 'astêr' }
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
      let definition = result.definition
      definition.emoji = randomExample.emoji
      this.$store.commit('setHomeExample', definition)
    }

    this.isExampleLoading = false
  },

  methods: {
    getTwemoji (emoji) {
      return 'twemoji:' + emoji
    },

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

.icon {
  vertical-align: middle;
  margin-top: -0.4rem;
  margin-left: -0.25rem;
  margin-right: 0.25rem;
}

.emoji-container {
  user-select: none;
  margin: auto;
  height: 96px;
  width: 96px;
  background-image: radial-gradient(circle at bottom left, rgb(255, 255, 255) 33%, rgba(255, 255, 255, 0) 100%);
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

  .emoji-container {
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
  .emoji-container {
    height: 128px;
    width: 128px;
    float: right;
    margin-top: -48px;
    margin-right: -48px;
    margin-left: 15px;
    margin-bottom: 15px;
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
