/**
 * 请求结果
 * @param {Data} err 错误结果
 * @param {Data} doc 成功数据/信息
 */
function requestResult(err, doc){
    if (doc) {
        return {
            status: 1,
            message: 'success',
            body: doc
        }
    } else {
        return {
            status: 2,
            message: 'error',
            body: err
        }
    }
}

module.exports = requestResult