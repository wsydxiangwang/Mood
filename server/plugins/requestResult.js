/**
 * 请求结果
 * @param {string} status 状态
 * @param {Data} data 数据/信息
 */
 module.exports = function RequestResult({ status, data }) {
    if (status == 'success') {
        return {
            status: 1,
            message: 'success',
            body: data
        }
    } else {
        return {
            status: 2,
            message: 'error',
            body: data
        }
    }
}