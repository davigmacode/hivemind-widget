import ChartDoughnut from './ChartDoughnut'

export default {
  extends: ChartDoughnut,
  props: ['data', 'title'],
  data () {
    return {
      presets: {
        love: {
          index: 0,
          dataset: 0,
          label: 'Love',
          color: '#F06292',
          hidden: true,
          positive: true
        },
        haha: {
          index: 1,
          dataset: 0,
          label: 'Haha',
          color: '#FFD54F',
          hidden: true,
          positive: true
        },
        wow: {
          index: 2,
          dataset: 0,
          label: 'Wow',
          color: '#81C784',
          hidden: true,
          positive: true
        },
        sad: {
          index: 3,
          dataset: 0,
          label: 'Sad',
          color: '#BA68C8',
          hidden: true,
          negative: true
        },
        angry: {
          index: 4,
          dataset: 0,
          label: 'Angry',
          color: '#FFA726',
          hidden: true,
          negative: true
        },
        positive: {
          index: 5,
          dataset: 1,
          label: 'Positive',
          color: '#64B5F6',
          hidden: false,
          subtotal: true
        },
        negative: {
          index: 6,
          dataset: 1,
          label: 'Negative',
          color: '#FF8A65',
          hidden: false,
          subtotal: true
        }
      }
    }
  },
  computed: {
    record () {
      let summaries = this.data
      let result = {
        labels: [],
        datasets: [{
          backgroundColor: [],
          data: [0, 0, 0, 0, 0, 0, 0],
          label: 'all reactions',
          datalabels: {
            align: 'end',
            anchor: 'end',
            color: '#555',
            offset: 0
          }
        }, {
          backgroundColor: [],
          data: [0, 0, 0, 0, 0, 0, 0],
          label: 'simple reactions'
        }]
      }

      let presets = this.presets
      for (let key in presets) {
        if (!presets.hasOwnProperty(key)) continue

        let preset = presets[key]
        result.labels[preset.index] = preset.label
        result.datasets[0].backgroundColor[preset.index] = preset.color
        result.datasets[1].backgroundColor[preset.index] = preset.color

        if (!preset.subtotal) {
          // fill all reaction dataset
          result.datasets[0].data[preset.index] = summaries[key].sum

          // fill simple reaction dataset
          if (preset.negative) {
            // fill negative reaction
            result.datasets[1].data[6] += summaries[key].sum
          } else {
            // fill positive reaction
            result.datasets[1].data[5] += summaries[key].sum
          }
        }
      }

      return result
    },
    total () {
      let result = 0
      let summaries = this.data
      let presets = this.presets

      for (let key in presets) {
        if (!presets.hasOwnProperty(key) || presets[key].subtotal) continue

        result += summaries[key].sum
      }

      return result
    }
  },
  mounted () {
    let app = this
    let title = this.title || false
    let options = {
      responsive: true,
      legend: {
        display: true,
        position: 'left',
        labels: {
          usePointStyle: true,
          fontFamily: '"Roboto Condensed", sans-serif',
          fontStyle: 'bold',
          fontSize: 13,
          generateLabels: (chart) => {
            let result = []
            let presets = this.presets
            for (let key in presets) {
              if (!presets.hasOwnProperty(key)) continue

              let preset = presets[key]
              let value = chart.data.datasets[preset.dataset].data[preset.index]
              result.push({
                text: preset.label + ' (' + app.$currency(value) + ')',
                fillStyle: preset.color,
                lineWidth: 0
              })
            }

            return result
          }
        }
      },
      title: {
        display: title !== false,
        fontSize: 18,
        fontFamily: '"Roboto Condensed", sans-serif',
        text: title
      },
      tooltips: {
        enabled: true
      },
      layout: {
        padding: 10
      },
      animation: {
        animateScale: true,
        animateRotate: true
      },
      plugins: {
        datalabels: {
          color: 'white',
          font: {
            size: 12,
            weight: 'bold',
            family: '"Roboto Condensed", sans-serif'
          },
          display: (context) => {
            let dataset = context.dataset
            let value = dataset.data[context.dataIndex]
            return value > 0
          },
          formatter: (value, context) => {
            return Math.round(value / this.total * 100) + '%'
          }
        }
      }
    }

    this.renderChart(this.record, options)
  }
}
