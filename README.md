# chain.js
All actions can wrapped asynchronous chain calls.

# Build setup
```
# install dependencies
npm install

# development build
npm run dev

# development build with watch mode
npm run dev:w

# build for production with minification
npm run build
```

# work for what
come soon...

# Streams Pattern
come soon...

# example
simple
```js
const chainA = chain.NewChain([">> context <<",0])
                .extend(chain.ex.std)
                .doit(v => console.log(v))
                .map(v => v[0])
                .doit(v => console.log(v))
// request
const request = chain.NewChain("http://localhost:8080/api")
                .extend(chain.ex.http)
                .get(res => res.data)
                .onerror(err => console.warn(err))
                .doit(v => console.log("get value ==>",v))
```

# Custom Extension
## jquery-like
```js
const DOMEx = {
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
                // scope call
                resolve(true);
            });
        };
    }
}
function $$(query){
    const $dom = document.querySelector(query)
    return chain.NewChain($dom)
                .extend(DOMEx)
                .extend(chain.ex.std)
}
// usage
$$("body")
    .css("padding: 2rem;")
    .css("font-weight: bold;")
    .html("<p>All actions can wrapped asynchronous chain calls</p>")
    .bindEv("click")
    .doit(ev => {
        console.log(`click: X[${ev.clientX}] Y[${ev.clientY}]`)
        }
    )
    .map(ev => ev.target)
    .doit(dom => console.log(dom.innerHTML))
    .ondone(ctx => console.log("single chain call been done"))
```

## promise-like
```js
function NewPromise(fn) {
    const flower = new Flower();
    const inner = NewFlow();
        .extend({
            then(cb) {
                return function (ctx, reslove) {
                    let res = cb(ctx);
                    if (res) this.ctx = res;
                    reslove();
                }
            },
            catch (cb) {
                return function () {
                    inner.__ref.error = cb;
                }
            }
        })
    setTimeout(
        () => fn(
            res => {
                flower.ctx = res;
                inner.__ref.next(flower);
            },
            err => {
                inner.__ref.crash(flower, err);
                inner.__ref.complete(flower);
            }
        ), 1);
    return inner;
}

NewPromise((resolve, reject) => {
        setTimeout(
            () => resolve("promise"),
        1000);
        // onerr before resolve
        setTimeout(
            () => reject(new Error()),
        500);
    })
    .then(res => console.log(res))
    .catch(err => console.warn(err))
```

## ez debounce and throttle
```js
const bindFromEv = chain.NewChain()
                    .extend(chain.ex.std)
                    .extend(chain.ex.dom)
                    .on($("body"))
                    .bindEv("click")
                    .debounce(500)
                    .doit(ev => console.log(ev.clientX,ev.clientY))
```
extend source code
> `./src/extends/std.js`
```js
// ...
export default {
    // ...
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
    // ...
}
```

# LICENSE
GPL-3.0