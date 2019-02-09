<template>
  <div class="new-event">
    <input type="text" placeholder="Title" v-model="title">
    <input type="date" placeholder="Date" v-model="due">
    <button type="submit" value="submit" v-on:click="createEvent">Create</button>
  </div>
</template>

<script>
const _ = require('lodash');
const storage = require('electron-json-storage');
const uuidv4 = require('uuid/v4');
const moment = require('moment');

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
      const instance = this;
      storage.get('events', function(error, data) {
        if (error) throw error;
        const newEvent = {
          id: uuidv4(),
          title: instance.title,
          due: moment(instance.due)
        };
        let events = []
        if (_.isEmpty(data)) {
          events[0] = newEvent;
        } else {
          events = _.toArray(data);
          events.push(newEvent);
        }
        storage.set('events', events);
        instance.refreshEvents();
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
