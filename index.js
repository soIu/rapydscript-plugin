const { dirname, extname, resolve, join } = require('path')

let tempCache;
let bufferLength;

const rapydscript_variables = `
var ρσ_iterator_symbol = (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") ? Symbol.iterator : "iterator-Symbol-5d0927e5554349048cf0e3762a228256";
var ρσ_kwargs_symbol = (typeof Symbol === "function") ? Symbol("kwargs-object") : "kwargs-object-Symbol-5d0927e5554349048cf0e3762a228256";
var ρσ_cond_temp, ρσ_expr_temp, ρσ_last_exception;
var ρσ_object_counter = 0;
`

const getTemp = () => {
  if (tempCache) return tempCache;
  tempCache = [require('temp').track()];
  tempCache[1] = tempCache[0].openSync({suffix: '.js'}).path;
  const buffer = Buffer.from(rapydscript_variables + require('fs').readFileSync(join(__dirname, 'node_modules/rapydscript-ng/release/baselib-plain-pretty.js')).toString() + '\nmodule.exports = {\n};');
  bufferLength = buffer.length;
  require('fs').writeFileSync(tempCache[1], buffer)
  return tempCache;
}

const defaultOptions = {}

const applyTransform = (p, t, state, value, calleeName, moduleString) => {
  const ext = extname(value)
  if (ext !== '.py' && ext !== '.pyj') return
  const options = Object.assign({}, defaultOptions, state.opts)
  const rootPath = state.file.opts.sourceRoot || process.cwd()
  const scriptDirectory = dirname(resolve(state.file.opts.filename))
  const filePath = resolve(scriptDirectory, value)
  const fullPath = filePath
  const [temp, tempFile] = getTemp()
  const tempPath = temp.openSync({suffix: '.js'}).path
  require('child_process').execSync(process.execPath + ' ' + join(__dirname, 'node_modules/rapydscript-ng/bin/rapydscript') + ' compile -m ' + fullPath + ' -o ' + tempPath)
  bufferLength -= 2
  require('fs').truncateSync(tempFile, bufferLength)
  const buffer = Buffer.from('"' + fullPath + '": (module, exports) => ' + require('fs').readFileSync(tempPath).toString().slice(0, -1) + ',\n}')
  bufferLength += buffer.length
  require('fs').appendFileSync(tempFile, buffer)
  require('fs').writeFileSync(tempPath, 'require("' + tempFile + '")["' + fullPath + '"](module, module.exports)')
  moduleString.replaceWith(t.StringLiteral(tempPath))
}

function transformImportsInline ({ types: t }) {
  return {
    visitor: {
      ImportDeclaration (p, state) {
        applyTransform(p, t, state, p.node.source.value, 'import', p.node.source)
      },
      CallExpression (p, state) {
        const callee = p.get('callee')
        if (!callee.isIdentifier() || !callee.equals('name', 'require')) {
          return
        }

        const arg = p.get('arguments')[0]
        if (!arg || !arg.isStringLiteral()) {
          return
        }

        applyTransform(p, t, state, arg.node.value, 'require', arg)
      }
    }
  }
}

module.exports = transformImportsInline
module.exports.transformImportsInline = transformImportsInline