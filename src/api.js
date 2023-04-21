import { supabase } from '@/supabaseClient'

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
    const { data: definition } = await supabase.from('dictionary')
      .select('ordered_id,uri,word,html_definition')
      .eq('uri', uri)
      .single()

    if (!definition) return false

    let response = {
      definition: {
        uri: definition.uri,
        word: definition.word,
        htmlDefinition: definition.html_definition
      }
    }

    let previous = {}, next = {}

    if (getSiblings) {
      const { data: siblings } = await supabase.from('dictionary')
        .select('ordered_id, uri, word')
        .in('ordered_id', [(definition.ordered_id - 1), (definition.ordered_id + 1)])
      
      if (siblings.length === 1) {
          if (siblings[0].ordered_id === (definition.ordered_id - 1)) {
              previous = siblings[0]
          }
          if (siblings[0].ordered_id === (definition.ordered_id + 1)) {
              next = siblings[0]
          }
      } else {
        previous = siblings[0]
        next = siblings[1]
      }

      response.siblings = {
        previous: (previous.ordered_id) ? {
          uri: previous.uri,
          word: previous.word   
        } : undefined,
        next: (next.ordered_id) ? {
          uri: next.uri,
          word: next.word 
        } : undefined
      }
    }

    return response
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

    searchValue = removeGreekVariants(searchValue)
    if (!isSearchValueAcceptable(searchValue)) return false

    let fields = 'uri,word,excerpt'
    if (exact || caseSensitive) fields += ',searchable'
    else fields += ',searchable_case_insensitive'

    let query = supabase.from('dictionary').select(fields)

    if (exact) {
      if (caseSensitive) {
        query = query.eq('searchable', searchValue)
      } else {
        query = query.eq('searchable_case_insensitive', searchValue.toLowerCase())
      }
    } else { // !exact
        if (caseSensitive) {
          query = query.like('searchable', `${searchValue}%`)
        } else {
          query = query.like('searchable_case_insensitive', `${searchValue.toLowerCase()}%`)
        }
    }

    query = query.order('ordered_id')

    if (limit) query = query.limit(limit)

    const { data: definitions } = await query

    let countAll = undefined

    if (exact || limit) {
      // Seconde requête pour obtenir l'ensemble des résultats (`countAll`)
      // par ressemblance du début de la chaîne recherchée dans le cas où
      // les paramètres de recherches filtrent les résultats. N.B. la contrainte
      // `caseSensitive` n'est pas prise en compte.
      let countQuery = supabase.from('dictionary').select('*', { count: 'exact', head: true })

      if (caseSensitive) {
          countQuery = countQuery.like('searchable', `${searchValue}%`)
      } else {
          countQuery = countQuery.like('searchable_case_insensitive', `${searchValue.toLowerCase()}%`)

      }

      const { count } = await countQuery
      countAll = count
    }

    return {
      definitions: definitions.map(definition => ({
        uri: definition.uri,
        word: definition.word,
        excerpt: definition.excerpt,
        isExact: function () {
          if (exact || caseSensitive) {
            if (definition.searchable === searchValue) {
              return true
            }
          } else {
            if (definition.searchable_case_insensitive === searchValue) {
              return true
            }
          }

          return false
        }()
      })),
      count: definitions.length,
      countAll: countAll
    }
  }
}
