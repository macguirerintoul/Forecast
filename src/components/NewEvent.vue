<template>
  <div id="new-event">
    <div>
      <input type="text" placeholder="New Event" v-model="title">
      <input v-on:focus="dateFocused()" type="date" v-model="due" required>
    </div>
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

import Vue from 'vue'

export default {
  name: 'NewEvent',
  data() {
    return {
      title: '',
      due: '',
    }
  },
  methods: {
    dateFocused() {
      this.due = (this.due == '') ? moment().format("YYYY-MM-DD").toString() : this.due;
    },
    createEvent: function() {
      console.log("Creating event - ", this.title)
      if (this.title == '' || this.due == '') {
        this.$notify({
          group: 'forecast',
          type: 'error',
          text: 'Please enter a title and a date.'
        });
      } else {
        this.$parent.addEvent(this.title, moment(this.due));
        this.title = '';
        this.due = '';
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  $text: #000000;
  $placeholder: #aaa;

  #new-event {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1em;
    button {
      background: none;
      border-radius: 1em;
      color: $placeholder;
      border-width: 2px;
      border-color: $placeholder;
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
      height: 1.2em;
      font-size: 1.2em;
      &,
      &::placeholder {
        color: $placeholder;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }
      &[type="text"] {
        color: $text;
      }
      &[type="date"] {
        color: $placeholder;
      }
      &[type="date"]:focus,
      &[type="date"]:valid {
        color: $text;
      }
      &:focus {
        outline: none;
      }
    }
  }
</style>
