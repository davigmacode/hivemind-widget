<template>
  <div :class="css.widget.class">
    <spinner v-if="loading"></spinner>
    <template v-else>
      <error v-if="error" :message="error"></error>
      <template v-else>
        <div class="hivemind-header" v-if="widget.title">
          <a class="hivemind-brand" :href="brand.url" :target="brand.target" v-if="screen !== 'xs'">
            <img :src="brand.img" :alt="brand.alt">
          </a>
          <h3 class="hivemind-title" v-text="widget.title"></h3>
        </div>
        <div class="hivemind-body">
          <component
            :is="view"
            :widget="widget"
            :stories="stories"
            :summaries="summaries"
            :screen="screen"></component>
        </div>
      </template>
    </template>
    <div class="hivemind-footer" v-if="!widget.title || screen === 'xs'">
      <a class="hivemind-brand" :href="brand.url" :target="brand.target">
        <img :src="brand.img" :alt="brand.alt">
      </a>
    </div>
  </div>
</template>

<script>
  import Spinner from '../components/Spinner.vue'
  import Error from '../components/Error.vue'
  import Stories from '../components/Stories.vue'
  import Summary from '../components/Summary.vue'
  import Trend from '../components/Trend.vue'
  import Slider from '../components/Slider.vue'
  import Api from '../libraries/api'

  export default {
    components: {
      Error,
      Spinner,
      Stories,
      Summary,
      Trend,
      Slider
    },
    props: ['id'],
    data () {
      return {
        $api: null,
        loading: true,
        screen: 'lg',
        error: '',
        brand: {
          url: 'https://beta.hivemind.id',
          img: 'https://unpkg.com/hivemind-widget/img/powered.gif',
          alt: 'powered by hivemind.id',
          target: '_blank'
        },
        defaults: {
          stories: {
            limit: 5,
            column: 1,
            thumb: 'left',
            datetime: 'rv',
            datetimePosition: 'bottom',
            engagement: 'hidden',
            overflow: 'display',
            target: '_self',
            optimizer: 'no'
          },
          summary: {
            interval: 'none'
          },
          trend: {
            interval: 'daily',
            engagement: 'all'
          },
          slider: {
            limit: 5,
            datetime: 'rv',
            target: '_self'
          }
        },
        widget: {},
        stories: null,
        summaries: null
      }
    },
    computed: {
      view () {
        let views = {
          'stories': 'Stories',
          'summary': 'Summary',
          'trend': 'Trend',
          'slider': 'Slider'
        }

        return views[this.widget.type]
      },
      css () {
        return {
          widget: {
            class: ['hivemind-widget', 'hivemind-widget-' + this.screen]
          }
        }
      }
    },
    methods: {
      breakpoint () {
        let sm = 768
        let md = 922
        let lg = 1200
        let mm = null
        let cb = () => this.breakpoint()

        mm = window.matchMedia(`(min-width: ${lg}px)`)
        if (mm.matches) {
          this.screen = 'lg'
          mm.onchange = cb
        } else {
          mm = window.matchMedia(`(min-width: ${md}px) and (max-width: ${lg - 1}px)`)
          if (mm.matches) {
            this.screen = 'md'
            mm.onchange = cb
          } else {
            mm = window.matchMedia(`(min-width: ${sm}px) and (max-width: ${md - 1}px)`)
            if (mm.matches) {
              this.screen = 'sm'
              mm.onchange = cb
            } else {
              this.screen = 'xs'
              mm.onchange = cb
            }
          }
        }
      },
      getWidget () {
        this.loading = true
        this.error = ''

        let widgetID = this.id
        if (!widgetID) {
          this.error = 'Widget ID is required'
          this.loading = false
          return true
        }

        // check media match
        this.breakpoint()

        // call authentication api
        this.$api.request({
          method: 'get',
          url: `widgets/${widgetID}/contents`
        }).then((response) => {
          response = response.data
          let widget = response.widget
          let type = widget.type || 'stories'
          widget.options = Object.assign({}, this.defaults[type], widget.options)
          this.widget = widget
          this.stories = response.data
          this.summaries = response.summary
        }).catch((error) => {
          this.error = error.message
        }).then(() => {
          this.loading = false
        })
      }
    },
    created () {
      this.$api = Api
      this.getWidget()
    }
  }
</script>

<style>
  .hivemind-header {
    position: relative;
  }
  .hivemind-header .hivemind-brand {
    float: right;
    padding: 0;
  }
  .hivemind-title {
    margin: 12px 0;
  }
  .hivemind-body {
    display: block;
    position: relative;
    text-align: center;
  }
  .hivemind-footer {
    text-align: center;
    padding: 15px 0;
    display: block;
  }
  .hivemind-brand img {
    max-width: 100%;
  }
  .hivemind-loading {
    min-height: 250px;
    background: #f8f8f8;
    justify-content: center;
    flex-direction: column;
    display: flex;
  }
</style>