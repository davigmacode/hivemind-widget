<template>
  <div class="hivemind-widget">
    <div class="hivemind-body">
      <div class="hivemind-loading" v-if="loading">
        <spinner :spacing="10" message="loading"></spinner>
      </div>
      <div class="hivemind-content" v-else>
        <error v-if="error" :message="error"></error>
        <div class="hivemind-chart" v-else>
          <chart-total v-if="!summary.isInterval" :data="summary.data" :title="options.title"></chart-total>
          <chart-interval v-else :data="summary.data" :title="options.title" :interval="summary.type"></chart-interval>
        </div>
      </div>
    </div>
    <div class="hivemind-brand">
      <a href="https://beta.hivemind.id" target="_blank">
        <img src="https://unpkg.com/hivemind-widget/img/powered.gif" alt="powered by hivemind.id">
      </a>
    </div>
  </div>
</template>

<script>
  import Widget from './Widget.vue'
  import ChartTotal from './ChartTotal.js'
  import ChartInterval from './ChartInterval.js'

  export default {
    extends: Widget,
    components: {
      ChartTotal,
      ChartInterval
    },
    props: {
      interval: {
        type: String,
        required: false,
        default: 'none'
      },
      title: {
        type: String,
        required: false,
        default: ''
      },
      width: {
        type: String,
        required: false,
        default: '350px'
      },
      height: {
        type: String,
        required: false,
        default: '350px'
      }
    },
    data () {
      return {
        items: [],
        summary: {}
      }
    },
    computed: {
      styles () {
        return {
          position: 'relative',
          width: this.width || 'auto',
          height: this.height || 'auto'
        }
      },
      options () {
        return {
          title: this.title,
          width: this.width,
          height: this.height
        }
      }
    },
    methods: {
      fetchContents (token) {
        let type = this.interval
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
          $board: this.hiveid,
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
      this.preProcessing()
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
