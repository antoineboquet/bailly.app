<template functional>
  <span v-if="props.source.uri == 'partialSearchMessage'"
  class="word-list-item has-background-grey-lighter has-text-weight-bold">
    <p class="has-text-centered">{{ props.source.word }}</p>
  </span>

  <router-link v-else :to="{ name: 'definition', params: { uri: props.uri || props.source.uri }}"
  class="greek word-list-item" :class="{ 'is-active': props.isExact || props.source.isExact }">
    {{ props.word || props.source.word }}
  </router-link>
</template>

<script>
export default {
  name: 'WordListItem',

  props: {
    // Nom imposé par `vue-virtual-scroll-list`
    // Doit englober les mêmes propriétés que celles définies ci-dessous
    source: Object,
    // Pour un usage du composant hors `vue-virtual-scroll-list`
    uri: String,
    word: String,
    isExact: Boolean
  }
}
</script>

<style lang="scss" scoped>
.list-item:first-of-type .word-list-item {
  border-top-left-radius: $radius-large;
  border-top-right-radius: $radius-large;
}

.list-item:last-of-type .word-list-item {
  border-bottom-left-radius: $radius-large;
  border-bottom-right-radius: $radius-large;
}

.word-list-item.is-active {
  background-color: $warning-light;
  color: findDarkColor($warning-light);
  font-weight: bold;

  &:hover {
    background: darken($warning-light, 3%);
    color: darken(findDarkColor($warning-light), 5%);
  }
}
</style>
