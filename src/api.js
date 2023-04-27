import http from '@/http'

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

function removeGreekVariants (str) {
  return str.replace(/ϐ/g, 'β').replace(/ς/g, 'σ')
}

export default {
  /**
   * Requête à partir d'une URI.
   * @param {String}  uri - identifiant unique d'un mot.
   * @param {Boolean} getSiblings - ajoute les mots adjacents à la réponse (`uri`, `word`).
   * @returns Une définition et les mots adjacents à la demande.
   */
  async definitionByURI (uri, getSiblings = false) {
    let fields = `uri,word,htmlDefinition`

    let query  = `definition/${uri}?fields=${fields}`
    if (getSiblings) query += `&siblings`

    // { definition: {}, siblings: { previous: {}, next: {} }
    return http.fetch(query).then(response => { return response })
  },

  /**
   * Requête à partir d'une chaîne de caractères grecs normalisés
   * (-> `searchable`, `searchable_case_insensitive`).
   * @param {String} searchValue
   * @param {Number} limit
   * @returns Un jeu de définitions et des métadonnées.
   */
  async definitions (
    searchValue,
    caseSensitive = false,
    exact = false,
    limit = MAX_LIMIT
  ) {
    if (limit > MAX_LIMIT) return false

    if (!caseSensitive) searchValue = searchValue.toLowerCase()
    searchValue = removeGreekVariants(searchValue)
    
    if (!isSearchValueAcceptable(searchValue)) return false

    let fields = 'uri,word,excerpt'
    if (exact || caseSensitive) fields += ',searchable'
    else fields += ',searchableCaseInsensitive'

    let query = `definitions/${searchValue}?fields=${fields}&limit=${limit}`

    if (caseSensitive) query += `&caseSensitive`
    if (exact) query += `&exact`
    
    return await http.fetch(query)
      .then(response => {        
        return {
          definitions: response.definitions.map(definition => ({
            uri: definition.uri,
            word: definition.word,
            excerpt: definition.excerpt,
            isExact: function () {
              if (exact || caseSensitive) {
                if (definition.searchable === searchValue) {
                  return true
                }
              } else {
                if (definition.searchableCaseInsensitive === searchValue) {
                  return true
                }
              }
    
              return false
            }()
          })),
          count: response.count,
          countAll: response.countAll
        }
      })
  }
}
