<script>
  import Api from '../libraries/api'
  import Error from './Error.vue'
  import Spinner from 'vue-simple-spinner'

  export default {
    components: {
      Error,
      Spinner
    },
    props: ['apikey', 'hiveid', 'title'],
    data () {
      return {
        $api: null,
        loading: true,
        error: '',
        brand: {
          url: 'https://beta.hivemind.id',
          img: 'https://unpkg.com/hivemind-widget/img/powered.gif',
          alt: 'powered by hivemind.id',
          target: '_blank'
        }
      }
    },
    computed: {
      settings () {
        let defaults = {
          content: {
            limit: 5,
            column: 1,
            thumb: 'hidden',
            datetime: 'rv',
            engagement: 'hidden',
            overflow: 'display',
            target: '_blank',
            optimizer: 'yes'
          },
          summary: {
            interval: 'none'
          },
          trend: {
            interval: 'daily',
            engagement: 'basic'
          }
        }

        let type = this.$options.name
        let globals = window.hivemind || {}
        let result = globals[type] || {}
        result.apikey = this.apikey || globals.apikey
        result.hiveid = this.hiveid || globals.hiveid

        let props = this.$props
        props = Object.assign({}, ...Object.entries(props).map(([k, v]) => (v !== undefined && {[k]: v})))

        return Object.assign({}, defaults[type], result, props)
      }
    },
    methods: {
      authenticate () {
        this.loading = true
        this.error = ''

        let apikey = this.settings.apikey
        let hiveid = this.settings.hiveid

        if (!apikey) {
          return Promise.reject({message: 'API key is required'})
        }

        if (!hiveid) {
          return Promise.reject({message: 'Hive Id is required'})
        }

        return this.$api.request({
          method: 'post',
          url: 'auth/login',
          data: {
            strategy: 'apikey',
            apikey: apikey
          }
        })
      }
    },
    created () {
      this.$api = Api
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
  .hivemind-brand {
    text-align: center;
    padding: 15px 0 0;
    display: block;
  }
  .hivemind-brand img {
    max-width: 100%;
  }
  .hivemind-loading {
    min-height: 250px;
    background: #ECEFF1;
    justify-content: center;
    flex-direction: column;
    display: flex;
  }
</style>