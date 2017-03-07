import Vue from 'vue'
import VueRouter from 'vue-router'
import modal from 'src/components/modal'

const dft_response = [200, {'Content-Type': 'application/json'}, '[{"name": "Foobars", "link": "foobar"}]']

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
    {field: 'first_field', type: 'text', label: 'Foobar', max_length: 255}
  ],
  attributes: [
    {field: 'custom_field', type: 'text', label: 'Custom Field', max_length: 2047}
  ]
}

const vm_data = {
  contractors: [{name: 'Fred Bloggs', link: 'fred-bloggs', tag_line: 'hello'}],
  config: {},
  contractors_extra: {'fred-bloggs': {'extra_attributes': [{'name': 'Bio', 'value': 'I am great'}]}},
  enquiry_form_info: enquiry_options,
  enquiry_data: {},
  method_calls: {},
}

const dft_router = new VueRouter({routes: [
  {path: '/', name: 'index', component: {render: h => h('div', {attrs: {'class': 'index'}})}},
  {path: '/:link', name: 'modal', component: modal},
]})

const generate_vm = (router, vm_data_) => {
  Vue.use(VueRouter)
  return new Vue({
    el: document.createElement('div'),
    router: router || dft_router,
    render: h => h('router-view'),
    data: vm_data_ || vm_data,
    methods: {
      __record_call: function (method_name) {
        if (this.hasOwnProperty('method_calls')) {
          this.method_calls[method_name] = (this.method_calls[method_name] || 0) + 1
        }
      },
      get_details: function () { this.__record_call('get_details') },
      get_enquiry: function () { this.__record_call('get_enquiry') },
      get_text: function (name, replacements) { this.__record_call('get_text') },
      submit_enquiry: function (callback) {
        this.__record_call('submit_enquiry')
        this.enquiry_data = {}
        callback()
      },
    }
  })
}

function tick () {
  return new Promise((resolve, reject) => Vue.nextTick(resolve))
}

export {dft_response, TestConsole, enquiry_options, vm_data, generate_vm, tick}