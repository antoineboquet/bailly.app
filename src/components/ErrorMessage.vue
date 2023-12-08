<template>
  <div v-if="isFullHeight" class="error-message hero is-fullheight-with-navbar">
    <div class="hero-body pt-0">
      <div class="container">
        <div class="columns is-desktop is-vcentered">
          <div class="column has-text-centered" v-html="displayedMessage"></div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="isBoxed" class="error-message p-6 box has-text-centered" v-html="displayedMessage"></div>

  <p v-else class="error-message" v-html="displayedMessage"></p>
</template>

<script>
export default {
  name: 'ErrorMessage',

  props: {
    isFullHeight: Boolean,
    isBoxed: Boolean,
    message: [Response, Error],
  },

  data () {
    return {
      displayedMessage: ''
    }
  },

  created () {
    const titleTag = '<p class="title is-4 is-size-5-mobile">'
    const subtitleTag = '<p class="subtitle is-5">'
    const closeTag = '</p>'

    if (this.message.status) {
      switch (this.message.status) {
        case 500:
          this.displayedMessage = titleTag + 'Une erreur est survenue.' + closeTag +
                                  subtitleTag + 'Veuillez réessayer plus tard.' + closeTag
          break

        default:
          this.displayedMessage = titleTag + 'Les données n\'ont pas pu être récupérées.' + closeTag +
                                  subtitleTag + '(' + this.message.status + ' ' +
                                  this.message.statusText + ')' + closeTag
          break
      }
    } else {
      this.displayedMessage = titleTag + 'La connexion a été perdue.' + closeTag +
                              subtitleTag + 'Vos recherches précédentes restent consultables hors ligne.' + closeTag
    }
  }
}
</script>

<style lang="scss" scoped>
.error-message {
  user-select: none;
}
</style>
