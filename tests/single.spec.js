const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const VueRouterInvokeWebpackPlugin = require('../core');
const { makeFile, removeFile } = require('./utils');
function testPlugin(options, expectVal, notExpectVal) {
  webpack({
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'tests')
      }
    },
    plugins: [
      new VueRouterInvokeWebpackPlugin(
        Object.assign({ routerDir: 'tests/singleT' }, options)
      )
    ]
  });
  if (expectVal || notExpectVal) {
    const isTs = options.language === 'typescript';
    let file = fs.readFileSync(
      `tests/singleT/.invoke/router.${isTs ? 'ts' : 'js'}`,
      'utf-8'
    );
    file = file.replace(/\s/g, '');
    if (expectVal) {
      // console.log(new RegExp(expectVal, 'gi'));
      expect(new RegExp(expectVal, 'gi').test(file)).toBeTruthy();
    } else {
      expect(new RegExp(notExpectVal, 'gi').test(file)).toBeFalsy();
    }
  }
}

describe('singleRoute', () => {
  it('hump name', () => {
    makeFile('singleT/Login/Index.vue');
    testPlugin(
      { dir: 'tests/singleT', alias: '@/singleT' },
      `name\\:\\'login\\',path\\:\\'\\/login\\'`
    );
    removeFile('singleT');
  });

  it('yakitori name', () => {
    makeFile('singleT/Login-Name/Index.vue');
    testPlugin(
      { dir: 'tests/singleT', alias: '@/singleT' },
      `name\\:\\'loginName\\',path\\:\\'\\/loginName\\'`
    );
    removeFile('singleT');
  });

  it('underlinename', () => {
    makeFile('singleT/Login_Name/Index.vue');
    testPlugin(
      { dir: 'tests/singleT', alias: '@/singleT' },
      `name\\:\\'loginName\\',path\\:\\'\\/loginName\\'`
    );
    removeFile('singleT');
  });

  it('lowercase name', () => {
    makeFile('singleT/login_name/index.vue');
    testPlugin(
      { dir: 'tests/singleT', alias: '@/singleT' },
      `name\\:\\'loginName\\',path\\:\\'\\/loginName\\'`
    );
    removeFile('singleT');
  });

  it('uppercase name', () => {
    makeFile('singleT/LOGIN_NAME/INDEX.vue');
    testPlugin(
      { dir: 'tests/singleT', alias: '@/singleT' },
      `name\\:\\'loginName\\',path\\:\\'\\/loginName\\'`
    );
    removeFile('singleT');
  });

  it('multiple', () => {
    makeFile('singleT/login_name/index.vue');
    makeFile('singleT/login_name/login_inner/index.vue');
    testPlugin(
      { dir: 'tests/singleT', alias: '@/singleT' },
      `(name\\:\\'loginName\\',path\\:\\'\\/loginName\\'|name\\:\\'loginName-loginInner\\',path\\:\\'\\/loginName\\/loginInner\\')`
    );
    removeFile('singleT');
  });
});