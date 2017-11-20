<template>
  <div class="hivemind-widget">
    <div class="hivemind-header" v-if="settings.title">
      <a class="hivemind-brand" :href="brand.url" :target="brand.target">
        <img :src="brand.img" :alt="brand.alt">
      </a>
      <h3 class="hivemind-title" v-text="settings.title"></h3>
    </div>
    <div class="hivemind-body">
      <spinner v-if="loading"></spinner>
      <div class="hivemind-content" v-else>
        <error v-if="error" :message="error"></error>
        <table class="hivemind-trend" v-else>
          <tr v-for="(data, key) in items" :key="key">
            <td class="hivemind-trend-label" v-text="key"></td>
            <td class="hivemind-trend-data">
              <trend
                :data="data"
                :gradient="trend.gradient"
                :auto-draw="trend.autodraw"
                :stroke-width="trend.strokeWidth"
                :stroke-linecap="trend.strokeLinecap"
                :smooth="trend.smooth">
              </trend>
            </td>
          </tr>
        </table>
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
  import Trend from 'vuetrend'

  export default {
    extends: Widget,
    components: {
      Trend
    },
    props: ['interval', 'engagement'],
    data () {
      return {
        items: {},
        trend: {
          data: [],
          gradient: ['#6fa8dc', '#42b983', '#2c3e50'],
          strokeLinecap: 'round',
          strokeWidth: 7,
          autodraw: true,
          smooth: true
        }
      }
    },
    methods: {
      fetchContents (token) {
        let hiveid = this.settings.hiveid
        let engagement = this.settings.engagement
        let interval = this.settings.interval
        let intervals = {
          day: 'day',
          week: 'week',
          month: 'month',
          daily: 'day',
          weekly: 'week',
          monthly: 'month'
        }
        let engagements = {
          basic: ['likes', 'comments', 'shares', 'clicks'],
          reactions: ['love', 'wow', 'haha', 'sad', 'angry'],
          all: ['likes', 'comments', 'shares', 'clicks', 'love', 'wow', 'haha', 'sad', 'angry']
        }

        // interval parameter validation
        if (!intervals[interval]) {
          this.error = 'Invalid value for "interval" property'
          this.loading = false
          return true
        }

        // engagement parameter validation
        if (!engagements[engagement]) {
          this.error = 'Invalid value for "engagement" property'
          this.loading = false
          return true
        }

        let filter = {
          $board: hiveid,
          $summary: intervals[interval],
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
          let trend = {}
          let summaries = response.data.summary
          engagements = engagements[engagement]

          for (let i = 0; i < summaries.length; i++) {
            let summary = summaries[i]
            for (let j = 0; j < engagements.length; j++) {
              let e = engagements[j]
              if (!trend[e]) {
                trend[e] = []
              }
              trend[e].push(summary[e].sum)
            }
          }

          this.$set(this, 'items', trend)
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
  .hivemind-trend {
    display: table;
    width: 100%;
    border: 0;
    padding: 0;
    background-color: #fff;
    border-collapse: collapse;
    border-spacing: 0;
    box-shadow: 0 1px 3px rgba(0,0,0,.2), 0 1px 1px rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12);
  }
  .hivemind-trend tr {
    border: 0;
  }
  .hivemind-trend tr:nth-child(2n) {
    background-color: #f8f8f8;
  }
  .hivemind-trend td {
    padding: 9px 15px;
    border: 0;
  }
  .hivemind-trend svg {
    width: auto;
  }
  .hivemind-trend-label {
    padding-left: 25px;
    text-transform: capitalize;
    text-align: left;
  }
  .hivemind-trend-data {
    text-align: right;
  }
</style>
