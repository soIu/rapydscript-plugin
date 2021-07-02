def gua_sebuah_fungsi():
    print("gua dicall nih dari rapydscript")
    print('satu lagi')
    console.log(require('./test2.py'))
    console.log(require('./test2.js'))
    return 'gua sebuah string dari rapydscript, mungkin gua dicall di js hehe'

module.exports = gua_sebuah_fungsi()
