<template>
  <div id="new-event" v-on:keyup.enter="createEvent">
    <div>
      <input type="text" placeholder="New Event" v-model="title">
      <input v-on:focus="dateFocused()" type="date" v-model="date" required>
      <input v-on:focus="timeFocused()" type="time" v-model="time" required>
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

// import Vue from 'vue'

export default {
  name: 'NewEvent',
  data() {
    return {
      title: '',
      date: '',
      time: '',
    }
  },
  methods: {
    dateFocused() {
      this.date = (this.date == '') ? moment().format("YYYY-MM-DD").toString() : this.date;
    },
    timeFocused() {
      this.time = (this.time == '') ? moment().format("HH:mm").toString() : this.time;
    },
    createEvent: function() {
      console.log("Creating event - ", this.title)
      if (this.title == '' || this.date == '') {
        this.$notify({
          group: 'forecast',
          type: 'error',
          text: 'Please enter a title and a date.'
        });
      } else {
        let due = moment(this.date + ' ' + this.time).toString()
        console.log(due)
        this.$parent.addEvent(this.title, due);
        this.title = ''
        this.date = ''
        this.time = ''
      }
    }
  }
}
</script>

<style scoped lang="scss">

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
        font-family: $font-stack;
      }
      &[type="text"] {
        color: $el-dark;
      }
      &[type="date"] {
        color: $placeholder;
      }
      &[type="date"]:focus,
      &[type="date"]:valid,
      &[type="time"]:focus,
      &[type="time"]:valid {
        color: $el-dark;
      }
      &:focus {
        outline: none;
      }
    }
  }
</style>
