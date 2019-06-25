<template>
  <div id="app">
    <div id="title-bar"><span>Forecast</span></div>
    <NewEvent></NewEvent>
    <notifications group="forecast" position="bottom center" />
    <swipe-list ref="list" id="events-container" :items="events" transition-key="_id">
      <template v-slot="{ item, index, revealLeft, revealRight, close }">
        <Event @rightClick="eventRightClick(index)" @eventClicked="eventClicked(index)" :key="item._id" v-bind:index="index" v-bind:id="item._id" v-bind:title="item.title" v-bind:due="item.due" />
      </template>
      <template v-slot:right="{ item }">
        <div class="swipeout-action" @click="removeEvent(item._id)">
          <img src="./assets/check.svg" alt="complete">
        </div>
    </template>
    <div id="empty" slot="empty">
      <div id="icon">
        <img width="96" src="./assets/icon.png" alt="Forecast icon">
      </div>
      <h1>Welcome to Forecast.</h1>
      <h2>Here's how to use it.</h2>
      <ol>
        <li>Scroll up to add an item</li>
        <li>Choose a title</li>
        <li>Choose a date</li>
        <li>Hit enter or click create</li>
        <li>Drag items left (or right-click) to complete them</li>
      </ol>
    </div>
    </swipe-list>
  </div>
</template>

<script>
import { SwipeList, SwipeOut } from 'vue-swipe-actions';
import 'vue-swipe-actions/dist/vue-swipe-actions.css';
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
  mounted() {
    this.getEvents();
    var rect = document.getElementById("events-container").getBoundingClientRect();
    // 32 is the hard-coded height of the menu bar (2em)
    window.scrollTo(0, rect.top - 32);
  },
  methods: {
    getEvents() {
      console.log("getEvents - App");
      db.loadDatabase();
      db.find({}).sort({ due: 1 }).exec((err, docs) => {
        this.events = docs;
        this.events.forEach(object => {
          // Due dates are stored in database as strings, so convert them back into Moment objects
          object.due = moment(object.due);
        });
      });
    },
    eventRightClick(index) {
      const list = this.$refs.list;
      if (list.isRevealed(index) == "right") {
        list.closeActions(index);
      } else {
        list.revealRight(index);
      }
    },
    eventClicked(index) {
      const list = this.$refs.list;
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
          // console.log(a.due.diff(b.due));
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
  html, body {
    margin: 0;
    min-height: 100%;
    box-sizing: border-box;
    background-color: $bg-light;
  }
  #title-bar {
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
    -webkit-app-region: drag;
    background-color: $bg-light;
    height: 2.2em;
    text-align: center;
    border-bottom: 1px solid $light-grey;
    span {
      margin: auto;
      font-size: 10pt;
    }
  }
  #app {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: $el-dark;
    height: 114vh;
    padding-top: 2em;
    #events-container {
      // CSS for Clear-style list items
      // @for $i from 1 through 20 {
      //   &>div:nth-child(#{$i}) {
      //     background-color: rgba(#0000ff, 1 - ($i * 0.05));
      //   }
      // }
      &>#empty {
        margin: auto;
        padding: 1em;
        max-width: 25em;
        margin-top: 4em;
        h2 {
          font-weight: 400;
        }
        ol {
          text-align: left;
        }
        #icon {
          text-align: center;
        }
      }
    }
  }
  /*
    Below is custom CSS for vue-swipe-actions.
  */
  .swipeout {
    border-bottom: 1px solid $light-grey;
    &:first-of-type {
      border-top: 1px solid $light-grey;
    }
    .swipeout-action {
     background-color: $light-grey;
     padding: 0 1em;
    img {
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 2em;
    }
  }
}
</style>
