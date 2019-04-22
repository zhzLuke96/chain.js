const default_delay = 500

export default {
    on(ctx) {
        return function (_, resolve) {
            this.ctx = ctx
            resolve()
        }
    },
    map(fn) {
        return function (ctx, resolve) {
            this.ctx = fn(ctx);
            resolve();
        };
    },
    defer(delay) {
        return function (_, resolve) {
            setTimeout(resolve, delay || default_delay)
        }
    },
    freq(delay) {
        return function (_, resolve) {
            setInterval(resolve, delay || default_delay)
        }
    },
    debounce(delay) {
        let timer;
        return function (_, resolve) {
            timer && clearTimeout(timer);
            timer = setTimeout(resolve, delay || default_delay);
        }
    },
    throttle(delay) {
        let start;
        return function (_, resolve) {
            let now = Date.now()
            if (!start) {
                start = now;
            }
            if (now - start >= (delay || default_delay)) {
                resolve();
                start = now;
            } else {
                this.__ref.complete(this)
            }
        }
    }
}