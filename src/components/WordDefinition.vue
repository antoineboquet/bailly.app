<template>
  <p
    class="word-definition"
    v-html="formatedHtmlDefinition"
  ></p>
</template>

<script>
export default {
  name: 'WordDefinition',

  props: {
    htmlDefinition: String
  },

  computed: {
    formatedHtmlDefinition () {
      // Utiliser la flèche du Bailly (encodée dans le caractère `E` de BaillyArrow.woff2).
      return this.htmlDefinition.replace(/\u27BC/g, '<span class="arrow"></span>')
    }
  }
}
</script>

<style lang="scss" scoped>
.word-definition {
  font-family: $family-serif;
}
/*.entry {
  font-weight: 700;
}

.romain {
  font-style: normal !important;
}

.author {
  font-variant: small-caps;
}

.work {
  font-style: italic;
}

// https://www.w3.org/Style/Examples/007/color-bullets.en.html
.word-definition ol {
  list-style: none;
  counter-reset: li
}

.word-definition li {
  counter-increment: li;
  margin: 1.5rem auto;
  margin-left: 2rem;
}

.word-definition li:last-of-type {
  margin-bottom: 0;
}

.word-definition ol li::before {
  content: "." counter(li);
  display: inline-block;
  width: 2.6rem;
  margin-left: -3rem;
  direction: rtl;
  text-align: right;
  color: $red;
}

.word-definition ol.rub > li::before {
  content: "." counter(li, upper-alpha);
  font-weight: bold;
  color: darken($green, 30%);
}

.word-definition ol.rub ol.rub > li::before {
  content: "." counter(li, upper-roman);
  font-weight: bold;
  color: darken($blue, 30%);
}*/
</style>-->
