# koa1-safe-redirect

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]
[![npm download month][download-month-image]][download-url]


[npm-image]: https://img.shields.io/npm/v/koa1-safe-redirect.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa1-safe-redirect
[travis-image]: https://img.shields.io/travis/forthedamn/koa1-safe-redirect.svg?style=flat-square
[travis-url]: https://travis-ci.org/forthedamn/koa1-safe-redirect
[codecov-image]: https://codecov.io/gh/forthedamn/koa1-safe-redirect/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/forthedamn/koa1-safe-redirect
[download-image]: https://img.shields.io/npm/dt/koa1-safe-redirect.svg
[download-url]: https://npmjs.org/package/koa1-safe-redirect
[download-month-image]: https://img.shields.io/npm/dm/koa1-safe-redirect.svg
[download-url]: https://npmjs.org/package/koa1-safe-redirect


safe redirect middleware for koa 1.x

---

## how to use

### 1. install

```
npm install koa1-safe-redirect --save
```
### 2. config url white list

```
// ./config/default.js

module.exports = {
  urlWhiteList: [
    /**
     * allow the hostname end with 'github.com'
     * like 'https://github.com/**'
     */
    /github\.com$/
  ]
}
```

### 3. use as middleware

```
const Koa = require('koa');
const safeRedirect = require('koa1-safe-redirect')('urlWhiteList');

const app = new Koa();
app
  .use(safeRedirect)
  .use(function* (next) {
  // will get 403
  ctx.redirect('https://www.test.com');
  return yield next;
});

```

---


## API

### white url strategy

Safe redirect get white list from ./config/{NODE_ENV}.js,same strategy with [node-config](https://github.com/lorenwest/node-config)

If config whitelist is empty or not an array,safe redirect will do nothing

#### RegExp

```
module.exports = {
  urlWhiteList: [
    /**
     * allow the hostname end with 'github.com'
     * like 'https://xxx.github.com/**'
     */
    /github\.com$/
  ]
}
```

#### String

```
module.exports = {
  urlWhiteList: [
    /**
     * only allow the hostname equal 'github.com'
     * like 'https://github.com/**'
     */
    'github.com'
  ]
}
```



### config name


#### use default

Default config name is 'whiteList'

```
// 1. config
module.exports = {
  'whiteList': [
    ...
  ]
}

// 2. init middleware
const safeRedirect = require('koa1-safe-redirect')();
```

#### custom

```
// 1. config
module.exports = {
  'xxx': [
    ...
  ]
}

// 2. init middleware
const safeRedirect = require('koa1-safe-redirect')('xxx');
```

