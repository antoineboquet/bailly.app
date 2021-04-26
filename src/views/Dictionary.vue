<template>
  <div class="dictionary">
    <history-button></history-button>

    <section v-if="!errorMessage" class="section">
      <div v-show="isFetching" class="spinner"></div>

      <div v-show="!isFetching" class="container is-widescreen">
        <nav v-if="isDisplayModeTiles">
          <word-tile-group
            v-for="chunk in words"
            v-bind:key="chunk.id"
            v-bind:words="chunk.data"
          ></word-tile-group>
        </nav>

        <nav v-else class="list static-width">
          <word-list-item
            v-for="word in words"
            v-bind:key="word.uri"
            v-bind:word="word"
          ></word-list-item>
        </nav>
      </div>
    </section>

    <error-message v-else isFullHeight :message="errorMessage"></error-message>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import { mapGetters, mapState } from 'vuex'
import { displayMode, keyType } from '@/enums'
import { chunkArr } from '@/libraries/array'
import { toGreek } from '@/libraries/textTransform'
import ErrorMessage from '@/components/ErrorMessage.vue'
import HistoryButton from '@/components/HistoryButton.vue'
import WordListItem from '@/components/WordListItem.vue'
import WordTileGroup from '@/components/WordTileGroup.vue'

export default {
  name: 'Dictionary',

  components: {
    ErrorMessage,
    HistoryButton,
    WordListItem,
    WordTileGroup
  },

  data () {
    return {
      errorMessage: undefined,
      query: '',
      queryParam: '',
      words: []
    }
  },

  computed: {
    ...mapGetters([
      'dictionarySlices'
    ]),

    ...mapState({
      displaySetting: state => state.settings.display,
      isCaseSensitive: state => state.settings.search.caseSensitive,
      isFetching: state => state.isFetching,
      updateSearchValueWithQueryParam: state => state.triggers.updateSearchValueWithQueryParam
    }),

    isDisplayModeTiles () {
      return this.displaySetting === displayMode.TILES
    }
  },

  watch: {
    isCaseSensitive () {
      this.updateDictionary()
    },

    query () {
      this.debounceWords()
      this.debounceUpdateDictionary()
    },

    queryParam () {
      this.query = toGreek(this.queryParam, keyType.TRANSLITERATION)
    },

    /**
     * Navigue automatiquement vers la définition s'il existe une
     * correspondance exacte ET unique pour la recherche effectuée.
     */
    words () {
      if ((this.words[0] && this.words.length === 1 && this.words[0].isExact) ||
          (this.words[0] && this.words[0].data && this.words[0].data.length === 1 && this.words[0].data[0].isExact))
      {
        const args = {
          name: 'definition',
          params: { uri: this.words[0].uri || this.words[0].data[0].uri }
        }

        this.$router.push(args)
      }
    }
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.queryParam = vm.$route.params.query || Object.keys(vm.$route.query)[0] || ''
      if (!vm.queryParam) next('/')

      vm.$store.state.triggers.updateSearchValueWithQueryParam = true
    })
  },

  beforeRouteUpdate (to, from, next) {
    this.queryParam = to.params.query
    next()
  },

  methods: {
    debounceUpdateDictionary: debounce(
      function () {
        this.updateDictionary()
      },
      250
    ),

    debounceWords: debounce(
      function () {
        const slice = this.dictionarySlices(this.query, true) || []
        const words = slice.definitions || []

        switch (this.displaySetting) {
          case displayMode.TILES:
            const chunkedArr = chunkArr(words, 12) // eslint-disable-line
            const wordsWrapper = [] // eslint-disable-line

            for (let i = 0; i < chunkedArr.length; i++) {
              wordsWrapper.push({ id: i, data: chunkedArr[i] })
            }

            this.words = wordsWrapper
            break

          default:
            this.words = words
            break
        }

        window.scrollTo(0, 0)
      },
      150
    ),

    updateDictionary () {
      this.$store.dispatch('updateDictionary', {
        query: this.query
      }).then(() => {
        this.errorMessage = undefined
        this.debounceWords()
      }).catch((error) => {
        this.errorMessage = error
      })
    }
  }
}
</script>
