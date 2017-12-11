import Vue from 'vue'
import VueRouter from 'vue-router'
import con_modal from 'src/components/con-modal'
import enquiry from 'src/components/enquiry'
import enquiry_modal from 'src/components/enquiry-modal'

const dft_response = [200, {'Content-Type': 'application/json'}, '[{"name": "Foobars", "link": "123-foobar"}]']

class TestConsole {
  log_ = []
  warning_ = []
  error_ = []

  log () {
    this.log_.push(Array.from(arguments).join())
  }

  warning () {
    this.warning_.push(Array.from(arguments).join())
  }

  error () {
    this.error_.push(Array.from(arguments).join())
  }
}

const enquiry_options = {
  visible: [
    {field: 'first_field', prefix: null, type: 'text', label: 'Foobar', max_length: 255},
    {field: 'custom_field', prefix: 'attributes', type: 'text', label: 'Custom Field', max_length: 2047},
    {
      field: 'select_test',
      choices: [
        {
          display_name: 'v1',
          value: 'v1'
        },
        {
          display_name: 'v2',
          value: 'v2'
        }
      ],
      help_text: 'xxx',
      label: 'Select Test',
      prefix: 'attributes',
      required: true,
      sort_index: 1000,
      type: 'select'
    },
  ],
}

const vm_data = () => ({
  contractors: [{name: 'Fred Bloggs', link: '123-fred-bloggs', tag_line: 'hello'}],
  config: {},
  grecaptcha_key: null,
  contractors_extra: {'123-fred-bloggs': {'extra_attributes': [{'name': 'Bio', 'value': 'I am great'}]}},
  enquiry_form_info: enquiry_options,
  enquiry_data: {},
  method_calls: {},
})

const con_modal_router = new VueRouter({routes: [
  {path: '/', name: 'index', component: {render: h => h('div', {attrs: {'class': 'index'}})}},
  {path: '/:link', name: 'con-modal', component: con_modal},
]})

const enquiry_router = new VueRouter({routes: [
  {path: '/', name: 'index', component: enquiry},
]})

const modal_enquiry_router = new VueRouter({routes: [
  {path: '/', name: 'index', component: {render: h => h('div', {attrs: {'class': 'index'}})}},
  {path: '/enquiry', name: 'enquiry-modal', component: enquiry_modal},
]})

function generate_vm (router, vm_data_) {
  Vue.use(VueRouter)
  return new Vue({
    el: document.createElement('div'),
    router: router || con_modal_router,
    render: h => h('router-view'),
    data: vm_data_ || vm_data(),
    methods: {
      __record_call (method_name, extra_args) {
        if (this.hasOwnProperty('method_calls')) {
          if (this.method_calls[method_name]) {
            this.method_calls[method_name].push(extra_args || null)
          } else {
            this.method_calls[method_name] = [extra_args || null]
          }
        }
      },
      get_contractor_details () { this.__record_call('get_contractor_details') },
      get_enquiry () { this.__record_call('get_enquiry') },
      get_text () { this.__record_call('get_text') },
      submit_enquiry (callback) {
        this.__record_call('submit_enquiry', this.enquiry_data)
        this.enquiry_data = {}
        callback()
      },
      ga_event () { this.__record_call('ga_event') },
      grecaptcha_callback (r) { this.__record_call('grecaptcha_callback', r) },
      get_selected_subject () {
        this.__record_call('get_selected_subject')
        return null
      }
    }
  })
}

function tick () {
  return new Promise((resolve, reject) => Vue.nextTick(resolve))
}

function sleep (delay) {
  return new Promise((resolve, reject) => setTimeout(() => resolve(), delay))
}

function prepare_ga (log) {
  window._tcs_ga = null
  const ga_data = []
  window.ga = function () {
    ga_data.push(Array.from(arguments).join())
    if (log) {
      console.log('ga:', arguments)
    }
  }
  return ga_data
}

function teardown_ga () {
  delete window.ga_data
}

export {
  dft_response,
  TestConsole,
  enquiry_options,
  enquiry_router,
  modal_enquiry_router,
  vm_data,
  generate_vm,
  tick,
  sleep,
  prepare_ga,
  teardown_ga,
}
