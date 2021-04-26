<template>
  <div class="dictionary">
    <history-button></history-button>

    <section v-if="!errorMessage" class="section">
      <div v-show="isFetching" class="spinner"></div>

      <div v-show="!isFetching" class="container is-widescreen">
        <virtual-list
          :data-key="'id'"
          :data-sources="words"
          :data-component="virtualListComponent"
          :wrap-class="virtualListClasses"
          :item-class="virtualListItemClasses"
          :page-mode="true"
          wrap-tag="nav"
        />
      </div>
    </section>

    <error-message v-else isFullHeight :message="errorMessage"></error-message>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import VirtualList from 'vue-virtual-scroll-list'
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
    VirtualList
  },

  data () {
    return {
      errorMessage: undefined,
      query: '',
      queryParam: ''
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

    words () {
      const slice = this.dictionarySlices(this.query, true) || []
      const words = slice.definitions || []

      if (this.displaySetting === displayMode.TILES) {
        const chunkedArr = chunkArr(words, 12)
        const wordsWrapper = []

        for (let i = 0; i < chunkedArr.length; i++) {
          wordsWrapper.push({ id: i, data: chunkedArr[i] })
        }

        return wordsWrapper
      }

      words.forEach((el, i) => el.id = i)
      return words
    },

    virtualListClasses () {
      if (this.displaySetting === displayMode.TILES) return ''
      else return 'list static-width'
    },

    virtualListItemClasses () {
      if (this.displaySetting === displayMode.TILES) return ''
      else return 'list-item is-size-5'
    },

    virtualListComponent () {
      if (this.displaySetting === displayMode.TILES) return WordTileGroup
      else return WordListItem
    }
  },

  watch: {
    isCaseSensitive () {
      this.updateDictionary()
    },

    query () {
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
    debounceUpdateDictionary: debounce(function () {
      this.updateDictionary()
    }, 250),

    updateDictionary () {
      this.$store.dispatch('updateDictionary', {
        query: this.query
      })
      .then(() => {
        this.errorMessage = undefined
      })
      .catch((error) => {
        this.errorMessage = error
      })
    }
  }
}
</script>
