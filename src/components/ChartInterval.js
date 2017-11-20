import ChartLine from './ChartLine'

export default {
  extends: ChartLine,
  props: ['data', 'title', 'interval'],
  data () {
    return {
      presets: {
        love: {
          label: 'Love',
          color: '#F06292',
          hidden: true,
          positive: true
        },
        haha: {
          label: 'Haha',
          color: '#FFD54F',
          hidden: true,
          positive: true
        },
        wow: {
          label: 'Wow',
          color: '#81C784',
          hidden: true,
          positive: true
        },
        sad: {
          label: 'Sad',
          color: '#BA68C8',
          hidden: true,
          negative: true
        },
        angry: {
          label: 'Angry',
          color: '#FFA726',
          hidden: true,
          negative: true
        },
        positive: {
          label: 'Positive Interaction',
          color: '#64B5F6',
          hidden: false,
          subtotal: true
        },
        negative: {
          label: 'Negative Interaction',
          color: '#FF8A65',
          hidden: false,
          subtotal: true
        },
        total: {
          label: 'Total Interaction',
          color: '#7986CB',
          hidden: false,
          grandtotal: true
        }
      }
    }
  },
  computed: {
    summary () {
      let app = this
      let summaries = this.data
      let keys = Object.keys(this.presets)
      let result = { labels: [], datasets: {} }
      let dateFormat = ['day', 'week'].indexOf(this.interval) !== -1 ? 'MMM Do YYYY' : 'MMM YYYY'

      for (let i = 0; i < summaries.length; i++) {
        let summary = summaries[i]
        result.labels.push(summary.key_as_string)

        for (let j = 0; j < keys.length; j++) {
          let key = keys[j]
          let config = this.presets[key]

          // set default data
          if (!result.datasets[key]) {
            result.datasets[key] = {
              key: key,
              data: [],
              fill: false,
              label: config.label,
              borderColor: config.color,
              hidden: config.hidden
            }
          }

          let sum = 0
          if (key === 'positive') {
            sum = summary['love'].sum + summary['haha'].sum + summary['wow'].sum
          } else if (key === 'negative') {
            sum = summary['sad'].sum + summary['angry'].sum
          } else if (key === 'total') {
            sum = summary['love'].sum + summary['haha'].sum + summary['wow'].sum
            sum += summary['sad'].sum + summary['angry'].sum
          } else {
            sum = summary[key].sum || 0
          }
          result.datasets[key].data.push(sum)
        }
      }

      result.datasets = Object.values(result.datasets)
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
        position: 'bottom',
        onClick: (e, legendItem) => {
          let ci = this._chart
          let index = legendItem.datasetIndex

          // toggle dataset ... rerender the chart
          ci.data.datasets[index].hidden = !ci.data.datasets[index].hidden
          ci.update({
            duration: 800,
            easing: 'easeOutBounce'
          })
        },
        onHover: (e) => {
          e.target.style.cursor = 'pointer'
        },
        labels: {
          usePointStyle: true,
          fontFamily: '"Roboto Condensed", sans-serif',
          fontStyle: 'bold',
          fontSize: 13,
          generateLabels: (chart) => {
            let result = []
            let datasets = chart.data.datasets
            for (let i = 0; i < datasets.length; i++) {
              let dataset = datasets[i]
              result.push({
                datasetIndex: i,
                datasetKey: dataset.key,
                text: dataset.label,
                fillStyle: dataset.borderColor,
                hidden: dataset.hidden,
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
        enabled: true,
        displayColors: false,
        callbacks: {
          label: function (tooltipItems, data) {
            return data.datasets[tooltipItems.datasetIndex].label + ': ' + app.$currency(tooltipItems.yLabel)
          }
        }
      },
      layout: {
        padding: 20
      },
      animation: {
        animateScale: true,
        animateRotate: true
      },
      scales: {
        yAxes: [
          {
            ticks: {
              callback: function (label, index, labels) {
                return app.$shortnum(label)
              }
            }
          }
        ]
      },
      plugins: {
        datalabels: {
          color: 'white',
          font: {
            size: 12,
            weight: 'bold',
            family: '"Roboto Condensed", sans-serif'
          },
          borderColor: 'white',
          borderRadius: 100,
          borderWidth: 2,
          padding: 5,
          backgroundColor: (context) => {
            return context.dataset.borderColor
          },
          display: (context) => {
            let dataset = context.dataset
            // let count = dataset.data.length
            let value = dataset.data[context.dataIndex]
            // return value > count * 1
            return value > 0
          },
          formatter: (value, context) => {
            return app.$shortnum(value)
          }
        }
      }
    }

    this.renderChart(this.summary, options)
  }
}
