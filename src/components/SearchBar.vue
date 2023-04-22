<template>
  <div id="search-bar" class="is-flex-mobile">
    <button v-if="(this.$route.name === 'definition' && this.searchValue && resultsCounter > 1)" @click="goToSearchResults" class="button back-to-search is-hidden-tablet mr-2">
      <span class="icon is-large has-text-white">
        <ion-icon class="ion-ionic" name="arrow-back-outline">
          <span >&larr;</span>
        </ion-icon>
      </span>
    </button>

    <div class="control">
      <input
        autofocus
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        type="search"
        class="input is-rounded is-shadowless"
        placeholder="Rechercher..."
        ref="inputSearch"
        v-model="searchValue"
        @focus="onFocus"
        @blur="onBlur"
        @input="updateInput"
        @compositionupdate="overrideIME"
      />

      <div id="search-bar-items" v-bind:class="{ 'has-text-grey': itemsFocus, 'has-text-grey-light': !itemsFocus }">
        <span v-show="resultsCounter >= 1 && searchValue.length >= 1" class="tag counter is-light has-text-weight-bold">
          {{ resultsCounter }}
        </span>
        <!--
        <span v-show="!resultsCounter && searchValue.length >= 1" class="tag counter-no-results is-primary has-text-weight-bold">
          <span class="is-hidden-mobile">Aucun résultat</span>
          <span class="is-hidden-tablet">0</span>
        </span>
        -->
        <span class="icon" :class="{ 'has-text-primary': !isInputModeBetaCode && itemsFocus, 'has-text-grey': !isInputModeBetaCode && !itemsFocus }" data-tooltip="Mode de saisie" @click="toggleInputMode">
          <ion-icon class="ion-ionic" name="repeat-outline" size="large">
            <span>&rlarr;</span>
          </ion-icon>
        </span>

        <span class="icon" :class="{ 'has-text-primary': isCaseSensitive && itemsFocus, 'has-text-grey': isCaseSensitive && !itemsFocus }" data-tooltip="Sensibilité à la casse" @click="toggleCaseSensitivityOption">
          <ion-icon class="ion-ionic" name="text-outline" size="large">
            <span>Aa</span>
          </ion-icon>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

import {
  applyGammaDiphthongs,
  keyType,
  removeDiacritics,
  toGreek,
  toTransliteration
} from 'greek-conversion'

import { inputMode } from '@/enums'

const conversionOptions = {
  preserveWhitespace: true,
  removeDiacritics: true
}

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
        this.searchValue = toGreek(
          this.searchValue,
          keyType.TRANSLITERATION,
          conversionOptions
        )
      } else {
        this.searchValue = toTransliteration(
          this.searchValue,
          keyType.GREEK,
          conversionOptions
        )
      }
    },

    updateSearchValueWithQueryParam () {
      if (this.updateSearchValueWithQueryParam) {
        const queryParam = this.$route.params.query || Object.keys(this.$route.query)[0] || ''

        if (this.isInputModeBetaCode) {
          this.searchValue = toGreek(queryParam, keyType.TRANSLITERATION, conversionOptions)
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

    goToSearchResults () {
      if (this.searchValue) this.pushSearchRoute(this.searchValue)
    },

    onFocus () {
      this.itemsFocus = true
      if (this.searchValue) this.pushSearchRoute(this.searchValue)
    },

    onBlur () {
      this.itemsFocus = false
    },

    updateInput (event) {
      // Supprimer les espaces en début de recherche et
      // les espaces multiples en fin de recherche.
      event.target.value = event.target.value.trimStart()
      event.target.value = event.target.value.replace(/\s{2,}/g, ' ')
      
      // Empêcher les recherches trop longues.
      if (this.searchValue.length + 1 > this.searchValueMaxLength) {
        this.searchValue = this.lastSearchValue
        return
      }

      switch (this.isInputModeBetaCode) {
        case true: {
          event.target.value = removeDiacritics(event.target.value, keyType.GREEK)
          this.searchValue = toGreek(event.target.value, keyType.BETA_CODE, conversionOptions)

          this.lastSearchValue = this.searchValue

          const selection = {
            start: event.target.selectionStart,
            end: event.target.selectionEnd
          }

          this.$nextTick(function () {
            // Mise à jour de la sélection (nécessite de passer par une référence).
            this.$refs.inputSearch.selectionEnd = selection.start
          })
          break
        }

        case false:
          this.searchValue = applyGammaDiphthongs(event.target.value, keyType.TRANSLITERATION)
          break
      }

      this.pushSearchRoute(this.searchValue)
    },
    
    // Android/GBoard : prévient la rétention de l'entrée utilisateur.
    overrideIME () {
      this.$refs.inputSearch.dispatchEvent(new CompositionEvent('compositionend'))
    },

    pushSearchRoute (value) {
      if (value && value.length) {
        const args = {
          name: 'search',
          params: {
            query: (this.isInputModeBetaCode)
              ? toTransliteration(value, keyType.GREEK, conversionOptions)
              : value
          }
        }

        return this.$router.replace(args).catch((error) => {}) // eslint-disable-line
      }

      this.$router.replace('/').catch((error) => {}) // eslint-disable-line
    }
  }
}
</script>

<style lang="scss" scoped>
  @media screen and (max-width: $tablet) {
    #search-bar .control {
      flex-grow: 2;
    }
  }

  .back-to-search {
    width: 2.4em;
    height: 2.4em;
    background: $grey-dark;
    border: 0;
    border-radius: 9999px;
  }
</style>
