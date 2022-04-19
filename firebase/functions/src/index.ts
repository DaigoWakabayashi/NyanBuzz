import * as firebaseAdmin from 'firebase-admin'
import * as functions from 'firebase-functions'
import TwitterApi from 'twitter-api-v2'

// Firebaseプロジェクトの初期化
firebaseAdmin.initializeApp(functions.config().firebase)

/// Firestore（AdminSDK）
const db = firebaseAdmin.firestore()

/// APIクライアントの作成（https://github.com/plhery/node-twitter-api-v2/blob/HEAD/doc/basics.md#client-basics）
const client = new TwitterApi({
  appKey: functions.config().twitter.app_key,
  appSecret: functions.config().twitter.app_secret,
})

export const searchTweets = functions
  .region('asia-northeast1')
  .pubsub.schedule('every 15 minutes from 0:00 to 23:59')
  .timeZone('Asia/Tokyo')
  .onRun(async (context) => {
    console.log('============ start ============')
    try {
      // クエリ条件：
      // - 日本語
      // - 画像 or 動画付き
      // - 最低 500 いいね
      // - (ねこ OR 猫 OR ネコ OR ﾈｺ OR にゃんこ OR ニャンコ OR ﾆｬﾝｺ) を含む
      const response = await client.v1.get('search/tweets.json', {
        q: 'lang:ja filter:media min_faves:500 ねこ OR 猫 OR ネコ OR ﾈｺ OR にゃんこ OR ニャンコ OR ﾆｬﾝｺ',
        max_results: 100,
        tweet_mode: 'extended',
      })
      const batch = db.batch()
      for (const tweet of response.statuses) {
        if (tweet.possibly_sensitive) {
          // センシティブなツイート
          console.log(
            `センシティブなTweet${response.statuses.indexOf(tweet)} : %j`,
            tweet
          )
        } else {
          // 通常のツイート
          const tweetDoc = db.collection('tweets').doc(tweet.id_str)
          batch.set(
            tweetDoc,
            {
              id: tweet.id,
              id_str: tweet.id_str,
              name: tweet.user.name,
              screen_name: tweet.user.screen_name,
              profile_image_url_https: tweet.user.profile_image_url_https,
              created_at: tweet.created_at,
              favorite_count: tweet.favorite_count,
              retweet_count: tweet.retweet_count,
              images: tweet.extended_entities.media,
              text: tweet.full_text.replace(
                /https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+/g,
                ''
              ),
            },
            { merge: true }
          )
          console.log(`Tweet${response.statuses.indexOf(tweet)} : %j`, tweet)
        }
      }
      await batch.commit()
      console.log(`取得したツイート数 :`, response.statuses.length)
      return console.log('============ end ============')
    } catch (error) {
      console.log('エラーが発生しました %j', error)
      console.error(error)
      return console.log('============ end ============')
    }
  })
