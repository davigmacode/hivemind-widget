<script>
  import Api from '../libraries/api'
  import Error from './Error.vue'
  import Spinner from 'vue-simple-spinner'

  export default {
    components: {
      Error,
      Spinner
    },
    props: {
      apikey: {
        type: String,
        required: true
      },
      hiveid: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        $api: null,
        loading: true,
        error: ''
      }
    },
    computed: {
      hivemind () {
        return window.hivemind || {}
      }
    },
    methods: {
      authenticate () {
        let apikey = this.apikey || this.hivemind.apikey

        if (!apikey) {
          return Promise.reject({message: 'API key is required'})
        }

        return this.$api.request({
          method: 'post',
          url: 'auth/login',
          data: {
            strategy: 'apikey',
            apikey: apikey
          }
        })
      },
      preProcessing () {
        this.loading = true
        this.error = ''
      }
    },
    created () {
      this.$api = Api
      this.preProcessing()
    }
  }
</script>

<style>
  .hivemind-body {
    position: relative;
    min-height: 250px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    background: #ECEFF1;
  }
  .hivemind-brand {
    text-align: center;
    padding: 15px 0 0;
  }
  .hivemind-brand img {
    max-width: 100%;
  }
  .hivemind-post-empty {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    opacity: 0.5;
  }
</style>