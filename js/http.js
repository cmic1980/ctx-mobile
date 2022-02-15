import authority from './authority.js'

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        var error = new Error(response.statusText)
        error.response = response
        throw error
    }
}


function buildResponseContext(response) {
    const context = {}
    context.ok = response.ok
    context.status = response.status
    context.statusText = response.statusText

    let contentType = response.headers.get("content-type")
    contentType = v.lowerCase(contentType)

    if (v.includes(contentType, "application/json")) {
        context.contentType = "json"
    } else {
        context.contentType = "text"
    }
    return context
}

function buildResponseBlobContext(response) {
    const context = {}
    context.ok = response.ok
    context.status = response.status
    context.statusText = response.statusText

    let contentType = response.headers.get("content-type")
    contentType = v.lowerCase(contentType)

    if (v.includes(contentType, "application/json")) {
        context.contentType = "json"
    } else if (v.includes(contentType, "application/octet-stream")) {
        context.contentType = "blob"
        let disposition = response.headers.get("content-disposition")
        if (disposition != null) {

            let params = disposition.split(";");
            let fileName = params[1];
            fileName = v.lowerCase(fileName)
            fileName = fileName.replace("filename=", "")
            context.fileName = fileName
        }
    } else {
        context.contentType = "text"
    }
    return context
}

function resultHandle(context, data, cb, err) {
    if (context.ok == true) {
        setTimeout(() => {
            cb(data, context)
        }, 100)
    } else {
        if (err != null) {
            // 不能处理异常 errHandle继续处理
            if (err(data, context)) {
                errHandle(data, context)
            }
        } else {
            errHandle(data, context)
        }

    }
}


export default {
    get(url, cb, data, err) {
        let getUtl = url
        let query = "";
        for (var key in data) {
            // &
            if (v.isEmpty(query) == false) {
                query = query + "&"
            }
            // key=1
            query += key + "=" + data[key]

        }

        if (v.isEmpty(query) == false) {
            getUtl = getUtl + "?" + query
        }

        let context = null
        fetch(getUtl, {
                'headers': {
                    'Authorization': authority.getToken()
                }
            })
            .then(function(response) {
                context = buildResponseContext(response)
                return response.text()
            })
            .then(function(text) {
                let data = null
                if (context.contentType == "json") {
                    data = JSON.parse(text)
                } else {
                    data = text
                }
                resultHandle(context, data, cb, err)
            })
            .catch(function(ex) {
                console.log('parsing failed', ex)
            })
    },

    post(url, cb, data, err) {
        let context = null
        const postData = JSON.stringify(data)
        fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authority.getToken()
                },
                body: postData
            })
            .then(function(response) {
                context = buildResponseContext(response)
                return response.text()
            })
            .then(function(text) {
                let data = null
                if (context.contentType == "json") {
                    data = JSON.parse(text)
                } else {
                    data = text
                }
                resultHandle(context, data, cb, err)
            })
            .catch(function(ex) {
                console.log('parsing failed', ex)
            })

    },
    downloadPost(url, cb, data, err) {
        let context = null
        const postData = JSON.stringify(data)
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authority.getToken()
            },
            body: postData,
            responseType: 'blob'
        }).then(response => {
            context = buildResponseBlobContext(response)
            return response.blob();
        }).then(blob => {
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = context.fileName;
            link.click();
            window.URL.revokeObjectURL(link.href);
            resultHandle(context, data, cb, err)
        }).catch(function(ex) {
            console.log('parsing failed', ex)
        })
    },
    getImageUrl(url, cb, data, err) {
        let context = null
        const postData = JSON.stringify(data)
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authority.getToken()
            },
            body: postData,
            responseType: 'blob'
        }).then(response => {
            context = buildResponseBlobContext(response)
            return response.blob();
        }).then(blob => {
            data.url = window.URL.createObjectURL(blob);
            resultHandle(context, data, cb, err)
        }).catch(function(ex) {
            console.log('parsing failed', ex)
        })
    },
    postFile(url, cb, data, err) {
        let context = null

        var formData = new FormData();
        formData.append('file', data);

        fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': authority.getToken()
                },
                body: formData
            })
            .then(function(response) {
                context = buildResponseContext(response)
                return response.text()
            })
            .then(function(text) {
                let data = null
                if (context.contentType == "json") {
                    data = JSON.parse(text)
                } else {
                    data = text
                }
                resultHandle(context, data, cb, err)
            })
            .catch(function(ex) {
                console.log('parsing failed', ex)
            })

    },
}