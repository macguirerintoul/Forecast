<template>
  <div id="app">
    <div id="title-bar"><span>Forecast</span></div>
    <NewEvent />
    <swipe-list id="events-container" :items="events" transition-key="id">
      <template v-slot="{ item, index, revealLeft, revealRight, close }">
        <Event :key="item.id" v-bind:id="item.id" v-bind:title="item.title" v-bind:due="item.due" />
      </template>
      <template v-slot:right="{ item }">
        <div class="swipeout-action" @click="removeEvent(item)">
          <img src="./assets/check.svg" alt="complete">
        </div>
    </template>
    <div id="empty" slot="empty">
      <h2>Nothing on the Forecast.</h2>
    </div>
    </swipe-list>
  </div>
</template>

<script>
import { SwipeList, SwipeOut } from 'vue-swipe-actions';
import Event from './components/Event.vue'
import NewEvent from './components/NewEvent.vue'

const Datastore = require('nedb');
const db = new Datastore({ filename: 'forecast.db', autoload: true });

export default {
  name: 'app',
  components: {
    Event,
    NewEvent,
    SwipeOut,
    SwipeList
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
      console.log("getEvents - App");
      db.loadDatabase();
      this.events = [];
      db.find({}).sort({ due: 1 }).exec((err, docs) => {
        this.events = docs;
      });
    },
    clearEvents() {
      console.log("clearEvents - App");
      db.remove({}, { multi: true }, () => {
        this.events = []
      });
    },
    removeEvent(item) {
      console.log(item._id);
      db.remove({ _id: item._id }, (error, removed) => {
        console.log(removed);
      });
      this.getEvents();
    },
  }
}
</script>

<style lang="scss">
  $cream: #fffff7;

  html, body {
    margin: 0;
    min-height: 100%;
    box-sizing: border-box;
  }
  html,
  #title-bar {
    background-color: black;
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
    color: $cream;
    height: 100%;
    padding-top: 2em;
    #events-container {
      background-color: #000;
      @for $i from 1 through 20 {
        &>div:nth-child(#{$i}) {
          background-color: rgba(#0000ff, 1 - ($i * 0.05));
        }
        &>#empty {
          // styles for the 'empty' div
          background-color: black;
          text-align: center;
          font-weight: 200;
          color: $cream;
          h2 {
            font-weight: 300;
            color: $cream;
          }
        }
      }
    }
  }

  // vue-swipe-actions styles
  .swipeout {
    position: relative;
    overflow: hidden;
    user-select: none;
    display: flex;
    .swipeout-action {
      width: 4em;
      background-color: #0000004f;
      text-align: center;
      img {
        opacity: 0.5;
        max-height: 50%;
        margin-top: 27%;
      }
    }
    &.swipeout--disabled {
      user-select: auto;
    }
    .swipeout-left,
    .swipeout-right {
      position: absolute;
      height: 100%;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      z-index: 1;
    }

  }
  .swipeout.swipeout--transitioning .swipeout-action,
  .swipeout.swipeout--transitioning .swipeout-content {
    transition: transform 0.3s;
  }
  .swipeout .swipeout-content {
    width: 100%;
  }
  .swipeout .swipeout-action,
  .swipeout .swipeout-content {
    will-change: transform;

  }
  .swipeout .swipeout-left {
    left: 0;
    transform: translateX(-100%);
  }
  .swipeout .swipeout-right {
    display: flex;
    right: 0;
    transform: translateX(100%);
  }
  .swipeout-list-item {
    outline: none;
  }
</style>
