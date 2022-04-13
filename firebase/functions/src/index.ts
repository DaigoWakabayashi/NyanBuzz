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
  .pubsub.schedule('every 5 minutes from 0:00 to 23:59')
  .timeZone('Asia/Tokyo')
  .onRun(async (context) => {
    try {
      // 直近7日間のツイートを検索する（https://github.com/plhery/node-twitter-api-v2/blob/HEAD/doc/v2.md#search-tweets-recent）
      // クエリ条件：
      // - 日本語
      // - リツイートでない
      // - 引用リツイートではない
      // - リプライでない
      // - (ねこ OR 猫 OR ネコ OR ﾈｺ OR にゃんこ OR ニャンコ OR ﾆｬﾝｺ) を含む
      // - 画像つき
      const response = await client.v2.get('tweets/search/recent', {
        query:
          '(ねこ OR 猫 OR ネコ OR ﾈｺ OR にゃんこ OR ニャンコ OR ﾆｬﾝｺ) -is:retweet -is:reply -is:quote has:media lang:ja',
        max_results: 100,
        expansions: ['author_id'],
        'tweet.fields': ['created_at', 'public_metrics', 'possibly_sensitive'],
        'user.fields': ['profile_image_url'],
      })
      const catTweets = response.data
      for (const tweet of catTweets) {
        // ドキュメントIDをツイートIDと一致させることで、
        // 同一のツイートを取得した場合でも update 処理となる
        await db.collection('tweets').doc(tweet['id']).set(tweet)
        console.log(`ツイート ${catTweets.indexOf(tweet)} %j`, tweet)
      }
      return null
    } catch (error) {
      console.log('エラー :', error)
      return null
    }
  })
