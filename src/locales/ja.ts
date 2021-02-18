export default {
  back: '戻る',
  ordinals: [
    '1番目',
    '2番目',
    '3番目',
    '4番目',
    '5番目',
    '6番目',
    '7番目',
    '8番目',
    '9番目',
    '10番目',
    '11番目',
    '12番目',
  ],
  account_setup: {
    welcome: {
      title: 'Heliumへ\nようこそ',
      subtitle:
        'Hotspotを主催して新しい暗号通貨、<b><purple>$HNT</purple></b>を\n獲得し、\nThe People’s Networkを構築しましょう。',
      create_account: 'アカウントを開設',
      import_account: '既存のアカウントをインポート',
    },
    warning: {
      title: '安全なアカウントを\n作成しています。',
      subtitle:
        'Heliumアカウントは\n<b><purple>12個の一意の単語</purple></b>によって保護されています。\nこれは、サインイン時やアカウントの回復時に\nパスワードとして機能します。',
      generate: '12個の単語を生成',
    },
    generating: '12個の単語を生成しています...',
    passphrase: {
      title: '12個の単語を使用した\nパスワード',
      subtitle:
        'これらの<b>12個の単語はすべて順に\nメモしておく</b>必要があります。\n\n<red>Heliumはこれらの単語を回復できません。</red>',
      warning: 'Heliumはこれらの単語を回復できません',
      next: 'これらの単語をメモしました',
    },
    confirm: {
      title: '単語を\n確認',
      subtitle:
        '以下のどれがあなたの<b><purple>{{ordinal}}単語ですか？</purple></b>',
      forgot: '単語を忘れた場合',
      failed: {
        title: '申し訳ありません...',
        subtitle_1: '再入力されたシードフレーズが正しくありません。',
        subtitle_2: 'もう一度実行してください。',
        try_again: 'もう一度実行してください',
      },
    },
    create_pin: {
      title: 'PINコードを設定',
      subtitle: '最後にPINコードを設定して、アカウントの保護を強化します。',
    },
    confirm_pin: {
      title: 'PINを再入力してください',
      subtitle: 'PINを再入力してください',
    },
    enable_notifications: {
      title: '通知を有効化',
      subtitle:
        'アカウントやHotspotに重要な更新が発生した場合に通知が届きます。',
      mining: 'Hotspotはマイニングツールです',
      later: '後で設定する',
    },
  },
  learn: {
    title: 'HNTを獲得する\n方法は？',
    slides: [
      {
        topTitle: 'ビーコンをリッスンする',
        topBody: 'Hotspotは近隣にあるHotspotのビーコンをリッスンします',
        bottomTitle: 'ビーコンの仕組みは？',
        bottomBody:
          'ビーコンはHotspotによって送信される特別なパケットです。隣接する他のHotspotはこれらのパケットをリッスンできます。\n\nこの信号により、ネットワークはどのHotspotがどのHotspotの受信範囲内に存在するのかを特定できます。隣接するHotspotは「ウィットネス」と呼ばれます。あなたのビーコンをリッスンするHotspotは、ウィットネスリストに追加されます。',
      },
      {
        topTitle: 'ビーコンをリッスンする',
        topBody: 'Hotspotは近隣にあるHotspotのビーコンをリッスンします',
        bottomTitle: 'ビーコンの仕組みは？',
        bottomBody:
          'ビーコンはHotspotによって送信される特別なパケットです。隣接する他のHotspotはこれらのパケットをリッスンできます。\n\nこの信号により、ネットワークはどのHotspotがどのHotspotの受信範囲内に存在するのかを特定できます。隣接するHotspotは「ウィットネス」と呼ばれます。あなたのビーコンをリッスンするHotspotは、ウィットネスリストに追加されます。',
      },
      {
        topTitle: 'ビーコンをリッスンする',
        topBody: 'Hotspotは近隣にあるHotspotのビーコンをリッスンします',
        bottomTitle: 'ビーコンの仕組みは？',
        bottomBody:
          'ビーコンはHotspotによって送信される特別なパケットです。隣接する他のHotspotはこれらのパケットをリッスンできます。\n\nこの信号により、ネットワークはどのHotspotがどのHotspotの受信範囲内に存在するのかを特定できます。隣接するHotspotは「ウィットネス」と呼ばれます。あなたのビーコンをリッスンするHotspotは、ウィットネスリストに追加されます。',
      },
    ],
    next: 'ガイドを読みました',
  },
  generic: {
    done: '完了',
    understand: '理解しました',
    blocks: 'ブロック',
    active: 'アクティブ',
    skip: 'スキップ',
    next: '次へ',
    need_help: 'サポートが必要な場合',
    scan_again: '再スキャン',
    submit: '申請',
    balance: '残高',
    continue: '続行',
    skip_for_now: '今はスキップ',
    go_to_account: '「アカウント」に移動',
    go_to_settings: '「設定」に移動',
    hotspot: 'Hotspot',
    location: '位置情報',
    challenger: 'Challenger',
    learn_more: '詳細',
    cancel: 'キャンセル',
    ok: 'OK',
    unknown: '不明',
    online: 'オンライン',
    offline: 'オフライン',
    fee: '料金',
    to: '終了日',
    from: '開始日',
    new: '新規',
    save: '保存',
    connect: '接続',
    go_back: '戻る',
    forget: '破棄',
    error: 'エラー',
    loading: '読み込んでいます...',
  },
  hotspot_setup: {
    selection: {
      title: 'Hotspotを\n選択してください。',
      subtitle: 'どのような種類のHotspotを\n追加しますか？',
      option_one: 'Helium\nHotspot',
      option_two: 'RAK\nHotspot Miner',
      third_party_header: 'その他のHotspot',
      helium_edition: 'Helium Network向け',
      fine_print:
        'RAK Hotspot MinerにはRAKによって事前に読み込まれた特別なファームウェアがあります。続行する前に、ハードウェアがRAK Hotspot Minerであることを再確認してください。',
    },
    start: {
      title: 'Hotspotを設定',
      subtitle:
        'Hotspotを使用すると、The People’s Networkを構築してHNTを獲得できます。',
      info: 'その仕組みは？',
      next: '開始する',
      not_now: '今はやめておく',
    },
    education: {
      title: 'Hotspotを\n配置しています。',
      cards: [
        {
          title: '遮蔽物を排除する',
          subtitle:
            'Hotspotは、他のHotspotから300メートル以上離れていて周囲に遮蔽物のない環境に配置する必要があります。 ',
        },
        {
          title: '閉じた場所に配置しない',
          subtitle:
            'Hotspotはナイトテーブルや本棚にしまい込まないようにします。窓の横などに配置してください。',
        },
        {
          title: '建物で信号がブロックされないようにする',
          subtitle:
            '近くの建物が近隣のデバイスの信号をブロックし、Hotspotが信号を受信しにくくなる場合があります。',
        },
        {
          title: '網戸の近くに配置しない',
          subtitle:
            'Hotspotは金属網から離して配置するようにしてください。金属網は無線信号を著しくブロックする場合があります。',
        },
      ],
      next: 'ガイドを読みました',
    },
    diagnostics: {
      title: '診断',
      p_1:
        '<b><white>診断サポートにより、HeliumはHotspotの問題を安全な方法で特定できます。</white></b>\n\nHeliumが秘密キーにアクセスすることはありません。お使いのHotspotにのみアクセスし、ネットワーク上の他のデバイスにはアクセスしません。\n\n診断サポートをオプトアウトする場合は、Hotspotの購入時に使用したメールアドレスを使用して、<purple><b>support@helium.com</b></purple>までメールでご連絡ください。',
    },
    power: {
      title: '電源オン',
      next: '電源が入っています',
      subtitle_1: 'アンテナを取り付け、付属の電源アダプターに差し込みます。',
      rak_subtitle_1:
        '付属の電源アダプターを窓の近くにあるコンセントに差し込みます。',
      subtitle_2: 'Hotspotが起動し、準備が完了するとライトが緑色になります。',
      rak_subtitle_2:
        'RAK Hotspot Minerの電源がオンになると、赤いLEDライトが点きます。',
    },
    pair: {
      title: 'Bluetooth',
      subtitle_1: 'Hotspotの黒いボタンを押します。ライトが青に変わります。',
      rak_subtitle_1: 'RAK Hotspot Minerにペアリングボタンはありません。',
      subtitle_2:
        '続行する前に携帯電話のBluetoothがオンになっていることを確認します',
      rak_subtitle_2:
        'RAK Hotspot Minerの電源がオンになると、自動的にBluetoothが5分間有効になります。\n\nHotspotが完全に起動するまでに最大で1分かかる場合があります。\n\n「次へ」を押してスキャンします。',
      alert_no_permissions: {
        title: 'Bluetoothのアクセスを許可',
        body:
          'HeliumでBluetoothを使用するにはアクセス許可が必要です。Bluetoothのアクセス許可は「設定」で有効にできます。',
      },
      alert_ble_off: {
        title: 'Bluetoothを有効化',
        body:
          'ペアリングを開始するには、Bluetoothをオンにします。登録が完了するまでBluetoothをオンのままにします。',
      },
      scan: 'Hotspotをスキャン',
    },
    ble_scan: {
      title: 'Hotspotをスキャンしています',
      cancel: 'スキャンをキャンセル',
      connecting: '{{hotspotName}}に接続しています',
    },
    ble_select: {
      hotspots_found: '{{count}}個のHotspotが見つかりました。',
      hotspots_found_plural: '{{count}}個のHotspotが見つかりました',
      subtitle: 'Hotspotを選択して続行します。',
    },
    ble_error: {
      title: 'Hotspotが見つかりませんでした',
      enablePairing: 'ペアリングモードを有効化',
      pairingInstructions:
        'Bluetoothを有効にするには、製造元のマニュアルを参照してください',
    },
    wifi_scan: {
      title: 'Wi-Fi',
      settings_title: 'Wi-Fi設定',
      subtitle: 'Hotspotを接続するWi-Fiネットワークを選択します。',
      ethernet: '代わりにイーサネットを使用する',
      connection_failed: '接続に失敗しました。もう一度実行してください',
      disconnect_failed: '切断に失敗しました。もう一度実行してください',
      connected:
        'Hotspotは<green>オンライン</green>になっており、 %{network}に接続されています。',
      scan_fail_subtitle:
        'Hotspotで近隣のWi-Fiネットワークが検出できませんでした。ルーターがオンラインになっていて近隣に設置されていることを確認してください。',
      tip:
        '<blue>Wi-Fiが非表示に設定されている</blue>かどうかを確認しましたか？',
      saved_networks: '構成済みネットワーク',
      available_networks: '利用可能なネットワーク',
      disconnect_help:
        'パスワードを更新するか、新しいネットワークに接続するには、まず古いネットワークを破棄してください。',
      disconnect: 'ネットワークを破棄',
    },
    disconnect_dialog: {
      title: 'ネットワークを破棄しますか？',
      body: 'Hotspotは{{wifiName}}に自動接続しなくなります。',
    },
    wifi_password: {
      join_title: 'パスワードを入力',
      update_title: 'Wi-Fiを更新',
      message:
        'Hotspotは現在、このネットワークに接続しています。パスワードを変更すると、Hotspotがオフラインになる場合があります。',
      error_title: '無効なパスワード',
      subtitle:
        'Wi-Fiの資格情報を入力し、Hotspotをこのネットワークに接続してください。',
      placeholder: 'パスワード',
      show_password: 'パスワードを表示',
      hide_password: 'パスワードを非表示',
      connecting: 'ネットワークに接続しています',
      forget: '破棄',
      forget_network: 'ネットワークを破棄',
      forget_alert_title: 'ネットワークを破棄しますか？',
      forget_alert_message:
        'このHotspotは、以下のものに自動接続しなくなります： ',
    },
    ethernet: {
      title: 'イーサネットを使用する',
      subtitle:
        'インターネットルーターで利用可能なアクティブなポートに、Hotspotを接続します。',
      secure: 'イーサネットケーブルをしっかりと接続してください',
      next: 'Hotspotは接続されています',
    },
    firmware_update: {
      title: '更新を利用できます',
      subtitle:
        '続行する前に、Hotspotのファームウェアを更新する必要があります。',
      current_version: '現在のバージョン',
      required_version: '必要なバージョン',
      explanation:
        'Hotspotは更新を自動的に確認します。これには10分程度かかる場合があります。プラグを差し込んだままにして、後でもう一度確認してください。',
      next: 'OK',
    },
    add_hotspot: {
      title: 'Hotspotを追加',
      subtitle:
        'Hotspotを追加する場合、信頼性を確認する必要があるため、少額の料金が発生します（支払いはData Creditsで行います）。',
      checking_status: 'Hotspotのステータスを確認しています...',
      already_added:
        'このHotspotはすでにウォレットに追加されています。次の画面に進み、その位置情報をアサートしてください。',
      not_owned:
        'このHotspotを所有していないため、ウォレットに追加することはできません。',
      label: '現在のHotspot追加料金（支払いはData Creditsで行います）',
      help_link: 'Data Creditとは',
      support_title: 'Data Creditとは',
      support_answer:
        'Helium Network経由でデータを送信するには、Data Creditsが必要です。',
      error:
        'Hotspotの追加を続行できません。HeliumからHotspotを購入した場合は、support@helium.comに連絡し、MACアドレス{{mac}}をお伝えください',
      back: 'Hotspotのペアリングに戻る',
      wait_error_title: 'もう一度実行してください',
      wait_error_body:
        'Hotspotマイナーが開始を待っています。数分後にもう一度実行してください。',
    },
    enable_location: {
      title: 'Hotspotの\n位置情報を設定',
      subtitle:
        'Hotspotの位置情報を設定する必要があります。これは携帯電話を使用して行うことができます。',
      p_1:
        'まず、当社が携帯電話の位置情報にアクセスするための許可をリクエストします。',
      settings_p_1:
        'Hotspotの位置情報を更新するために、当社は位置情報に関する追加のアクセス許可が必要になります。',
      settings_p_2:
        '下のボタンをタップし、「設定」に移動します。「位置情報」で「アプリの使用時」をタップします。',
      next: 'アクセス許可をリクエストする',
      cancel: '後で設定する',
    },
    location_fee: {
      title: '位置情報の設定料金',
      subtitle_free: '位置情報の設定料金（10ドル）は前払いされています。',
      subtitle_fee:
        '位置情報の設定料金として10ドル（DC）を支払い、この位置情報を確認する必要があります。',
      confirm_location:
        '選択した位置情報が正しいことを確認し、Hotspotを登録します。',
      pending_p_1:
        'Hotspotの「位置情報を確認」トランザクションが保留中のものがブロックチェーンに存在します。',
      pending_p_2:
        'Hotspotの位置情報を変更する場合は、前のトランザクションが完了してから行ってください。',
      balance: '残高：',
      fee: '料金：',
      no_funds: 'アカウントのHNTの残高が不足しています',
      calculating_text: 'HNTの量を計算しています',
      error_title: 'エラー',
      error_body:
        '料金データの読み込み中にエラーが発生しました。もう一度実行してください。',
      next: 'Hotspotを登録',
      fee_next: '料金の支払いとHotspotの登録',
    },
    location: {
      title: 'Hotspotの位置情報',
      next: '位置情報を設定',
    },
    progress: {
      title: 'Hotspotを登録しています',
      subtitle:
        'この処理には数分かかる場合があります。この画面は閉じてもかまいません。',
      next: 'ウォレットに移動',
    },
    error: {
      alertTitle: 'サーバーが応答できません',
      alertMessage:
        'サーバーへのリクエストがタイムアウトしたため、現在Hotspotを追加できません。\n\nsupport@helium.comに連絡し、MACアドレス %{mac}をお伝えください。',
    },
  },
  account_import: {
    word_entry: {
      title: '回復シードフレーズを\n入力してください',
      directions: '<b>{{ordinal}}</b>単語を入力してください',
      placeholder: '{{ordinal}}単語',
      subtitle: '回復シードフレーズは、大文字と小文字が区別されません',
    },
    confirm: {
      title: 'シードフレーズを確認',
      subtitle:
        '入力した12個の単語は以下のとおりです。必要に応じて、単語をタップして更新できます。',
      next: 'シードフレーズを申請',
    },
    complete: {
      title: 'アカウントを回復しています...',
      subtitle: 'これには少し時間がかかります。',
    },
    alert: {
      title: 'エラー',
      body: 'このシードフレーズはHeliumアカウントに対応していません',
    },
  },
  wallet: {
    title: 'ウォレット',
    copiedToClipboard: '{{address}}をクリップボードにコピーしました',
    share: '共有',
  },
  send: {
    title: {
      payment: 'HNTを送信',
      dcBurn: 'HNTをバーン',
      transfer: 'Hotspotでデータを転送',
    },
    available: '利用可能量：{{ amount }}',
    address: {
      label: '受信者のアドレス',
      label_transfer: '購入者のアドレス',
      placeholder: 'アドレスを入力...',
      seller: '販売者のアドレス',
    },
    amount: {
      label: '量（HNT）',
      label_transfer: 'リクエスト量（HNT）',
      placeholder: '0',
      placeholder_transfer: '（オプション）Hotspotの支払いをリクエスト...',
    },
    dcAmount: {
      label: 'DC換算数',
      placeholder: '0',
    },
    memo: {
      label: 'メモ',
      placeholder: 'メモを入力...（オプション）',
    },
    sendMax: '最大送信',
    button: {
      payment: 'HNTを送信',
      dcBurn: 'HNTをバーン',
      transfer_request: '転送リクエストを送信',
      transfer_complete: '転送を完了',
    },
    qrInfo: 'QR情報',
    error:
      'このトランザクションの申請中にエラーが発生しました。もう一度実行してください。',
    hotspot_label: 'Hotspot',
    last_activity: '最後に報告されたアクティビティ：{{activity}}',
  },
  more: {
    title: '設定',
    sections: {
      security: {
        title: 'セキュリティ',
        enablePin: 'PINを有効化',
        requirePin: 'PINを要求',
        resetPin: 'PINをリセット',
        requirePinForPayments: '支払い用のPINを要求',
        authIntervals: {
          immediately: '今すぐ',
          after_1_min: '1分後',
          after_5_min: '5分後',
          after_15_min: '15分後',
          after_1_hr: '1時間後',
          after_4_hr: '4時間後',
        },
        revealWords: '単語を表示',
      },
      learn: {
        title: '詳細',
        tokenEarnings: '獲得したトークン',
        hotspotPlacement: 'Hotspotの配置',
        support: 'サポート',
        troubleshooting: 'トラブルシューティング',
        joinDiscord: 'Helium Discordに参加',
      },
      account: {
        title: 'アカウント',
        language: '言語',
        units: '単位',
        signOut: 'サインアウト',
        signOutAlert: {
          title: '警告！',
          body:
            'これにより、このデバイスからすべてのアカウント情報が削除されます。アカウントとHotspotへのアクセスを復元するには、12個の単語で作成された回復シードフレーズを使用する必要があります。',
        },
      },
    },
  },
  auth: {
    title: 'PINを入力してください',
    error: 'PINが正しくありません',
    enter_current: '現在のPINを入力して続行してください',
  },
  hotspots: {
    new: {
      title: '新しいHotspotを追加',
      subtitle:
        'Hotspotを追加したばかりである場合は、しっかりと設置してください。ネットワークにHotspotが伝播するまでに少し時間がかかります。',
      setup: 'Hotspotを設定',
      explorer: 'グローバルHotspotエクスプローラー',
    },
    owned: {
      title: 'Hotspot',
      reward_summary:
        'Hotspotは過去24時間で{{hntAmount}}HNTをマイニングしました。',
      reward_summary_plural:
        '{{count}}個のHotspotは過去24時間で{{hntAmount}}HNTをマイニングしました。',
      your_hotspots: 'Hotspot',
    },
    empty: {
      body: 'まだHotspotを追加もフォローもしていません。',
    },
  },
  permissions: {
    location: {
      title: '位置情報のアクセス許可',
      message:
        'Bluetooth LEを検出するため、Heliumウォレットはあなたの位置情報にアクセスする必要があります。',
    },
  },
  time: {
    morning: '午前',
    evening: '夜間',
    afternoon: '午後',
    day_header: '適切な\n{{timeOfDay}}。',
  },
  notifications: {
    share: '共有',
    list: { title: 'Notifications' },
    none: {
      title: '通知は\nありません',
      subtitle:
        'ここではHotspotとThe People’s Networkに関するニュース、更新、アラートを入手できます。',
    },
  },
  transactions: {
    pending: '保留中',
    mining: 'マイニング報酬',
    sent: '送信済みHNT',
    burnHNT: 'HNTをバーン',
    received: '受信済みHNT',
    added: 'Hotspotがブロックチェーンに追加されました',
    location: '位置情報を確認',
    transfer: 'Hotspotのデータ転送',
    transferSell: 'Hotspotでデータを転送（販売）',
    transferBuy: 'Hotspotでデータを転送（購入）',
    view: '表示',
    filter: {
      all: 'すべてのアクティビティ',
      mining: 'マイニング報酬',
      payment: '支払いトランザクション',
      hotspot: 'Hotspotトランザクション',
      pending: '保留中トランザクション',
    },
    no_results: '結果はありません',
  },
  hotspot_settings: {
    title: 'Hotspot設定',
    pairing: {
      title: 'Hotspotのペアリングが要求されました',
      subtitle:
        'Helium Hotspotのボタンを押すか、RAK Hotspot Minerの電源を入れ直してください。',
      scan: 'Hotspotをスキャン',
    },
    transfer: {
      title: 'Hotspotでデータを転送',
      subtitle: 'Hotspotのデータを別のHeliumウォレットアカウントに転送します。',
      begin: 'Hotspotでデータの転送を開始',
    },
    diagnostics: {
      title: '診断レポート',
      no_hotspots: 'Hotspotが見つかりませんでした',
      scan_again: '再スキャン',
      generating_report: 'レポートを生成しています',
      p2p: 'Peer-to-Peer接続',
      no_connection: '接続がありません',
      outbound: '送信',
      outbound_help:
        'Hotspotがブロックチェーンのピアに接続できません。原因としては、ルーターに問題がある、インターネット接続がない、あるいは着信接続がファイアウォールでブロックされている可能性があります。',
      inbound: '受信',
      inbound_help:
        'ブロックチェーンのピアがHotspotに到達できません。原因としては、ルーターに問題がある、インターネット接続がない、あるいは着信接続がファイアウォールでブロックされている可能性があります。',
      activity: 'アクティビティ',
      blockchain_sync: 'ブロックチェーンの同期',
      synced: '{{percent}}同期されました',
      blockchain_height_help:
        'Hotspotを100%同期してからマイニングを開始する必要があります。これにはインターネットの速度に応じて数時間以上かかる場合があります。Hotspotの電源を入れたままインターネットに接続してください。',
      last_challenged: '最後のChallenge',
      last_challenged_help:
        '隣接するHotspotがあなたのHotspotの位置情報を確認できません。ほとんどの場合、無線信号が到達できない領域にアンテナが配置されていることが原因です（建物がブロックしている、アンテナが下を向いている、アンテナが屋内にあるなど）。',
      firmware: 'Hotspotファームウェア',
      hotspot_type: 'Hotspotの種類',
      app_version: 'アプリバージョン',
      wifi_mac: 'Wi-Fi MAC',
      eth_mac: 'イーサネットMAC',
      nat_type: 'NATの種類',
      ip: 'IPアドレス',
      report_generated: 'レポートが生成されました',
      send_to_support: 'サポートにレポートを送信',
      help_link: 'ソリューションをもっと読む',
      email_client_missing:
        '互換性のあるインストール済みのメールクライアントが見つかりませんでした',
      other_info: 'その他の情報',
    },
    wifi: {
      title: 'Wi-Fiネットワーク',
      connected_via: '接続方法',
      not_connected: '接続されていません',
      available_wifi: '利用可能なWi-Fiネットワーク',
      show_password: 'パスワードを表示',
      hide_password: 'パスワードを非表示',
      ethernet: 'イーサネット',
    },
    options: {
      paired: 'Hotspotとペアリング済み',
      diagnostic: '診断',
      wifi: 'Wi-Fiネットワーク',
      reassert: '位置情報を更新',
      firmware: 'Hotspotファームウェア',
    },
    reassert: {
      remaining:
        '<b><purple>{{count}}個の無料の</purple></b>Hotspot位置情報アサート更新が残っています。',
      remaining_plural:
        '<b><purple>{{count}}個の無料の</purple></b>Hotspot位置情報アサート更新が残っています。',
      change_location: '位置情報を変更',
      confirm: '確認しました',
      cost: '位置情報を再アサートするためのコストは以下のとおりです：',
      insufficient_funds:
        'このアサートを行うための資金が\nありません。HNTを取得してください。',
      confirm_location: 'Hotspotの位置情報の変更を確認してください',
      charge: '以下の料金が請求されます：{{amount}}。',
      pending_message: '位置情報の更新を保留しています。',
      assert_pending: 'アサートを保留しています...',
      failTitle: 'Hotspotの再アサートに失敗しました',
      failSubtitle: '後でもう一度実行してください',
    },
  },
  hotspot_details: {
    title: 'Hotspotの詳細',
    owner: '所有者：{{address}}',
    pass_rate: '合格率',
    reward_title: 'HNT報酬',
    witness_title: 'ウィットネス',
    challenge_title: 'Challenges',
    picker_title: '過去',
    picker_options: ['24時間', '7日間', '14日間', '30日間'],
    status_online: 'オンライン',
    status_offline: '注意が必要',
    options: {
      settings: '設定',
      viewExplorer: 'エクスプローラーで表示',
      share: '共有',
    },
  },
  transfer: {
    title: 'Hotspotでデータを転送',
    heading: 'いずれかのHotspotの所有権を安全に変更します。',
    body:
      'Hotspotでデータが転送されると、アプリにHotspotが表示されなくなり、このHotspotのHNTを獲得します。\n\n転送を続行するには、下にあるボックスにHotspot名を入力してください。',
    button_title: '転送を続行',
    input_placeholder: 'ここにHotspot名を入力してください...',
    exists_alert_title: '転送データがすでに存在します',
    exists_alert_body:
      'このHotspotのアクティブな転送データが保留になっています。',
    amount_changed_alert_title: 'リクエスト量が変更されました',
    amount_changed_alert_body:
      '販売者がリクエストした量が変更されました。新しいリクエスト量は{{amount}} HNTです。',
    nonce_alert_title: '転送を完了できません',
    nonce_alert_body:
      '販売者が「Hotspotでデータを転送」トランザクションを開始した後、HNTを送信または受信した可能性があります。Hotspotの販売者に連絡し、「Hotspotでデータを転送」トランザクションを新規に作成するように、また、「Hotspotでデータを転送」が完了するまで無関係な支払いトランザクションを実行しないように伝えてください。',
    incomplete_alert_title: '転送が完了していません',
    incomplete_alert_body:
      'この転送を完了できません。あなたが承認済みの購入者であることを確認するか、販売者に詳細を問い合わせてください。',
    canceled_alert_title: '転送がキャンセルされました',
    canceled_alert_body:
      'この転送はアクティブではなくなりました。販売者に詳細を問い合わせてください。',
    fine_print:
      '購入者がトランザクションを承諾して完了すると、Hotspotでデータが転送されます。',
    notification_button: 'トランザクションを表示',
    cancel: {
      button_title: '転送をキャンセル',
      failed_alert_title: '転送をキャンセルできません',
      failed_alert_body: 'APIから応答がありません。もう一度実行してください。',
      alert_title: 'Hotspotのデータ転送をキャンセル',
      alert_body:
        '{{gateway}}の{{buyer}}に対するHotspotのデータ転送が保留されています。\n\nキャンセルしますか？',
      alert_back: '戻る',
      alert_confirm: '転送をキャンセル',
    },
    unknown: '不明',
  },
  activity_details: {
    security_tokens: 'Security Token',
    reward: '報酬',
    from: '開始日',
    to: '終了日',
    memo: 'メモ',
    location: '位置情報',
    seller: '販売者',
    buyer: '購入者',
    owner: '所有者',
    my_account: 'アカウント',
    view_block: 'ブロックを表示',
    rewardTypes: {
      poc_challengees: 'PoC',
      poc_challengers: 'Challenger',
      poc_witnesses: 'ウィットネス',
      consensus: 'Consensus',
      data_credits: 'パケット転送',
      securities: 'Security Token',
    },
  },
}
