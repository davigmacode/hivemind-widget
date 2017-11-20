import Vue from 'vue'
import 'document-register-element'

// include vue-custom-element plugin to Vue
import VueCustomElement from 'vue-custom-element'
Vue.use(VueCustomElement)

// import and register your component(s)
import HivemindTrend from './widgets/Trend.vue'
Vue.customElement('hivemind-trend', HivemindTrend)
