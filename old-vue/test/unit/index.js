// Polyfill fn.bind() for PhantomJS
/* eslint-disable no-extend-native */
Function.prototype.bind = require('function-bind')

// const testsContext = require.context('./specs', true, /main\.js$/)
const testsContext = require.context('./specs', true)
testsContext.keys().forEach(testsContext)

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
const srcContext = require.context('src', true)
srcContext.keys().forEach(srcContext)
