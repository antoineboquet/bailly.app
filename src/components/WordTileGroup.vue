<template>
  <div class="word-tile-group columns is-multiline"><!-- is-gapless-->
    <word-tile-item
      v-for="word in words"
      v-bind:key="word.id"
      v-bind:uri="word.uri"
      v-bind:word="word.word"
      v-bind:excerpt="word.excerpt"
      v-bind:isExact="word.isExact"
      class="column is-6-tablet is-4-desktop is-3-widescreen"
    ></word-tile-item>
  </div>
</template>

<script>
import WordTileItem from '@/components/WordTileItem.vue'

export default {
  name: 'WordTileGroup',

  components: {
    WordTileItem
  },

  props: {
    source: Object
  },

  computed: {
    words () {
      return this.source.data
    }
  }
}
</script>

<style lang="scss" scoped>
.word-tile-group {
  animation: opacity ease-in 0.15s 0.07s forwards;
  opacity: 0;
}
</style>
