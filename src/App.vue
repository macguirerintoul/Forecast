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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
