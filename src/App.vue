<template>
  <div id="app">
    <button v-on:click="clearEvents">clear events</button>
    <button v-on:click="getEvents">get events</button>
    <NewEvent />
    <Event v-for="event in events" :key="event.id" v-bind:id="event.id" v-bind:title="event.title" v-bind:due="event.due" />
  </div>
</template>

<script>
import Event from './components/Event.vue'
import NewEvent from './components/NewEvent.vue'

var Datastore = require('nedb');
var db = new Datastore({ filename: 'untili.db', autoload: true });

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
      db.loadDatabase();
      db.find({}).sort({ due: 1 }).exec((err, docs) => {
        this.events = docs;
      });
    },
    clearEvents() {
      db.remove({}, { multi: true }, () => {
        this.events = []
      });
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
  padding: 1em;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #0F111A;
  color: #ffffff;
  height: 100%;
}
</style>
