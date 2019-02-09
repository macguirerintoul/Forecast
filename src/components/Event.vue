<template>
  <div class="event">
    <h2>{{ title }}</h2>
    <span class="due">{{ momentDue }}</span>
  </div>
</template>

<script>
const moment = require('moment');

export default {
  name: 'Event',
  props: {
    id: String,
    title: String,
    due: Object
  },
  computed: {
    momentDue: function () {
      return moment(this.due).fromNow(moment().isBefore(moment(this.due)));
    }
  }
}
</script>

<style scoped lang="scss">
  .event {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    h2 {
      font-size: 2em;
      display: inline;
    }
  }
</style>
