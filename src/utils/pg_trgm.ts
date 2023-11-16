export function trigram(value: string) {
  const nGrams = new Set<string>()

  if (value === null || value === undefined) {
    return Array.from(nGrams)
  }

  let index = value.length - 2

  while (index--) {
    nGrams.add(value.slice(index, index + 3))
  }

  return Array.from(nGrams)
}

const convertString = (input = '') => {
  if (!input || !input.trim()) return ''
  return `  ${input
    .trim()
    .replace(/\s+/g, ' ') // replace multiple spaces w/ single spaces
    .replace(/\s/g, '  ')} ` // replace single spaces w/ double spaces
    .toLowerCase()
}

const generateTrigram = (input = '') => [
  ...new Set( // De-duplication
    trigram(convertString(input)) // Generating trigrams w/ prepared input
      .filter((trigramItem) => !/^[\p{Letter}\p{Mark}0-9]\s\s$/giu.test(trigramItem))
  ),
]

export const trigramSimilarity = (input1 = '', input2 = '') => {
  if (input1 && input1.trim() && input1 === input2) return 1

  const trigrams1 = generateTrigram(input1)
  const trigrams2 = generateTrigram(input2)

  // Total trigrams
  const total = [...new Set([...trigrams1, ...trigrams2])]
  // Trigrams both have in common
  const common = []
  trigrams1.forEach((trigramItem) => {
    if (trigrams2.includes(trigramItem)) common.push(trigramItem)
  })

  return total.length === 0 ? 0 : common.length / total.length
}

export const wordSimilarity = (word1: string, word2: string) => {
  // Function to generate trigrams from a word
  function generateTrigrams(word: string) {
    const trigrams = new Set()
    for (let i = 0; i < word.length - 2; i++) {
      trigrams.add(word.substring(i, i + 3))
    }
    return trigrams
  }

  // Calculate trigrams for each word
  const trigrams1 = generateTrigrams(word1.toLowerCase())
  const trigrams2 = generateTrigrams(word2.toLowerCase())

  // Calculate the intersection of trigrams
  const intersection = new Set([...trigrams1].filter((trigram) => trigrams2.has(trigram)))

  // Calculate the similarity score
  const similarity = intersection.size / (Math.sqrt(trigrams1.size) * Math.sqrt(trigrams2.size))

  return similarity
}
