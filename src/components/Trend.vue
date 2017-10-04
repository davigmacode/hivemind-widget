<template>
  <div class="hivemind-widget">
    <div class="hivemind-body">
      <div class="hivemind-loading" v-if="loading">
        <spinner :spacing="10" message="loading"></spinner>
      </div>
      <div class="hivemind-content" v-else>
        <error v-if="error" :message="error"></error>
        <div class="hivemind-trend" v-else>
          <trend
            :data="trend.data"
            :gradient="trend.gradient"
            :auto-draw="trend.autodraw"
            :smooth="trend.smooth">
          </trend>
        </div>
      </div>
    </div>
    <div class="hivemind-brand">
      <a href="https://beta.hivemind.id" target="_blank">
        <img src="../img/powered.gif" alt="powered by hivemind.id">
      </a>
    </div>
  </div>
</template>

<script>
  import Widget from './Widget.vue'
  import Trend from 'vuetrend'

  export default {
    extends: Widget,
    components: {
      Trend
    },
    props: {
      interval: {
        type: String,
        required: false,
        default: 'none'
      },
      engagement: {
        type: String,
        required: false,
        default: ''
      }
    },
    data () {
      return {
        items: [],
        trend: {
          data: [],
          gradient: ['#6fa8dc', '#42b983', '#2c3e50'],
          autodraw: true,
          smooth: true
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
          daily: 'day',
          weekly: 'week',
          monthly: 'month'
        }

        // interval parameter validation
        if (intervals[type] == undefined) {
          this.error = 'Invalid value for "interval" property'
          return true
        }

        // engagement parameter validation
        let engagements = ['likes', 'comments', 'shares', 'clicks', 'love', 'wow', 'haha', 'sad', 'angry']
        if (engagements.indexOf(this.engagement) === -1) {
          this.error = 'Invalid value for "engagement" property'
          return true
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
          let trend = []
          let summaries = response.data.summary
          for (let i = 0; i < summaries.length; i++) {
            let summary = summaries[i]
            trend.push(summary[this.engagement].sum)
          }

          this.$set(this.trend, 'data', trend)
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
