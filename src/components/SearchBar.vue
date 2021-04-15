<template>
  <div id="search-bar">
    <div class="control">
      <input
        autofocus
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        type="search"
        class="input is-rounded is-shadowless"
        placeholder="Rerchercher..."
        ref="inputSearch"
        v-model="searchValue"
        @focus="onFocus"
        @blur="onBlur"
        @input="updateInput"
      />

      <div
        id="search-bar-items"
        v-bind:class="{
          'has-text-grey': itemsFocus,
          'has-text-grey-light': !itemsFocus
        }"
      >
        <span
          v-show="resultsCounter >= 1 && searchValue.length >= 1"
          class="tag counter is-light has-text-weight-bold"
        >
          {{ resultsCounter }}
        </span>

        <!--<span
          v-show="!resultsCounter && searchValue.length >= 1"
          class="tag counter-no-results is-primary has-text-weight-bold"
        >
          <span class="is-hidden-mobile">Aucun résultat</span>
          <span class="is-hidden-tablet">0</span>
        </span>-->

        <span
          class="icon"
          :class="{ 'has-text-black': !isInputModeBetaCode && itemsFocus, 'has-text-grey': !isInputModeBetaCode && !itemsFocus }"
          data-tooltip="Mode de saisie" @click="toggleInputMode"
        >
          <ion-icon
            class="ion-ionic"
            name="repeat-outline"
            size="large"
          >
            <span>&rlarr;</span>
          </ion-icon>
        </span>

        <span
          class="icon"
          :class="{ 'has-text-black': isCaseSensitive && itemsFocus, 'has-text-grey': isCaseSensitive && !itemsFocus }"
          data-tooltip="Sensibilité à la casse" @click="toggleCaseSensitivityOption"
        >
          <ion-icon
            class="ion-ionic"
            name="text-outline"
            size="large"
          >
            <span>Aa</span>
          </ion-icon>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { inputMode, keyType } from '@/enums'
import {
  applyGammaDiphthongs,
  applyGreekVariants,
  removeDiacritics,
  toGreek,
  toTransliteration
} from '@/libraries/textTransform'

export default {
  name: 'SearchBar',

  data () {
    return {
      itemsFocus: false,
      lastSearchValue: '',
      searchValue: '',
      searchValueMaxLength: 35 // plus long mot du dictionnaire
    }
  },

  computed: {
    ...mapGetters([
      'isExistingSlice'
    ]),

    ...mapState({
      isCaseSensitive: state => state.settings.search.caseSensitive,
      resultsCounter: state => state.resultsCounter,
      updateSearchValueWithQueryParam: state => state.triggers.updateSearchValueWithQueryParam
    }),

    isInputModeBetaCode () {
      const inputModeSetting = this.$store.state.settings.search.inputMode
      return inputModeSetting === inputMode.BETA_CODE
    }
  },

  watch: {
    isInputModeBetaCode () {
      if (this.isInputModeBetaCode) {
        this.searchValue = toGreek(this.searchValue, keyType.TRANSLITERATION)
      } else { // Scientifique
        this.searchValue = toTransliteration(this.searchValue)
      }
    },

    updateSearchValueWithQueryParam () {
      if (this.updateSearchValueWithQueryParam) {
        const queryParam = this.$route.params.query || Object.keys(this.$route.query)[0] || ''

        if (this.isInputModeBetaCode) {
          this.searchValue = toGreek(queryParam, keyType.TRANSLITERATION)
        } else {
          this.searchValue = queryParam
        }

        this.$store.state.triggers.updateSearchValueWithQueryParam = false
      }
    }
  },

  methods: {
    toggleInputMode () {
      this.$refs.inputSearch.focus()

      if (this.isInputModeBetaCode) {
        this.$store.commit(
          'inputModeSetting',
          inputMode.TRANSLITERATION
        )
      } else {
        this.$store.commit(
          'inputModeSetting',
          inputMode.BETA_CODE
        )
      }
    },

    toggleCaseSensitivityOption () {
      this.$refs.inputSearch.focus()
      this.$store.commit('caseSensitivitySetting', !this.isCaseSensitive)
    },

    onFocus () {
      this.itemsFocus = true
      if (this.searchValue) this.pushSearchRoute(this.searchValue)
    },

    onBlur () {
      this.itemsFocus = false
    },

    updateInput (event) {
      // Empêcher les recherches trop longues.
      const rule1 = (this.searchValue.length + 1 > this.searchValueMaxLength)
      // Ne pas accepter des valeurs autres que des lettres ou des espaces (beta code).
      const rule2 = (this.isInputModeBetaCode && event.data && /[^a-zα-ω\s]+/i.test(removeDiacritics(event.data)))

      if (rule1 || rule2) {
        this.searchValue = this.lastSearchValue
        return
      }

      if (!this.isInputModeBetaCode) { // scientifique
        this.searchValue = toTransliteration(applyGammaDiphthongs(event.target.value, keyType.TRANSLITERATION))
        this.pushSearchRoute(this.searchValue)
        return
      }

      // beta code

      let greek = toGreek(event.target.value, keyType.BETA_CODE)
      greek = applyGreekVariants(applyGammaDiphthongs(greek, keyType.GREEK))

      this.searchValue = greek
      this.lastSearchValue = this.searchValue

      const selection = {
        start: event.target.selectionStart,
        end: event.target.selectionEnd
      }

      this.$nextTick(function () {
        // Mise à jour de la sélection (nécessite de passer par une référence).
        this.$refs.inputSearch.selectionEnd = selection.start
      })

      this.pushSearchRoute(this.searchValue)
    },

    pushSearchRoute (value) {
      if (value && value.length) {
        const args = {
          name: 'search',
          params: { query: toTransliteration(value) || value }
        }

        return this.$router.push(args).catch((error) => {}) // eslint-disable-line
      }

      this.$router.push('/').catch((error) => {}) // eslint-disable-line
    }
  }
}
</script>
