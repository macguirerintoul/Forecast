<template>
  <div id="app">
    <div id="title-bar" :class="{ windows: os === 'win32' }">
      <span>Forecast</span>
    </div>
    <NewEvent></NewEvent>
    <notifications group="forecast" position="bottom center" />
    <swipe-list
      id="events-container"
      ref="list"
      :items="events"
      transition-key="_id"
    >
      <template v-slot="{ item, index, revealLeft, revealRight, close }">
        <Event
          :id="item._id"
          :key="item._id"
          :index="index"
          :title="item.title"
          :due="item.due"
          @rightClick="eventRightClick(index)"
          @eventClicked="eventClicked(index)"
        />
      </template>
      <template v-slot:right="{ item }">
        <div class="swipeout-action" @click="removeEvent(item._id)">
          <img src="./assets/check.svg" alt="complete" />
        </div>
      </template>
      <div id="empty" slot="empty">
        <div id="icon">
          <img width="96" src="./assets/icon.png" alt="Forecast icon" />
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
        <div id="links">
          <h6>
            <a
              href="https://forecast.macguire.me"
              @click="openURL('https://forecast.macguire.me', $event)"
              >Website</a
            >
            |
            <a
              href="https://github.com/mrintoul/forecast"
              @click="openURL('https://github.com/mrintoul/forecast', $event)"
              >GitHub</a
            >
          </h6>
          <h6>
            Created by
            <a
              href="https://macguire.me"
              @click="openURL('https://macguire.me', $event)"
              >Macguire Rintoul</a
            >
          </h6>
        </div>
      </div>
    </swipe-list>
  </div>
</template>

<script>
import { SwipeList } from 'vue-swipe-actions'
import 'vue-swipe-actions/dist/vue-swipe-actions.css'
import Event from './components/Event.vue'
import NewEvent from './components/NewEvent.vue'

const Datastore = require('nedb')
const moment = require('moment')
// eslint-disable-next-line
const { app, shell } = require('electron')
const os = require('os')
// eslint-disable-next-line
const currentVersion = require('electron').remote.app.getVersion()
const compareVersions = require('compare-versions')

const db = new Datastore({ filename: 'forecast.db', autoload: true })
const { trackEvent } = require('./analytics')

export default {
  name: 'App',
  components: {
    Event,
    NewEvent,
    // SwipeOut,
    SwipeList,
  },
  data() {
    return {
      events: [],
      os: os.platform(),
    }
  },
  async mounted() {
    // For some reason, this must happen first or it doesn't work
    const rect = document
      .getElementById('events-container')
      .getBoundingClientRect()

    if (this.os === 'win32') {
      window.scrollTo(0, rect.top)
    } else if (this.os === 'darwin') {
      // 32 is the hard-coded height of the menu bar (2em)
      window.scrollTo(0, rect.top - 32)
    }

    // check for updates and notify if a newer version has been uploaded to GitHub
    fetch('https://api.github.com/repos/mrintoul/forecast/releases/latest')
      .then(response => response.json())
      .then(data => {
        // gets latest version from GitHub by taking it from latest release tag name
        if (compareVersions(data.name.substr(1), currentVersion)) {
          console.log('Newer version available')
          this.$notify({
            group: 'forecast',
            type: 'success',
            title: 'Newer version available!',
            text: 'Visit the website (linked above) to get it.',
          })
        } else {
          console.log('Installed version is up to date')
        }
      })
      .catch(error => console.error(error))

    await this.clearBlankEvents()
    this.getEvents()
    trackEvent('User Interaction', 'App Opened')
  },
  methods: {
    openURL(url, event) {
      event.preventDefault()
      shell.openExternal(url)
    },
    clearBlankEvents() {
      /*
        Clear events without a title if they exist in the database.
        These may have resulted from earlier versions of the app where
        data validation wasn't implemented yet, or if something is
        going wrong in the creation method.
      */
      db.loadDatabase()
      return new Promise(resolve => {
        db.find({}).exec((error, docs) => {
          let itemsProcessed = 0
          docs.forEach(event => {
            if (event.title === '') {
              console.log('empty title')
              // eslint-disable-next-line
              db.remove({ _id: event._id }, {}, (err, numberRemoved) => {
                console.log(err, numberRemoved)
              })
            }
            itemsProcessed += 1
            if (itemsProcessed === docs.length) {
              resolve()
            }
          })
        })
      })
    },
    getEvents() {
      console.log('getEvents - App')
      db.loadDatabase()
      db.find({})
        .sort({ due: 1 })
        .exec((err, docs) => {
          this.events = docs
          this.events.forEach(object => {
            // Due dates are stored in database as strings, so convert them back into Moment objects
            // eslint-disable-next-line
            object.due = moment(object.due)
          })
        })
    },
    eventRightClick(index) {
      // eslint-disable-next-line
      const list = this.$refs.list
      if (list.isRevealed(index) === 'right') {
        list.closeActions(index)
      } else {
        list.revealRight(index)
      }
    },
    clearEvents() {
      console.log('clearEvents - App')
      db.remove({}, { multi: true }, () => {
        this.events = []
      })
    },
    addEvent(title, due) {
      db.insert(
        {
          title,
          due,
        },
        (error, document) => {
          console.log(document)
          this.events.push({
            // eslint-disable-next-line
            _id: document._id,
            title: document.title,
            due: document.due,
          })
          console.log('Event added')
          trackEvent('User Interaction', 'Event Created')
          this.events.sort((a, b) => {
            // console.log(a.due.diff(b.due));
            return a.due.diff(b.due)
          })
          console.log('Events sorted')
        }
      )
    },
    removeEvent(id) {
      console.log('Removing event ', id)
      // eslint-disable-next-line
      const index = this.events.findIndex(object => object._id == id)
      console.log(index)
      db.remove({ _id: id }, () => {
        this.events.splice(index, 1)
        trackEvent('User Interaction', 'Event Removed')
      })
    },
  },
}
</script>

<style lang="scss">
html,
body {
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
#title-bar.windows {
  display: none;
}
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $el-dark;
  height: 114vh;
  padding-top: 2em;
  h1,
  h2 {
    margin: 0;
  }
  h6 {
    margin: 0.2em 0;
  }
  #links {
    text-align: center;
    a {
      color: $el-dark;
    }
    h6 {
      font-weight: 300;
    }
  }

  #events-container {
    // CSS for Clear-style list items
    // @for $i from 1 through 20 {
    //   &>div:nth-child(#{$i}) {
    //     background-color: rgba(#0000ff, 1 - ($i * 0.05));
    //   }
    // }
    & > #empty {
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
