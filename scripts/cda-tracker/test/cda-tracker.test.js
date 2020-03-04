const { appendTrackingInfo } = require('../src/cda-tracker');
const { JSDOM } = require('jsdom');
const dom = new JSDOM();
const document = dom.window.document;

test('Link that doesn\'t match whitelist should not have tracking attached', () => {
  const a = document.createElement('a');
  a.href = "https://google.com/foo?bar=1";
  const config = {
    domains: ['docs.microsoft.com'],
    config: {
        event: "blog",
        channel: "",
        alias: 'antchu'
    }
  };

  appendTrackingInfo(config, [a]);

  expect(a.href).toBe('https://google.com/foo?bar=1');
});

test('Link that matches whitelist should have tracking attached', () => {
  const a = document.createElement('a');
  a.href = "https://docs.microsoft.com/foo";
  const config = {
    domains: ['docs.microsoft.com'],
    event: "foo",
    channel: "bar",
    alias: 'antchu'
  };

  appendTrackingInfo(config, [a]);

  expect(a.href).toBe('https://docs.microsoft.com/foo?WT.mc_id=foo-bar-antchu');
});

test('Link that matches whitelist and has existing query string should have tracking attached properly', () => {
  const a = document.createElement('a');
  a.href = "https://docs.microsoft.com/foo?bar=1&foo=2";
  const config = {
    domains: ['docs.microsoft.com'],
    event: "foo",
    channel: "bar",
    alias: 'antchu'
  };

  appendTrackingInfo(config, [a]);

  expect(a.href).toBe('https://docs.microsoft.com/foo?bar=1&foo=2&WT.mc_id=foo-bar-antchu');
});

test('Link that matches whitelist and has existing tracking should be left alone', () => {
  const a = document.createElement('a');
  a.href = "https://docs.microsoft.com/foo?WT.mc_id=1-2-3";
  const config = {
    domains: ['docs.microsoft.com'],
    event: "foo",
    channel: "bar",
    alias: 'antchu'
  };

  appendTrackingInfo(config, [a]);

  expect(a.href).toBe('https://docs.microsoft.com/foo?WT.mc_id=1-2-3');
});

test('Link that matches a regex in whitelist should have referrer query string attached', () => {
  const a = document.createElement('a');
  a.href = "https://docs.microsoft.com/foo";
  const config = {
    domains: [/.*\.microsoft\.com/],
    event: "foo",
    channel: "bar",
    alias: 'antchu'
  };

  appendTrackingInfo(config, [a]);

  expect(a.href).toBe('https://docs.microsoft.com/foo?WT.mc_id=foo-bar-antchu');
});

test('Link that has a hash should have code properly appended.', () => {
  const a = document.createElement('a');
  a.href = "https://docs.microsoft.com/foo#1234";
  const config = {
    domains: [/.*\.microsoft\.com/],
    event: "foo",
    channel: "bar",
    alias: 'antchu'
  };

  appendTrackingInfo(config, [a]);

  expect(a.href).toBe('https://docs.microsoft.com/foo?WT.mc_id=foo-bar-antchu#1234');
});