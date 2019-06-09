# 仕様

- 下記画像を参照

![Requirement](./memoma.PNG)

## 機能要件

- プロジェクトの作成時に三つのファイルを生成する。

    - プロジェクトディレクトリの生成を行い、配下にファイルを生成する

    - 生成されるファイル名の規則は以下の通り

```
# 実際のテキストファイル保管場所
.memoma/
    └ {{ :Project-Name }}/
        ├ {{ :Project-Name }}_memo.md
        ├ {{ :Project-Name }}_note.md
        └ {{ :Project-Name }}_todo.md

# テキストファイルを参照するための `.mmm` ファイルは自由に設定可能
```

- `.mmm`の構成

```
{
    "projectName": "",
    "filePath": ""
}
```

- 操作

    - 記述は `Markdown` ベース

    - `Ctrl` + `tab` で画面を切り替え可能

    - `Ctrl` + `s` で全ファイルを保存

    - `Ctrl` + `p` で `プレビュー <=> エディター` の toggle

- 追加予定

    - Export (to PDF, to Image, and more)

# 参考

- [メモの魔力](https://www.amazon.co.jp/dp/4344034082)

