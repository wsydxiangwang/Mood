/**
 * 
 * @param {*} pageNo 
 * @param {*} pageSize 
 * @param {*} query 
 */
async function getPage(pageNo, pageSize, query) {
    result = await Promise.all([
        db.count(query),
        db.find(query).skip((pageNo - 1)*pageSize).limit(pageSize)
    ]);
    return {
        count: result[0],
        list: result[1]
    };
}

module.exports = getPage