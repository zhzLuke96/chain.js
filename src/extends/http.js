function GetXhr() {
    var xhr = null;
    if (XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xhr;
}

export default {
    get(cb) {
        cb = cb || (v => v)
        return function (url, resolve) {
            const xhr = GetXhr();
            xhr.open("GET", url);
            xhr.onload = () => resolve(true, cb(xhr.responseText));
            xhr.onerror = () => this.__ref.crash(this, xhr.statusText)
            xhr.send(null);
        }
    },
    post(data, cb) {
        cb = cb || (v => v)
        return function (url, resolve) {
            const xhr = GetXhr();
            xhr.open("POST", url);
            xhr.onload = () => resolve(true, cb(xhr.responseText));
            xhr.onerror = () => this.__ref.crash(this, xhr.statusText);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset-UTF-8");
            xhr.send(data);
        }
    }
}