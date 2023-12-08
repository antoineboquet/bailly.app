<template>
  <p class="word-definition">
    <span class="entry gradient">{{ word }}</span>
    <span v-html="formatedHtmlDefinition"></span>
  </p>
</template>

<script>
export default {
  name: 'WordDefinition',

  props: {
    word: String,
    htmlDefinition: String
  },

  computed: {
    formatedHtmlDefinition () {
      let start = ' '
      let htmlDefinition = this.htmlDefinition
      
      // Ajouter un retour à la ligne ou une virgule afin de séparer l'entrée du début
      // de la définition si la définition ne commence pas par une parenthèse.
      if (
        !htmlDefinition.startsWith('(') &&
        !htmlDefinition.startsWith('[') &&
        !/^(<([a-z]+)(?![^>]*\/>)[^>]*>)+[[(]/.test(htmlDefinition)
      ) {
        // Ajouter un retour à la ligne si la définition commence par un numéro,
        // sinon ajouter une virugle (avec ou sans style gras selon ce qui suit).
        if (/^<b>\s+[I1]/.test(htmlDefinition)) {
          start = '<br>'
        } else {
          start = (htmlDefinition.startsWith('<b>')) ? '<b>, </b>' : ', '
        }
      }

      // Utiliser la flèche du Bailly (encodée dans le caractère `E` de BaillyArrow.woff2).
      htmlDefinition = htmlDefinition.replace(/\u27BC/g, '<span class="arrow"></span>')

      return start + htmlDefinition
    }
  }
}
</script>

<style lang="scss" scoped>
.word-definition {
  font-family: $family-serif;
}

.entry {
  font-weight: 700;
}

.gradient {
  background: #C1601F;
  background: linear-gradient(to right, #C1601F 0%, #CF1512 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>-->
