import http from '@/http'
import { removeGreekVariants } from '@/libraries/textTransform'

const MAX_LIMIT = 1000

/**
 * Vérifie si la valeur de la recherche est acceptable.
 * N.B. Il est nécessaire de vérifier si la recherche porte
 * uniquement sur des lettres grecques car des caractères
 * illicites sont permis en mode de saisie translittérée.
 * @param searchValue Saisie utilisateur.
 * @returns {Boolean}
 */
function isSearchValueAcceptable (str) {
  const truth = (
    // les mots mesurent 35 caractères max.
    str.length > 35 ||
    // = 4 caractères identiques à suivre (3 max.)
    /(.)\1{3,}/.test(str) ||
    // la recherche porte seulement sur des lettres grecques (digamma inclus)
    /[^αβγδεζηθικλμνξοπρστυφχψωϝ\s]/i.test(str) ||
    // pas d'espace initial ni de multiples `h` ou espaces consécutifs
    /^\s|[h\s]{2,}/.test(str)
  )

  return truth ? false : true
}

export default {
  /**
   * Envoie une requête à partir d'une URI.
   * @param {String}  uri - identifiant unique d'un mot.
   * @param {Boolean} siblings - retourner les mots adjacents (`uri`, `word`).
   * @returns Une unique définition et des métadonnées.
   */
  definitionByURI (uri, siblings = true) {
    let fields = `uri,word,htmlDefinition`
    let query  = `definition/${uri}?fields=${fields}`

    if (siblings) query += `&siblings`

    return http.fetch(query).then(response => { return response })
  },

  /**
   * Envoie une requête comprenant une chaîne de caractères grecs
   * normalisés et des contraintes pour la recherche.
   * @param {String} searchValue
   * @param {Number} limit
   * @returns Un jeu de définitions et des métadonnées.
   */
  async definitions (
    searchValue,
    caseSensitive = false,
    exact = false,
    limit = MAX_LIMIT,
    offset
  ) {
    if (limit > MAX_LIMIT) return false

    if (!caseSensitive) searchValue = searchValue.toLowerCase()
    searchValue = removeGreekVariants(searchValue)

    if (!isSearchValueAcceptable(searchValue)) return false

    let fields = 'uri,word,excerpt'

    if (exact || caseSensitive) fields += ',searchable'
    else fields += ',searchableCaseInsensitive'

    let query = `definitions/${searchValue}?fields=${fields}`
    query += `&limit=${limit}`

    if (caseSensitive) query += `&caseSensitive`
    if (exact) query += `&exact`
    if (offset) query += `&offset=${offset}`

    return await http.fetch(query)
      .then(response => {
        const definitions = response.definitions

        const words = {
          definitions: [],
          count: response.count,
          countAll: response.countAll
        }

        for (const row in definitions) {
          words.definitions[row] = {}

          words.definitions[row].uri = definitions[row].uri
          words.definitions[row].word = definitions[row].word
          words.definitions[row].excerpt = definitions[row].excerpt

          if (exact || caseSensitive) {
            if (definitions[row].searchable === searchValue) {
              words.definitions[row].isExact = true
            }
          } else {
            if (definitions[row].searchableCaseInsensitive === searchValue) {
              words.definitions[row].isExact = true
            }
          }
        }

        return words
      })
  }
}
