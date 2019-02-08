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
  created() {
    this.getEvents()
  },
  methods: {
    async getEvents() {
      const events = await storage.get('events', function(error, data) {
        if (error) throw error;
        alert(data);
        return data;
      });
      this.events = events;
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
