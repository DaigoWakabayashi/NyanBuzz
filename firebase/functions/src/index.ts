import * as firebaseAdmin from 'firebase-admin'
import * as functions from 'firebase-functions'
import TwitterApi from 'twitter-api-v2'

// Firebaseプロジェクトの初期化
firebaseAdmin.initializeApp(functions.config().firebase)

/// Firestore（AdminSDK）
const db = firebaseAdmin.firestore()

/// APIクライアントの作成（https://github.com/plhery/node-twitter-api-v2/blob/HEAD/doc/basics.md#client-basics）
const client = new TwitterApi(functions.config().twitter.bearer_token)

export const searchTweets = functions
  .region('asia-northeast1')
  .pubsub.schedule('every 15 minutes from 0:00 to 23:59')
  .timeZone('Asia/Tokyo')
  .onRun(async (context) => {
    try {
      console.log('This function is running')
      await db.collection('tweets').add({
        text: 'にゃんにゃん',
        createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      })
      // 直近7日間のツイートを検索する（https://github.com/plhery/node-twitter-api-v2/blob/HEAD/doc/v2.md#search-tweets-recent）
      const response = await client.v2.get('tweets/search/recent', {
        query: 'ねこ',
        max_results: 10,
      })
      const catTweets = response.data
      for (const tweet of catTweets) {
        console.log(`ツイート : %j`, tweet)
      }
      return null
    } catch (error) {
      console.log('エラー :', error)
      return null
    }
  })
