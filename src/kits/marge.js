import chain from "../chain"
const {
    NewChain
} = chain
const arrify = o => Array.prototype.slice.call(o)
export default function (...chains) {
    if (chains.length == 0) return
    if (chains.length == 1) return chains[0]

    let nxt_arr = {
        length: 0
    }
    let allResolve = null
    let autoResolve = () => nxt_arr.length == chains.length ? allResolve() : void 0;
    let ret_chain = NewChain().do(function (_, resolve) {
        allResolve = () => {
            resolve(true, arrify(nxt_arr))
            nxt_arr = {length: 0}
        }
    })
    chains.forEach((oneChain, idx) => {
        oneChain.doit(ctx => {
            if (typeof nxt_arr[idx] == "undefined") nxt_arr.length += 1
            nxt_arr[idx] = ctx
            autoResolve()
        })
    })
    return ret_chain
}