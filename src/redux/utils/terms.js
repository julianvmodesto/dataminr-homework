import common from 'common-words'
import twitter from 'twitter-text'

export const getTopTerms = (tweets: Array): Array => {
  // Ignore common words
  const ignoreWords = common.map((item) => item.word)
  ignoreWords.push('is', 're', 'are', 'where', 'https', 'don', 'sure')

  // Map of word counts
  const counts = new Map()

  tweets
    .map((tweet) => tweet.text)
    // Remove Twitter Entities from Tweet i.e. hashtags, mentions, URLs
    .map((text) => {
      const entities = twitter.extractEntitiesWithIndices(text)

      // Iterate the list of entities in reverse
      // in order to correctly splice out the indices
      for (let i = entities.length - 1; i >= 0; i--) {
        let [start, end] = entities[i].indices
        // Splice out text
        text = text.slice(0, start) + '' + text.slice(end)
      }
      return text
    })
    // Concat text
    .reduce((a, b) => a + ' ' + b)
    // Match whole words
    .match(/[a-z]+|\d+/igm)
    .filter((word) => word.length > 1 && word !== 'RT' && !ignoreWords.includes(word.toLowerCase()))
    // Do word count
    .forEach((word) => {
      let count = counts.get(word) || 0
      counts.set(word, count + 1)
    })
  // Sort words by counts, descending
  let ret = Array.from(counts.entries()).map(([word, count]) => ({word, count}))
  ret.sort((a, b) => b.count - a.count)
  // Return only top 10 terms
  return ret.length > 10 ? ret.slice(0, 10) : ret
}
