// const Arrify = o => Array.prototype.slice.call(o);
export default {
    css(text) {
        return ($dom, resolve) => {
            $dom.style.cssText += text;
            resolve();
        };
    },
    html(text) {
        return ($dom, resolve) => {
            $dom.innerHTML = text;
            resolve();
        };
    },
    bindEv(type) {
        return function ($dom, resolve) {
            $dom.addEventListener(type, ev => {
                this.ctx = ev;
                resolve(true);
            });
        };
    }
}