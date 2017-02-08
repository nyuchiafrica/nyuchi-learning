import socket from 'src/main'

const dft_response = [200, {'Content-Type': 'application/json'}, '[{"name": "Foobars", "link": "foobar"}]']

describe('main.js', done => {
  let server
  before(() => {
    server = sinon.fakeServer.create()
    server.autoRespond = true
    server.respondWith(dft_response)
  })
  after(() => { server.restore() })

  it('should initialise with different element name', done => {
    let outer = document.createElement('div')
    outer.setAttribute('id', 'outer')
    document.body.appendChild(outer)
    let el = document.createElement('div')
    el.setAttribute('id', 'foobar')
    outer.appendChild(el)

    const vm = socket('public_key', {
      element: '#foobar'
    })

    expect(vm.$el.parentNode.attributes['id'].value).to.equal('outer')
    // no time for get_data to be called so wont fail
    expect(vm.contractors).to.be.empty

    setTimeout(() => {
      expect(vm.contractors).to.have.lengthOf(1)
      done()
    }, 50)
  })
})

describe('main.js', () => {
  let server
  before(() => {
    server = sinon.fakeServer.create()
    server.autoRespond = true
    server.respondWith('/public_key/contractors', dft_response)
  })
  after(() => { server.restore() })

  it('should download contractors', done => {
    let el = document.createElement('div')
    el.setAttribute('id', 'socket')
    document.body.appendChild(el)

    const vm = socket('public_key')

    setTimeout(() => {
      expect(vm.error).to.equal(null)
      expect(vm.contractors).to.deep.equal([{name: 'Foobars', link: 'foobar'}])
      done()
    }, 50)
  })
})

describe('main.js', () => {
  let server
  before(() => {
    server = sinon.fakeServer.create()
    server.autoRespond = true
    server.respondWith('/public_key/contractors', [404, {}, 'badness'])
  })
  after(() => { server.restore() })

  it('should show error with bad response', done => {
    let el = document.createElement('div')
    el.setAttribute('id', 'socket')
    document.body.appendChild(el)

    const vm = socket('public_key')

    setTimeout(() => {
      !expect(vm.error).to.not.equal(null)
      expect(vm.error).to.contain('Error: bad response 404')
      expect(vm.error).to.contain('response status: 404')
      expect(vm.error).to.contain('response text:\nbadness')
      expect(vm.error).to.not.contain('Connection error')
      done()
    }, 50)
  })
})

describe('main.js', () => {
  it('should show connection error', done => {
    let el = document.createElement('div')
    el.setAttribute('id', 'socket')
    document.body.appendChild(el)

    const vm = socket('the-public-key', {api_root: 'http://localhost:12345678'})

    setTimeout(() => {
      expect(vm.error).to.contain('Connection error')
      expect(vm.error).to.contain('response status: 0')
      done()
    }, 50)
  })
})
