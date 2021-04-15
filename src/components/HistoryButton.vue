<template>
  <div v-if="words.length" class="history">
    <nav class="list" :class="{ 'is-active': isHistoryOpen }">
      <div class="list-header">
        <h5 class="title is-5 has-text-centered">
          Historique
        </h5>
      </div>

      <div class="list-body">
        <div
          @click="toggleHistoryIfMobile"
          v-for="word in words"
          v-bind:key="word.definition.uri"
          class="greek list-item is-size-5"
        >
          <router-link :to="{ name: 'definition', params: { uri: word.definition.uri }}">
            {{ word.definition.word }}
          </router-link>
        </div>
      </div>
    </nav>

    <span @click="toggleHistory" class="history-button icon is-large">
      <ion-icon
        class="ion-ionic"
        style="font-size: 1.6em;"
        name="time-outline">
      </ion-icon>
    </span>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'HistoryButton',

  computed: {
    ...mapState({
      isHistoryOpen: state => state.isHistoryOpen,
      lastWords: state => state.lastWords,
      maxShownHistoryResults: state => state.maxShownHistoryResults
    }),

    words () {
      return this.lastWords.slice(0, this.maxShownHistoryResults)
    }
  },

  methods: {
    toggleHistory () {
      this.$store.state.isHistoryOpen = !this.isHistoryOpen
    },

    toggleHistoryIfMobile () {
      if (window.innerWidth < 769) this.toggleHistory()
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  position: fixed;
  z-index: 9999;
  left: 0;
  right: 0;
  bottom: 0;

  margin: 0;

  overflow-y: scroll;
  overscroll-behavior: contain; // prévient le défilement de `body`

  visibility: hidden;

  box-shadow: 0 0 2em -0.125em rgba(10, 10, 10, 0.15),
              0 0 0 1px rgba(10, 10, 10, 0.02);

  transform: translateY(100%);
  transition: transform 0.3s ease-in-out,
              visibility 0.3s;

  @media only screen and (max-width: $tablet) /*and (max-height: 640px)*/ {
    top: 0;
  }

  &.is-active {
    visibility: visible;
    transform: translateY(0%);
  }

  &, .list-header, .list-item {
    border-radius: 0 !important;
  }

  .list-header {
    position: sticky;
    top: 0;
  }

  .list-item {
    background: $white !important;

    &:hover {
      background: $white-bis !important;
    }
  }

  @media only screen and (min-width: $tablet) {
    top: auto;
    left: auto;
    right: 0;

    min-width: 400px;
    min-height: 33vh;

    margin: 0;

    overflow-y: auto;

    transform: translate(100%, 100%) scale(0);

    .list-body {
      max-height: 50vh;
      overflow: auto;
    }

    &.is-active {
      transform: translate(0%, 0%) scale(1);
    }
  }
}

.history-button {
  position: fixed;
  z-index: 9999;
  bottom: 1rem;
  right: 1rem;

  cursor: pointer;

  color: findLightColor($primary);

  background: $primary;
  border-radius: $radius-rounded;
  box-shadow: 3px 3px 9px rgba(black, 0.15);

  transition: 0.15s;

  @media only screen and (min-width: $desktop) {
    right: 1.25rem;
  }

  &:hover {
    background: findDarkColor($primary);
  }
}
</style>
