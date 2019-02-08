<template>
  <div id="app">
    <NewEvent />
    <Event v-for="event in events" :key="event.id" v-bind:id="event.id" v-bind:title="event.title" v-bind:due="event.due" />
  </div>
</template>

<script>
import Event from './components/Event.vue'
import NewEvent from './components/NewEvent.vue'
const storage = require('electron-json-storage');

export default {
  name: 'app',
  components: {
    Event,
    NewEvent
  },
  data() {
    return {
      events: []
    }
  },
  mounted() {
    storage.get('events', function(error, data) {
      if (error) throw error;
      alert("events got");
      alert(data)
      alert(data[0].title);
      this.events = data;
    });
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
