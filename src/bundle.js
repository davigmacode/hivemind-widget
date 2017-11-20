import Vue from 'vue'
import Currency from './libraries/currency'
import Shortnum from './libraries/shortnum'
import 'document-register-element'

Vue.prototype.$currency = Vue.currency = Currency
Vue.prototype.$shortnum = Vue.shortnum = Shortnum
Vue.filter('currency', Currency)
Vue.filter('shortnum', Shortnum)

// include vue-custom-element plugin to Vue
import VueCustomElement from 'vue-custom-element'
Vue.use(VueCustomElement)

// import and register your component(s)
import HivemindContent from './widgets/Content.vue'
import HivemindSummary from './widgets/Summary.vue'
import HivemindTrend from './widgets/Trend.vue'
Vue.customElement('hivemind-content', HivemindContent)
Vue.customElement('hivemind-summary', HivemindSummary)
Vue.customElement('hivemind-trend', HivemindTrend)
