<template>
  <div class="home-history hero is-fullheight-with-navbar">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-multiline is-vcentered has-text-centered">
          <div v-for="word in words"
          v-bind:key="word.definition.uri"
          class="column is-half-tablet is-one-third-desktop">
            <router-link :to="{ name: 'definition', params: { uri: word.definition.uri }}"
            class="title is-5 greek">
              {{ word.definition.word }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'HomeHistory',

  computed: {
    ...mapState({
      lastWords: state => state.lastWords,
      maxShownHistoryResults: state => state.maxShownHistoryResults
    }),

    words () {
      return this.lastWords.slice(0, this.maxShownHistoryResults)
    }
  }
}
</script>

<style lang="scss" scoped>
a.title {
  text-decoration: none;
}

@media screen and (min-width: $tablet) {
  .column {
    padding: 1.5rem;
  }
}

.hero-body {
  align-items: flex-start !important;

  @media screen and (min-width: $desktop) {
    align-items: center !important;
    padding-top: 0;
  }
}
</style>
