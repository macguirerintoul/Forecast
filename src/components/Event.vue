<template>
  <div class="event">
    <h2>{{ title }}</h2>
    <span class="due">{{ due }}</span>
  </div>
</template>

<script>
export default {
  name: 'Event',
  props: {
    id: Number,
    title: String,
    due: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.event {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
  h1 {
    display: inline;
  }
</style>
