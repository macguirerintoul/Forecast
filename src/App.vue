<template>
  <div id="app">
    <div id="title-bar"><span>Forecast</span></div>
    <NewEvent />
    <swipe-list id="events-container" :items="events" transition-key="_id">
      <template v-slot="{ item, index, revealLeft, revealRight, close }">
        <Event :key="item._id" v-bind:id="item._id" v-bind:title="item.title" v-bind:due="item.due" />
      </template>
      <template v-slot:right="{ item }">
        <div class="swipeout-action" @click="removeEvent(item._id)">
          <img src="./assets/check.svg" alt="complete">
        </div>
    </template>
    <div id="empty" slot="empty">
      <h2>Nothing on your Forecast.</h2>
      <h4>Add something? Scroll up.</h4>
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
const moment = require('moment');

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
    this.getEvents();
    window.scrollTo(0, document.body.scrollHeight);
  },
  methods: {
    getEvents() {
      console.log("getEvents - App");
      db.loadDatabase();
      db.find({}).sort({ due: 1 }).exec((err, docs) => {
        this.events = docs;
        this.events.forEach(object => {
          // console.log(object.due);
          object.due = moment(object.due);
          // console.log(object.due);
        });
      });
    },
    clearEvents() {
      console.log("clearEvents - App");
      db.remove({}, { multi: true }, () => {
        this.events = []
      });
    },
    addEvent(title, due) {
      db.insert({
        title: title,
        due: due
      }, (error, document) => {
        console.log(document)
        this.events.push({
          '_id': document._id,
          'title': document.title,
          'due': document.due
        });
        console.log("Event added")
        this.events.sort(function(a, b) {
          console.log(a.due.diff(b.due));
          return a.due.diff(b.due);
        });
        console.log("Events sorted")
      });
    },
    removeEvent(id) {
      console.log("Removing event ", id);
      let index = this.events.findIndex(object => object._id == id);
      console.log(index);
      db.remove({ _id: id }, (error, removed) => {
        this.events.splice(index, 1);
      });
    },
  }
}
</script>

<style lang="scss">
  $cream: #fffff7;
  $text-grey: #aaa;

  html, body {
    margin: 0;
    min-height: 100%;
    box-sizing: border-box;
    background-color: black;
  }
  #title-bar {
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
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
    height: 114vh;
    padding-top: 2em;
    #events-container {
      background-color: #000;
      // CSS for Clear-style list items
      // @for $i from 1 through 20 {
      //   &>div:nth-child(#{$i}) {
      //     background-color: rgba(#0000ff, 1 - ($i * 0.05));
      //   }
      // }
      &>#empty {
        margin-top: 4em;
        background-color: black;
        text-align: center;
        font-weight: 200;
        h2 {
          font-weight: 300;
          color: $cream;
        }
        h4 {
          color: $text-grey;
        }
      }
    }
  }

  // Styles from vue-swipe-actions
  // .swipeout is the class applied to each list item
  .swipeout-list {
    padding-top: 2em;
  }
  .swipeout {
    position: relative;
    overflow: hidden;
    user-select: none;
    display: flex;
    border-bottom: 1px solid #333;
    .swipeout-action {
      width: 4em;
      background-color: #0000004f;
      text-align: center;
      img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50%;
        margin: auto;
        opacity: 0.5;
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
