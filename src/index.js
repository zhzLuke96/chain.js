import index from "./index.common"
const $global = window ? window : global

function define(key, obj) {
    $global[key] = obj
}

define("chain", index)