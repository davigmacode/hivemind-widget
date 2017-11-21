<template>
  <div class="hivemind-chart">
    <chart-total v-if="!summary.isInterval" :data="summary.data"></chart-total>
    <chart-interval v-else :data="summary.data" :interval="summary.type"></chart-interval>
  </div>
</template>

<script>
  import ChartTotal from './ChartTotal.js'
  import ChartInterval from './ChartInterval.js'

  export default {
    components: {
      ChartTotal,
      ChartInterval
    },
    props: [
      'widget',
      'stories',
      'summaries',
      'screen'
    ],
    computed: {
      summary () {
        let type = this.widget.options.interval || 'total'
        let intervals = {
          day: 'day',
          week: 'week',
          month: 'month',
          daily: 'day',
          weekly: 'week',
          monthly: 'month',
          none: 'total',
          total: 'total'
        }

        return {
          data: this.summaries,
          type: intervals[type],
          isInterval: ['total', undefined].indexOf(intervals[type]) === -1
        }
      }
    }
  }
</script>

<style scoped>
</style>
