/**
 * 请求结果 统一处理返回值
 */
function requestResult(data){
    if(data){
        return {
            status: 1,
            message: 'success',
            body: data
        }
    }else{
        return {
            status: 2,
            message: 'error',
            body: data
        }
    }
}

module.exports = requestResult