// const Arrify = o => Array.prototype.slice.call(o);
const $ = (q, parent) => document.querySelector.call(parent || document, q)
const $style = (dom, pseudo) => getComputedStyle ? getComputedStyle(dom, pseudo) : {}

function setCss(dom, conf) {
    if (typeof conf == typeof "") {
        dom.style.cssText += conf;
    } else {
        for (const key in conf) {
            if (conf.hasOwnProperty(key)) {
                dom.style[key] = conf[key];
            }
        }
    }
}

export default {
    css(conf) {
        return ($dom, resolve) => {
            setCss($dom, conf)
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
    },
    toogle() {
        const onShow = dom => $style(dom).display != "none";
        let orig = null;
        return function ($dom, resolve) {
            if (onShow($dom)) {
                orig = $style($dom).display
                $dom.style.display = "none"
            } else {
                $dom.style.display = orig || "unset"
            }
            resolve()
        }
    },
    onParent(onnode) {
        return function ($dom, resolve) {
            this.ctx = onnode ? $dom.parentNode : $dom.parentElement
            resolve()
        }
    },
    onChildren(q) {
        return function ($dom, resolve) {
            this.ctx = $(q || "*", $dom)
            resolve()
        }
    },
    transit(prop, to, conf) {
        let {
            from,
            time,
            delay,
            timing
        } = conf || {}
        const t2d = t => t / 1000 + "s"
        time = time || 300
        return function ($dom, resolve) {
            from && setCss($dom, {
                [prop]: from
            })
            setCss($dom, {
                "transition-duration": t2d(time),
                "transition-delay": delay ? t2d(delay) : "",
                "transition-timing-function": timing || "linear"
            })
            if (typeof to != "undefined") {
                setCss($dom, {
                    [prop]: to
                })
            }
            // animotion over
            setTimeout(() => {
                // clear
                setCss($dom, {
                    "transition-duration": "",
                    "transition-delay": "",
                    "transition-timing-function": ""
                })
                resolve()
            }, time + 50)
        }
    }
}