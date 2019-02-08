<template>
  <div class="new-event">
    <input type="text" placeholder="Title" v-model="title">
    <input type="date" placeholder="Date" v-model="due">
    <button type="submit" value="submit" v-on:click="createEvent">Create</button>
  </div>
</template>

<script>
const storage = require('electron-json-storage');

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
      storage.get('events', function(error, data) {
        if (error) throw error;
        let events = data;
        const newEvent = {
          id: 6,
          title: this.title,
          due: this.due
        }
        events.push(newEvent);
        alert(JSON.stringify(events));
        storage.set('events', events);
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
