/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const consola = require('consola')
const { generateKey } = require('ironfish-wasm-nodejs')

beforeAll(() => {
  // This causes the WASM to be initialized, which is 1 time 2 second cost for each test suite
  if (process.env.TEST_INIT_WASM) {
    generateKey()
  }
})

beforeEach(() => {
  consola.pause()
})
