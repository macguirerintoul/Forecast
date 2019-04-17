<template>
  <div id="new-event">
    <input type="text" placeholder="New Event" v-model="title">
    <input type="date" placeholder="Date" v-model="due" required>
    <button type="submit" value="submit" @click="createEvent">Create</button>
  </div>
</template>

<script>
const moment = require('moment');
const Datastore = require('nedb');
const db = new Datastore({
  filename: 'forecast.db',
  autoload: true
});

export default {
  name: 'NewEvent',
  data() {
    return {
      title: '',
      due: '',
    }
  },
  methods: {
    createEvent: function() {
      db.insert({
        title: this.title,
        due: moment(this.due)
      }, (error, document) => {
        console.log("Event created - ", this.title, document._id)
        this.title = '';
        this.due = null;
        this.$parent.getEvents();
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  $cream: #fffff7;

  #new-event {
    display: flex;
    align-items: baseline;
    padding: 1em;
    button {
      background: none;
      border-radius: 1em;
      color: rgba(255, 255, 255, 0.5);
      border-width: 2px;
      border-color: rgba(255, 255, 255, 0.5);
      font-size: 1em;
      font-weight: 700;
      padding: 0.5em 1em;
      &:focus {
        outline: none;
        background: #FFF;
        color: #0000FF;
      }
    }
    input {
      background: transparent;
      border: none;
      height: 2em;
      font-size: 1.75em;
      &,
      &::placeholder {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }
      &[type="text"] {
        color: $cream;
      }
      &[type="date"] {
        color: rgba(#FFF, 0.5);
      }
      &[type="date"]:focus,
      &[type="date"]:valid {
        color: $cream;
      }
      &:focus {
        outline: none;
      }
    }
  }
</style>
