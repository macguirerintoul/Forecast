<template>
  <div @contextmenu="$emit('rightClick')" @click="$emit('eventClicked')" class="event">
    <h2>{{ title }}</h2>
    <div class="due">
      <span class="amount">{{ amount }}</span>
      <span class="unit">{{ unit }}</span>
    </div>
  </div>
</template>

<script>
const moment = require('moment');

export default {
  name: 'Event',
  props: {
    id: String,
    index: Number,
    title: String,
    due: Object
  },
  computed: {
    amount: function () {
      let fromNow = moment(this.due).fromNow(moment().isBefore(moment(this.due)));
      let amount = fromNow.substring(0, fromNow.indexOf(" "));
      return (amount == 'a' || amount == 'an') ? '1' : amount;
    },
    unit: function() {
      let str = moment(this.due).fromNow(moment().isBefore(moment(this.due)));
      return str.substring(str.indexOf(" "));
    }
  }
}
</script>

<style scoped lang="scss">
  .event {
    padding: 2em 2em;
    display: flex;
    align-items: center;
    justify-content: space-between;
    h2 {
      margin: 0;
      font-size: 1.75em;
      display: inline;
    }
    .due {
      display: flex;
      flex-direction: column;
      text-align: right;
      min-width: 4em;
      .amount {
        font-size: 2em;
        font-weight: 700;
      }
    }
  }
</style>
