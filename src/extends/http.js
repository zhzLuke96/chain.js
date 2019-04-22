function GetXhr(){
    var xhr=null;
    if(XMLHttpRequest){
        xhr=new XMLHttpRequest();
    }else{
        xhr=new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xhr;
}

export default{
    get(cb){
        return function(url,resolve){
            if(cb){
                this.__ref.opts.push(
                    function(ctx,resolve){
                        let res = cb.call(this,ctx,resolve);
                        if(res)this.ctx = res
                        resolve()
                    }
                )
            }
            const xhr = GetXhr();
            xhr.open("GET", url);
            xhr.onload = () => resolve(false, xhr.responseText);
            xhr.onerror = () => this.__ref.crash(this, xhr.statusText)
            xhr.send(null);
        }
    },
    post(data,cb){
        return function(url,resolve){
            if(cb){
                this.__ref.opts.push(
                    function(ctx,resolve){
                        let res = cb.call(this,ctx,resolve);
                        if(res)this.ctx = res
                        resolve()
                    }
                )
            }
            const xhr = GetXhr();
            xhr.open("POST", url);
            xhr.onload = () => resolve(false, xhr.responseText);
            xhr.onerror = () => this.__ref.crash(this, xhr.statusText);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset-UTF-8");
            xhr.send(data);
        }
    }
}