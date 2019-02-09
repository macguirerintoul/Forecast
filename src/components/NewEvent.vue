<template>
<div class="new-event">
  <input type="text" placeholder="Title" v-model="title">
  <input type="date" placeholder="Date" v-model="due">
  <button type="submit" value="submit" v-on:click="createEvent">Create</button>
</div>
</template>

<script>
const moment = require('moment');
var Datastore = require('nedb');
var db = new Datastore({
  filename: 'untili.db',
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
      }, (err, newDoc) => {
        console.log(newDoc)
        this.refreshEvents();
      });
    },
    refreshEvents() {
      this.$parent.getEvents();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
