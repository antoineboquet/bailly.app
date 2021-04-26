<template functional>
  <div class="list-item is-size-5">
    <span v-if="props.word.uri == 'partialSearchMessage'"
    class="word-list-item has-background-grey-lighter has-text-weight-bold">
      <p class="has-text-centered">{{ props.word.word }}</p>
    </span>

    <router-link v-else :to="{ name: 'definition', params: { uri: props.word.uri }}"
    class="greek word-list-item" :class="{ 'is-active': props.word.isExact }">
      {{ props.word.word }}
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'WordListItem',

  props: {
    word: Object
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
