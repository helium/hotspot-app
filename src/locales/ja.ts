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
      subtitle: 'PINコードを設定して、アカウントを保護します。',
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
    clear: 'クリア',
    done: '完了',
    disabled: '無効',
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
    unable_to_get_location: '位置情報を取得できませんでした',
    location_blocked:
      '位置情報がオフになっています。位置情報サービスを許可するには、携帯電話の設定に移動します。',
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
    copy: 'コピー',
    address: 'アドレス',
    invalid_password: 'パスワードが間違っています',
    something_went_wrong: '何らかの問題が発生しました',
    hnt_to_currency: '{{currencyType}}。CoinGeckoのデータ',
    search_location: 'アドレスや場所を検索する',
    unavailable: '利用不可',
    minutes: '{{count}}分',
    minutes_plural: '{{count}}分',
    seconds: '{{count}}秒',
    seconds_plural: '{{count}}秒',
    one: '一',
    swipe_to_confirm: 'スワイプして確認',
  },
  hotspot_setup: {
    selection: {
      title: 'Hotspotを\n選択してください。',
      subtitle: 'どのような種類のHotspotを\n追加しますか？',
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
    },
    power: {
      title: '電源オン',
      next: '電源が入っています',
    },
    pair: {
      title: 'Bluetooth',
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
        'Hotspotは<green>オンライン</green>になっており、%{network}に接続されています。',
      scan_fail_subtitle:
        'Hotspotで近隣のWi-Fiネットワークが検出できませんでした。ルーターがオンラインになっていて近隣に設置されていることを確認してください。',
      tip:
        '<blue>Wi-Fiが非表示に設定されている</blue>かどうかを確認しましたか？',
      saved_networks: '構成済みネットワーク',
      available_networks: '利用可能なネットワーク',
      disconnect_help:
        'パスワードを更新するか、新しいネットワークに接続するには、まず古いネットワークを破棄してください。',
      disconnect: 'ネットワークを破棄',
      not_found_title: 'Wi-Fiネットワークが見つかりません',
      not_found_desc:
        'Hotspotが起動して利用可能なネットワークを見つけるまでに、最大3分かかる場合があります。',
      scan_networks: 'ネットワークをスキャン',
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
    onboarding_error: {
      title: 'オンボーディングエラー',
      subtitle:
        'オンボーディングサーバーでHotspotが見つかりません。次の手順については、Hotspotの製造元にお問い合わせください。',
      next: 'セットアップを終了',
      disconnected:
        'Hotspotへの接続中にエラーが発生しました。もう一度実行してください。',
      title_connect_failed: 'Hotspotのペアリングに失敗しました',
      body_connect_failed:
        'Hotspot Minerがリクエストに応答できません。Hotspotを再起動して、後でもう一度実行してください。',
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
      add_hotspot_error_body:
        'Add Hotspotトランザクションの構築中にエラーが発生しました。もう一度実行してください。',
      assert_loc_error_body:
        'Assert Locationトランザクションの構築中にエラーが発生しました。もう一度実行してください。',
      assert_loc_error_no_loc:
        '選択した位置情報が無効です。もう一度実行してください。',
      no_onboarding_key_title: 'オンボーディングキーが見つかりません',
      no_onboarding_key_message: 'もう一度実行しますか？',
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
      gain_label: 'TX/RXゲイン：',
      elevation_label: '高さ：',
      gain: '{{gain}} dBi',
      elevation: '{{count}}メートル',
      elevation_plural: '{{count}}メートル',
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
        'サーバーへのリクエストがタイムアウトしたため、現在Hotspotを追加できません。\n\nsupport@helium.comに連絡し、MACアドレス%{mac}を伝えてください。',
    },
    skip_location: {
      title: 'Hotspotを追加',
      subtitle_1: '後で位置情報をアサートすることにしました。',
      subtitle_2: '後で設定から位置情報を更新します。',
    },
    not_owner: {
      title: 'このHotspotにはすでに所有者が存在します。',
      subtitle_1:
        'あなたは他のユーザーのためにこのHotspotを\nホストしてますか？',
      subtitle_1_no_follow:
        'Wi-Fiを更新しているホストの場合、今すぐセットアップを終了できます。',
      subtitle_2:
        'Hotspotをフォローすると、所有していないHotspotをアプリ内で監視できます。',
      contact_manufacturer:
        'あなたがホットスポットの所有者（購入者）であると思われる場合は、Hotspotの製造元に問い合わせてください。',
    },
    owned_hotspot: {
      title: 'このHotspotをすでに所有しています',
      subtitle_1: 'このHotspotはすでにオンボード済みのようです。',
      subtitle_2:
        'HotspotのWi-Fiまたは位置情報を更新するには、Hotspotの設定に移動します。',
    },
  },
  account_import: {
    word_entry: {
      title: '回復シードフレーズを\n入力してください',
      directions: '<b>{{ordinal}}</b>単語を入力してください',
      placeholder: '{{ordinal}}単語',
      subtitle: '回復シードフレーズは\n大文字と小文字が区別されません',
    },
    confirm: {
      title: 'シードフレーズを\n確認してください',
      subtitle:
        '入力した12個の単語は以下のとおりです。編集する必要がある場合は、これらのいずれかをタップします。',
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
    intro_body:
      'このアカウントタブは、保持しているHNTまたはData Credit用の仮想ウォレットとして機能します。',
    intro_slides: [
      {
        title: 'HNTを受信',
        body: 'アドレスまたは QR コードにアクセスします。',
      },
      {
        title: 'HNT を送信',
        body: 'QRコードをスキャンするか、手動で詳細を入力します。',
      },
      {
        title: 'アカウントのグラフを作成',
        body:
          '緑色はHNTがアカウントに<green>追加されている</green>ことを示します。',
      },
      {
        title: 'アカウントのグラフを作成',
        body:
          '青色はHNTがアカウントから<blue>引き出されている</blue>ことを示します。',
      },
    ],
    chartRanges: {
      daily: { label: '14D', accessibilityLabel: '14 Days' },
      weekly: { label: '12W', accessibilityLabel: '12 Weeks' },
      monthly: { label: '12M', accessibilityLabel: '12 Months' },
    },
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
      transfer_complete: '転送を完了',
    },
    qrInfo: 'QR情報',
    error:
      'このトランザクションの申請中にエラーが発生しました。もう一度実行してください。',
    deployModePaymentsDisabled: 'デプロイモードでは支払いが無効になります',
    hotspot_label: 'Hotspot',
    last_activity: '最後に報告されたアクティビティ：{{activity}}',
    label_error: 'アカウントに十分なHNTがありません。',
    scan: {
      title: 'QRコードの使い方',
      send: 'HNTを送信',
      send_description: 'HeliumアドレスをすばやくスキャンしてHNTを送信します。',
      burn: 'HNTをDCにバーン',
      burn_description:
        'HNTをData Creditにバーンして、デバイスネットワークの接続料金を支払うことができます。DCは転送できません。',
      view: 'QRコードを表示',
      view_description:
        'QRコードを共有して、他のユーザーからHNTを入金するか受け取ります。',
      learn_more: '詳細',
      parse_code_error: 'QRコードを解析できません',
      invalid_hotspot_address:
        'QRコードのホットスポットアドレスが見つからないか無効です。',
      invalid_sender_address:
        'QRコードの送信者アドレスは有効なウォレットアカウントアドレスではありません。',
      mismatched_sender_address:
        'QRコードの送信者アドレスがウォレットアカウントアドレスと一致しません。 続行するには、アドレスが一致している必要があります。',
    },
    send_max_fee: {
      error_title: '最大送信エラー',
      error_description:
        '残りの最大送信にかかる手数料を計算できません。\n\n「最大送信」をタップしてもう一度実行してください。',
    },
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
        deployMode: {
          title: 'デプロイモード',
          subtitle:
            'このモードはウォレットに追加の保護を追加し、一部のアプリ機能を制限します。',
          inDeployMode: 'デプロイモードの場合：',
          cantViewWords: 'あなたの12の安全な言葉を見ることができません',
          cantTransferHotspots:
            'このアカウントからホットスポットを転送できません',
          canOnlySendFunds: 'にのみ資金を送ることができます',
          otherAccount: '他の指定されたアカウント',
          enableButton: 'デプロイモードを有効にする',
          disableInstructions:
            'この機能を無効にするには、ログアウトする必要があります。 今すぐ12語すべてを書き留めることを忘れないでください。',
          addressLabel: '許可されたアカウントアドレス...',
        },
      },
      learn: {
        title: '詳細',
        tokenEarnings: '獲得したトークン',
        heliumtoken: 'Helium Token',
        coverage: 'ネットワークカバレッジ',
        hotspotPlacement: 'Hotspotの配置',
        support: 'サポート',
        troubleshooting: 'トラブルシューティング',
        joinDiscord: 'Helium Discordに参加',
      },
      app: {
        title: 'アプリ',
        enableHapticFeedback: '触覚フィードバックを有効にする',
        convertHntToCurrency: 'HNTを通貨に変換する',
        language: '言語',
        signOut: 'サインアウト',
        signOutAlert: {
          title: '警告！',
          body:
            'アカウントからサインアウトしています。回復用の12個の単語をお持ちですか？お持ちでない場合、以下にアクセスできなくなります。\n\n - Hotspot\n- HNT\n - ウォレット',
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
    sort_by: 'Hotspotを次でソートする',
    new: {
      title: '新しいHotspotを追加',
      subtitle:
        'Hotspotを追加したばかりである場合は、しっかりと設置してください。ネットワークにHotspotが伝播するまでに少し時間がかかります。',
      setup: 'Hotspotを設定',
      explorer: '周辺にあるHotspotを表示する',
    },
    owned: {
      title: 'Hotspot',
      title_no_hotspots: 'Hotspot',
      your_hotspots: 'Hotspot',
      filter: {
        new: '最新のHotspot',
        near: '最も近いHotspot',
        earn: '獲得数上位のHotspot',
        offline: 'オフラインHotspot',
        followed: 'フォローしたHotspot',
      },
    },
    search: {
      title: 'Hotspot検索',
      my_hotspots: 'Hotspot',
      all_hotspots: 'すべてのHotspot',
      placeholder: '検索...',
      recent_searches: '最近の検索',
      tips: '検索のヒント',
      tips_body:
        'Hotspot名（愉快な動物の名前など）または地名（ニューヨーク市など）を入力してみてください。\n\n注：過去10分以内に追加されたHotspotは表示されない場合があります。',
    },
    empty: {
      body: 'まだHotspotを追加もフォローもしていません。',
      failed:
        'APIまたはネットワークの停止により、Hotspotのアクセスに問題が発生しています。後でもう一度実行してください。',
    },
    list: {
      no_offline: 'オフラインHotspotはありません',
      online: 'オンラインHotspot',
      no_results: '結果はありません',
    },
    ticker:
      '{{formattedHotspotCount}}個のHotspot • Oracleの価格：{{oraclePrice}} • ブロック時間：{{formattedBlockTime}}秒 • ',
    ticker_no_block:
      '{{formattedHotspotCount}}個のHotspot • Oracleの価格：{{oraclePrice}} • ',
  },
  permissions: {
    location: {
      title: '位置情報のアクセス許可',
      message:
        'Bluetoothを検出して位置情報のアサートを有効にするために、Heliumはあなたの位置情報にアクセスする必要があります。この情報が販売または共有されることは決してありません。',
    },
  },
  time: {
    morning: '午前',
    evening: '夜間',
    afternoon: '午後',
  },
  notifications: {
    tapToReadMore: 'タップして詳細を読む',
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
    location_v2: 'Hotspotを更新',
    transfer: 'Hotspotのデータ転送',
    transferSell: 'Hotspotでデータを転送（販売）',
    transferBuy: 'Hotspotでデータを転送（購入）',
    view: '表示',
    view_transactions: 'トランザクションを表示',
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
      title: 'Wi-Fiまたは実行診断を更新',
      subtitle: '続行する前にペアリングする必要があります。',
      scan: 'ペア',
    },
    transfer: {
      title: 'Hotspotでデータを転送',
      subtitle: '別のHeliumウォレットに送信します。',
      begin: 'Hotspotでデータの転送を開始',
    },
    update: {
      title: 'Hotspotを更新',
      subtitle: 'Hotspotの位置情報またはアンテナの詳細。',
    },
    discovery: {
      title: '検出モード',
      subtitle: '理想的なHotspotの配置を特定します。',
      no_location_error: {
        title: '検出モードを開始できません',
        message:
          '検出モードを開始する前に、Hotspotの位置情報を設定してください。',
      },
      unasserted_hotspot_warning: {
        title: 'Hotspotの位置情報がありません',
        message:
          '応答するHotspotを視覚化するため、携帯電話の位置情報がHotspotのプレースホルダーとして使用されます。',
      },
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
      hotspot_type: 'Hotspotメーカー',
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
      unavailable_warning:
        '*Hotspotが完全に起動するまで、診断を利用できない場合があります。データが欠落している場合は、前に戻って、診断レポートをもう一度生成してください。',
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
      current_location: '現在の位置情報',
      new_location: '新しい位置情報',
      antenna_details: 'アンテナ/高さの詳細',
      update_antenna: 'アンテナを更新',
      submit:
        '申請を行い、現在保留になっているHotspotのトランザクションを更新します。',
      already_pending:
        'トランザクションが保留になっている間、Hotspotを更新することはできません。後でもう一度実行してください。',
    },
  },
  hotspot_details: {
    checklist: 'チェックリスト',
    title: 'Hotspotの詳細',
    owner: '所有者：{{address}}',
    owner_you: 'あなたが所有しています',
    pass_rate: '合格率',
    reward_title: 'HNT報酬',
    witness_title: '平均的なウィットネス',
    challenge_title: 'Challenges',
    challenge_sub_title: '（ウィットネス、Challenger、またはChallengee）',
    picker_title: '過去',
    overview: '概要',
    no_location: '位置情報がありません',
    picker_options: {
      7: '過去7日間',
      14: '過去14日間',
      30: '過去30日間',
    },
    picker_prompt: '範囲を選択',
    status_online: 'オンライン',
    status_offline: '注意が必要',
    status_syncing: '同期中',
    relayed: 'リレー済み',
    status_prompt_online: {
      title: 'Hotspotはオンラインになっており、同期されています。',
      subtitle_active: 'ステータス：{{hotspotBlock}}/{{currentBlock}}ブロック',
      subtitle_starting: '同期を開始しています...',
    },
    status_prompt_offline: {
      title: 'Hotspotはオフラインになっており、同期されていません。',
    },
    options: {
      settings: '設定',
      viewExplorer: 'エクスプローラーで表示',
      share: '共有',
    },
    no_location_title: 'アサート済みの位置情報はありません',
    no_location_body: 'Hotspotとペアリングをして開始します。',
    percent_synced: '{{percent}}%同期されました',
    starting_sync: '同期を開始しています...',
    relay_prompt: {
      title: 'Hotspotはリレーされています',
      message:
        'Hotspotの接続はネットワーク上の別のHotspotを介してリレーされており、マイニングに影響する可能性があります。Hotspotがリレーされないようにするには、トラブルシューティングガイドにアクセスしてください。',
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
    notification_button: 'トランザクションを表示',
    deployModeTransferDisableTitle: 'ホットスポットの転送が無効',
    deployModeTransferDisabled:
      '展開モードでは、転送ホットスポットは無効になります。',
    cancel: {
      button_title: '転送を保留しています。タップしてキャンセルします。',
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
    elevation: '高さ',
    antenna: 'アンテナ',
    rewardTypes: {
      poc_challengees: 'PoC',
      poc_challengers: 'Challenger',
      poc_witnesses: 'ウィットネス',
      consensus: 'Consensus',
      data_credits: 'パケット転送',
      securities: 'Security Token',
    },
    staking_fee_payer: '{{payer}}により支払われました',
  },
  checklist: {
    title: 'チェックリスト',
    blocks: {
      not:
        'Hotspotはマイニングする前に完全に同期する必要があります。新しいHotspotの同期には最大96時間かかる場合があります。',
      full: 'Hotspotが完全に同期されました。',
      partial:
        'HotspotはHeliumブロックチェーンの{{count}}ブロック手前で、約{{percent}}%同期されました。',
      partial_plural:
        'HotspotはHeliumブロックチェーンの{{count}}ブロック手前で、約{{percent}}%同期されました。',
      title: 'ブロックチェーンを同期',
    },
    status: {
      online: 'Hotspotはインターネットに接続されています。',
      offline:
        'Hotspotがオンラインではありません。同期してマイニングするにはHotspotをオンラインにする必要があります。',
      title: 'Hotspotのステータス',
    },
    challenger: {
      success: 'Hotspotが{{count}}ブロック前にChallengeを発行しました。',
      success_plural: 'Hotspotが{{count}}ブロック前にChallengeを発行しました。',
      fail:
        'HotspotはまだChallengeを発行していません。Hotspotは240ブロックごと（約4時間ごと）にChallengeを自動的に作成します。',
      title: 'Challengeを作成',
    },
    challenge_witness: {
      success: 'Hotspotは最近Challengeをウィットネスしました。',
      fail: 'Hotspotは近隣にあるHotspotのChallengeをリッスンします。',
      title: 'Challengeをウィットネスする',
    },
    witness: {
      success:
        'このHotspotはウィットネスリストに{{count}}個のHotspotがあります。',
      success_plural:
        'このHotspotはウィットネスリストに{{count}}個のHotspotがあります。',
      fail:
        'ウィットネスはまだありません。新しいHotspot、および位置情報やアンテナの設定が最近更新されたHotspotのウィットネスはゼロになります。',
      title: 'ウィットネスリスト',
    },
    challengee: {
      success:
        'Hotspotは{{count}}ブロック前のChallengeに最後に追加されました。',
      success_plural:
        'Hotspotは{{count}}ブロック前のChallengeに最後に追加されました。',
      fail:
        'オンラインHotspotは240ブロック（4時間）ごとにChallengeが作成され、次にChallengeが作成されるまでに時間がかかる場合があります。',
      title: 'Challengeを渡す',
    },
    data_transfer: {
      success: 'Hotspotは最近データパケットを転送しました。',
      fail:
        'Hotspotは自動的にデバイスデータを転送してHNTを獲得します。このHotspotはまだデータを転送していません。',
      title: 'データを転送',
    },
    auto: '自動',
    auto_hours: '数時間ごと',
    complete: '完了',
    online: 'オンライン',
  },
  discovery: {
    troubleshooting_guide: 'トラブルシューティングガイド',
    syncing_prompt: {
      title: '検出モードを開始できません',
      message:
        'Hotspotは完全に同期する必要があります。後でもう一度実行してください。',
    },
    offline_prompt: {
      title: '検出モードを開始できません',
      message:
        'Hotspotはオフラインになっています。インターネットに接続して、もう一度実行してください。',
    },
    relay_prompt: {
      title: 'Hotspotはリレーされています',
      message:
        '検出モードで実行されているHotspotがリレーされている場合、隣接するHotspotからの応答を受信しない可能性があります。Hotspotがリレーされないようにするには、トラブルシューティングガイドにアクセスしてください。',
    },
    session_error_prompt: {
      title: '検出モードを開始できません',
      message:
        'Hotspotのリレーが遅れており、応答していない可能性があります。ルーターの設定を確認し、もう一度実行してください。',
    },
    begin: {
      title: '検出モード',
      subtitle:
        '無線パケットを{{duration}}送信して、どのHotspotがあなたを検知するかを調べます。',
      body:
        '検出モードは1日あたり最大{{requestsPerDay}}セッションで、現時点では無料で使用できます。',
      previous_sessions: '前回のセッション',
      last_30_days: '(過去30日間)',
      start_session: '新しいセッションを開始する',
      no_sessions:
        '本日分のセッションはすべてなくなりました。\n明日もう一度やり直してください。',
      responses: '{{count}}件の応答',
      responses_plural: '{{count}}件の応答',
      initiation_error: 'セッションを開始できません',
      error: {
        title: 'エラー',
        subtitle:
          '検出モードの読み込み中に問題が発生しました。後でもう一度実行してください',
      },
      location_opts: {
        hotspot: '一時的な位置情報を使用*',
        asserted: 'アサート済みの位置情報を使用',
        info:
          '*位置情報を設定する前にHotspotのカバレッジをテストしたい場合に便利です',
      },
    },
    results: {
      title: '検出モードの結果',
      share: '結果を共有',
      responded: 'Hotspotが応答しました',
      elapsed_time: '経過時間',
      result_time: '結果の時間',
      searching: '検索中',
      distance: '{{distance}} {{unit}}離れています',
      added_to_followed: 'フォローしたHotspotに追加しました',
    },
    share: {
      subject: '検出結果',
      hotspot_name: 'Hotspot名',
      packets_heard: '検知されたパケット',
    },
  },
  antennas: {
    onboarding: {
      title: 'アンテナのセットアップ',
      subtitle: 'Hotspotのアンテナと高さの詳細を申請します。',
      gain: 'TX/RXゲイン',
      dbi: 'dBi',
      elevation: '高さ（メートル）',
      select: 'アンテナを選択',
    },
    elevation_info: {
      title: 'Hotspotの高さ',
      desc:
        'アンテナを地面からどのくらいの高さに配置するかを見積もります。平屋家屋の屋根にアンテナを配置する場合、高さは通常、5メートルになります。',
    },
    gain_info: {
      title: 'アンテナのTX/RXゲイン',
      desc:
        '1から15までの小数点以下1桁の値。これはHotspotまたはアンテナの製造元で確認できます。',
    },
  },
}
