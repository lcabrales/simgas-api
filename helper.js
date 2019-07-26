function getResponseObject(data, resultCode, resultMessage) {
    return {
        "Data": data,
        "Result": {
            "Code": resultCode,
            "Message": resultMessage
        }
    }
}

module.exports = {
    getResponseObject
}