import { keyType, mapping } from '@/enums'

export function applyGammaDiphthongs (str, type = keyType.GREEK) {
  switch (type) {
    case keyType.GREEK:
      str = str.replace(/ΝΓ/g, 'ΓΓ') // Maj.
               .replace(/ΝΞ/g, 'ΓΞ')
               .replace(/ΝΚ/g, 'ΓΚ')
               .replace(/ΝΧ/g, 'ΓΧ')
               .replace(/Νγ/g, 'Γγ') // Maj. + min.
               .replace(/Νξ/g, 'Γξ')
               .replace(/Νκ/g, 'Γκ')
               .replace(/Νχ/g, 'Γχ')
               .replace(/νγ/g, 'γγ') // Min.
               .replace(/νξ/g, 'γξ')
               .replace(/νκ/g, 'γκ')
               .replace(/νχ/g, 'γχ')
      break

    case keyType.TRANSLITERATION:
      str = str.replace(/GG/g,  'NG')  // Maj.
               .replace(/GX/g,  'NX')
               .replace(/GK/g,  'NK')
               .replace(/GCH/g, 'NCH')
               .replace(/Gg/g,  'Ng')  // Maj. + min.
               .replace(/Gx/g,  'Nx')
               .replace(/Gk/g,  'Nk')
               .replace(/Gch/g, 'Nch')
               .replace(/gg/g,  'ng')  // Min.
               .replace(/gx/g,  'nx')
               .replace(/gk/g,  'nk')
               .replace(/gch/g, 'nch')
      break

    default: break
  }

  return str
}

export function applyGreekVariants (str) {
  str = str.replace(/[βϐ]/g, 'ϐ')
  str = str.replace(/[σς]/g, 'σ')

  str = str.replace(/ΠΣ/g, 'Ψ').replace(/Πσ/g, 'Ψ').replace(/πσ/g, 'ψ')

  const words = toWords(str)

  for (let i = 0; i < words.length; i++) {
    if (words[i].charAt(0) === 'ϐ') {
      words[i] = 'β' + words[i].slice(1)
    }

    if (words[i].slice(-1) === 'σ' && words[i].length > 1) {
      words[i] = words[i].slice(0, -1) + 'ς'
    }
  }

  return words.join(' ')
}

export function isMappedKey (key, type = keyType.BETA_CODE) {
  const keys = []

  for (const el of mapping) {
    switch (type) {
      case keyType.GREEK:
        keys.push(el.greek)
        break

      case keyType.BETA_CODE:
        keys.push(el.latin)
        break

      case keyType.TRANSLITERATION:
        keys.push(el.trans)
        break

      default: break
    }
  }

  return keys.includes(key)
}

export function toWords (str) {
  const separator = ' '
  const re = new RegExp(separator, 'g')

  return str.split(re)
}

export function removeDiacritics (str) {
  return str.normalize('NFD')
            // Préserve le circonflexe (\u0302) utilisé pour la translittération.
            .replace(/[\u0300-\u0301]|[\u0303-\u036f]/g, '')
            .normalize('NFC')
}

export function removeGreekVariants (str) {
  for (let i = 0; i < str.length; i++) {
    switch (str[i]) {
      case 'ϐ':
        str = str.slice(0, i) + 'β' + str.slice(i + 1)
        break

      case 'ς':
        str = str.slice(0, i) + 'σ' + str.slice(i + 1)
        break

      default: break
    }
  }

  return str
}

export function toGreek (str, from = keyType.BETA_CODE) {
  let newStr = ''

  str = removeDiacritics(str)

  switch (from) {
    case keyType.BETA_CODE:
      for (let i = 0; i < str.length; i++) {
        let tmp = undefined

        for (const key of mapping) {
          if (key.latin === str[i]) {
            tmp = key.greek
          }
        }

        newStr += (tmp !== undefined) ? tmp : str[i]
      }
      break

    case keyType.TRANSLITERATION:
      for (let i = 0; i < str.length; i++) {
        const tmp = { trans: '', greek: '' }

        let  pair = str.slice(i, i + 2)
        if (pair.length !== 2) pair = undefined

        // Caractère `h` facultatif : l'ignorer si sa position est plausible.

        // Présence d'un `h` et absence de `h` consécutifs.
        const rule1 = (/h/i.test(str[i]) && !/h/i.test(str[i+1]))
        // Un `h` peut apparaître derrière un `r`.
        const rule2 = (/[r]/i.test(str[i-1]))
        // Un `h` peut apparaître en première position (de la chaîne ou d'un mot) lorsqu'il précède une voyelle.
        const rule3 = ((str[i-1] === undefined || str[i-1] === ' ') && /[aeioy]/i.test(str[i+1]))

        if (rule1 && (rule2 || rule3)) continue

        // Pour chaque clé du `mapping`, chercher des correspondances pour
        // un ou deux caractères et écraser la variable `tmp` jusqu'à trouver
        // une paire de sorte que la paire représentant un caractère grec prévale.
        for (let j = 0; j < mapping.length; j++) {
          if (mapping[j].trans === str[i] || mapping[j].trans === pair) {
            tmp.trans = mapping[j].trans
            tmp.greek = mapping[j].greek

            // S'il s'agit d'une paire, faire avancer l'itération
            // d'un indice supplémentaire (paire) et arrêter la recherche.
            if (mapping[j].trans === pair) {
              i++
              break
            }
          }
        }

        // Ajouter à la chaîne la lettre grec ou le caractère
        // d'entrée en l'absence de correspondance.
        newStr += tmp.greek || str[i]
      }
      break

    default: break
  }

  return applyGreekVariants(applyGammaDiphthongs(newStr, keyType.GREEK))
}

export function toBetaCode (str /*, from = keyType.GREEK*/) {
  let newStr = ''

  str = removeDiacritics(removeGreekVariants(str))

  for (let i = 0; i < str.length; i++) {
    let tmp = undefined

    for (const key of mapping) {
      if (key.greek === str[i]) {
        tmp = key.latin
      }
    }

    newStr += (tmp !== undefined) ? tmp : str[i]
  }

  return newStr
}

export function toTransliteration (str /*, from = keyType.GREEK*/) {
  let newStr = ''

  str = removeDiacritics(removeGreekVariants(str))

  for (let i = 0; i < str.length; i++) {
    let tmp = undefined

    for (const key of mapping) {
      if (key.greek === str[i]) {
        tmp = key.trans
      }
    }

    newStr += (tmp !== undefined) ? tmp : str[i]
  }

  return applyGammaDiphthongs(newStr, keyType.TRANSLITERATION)
}
