## Functions

- 環境変数の取得

```
functions % firebase functions:config:get > .runtimeconfig.json
```

- Emulator の立ち上げ

```
functions % npm run serve
```

- 関数のデプロイ

```
functions % firebase deploy --only functions
```

- 関数の shell 実行

```
firebase % firebase functions:shell
firebase > searchTweets('')
```

- ポートの kill

```
% sudo lsof -i:8085
% kill [ポート番号]
```