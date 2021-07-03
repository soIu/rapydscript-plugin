# babel-plugin-rapydscript
Babel plugin to load Python/RapydScript code

# Installation

```
npm install babel-plugin-rapydscript
```

Then add 'rapydscript' to your babel plugins wether it's on babelrc, babel.config.json or if you use a bundler usually they add directives for you to add babel plugins (if the bundler use babel or is configured to use babel as a loader).

# Example Usage

In any of your JS code, require a py file:

```js
//index.js

//Either ES6 import or CommonJS' require works, dynamic import is still on the work
import from_python from './test.py';
const same_object_from_python = require('./test.py');

console.log(from_python === same_object_from_python);
console.log(from_python);
```

And in your Python/RapydScript code:

```python
#test.py

def some_function():
    print('I log some string')
    return 'and return another string'
    
class SomeClass:
    some_class_property = [1, {}]
    another_property = 'could be anything'
    
    def __init__(self):
        self.some_object_property = 'not a class one'
    
module.exports = [some_function, SomeClass(), SomeClass.some_class_property, SomeClass().some_object_property, some_function()]
```

# Async/Await

Because we use Kovid Goyal's [fork](https://github.com/kovidgoyal/rapydscript-ng) of RapydScript (for stability and good support, and also baselib compatibility), it still doesn't support `async def` and `await` keyword natively. We implement a nice workaround that makes async/asynchronous as a decorator:

```python
@async #Or @asynchronous if your IDE complains about the syntax
def do_something_async():
    response = await fetch('/some/route')
    text = await response.text()
    returnt text
    
do_something_async().then(console.log)
```

`await` is still available as a keyword.
