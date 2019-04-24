function Chainer(ctx) {
    return {
        ctx: ctx,
        FLAG: {
            pending: false,
            done: false
        }
    }
}

function NewChain(ctx) {
    if (ctx) {
        return new Chain().outter().doit(function () {
            this.ctx = ctx
        })
    }
    return new Chain().outter();
}

function decoratedFuncs(decor, srcobj) {
    let ret = {};
    for (const key in srcobj) {
        if (srcobj.hasOwnProperty(key)) {
            const element = srcobj[key];
            ret[key] = (...args) => decor(element.apply(null, args));
        }
    }
    return ret;
}

class Chain {
    constructor() {
        this.opts = [];
        this.extend = {};
        this.error = null
        this.done = null
        setTimeout(() => this.next(), 0);
    }
    outter() {
        const self = this;
        let ret = {
            __ref: self,
            none(fn) {
                if (fn) {
                    fn(self.FLAG);
                }
                return Object.assign({}, self.extend, ret);
            },
            do(fn) {
                self.opts.push(fn);
                return this.none()
            },
            doit(fn) {
                self.opts.push(function (ctx, resolve) {
                    fn.call(this, ctx)
                    resolve()
                });
                return this.none()
            },
            resize(start, end) {
                if (!end) {
                    end = start
                    start = 0
                }
                self.opts = self.opts.slice(start, end)
                return this.none()
            },
            rollback(times) {
                times = times || 1
                for (let idx = 0; idx < times; idx++) {
                    self.opts.pop()
                }
                return this.none()
            },
            extend(o) {
                o = o || {};
                let innero = decoratedFuncs(
                    fn => {
                        self.opts.push(fn)
                        return this.none()
                    }, o);
                self.extend = Object.assign(self.extend, innero);
                return this.none()
            },
            error(fn) {
                self.error = function (err, ctx) {
                    fn.call(this, err, ctx);
                    self.complete(this)
                }
                return this.none()
            },
            onerror(fn) {
                self.error = fn
                return this.none()
            },
            ondone(fn) {
                self.done = fn
                return this.none()
            }
        };
        return ret;
    }
    next(env, cur) {
        env = env || Chainer();
        cur = cur || 0;
        if (env.FLAG.done) return
        if (cur >= this.opts.length) {
            this.complete(env)
            return
        }
        let curopt = this.opts[cur]

        if (!env.FLAG.pending && curopt) {
            env.__ref = this
            try {
                curopt.call(env, env.ctx,
                    (newflow, newCtx) => this.next(
                        newflow ? Chainer(newCtx || env.ctx) : env,
                        cur + 1
                    )
                );
            } catch (error) {
                this.crash(env, error)
            }
        }
    }
    crash(env, err) {
        env.FLAG.pending = true;
        if (this.error) {
            this.error.call(env, err, env.ctx);
        }
    }
    complete(env) {
        env.FLAG.done = true;
        if (this.done) {
            this.done.call(env, env.ctx);
        }
    }
}

export default {
    NewChain,
    Chain,
    Chainer
}