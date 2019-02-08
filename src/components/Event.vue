<template>
  <div class="event">
    <h1>{{ id }}</h1>
    <h1>{{ title }}</h1>
    <h1>{{ due }}</h1>
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

</style>
