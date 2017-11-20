<template>
  <table class="hivemind-trend">
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
</template>

<script>
  import Trend from 'vuetrend'

  export default {
    components: {
      Trend
    },
    props: [
      'widget',
      'stories',
      'summaries',
      'screen'
    ],
    data () {
      return {
        trend: {
          gradient: ['#6fa8dc', '#42b983', '#2c3e50'],
          strokeLinecap: 'round',
          strokeWidth: 5,
          autodraw: true,
          smooth: true
        },
        engagements: {
          basic: ['likes', 'comments', 'shares', 'clicks'],
          reactions: ['love', 'wow', 'haha', 'sad', 'angry'],
          all: ['likes', 'comments', 'shares', 'clicks', 'love', 'wow', 'haha', 'sad', 'angry']
        }
      }
    },
    computed: {
      items () {
        let options = this.widget.options
        let engagement = options.engagement || 'all'
        let engagements = this.engagements[engagement]
        let summaries = this.summaries

        let trend = {}
        for (let i = 0; i < summaries.length; i++) {
          let summary = summaries[i]
          for (let j = 0; j < engagements.length; j++) {
            let e = engagements[j]
            if (!trend[e]) {
              trend[e] = []
            }
            trend[e].push(summary[e].sum || 0)
          }
        }

        return trend
      }
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
