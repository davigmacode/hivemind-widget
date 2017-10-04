import Vue from 'vue'

// include vue-custom-element plugin to Vue
import VueCustomElement from 'vue-custom-element'
Vue.use(VueCustomElement)

// import and register your component(s)
import HivemindTrend from './components/Trend.vue'
Vue.customElement('hivemind-trend', HivemindTrend)
