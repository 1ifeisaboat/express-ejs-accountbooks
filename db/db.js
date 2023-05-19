const { default: mongoose } = require("mongoose");
const { DBHOST, DBNAME, DBPORT } = require('../config/config')
/**
 * 
 * @param {*} success 
 * @param {*} error 
 */
module.exports = function (success, error) {
    if (typeof error !== 'function') {
        error = () => {
            console.log('数据库连接失败')
        }
    }
    mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`)
    mongoose.connection.once('open', () => {
        success()
    })
    mongoose.connection.on('error', () => {
        error()
    })
    mongoose.connection.on('close', () => {
        console.log('关闭成功')
    })
}


