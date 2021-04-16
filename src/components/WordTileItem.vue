<template>
  <article class="word-tile-item">
    <div v-if="uri == 'partialSearchMessage'"
    class="card is-active has-background-grey-lighter has-text-weight-bold has-text-left">
      <div class="card-content">
        <p class="title is-5">
          {{ word }}
        </p>
      </div>
    </div>

    <router-link v-else :to="{ name: 'definition', params: { uri: uri }}"
    class="card" :class="{ 'is-active': isExact }">
      <div class="card-content" :class="{ 'faded': excerpt.endsWith('\u2026') }">
        <p class="greek title is-5">
          {{ word }}
        </p>
        <p class="excerpt" v-html="excerpt"></p>
      </div>
    </router-link>
  </article>
</template>

<script>
export default {
  name: 'WordTileItem',

  props: {
    uri: String,
    word: String,
    excerpt: String,
    isExact: Boolean
  }

  /*computed: {
    excerptLength () {
      const sanitizedExcerpt = this.excerpt.replace(/(<([^>]+)>)/ig, '')
      return sanitizedExcerpt.length
    }
  }*/
}
</script>

<style lang="scss" scoped>
/*.excerpt ol, .excerpt li {
  display: inline;
}

.entry {
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
}*/

.card {
  user-select: none;
  display: flex;
  height: 100%;
  background: transparent;
  box-shadow: none;
  text-align: justify;

  &:hover,
  &.is-active {
    background: $white;
    /* Copie de `$card-shadow`, innaccessible ici. */
    box-shadow: 0 0.5em 1em -0.125em rgba($scheme-invert, 0.1),
                0 0px 0 1px rgba($scheme-invert, 0.02);
    transition: 0.15s;
  }

  .card-content {
    &.faded {
      mask-image: linear-gradient(to bottom, black 60%, transparent 90%);
    }

    .excerpt {
      font-family: $family-serif;
    }
  }

  @media only screen and (max-width: $tablet) {
    .card-content {
      padding: 0.75rem;

      .title {
        margin-bottom: 0.75rem;
      }
    }
  }
}
</style>
