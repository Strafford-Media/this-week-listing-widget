import assert from 'node:assert'
import { test } from 'node:test'

import { trigram, trigramSimilarity, wordSimilarity } from '../src/utils/pg_trgm'

test('produce correct trigrams', () => {
  const expected = ['hel', 'ell', 'llo', 'lo ', 'o w', ' wo', 'wor', 'orl', 'rld']
  const actual = trigram('hello world')

  assert(expected.length === actual.length)
  assert.deepStrictEqual(new Set(actual), new Set(expected))
})

test('calculate correct similarity', () => {
  assert.equal(trigramSimilarity('hello world', 'hello world'), 1)
  assert.equal(trigramSimilarity('hello', 'hello world'), 0.5)
  assert.equal(trigramSimilarity('world', 'hello world'), 0.5)

  assert.equal(Number(trigramSimilarity('hell', 'hello world').toPrecision(5)), 0.30769)
})

// test('calculate correct word similarity', () => {
//   assert.equal(wordSimilarity('hell', 'hello world'), 0.8)
// })
