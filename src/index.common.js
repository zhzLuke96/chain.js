import chain from "./chain"

import std from "./extends/std"
import http from "./extends/http"
import dom from "./extends/dom"
import kit from "./tools"

const {NewChain,Chain} = chain

export default {
    NewChain,
    Chain,
    ex:{
        std,
        http,
        dom,
    },
    kit
}
