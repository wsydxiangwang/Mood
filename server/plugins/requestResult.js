/**
 * 请求结果
 * @param {Number} status 状态码
 * @param {All} data 数据/信息
 */
function requestResult(status, data){
    if(status == 1){
        return {
            status,
            message: 'success',
            body: data
        }
    }else{
        return {
            status,
            message: 'error',
            body: data
        }
    }
}

module.exports = requestResult