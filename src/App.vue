<template>
  <div id="app">
    <Event v-for="event in events" v-bind:title="event.title" />
  </div>
</template>

<script>
import Event from './components/Event.vue'

export default {
  name: 'app',
  components: {
    Event
  },
  data() {
    return {
      events: [
        {
          title: "event 1"
        },
        {title: "event 2"},
        {title: "event 3"},
      ]
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
