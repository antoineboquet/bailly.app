import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/api'
import { HttpError } from '@/http'
import { getIndexedDB } from '@/indexedDB'
import { inputMode, displayMode } from '@/enums'

Vue.use(Vuex)

const getDefaultSettings = () => {
  return {
    settings: {
      display: displayMode.TILES,

      homeComponent: undefined,

      search: {
        caseSensitive: false,
        inputMode: inputMode.BETA_CODE
      }
    }
  }
}

export default new Vuex.Store({
  state: {
    ...getDefaultSettings(),

    isFetching: false,
    isHistoryOpen: false,

    resultsCounter: -1,

    home: {
      animateExample: true,
      example: undefined
    },

    partialSearch: {
      maxQueryLength: 2,
      sliceLength: 19 // Quantité partiale de données à récupérer
    },

    maxShownSearchResults: 100,
    maxShownHistoryResults: 18, // trois colonnes et six lignes

    maxDictionarySlices: 300,
    maxHistoryLength: 150,

    triggers: {
      updateSearchValueWithQueryParam: false
    },

    /**
     * Tableau contenant les portions du dictionnaire que l'utilisateur
     * a recherchées au cours d'une session. Les portions sont encodées dans
     * un objet de forme { id: String, data: Object[] }. L'ID doit être une
     * chaîne grecque, afin que les données issues de recherches précédentes
     * puissent être réexploitées sans appel supplémentaire à l'API.
     *
     * N.B. La réponse de l'API doit garantir que les données sont présentées
     * selon l'ordre alphabétique.
     *
     * @example dictionarySlices = [
     *   {
     *     id: 'ρινο',
     *     data: [
     *       { uri: 'rhinobatês', word: 'ῥινοϐάτης', ... },
     *       { uri: 'rhinobatos', word: 'ῥινόϐατος', ... },
     *       { uri: 'rhinobolos', word: 'ῥινόϐολος', ... },
     *       { uri: 'rhinokerôs', word: 'ῥινόκερως', ... },
     *       ...
     *     ]
     *   },
     *   {
     *     id: 'ρινοκερ',
     *     data: [
     *       { uri: 'rhinokerôs', word: 'ῥινόκερως', ... }
     *     ]
     *   }, ...
     * ]
     */
    dictionarySlices: [],

    /**
     * Conserve les données des derniers mots recherchés (cf. historique).
     *
     * @example lastWords = [
     *   {
     *     definition: {
     *       uri: 'rhinokerôs',
     *       word: 'ῥινόκερως',
     *       htmlDefinition: '...'
     *     },
     *     siblings: {
     *       previous: { ... },
     *       next: { ... }
     *   }
     *   ...
     * ]
     */
    lastWords: []
  },

  getters: {
    /**
     * Retourne le nombre d'entrées d'une portion de dictionnaire pour un ID particulier.
     * @param {string} id - Identifiant d'une portion de dictionnaire
     */
    dictionarySliceLength: (state, getters) => (id) => {
      const slice = getters.dictionarySlices(id) || []
      return slice.countAll || slice.count
    },

    /**
     * Retourne une portion de dictionnaire pour un ID particulier.
     * @param {string} id - Identifiant d'une portion de dictionnaire.
     */
    dictionarySlices: (state) => (id, counterUpdate = false) => {
      const slice = state.dictionarySlices.find(el => el.id === id) || []
      const data = slice.data || []

      if (counterUpdate) {
        if (state.isFetching) state.resultsCounter = -1
        else state.resultsCounter = data.countAll || data.count || 0
      }

      return data
    },

    /**
     * Retourne un booléen reflétant l'existence d'une portion de dictionnaire.
     * @param {string} id - Identifiant d'une portion de dictionnaire.
     */
    isExistingSlice: (state) => (id) => {
      const found = state.dictionarySlices.findIndex(el => el.id === id)
      return found !== -1
    },

    /**
     * Retourne une définition mémorisée à partir de son URI.
     * @param {string} uri - URI d'une mot conservé dans `state.lastWords`.
     */
    lastWords: (state) => (uri) => {
      return state.lastWords.find(el => el.definition.uri === uri)
    },
  },

  mutations: {
    async _initializeStore (state) {
      // Préférences (localStorage)
      const displaySetting = localStorage.getItem('settings.display') || undefined
      const homeComponentSetting = localStorage.getItem('settings.homeComponent') || undefined
      const caseSensitivitySetting = localStorage.getItem('settings.search.caseSensitive') || undefined
      const inputModeSetting = localStorage.getItem('settings.search.inputMode') || undefined

      if (displaySetting) state.settings.display = JSON.parse(displaySetting)
      if (homeComponentSetting) state.settings.homeComponent = JSON.parse(homeComponentSetting)
      if (caseSensitivitySetting) state.settings.search.caseSensitive = JSON.parse(caseSensitivitySetting)
      if (inputModeSetting) state.settings.search.inputMode = JSON.parse(inputModeSetting)

      // Recherches (indexedDB)
      const indexedDB = await getIndexedDB()

      const transaction = indexedDB.transaction(['dictionarySlices', 'lastWords'], 'readonly')
      const dictionarySlices = transaction.objectStore('dictionarySlices').getAll()

      const dbLastWords = transaction.objectStore('lastWords').getAll()

      dictionarySlices.onsuccess = () => {
        state.dictionarySlices = dictionarySlices.result
      }

      dbLastWords.onsuccess = () => {
        state.lastWords = dbLastWords.result
        state.lastWords.forEach(row => delete row.id)
        state.lastWords.reverse()
      }
    },

    /**
     * Supprime toute portion du dictionnaire déjà chargée par l'utilisateur de sorte
     * que les résultats renvoyés permette de vérifier la sensibilité à la casse.
     * @param value {boolean} - Activation de la sensibilité à la casse.
     */
    async caseSensitivitySetting (state, value) {
      state.dictionarySlices = []
      state.settings.search.caseSensitive = value
      localStorage.setItem('settings.search.caseSensitive', JSON.stringify(value))

      const indexedDB = await getIndexedDB()
      const transaction = indexedDB.transaction('dictionarySlices', 'readwrite')
      const db = transaction.objectStore('dictionarySlices')
      db.clear()
    },

    displaySetting (state, value) {
      state.settings.display = value
      localStorage.setItem('settings.display', JSON.stringify(value))
    },

    inputModeSetting (state, value) {
      state.settings.search.inputMode = value
      localStorage.setItem('settings.search.inputMode', JSON.stringify(value))
    },

    homeComponentSetting (state, value) {
      state.settings.homeComponent = value
      localStorage.setItem('settings.homeComponent', JSON.stringify(value))
    },

    setHomeExample (state, value) {
      state.home.example = value
    },

    unsetHomeExampleAnimation (state) {
      state.home.animateExample = false
    },

    /**
     * Crée une nouvelle portion de dictionnaire.
     *
     * @param {string} args.id - Identifiant représentant une portion du dictionnaire.
     * @param {string[]} args.data - Jeu de données retourné par l'API.
     *
     * @example args = {
     *   id: 'ρινο',
     *   data: [
     *     { uri: 'rinobatês', word: 'ῥινοϐάτης', ... },
     *     { uri: 'rinobatos', word: 'ῥινόϐατος', ... },
     *     { uri: 'rinobolos', word: 'ῥινόϐολος', ... },
     *     { uri: 'rinokerôs', word: 'ῥινόκερως', ... },
     *     ...
     *   ]
     * }
     */
    async pushSlice (state, args) {
      const isPartialSearch = (args.id.length <= state.partialSearch.maxQueryLength)
      const areResultsTooLarge = (args.data.countAll > state.maxShownSearchResults)

      if (areResultsTooLarge) {
        args.data.definitions = args.data.definitions.slice(0, state.maxShownSearchResults)
      }

      if (areResultsTooLarge || (isPartialSearch && args.data.countAll > args.data.count)) {
        args.data.definitions.push({
          uri: 'partialSearchMessage',
          word: 'Précisez votre recherche pour voir tous les résultats.'
        })
      }

      state.dictionarySlices.push({
        id: args.id,
        data: args.data
      })

      Object.freeze(state.dictionarySlices[state.dictionarySlices.length - 1])

      const indexedDB = await getIndexedDB()
      const transaction = indexedDB.transaction('dictionarySlices', 'readwrite')
      const db = transaction.objectStore('dictionarySlices')

      db.add(state.dictionarySlices[state.dictionarySlices.length - 1])

      if (state.dictionarySlices.length > state.maxDictionarySlices) {
        // Supprimer d'abord la ligne dans l'indexedDB (nécessite de connaître
        // l'ID de la première case du tableau `state.dictionarySlices`).
        db.delete(state.dictionarySlices[0].id)
        state.dictionarySlices.shift()
      }
    },

    /**
     * Ajoute un mot dans l'historique et supprime l'ajout le plus ancien
     * SI la valeur de state.maxHistoryLength est excédée. `word` doit être
     * un objet de forme { definition: { ... }, siblings: { ... } }.
     */
    async updateHistory (state, word) {
      const existingIndex = state.lastWords.findIndex(el => el.definition.uri === word.definition.uri)

      const indexedDB = await getIndexedDB()
      const transaction = indexedDB.transaction('lastWords', 'readwrite')
      const db = transaction.objectStore('lastWords')

      if (existingIndex !== -1) {
        // Si le mot existe déjà, le supprimer de l'historique
        // pour le replacer en première positition.
        state.lastWords.splice(existingIndex, 1)
        state.lastWords.unshift(word)

        // Supprimer la réplique indexedDB et insérer les données
        // suivant le nouvel ordre (tous les IDs changent ici).
        db.clear('lastWords')

        for (let i = state.lastWords.length - 1; i >= 0; i--) {
          db.add(state.lastWords[i])
        }

        return
      }

      state.lastWords.unshift(word)

      db.add(word)

      if (state.lastWords.length > state.maxHistoryLength) {
        // Supprimer d'abord la ligne dans l'indexedDB (nécessite de connaître
        // l'URI de la première case du tableau `state.lastWords`).
        db.delete(state.lastWords[state.lastWords.length - 1].definition.uri)
        state.lastWords.pop()
      }
    }
  },

  actions: {
    resetSettings ({ commit }) {
      commit('displaySetting', getDefaultSettings().settings.display)
      commit('caseSensitivitySetting', getDefaultSettings().settings.search.caseSensitive)
      commit('inputModeSetting', getDefaultSettings().settings.search.inputMode)

      localStorage.removeItem('settings.display')
      localStorage.removeItem('settings.search.caseSensitive')
      localStorage.removeItem('settings.search.inputMode')
    },

    /**
     * Appelle la mutation pushSlice afin de peupler state.dictionarySlices
     * SI la portion de dictionnaire demandée n'a pas déjà été téléchargée.
     *
     * @param {string} args.query - Chaîne grecque recherchée.
     * @param {Object} args.params - Paramètres passés à l'API.
     *
     * @example args = {
     *   query: 'ρινο',
     *   params: {
     *     limit: 50
     *   }
     * }
     */
    async updateDictionary ({ commit, getters, state }, args) {
      const isExistingSlice = getters.isExistingSlice(args.query)
      const isPartialSearch = (args.query.length <= state.partialSearch.maxQueryLength)

      if (!args.query || isExistingSlice) return

      const params = [
        args.query,
        state.settings.search.caseSensitive,
        false //exact
      ]

      if (isPartialSearch) {
        params.push(state.partialSearch.sliceLength) // limit
      } else {
        // Ne jamais demander plus de résultats que `state.maxShownSearchResults`
        params.push(state.maxShownSearchResults) // limit
      }

      state.isFetching = true

      try {
        const result = await api.definitions(...params)
        if (result.count) commit('pushSlice', { id: args.query, data: result })
        state.isFetching = false
      }
      catch (error) {
        state.isFetching = false
        throw new HttpError(error)
      }
    }
  }
})
