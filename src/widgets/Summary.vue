<template>
  <div class="hivemind-widget">
    <div class="hivemind-header" v-if="settings.title">
      <a class="hivemind-brand" :href="brand.url" :target="brand.target">
        <img :src="brand.img" :alt="brand.alt">
      </a>
      <h3 class="hivemind-title" v-text="settings.title"></h3>
    </div>
    <div class="hivemind-body">
      <div class="hivemind-loading" v-if="loading">
        <spinner :spacing="10" message="loading"></spinner>
      </div>
      <div class="hivemind-content" v-else>
        <error v-if="error" :message="error"></error>
        <div class="hivemind-chart" v-else>
          <chart-total v-if="!summary.isInterval" :data="summary.data"></chart-total>
          <chart-interval v-else :data="summary.data" :interval="summary.type"></chart-interval>
        </div>
      </div>
    </div>
    <div class="hivemind-footer" v-if="!settings.title">
      <a class="hivemind-brand" :href="brand.url" :target="brand.target">
        <img :src="brand.img" :alt="brand.alt">
      </a>
    </div>
  </div>
</template>

<script>
  import Widget from '../components/Widget.vue'
  import ChartTotal from '../components/ChartTotal.js'
  import ChartInterval from '../components/ChartInterval.js'

  export default {
    extends: Widget,
    components: {
      ChartTotal,
      ChartInterval
    },
    props: ['interval'],
    data () {
      return {
        items: [],
        summary: {}
      }
    },
    methods: {
      fetchContents (token) {
        let type = this.settings.interval
        let intervals = {
          day: 'day',
          week: 'week',
          month: 'month',
          dayly: 'day',
          weekly: 'week',
          monthly: 'month',
          none: 'total',
          total: 'total'
        }

        if (intervals[type] === undefined) {
          this.error = 'Invalid value for "interval" property'
          return false
        }

        let filter = {
          $board: this.settings.hiveid,
          $summary: intervals[type],
          $limit: 0
        }

        this.$api.request({
          method: 'get',
          url: 'contents',
          params: filter,
          headers: {
            authorization: token
          }
        }).then((response) => {
          this.summary = {
            type: intervals[type],
            data: response.data.summary,
            isInterval: intervals[type] !== 'total'
          }
        }).catch((error) => {
          this.error = error.message
        }).then(() => {
          this.loading = false
        })
      }
    },
    mounted () {
      this.authenticate().then((response) => {
        this.fetchContents(response.data.accessToken)
      }).catch((error) => {
        this.error = error.message
        this.loading = false
      })
    }
  }
</script>

<style scoped>
  .hivemind-chart {
    background: #fff;
  }
</style>
