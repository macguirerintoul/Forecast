<template>
  <div id="app">
    <div id="title-bar"><span>Untili</span></div>
    <NewEvent />
    <div id="events-container">
      <Event v-for="event in events" :key="event.id" v-bind:id="event.id" v-bind:title="event.title" v-bind:due="event.due" />
    </div>
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

<style lang="scss">
  html, body {
    margin: 0;
    min-height: 100%;
  }
  #title-bar {
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    width: 100%;
    -webkit-app-region: drag;
    background-color: transparent;
    height: 2em;
    text-align: center;
    span {
      margin: auto;
      font-size: 10pt;
    }
  }
  #app {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #000;
    color: #fffff7;
    height: 100%;
    #events-container {
      @for $i from 1 through 20 {
        & div:nth-child(#{$i}) {
          background-color: rgba(#0000ff, 1 - ($i * 0.05));
        }
      }
    }
  }
</style>
