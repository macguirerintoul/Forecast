<template>
  <div id="app">
    <button v-on:click="clearEvents">clear events</button>
    <NewEvent />
    <Event v-for="event in events" :key="event.id" v-bind:id="event.id" v-bind:title="event.title" v-bind:due="event.due" />
  </div>
</template>

<script>
import Event from './components/Event.vue'
import NewEvent from './components/NewEvent.vue'
const _ = require('lodash');
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
    getEvents() {
      const instance = this;
      storage.get('events', function(error, data) {
        if (error) throw error;
        instance.events = _.toArray(data);
      });
    },
    clearEvents() {
      storage.remove('events');
      this.events = [];
    }
  }
}
</script>

<style>
html, body {
  margin: 0;
  height: 100%;
}
#app {
  padding: 5vw;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #100a27;
  color: #ffffff;
  height: 100%;
}
</style>
