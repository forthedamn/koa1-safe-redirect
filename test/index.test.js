require('jest');
const request = require('supertest');
const Koa = require('koa');
const redirect = require('../index')();
const config = require('config');

describe('this.redirect', () => {
  const configName = 'whiteList';
  const whiteListTemp = config[configName];
  afterEach(() => {
    config[configName] = whiteListTemp;
  });

  it('should get 302, without white list, when whitelist empty', (done) => {
    const app = new Koa();
    config[configName] = [];
    app
      .use(redirect)
      .use(function* (next) {
        const url = 'https://www.test.com';
        this.redirect(url);
        return yield next;
      });
    request(app.listen())
      .post('/')
      .expect(302, done);
  });

  it('should get 302, without white list, when whitelist is not array', (done) => {
    const app = new Koa();
    config[configName] = {};
    app
      .use(redirect)
      .use(function* (next) {
        const url = 'https://www.test.com';
        this.redirect(url);
        return yield next;
      });
    request(app.listen())
      .post('/')
      .expect(302, done);
  });

  it('should be safe redirect, and get 302', (done) => {
    const app = new Koa();
    app
      .use(redirect)
      .use(function* (next) {
        const url = undefined;
        this.redirect(url);
        expect(this.response.header.location).toEqual('/');
        expect(this.response.status).toEqual(302);
        return yield next;
      })
      .use(function* (next) {
        const url = '/get';
        this.redirect(url);
        expect(this.response.header.location).toEqual('/get');
        expect(this.response.status).toEqual(302);
        return yield next;
      })
      .use(function* (next) {
        const url = 'https://meituan.com';
        this.redirect(url);
        expect(this.response.header.location).toEqual(url);
        expect(this.response.status).toEqual(302);
        return yield next;
      })
      .use(function* (next) {
        const url = 'https://meituan.com';
        this.redirect('back', url);
        expect(this.response.header.location).toEqual(url);
        expect(this.response.status).toEqual(302);
        return yield next;
      })
      .use(function* (next) {
        const url = undefined;
        this.redirect('back', url);
        expect(this.response.header.location).toEqual('/');
        expect(this.response.status).toEqual(302);
        return yield next;
      })
      .use(function* (next) {
        const url = 'https://erp.sankuai.com';
        this.redirect(url);
        expect(this.response.header.location).toEqual('https://erp.sankuai.com');
        return yield next;
      });
    request(app.listen())
      .get('/')
      .expect(302, done);
  });

  it('should get 302 with Referrer', (done) => {
    const app = new Koa();
    app
      .use(redirect)
      .use(function* (next) {
        this.redirect('back');
        expect(this.response.header.location).toEqual('https://erp.sankuai.com');
        return yield next;
      });
    request(app.listen())
      .get('/')
      .set('Referrer', 'https://erp.sankuai.com')
      .expect(302, done);
  });

  it('should get 403', (done) => {
    const app = new Koa();
    app
      .use(redirect)
      .use(function* (next) {
        const url = 'https://www.test.com';
        this.redirect(url);
        expect(this.response.status).toEqual(403);
        return yield next;
      });
    request(app.listen())
      .post('/')
      .expect(403, done);
  });
});
