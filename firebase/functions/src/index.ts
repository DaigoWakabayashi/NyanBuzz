import * as functions from 'firebase-functions'
import TwitterApi from 'twitter-api-v2'

// APIクライアントの作成（https://github.com/plhery/node-twitter-api-v2/blob/HEAD/doc/basics.md#client-basics）
const client = new TwitterApi(functions.config().twitter.bearer_token)

export const searchTweets = functions
  .region('asia-northeast1')
  .pubsub.schedule('every 15 minutes from 0:00 to 23:59')
  .timeZone('Asia/Tokyo')
  .onRun(async (context) => {
    try {
      console.log('This function is running')
      // // 直近7日間のツイートを検索する（https://github.com/plhery/node-twitter-api-v2/blob/HEAD/doc/v2.md#search-tweets-recent）
      // const catTweets = await client.v2.search('ねこ', {
      //   'media.fields': 'url',
      //   max_results: 100,
      // })
      // for await (const tweet of catTweets) {
      //   console.log(`Tweet %j`, tweet)
      // }
      return null
    } catch (error) {
      console.log('エラー :', error)
      return null
    }
  })
