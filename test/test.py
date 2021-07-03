def gua_sebuah_fungsi():
    print("gua dicall nih dari rapydscript")
    print('satu lagi')
    console.log(require('./test2.py'))
    console.log(require('./test2.js'))
    return 'gua sebuah string dari rapydscript, mungkin gua dicall di js hehe'

@async
def do_something_async():
    dirs = await [1, 2, 3] #require('fs').promises.readdir('./')
    return dirs

do_something_async().then(console.log)

module.exports = gua_sebuah_fungsi()
