import {Chainer,NewChain} from "../chain"
export default function NewPromise(fn) {
    const env = new Chainer();
    const inner = NewChain()
        .extend({
            then(cb) {
                return function (ctx, resolve) {
                    let res = cb(ctx);
                    if (res) this.ctx = res;
                    resolve();
                }
            },
            catch (cb) {
                return function (_, resolve) {
                    inner.__ref.error = cb;
                    resolve()
                }
            }
        })
    // async init
    setTimeout(
        () => fn(
            res => {
                env.ctx = res;
                inner.__ref.next(env);
            },
            err => {
                inner.__ref.crash(env, err);
                inner.__ref.complete(env);
            }
        ), 1);
    return inner;
}