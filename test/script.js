var transformFileSync = require('babel-core').transformFileSync
var path = require('path')
var fs = require('fs')

var plugin = require('../index.js')
const log = (code) => /*console.log(code) ||*/ code
eval(log(transformFileSync(path.join(__dirname, 'test.js'), {plugins: [[plugin]]}).code))
