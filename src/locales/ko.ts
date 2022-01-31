export default {
  back: '돌아가기',
  ordinals: [
    '첫 번째',
    '두 번째',
    '세 번째',
    '네 번째',
    '다섯 번째',
    '여섯 번째',
    '일곱 번째',
    '여덟 번째',
    '아홉 번째',
    '열 번째',
    '열한 번째',
    '열두 번째',
  ],
  account_setup: {
    welcome: {
      title: 'Helium에 오신 것을\n환영합니다',
      subtitle:
        'The People’s Network 구축을 위해 Hotspot을 호스팅하고\n새로운 암호화폐인\n<b><purple>$HNT</purple></b>을 획득하세요.',
      create_account: '계정 생성',
      import_account: '기존 계정 가져오기',
    },
    warning: {
      title: '보안 계정\n생성.',
      subtitle:
        'Helium 계정은\n<b><purple>12개의 고유한 단어</purple></b>로 보호되며, 이는 계정에\n로그인하거나\n계정을 복구하기 위해 사용하는 암호 역할을 합니다.',
      generate: '12개의 단어 생성',
    },
    generating: '12개의 단어 생성 중...',
    passphrase: {
      title: '12단어\n암호',
      subtitle:
        '12개의 단어를 순서대로 <b>모두 적어둬야\n합니다</b>.\n\n<red>Helium은 암호에 쓰인 단어를 복구할 수 없습니다.</red>',
      warning: 'Helium은 암호에 쓰인 단어를 복구할 수 없습니다',
      next: '단어를 모두 적었습니다',
    },
    confirm: {
      title: '단어를\n확인하세요',
      subtitle:
        '다음 중 귀하의 <b><purple>{{ordinal}} 단어는 무엇인가요?</purple></b>',
      forgot: '단어를 잊어버림',
      failed: {
        title: '죄송합니다.',
        subtitle_1: '시드 문구를 잘못 입력했습니다.',
        subtitle_2: '다시 시도해 주세요.',
        try_again: '다시 시도하세요',
      },
    },
    create_pin: {
      title: 'PIN 코드 설정',
      subtitle: 'PIN 코드로 계정을 보호하세요.',
    },
    confirm_pin: {
      title: 'PIN 반복',
      subtitle: 'PIN을 다시 입력하세요',
    },
    enable_notifications: {
      title: '알림 활성화',
      subtitle:
        '계정 또는 Hotspot에 중요한 업데이트가 발생하면 알림을 받습니다.',
      mining: 'Hotspot은 채굴입니다',
      later: '아니요, 나중에 설정하겠습니다',
    },
  },
  learn: {
    title: 'HNT를 획득하려면\n어떻게 해야 하나요?',
    slides: [
      {
        topTitle: 'Beacon 수신',
        topBody: 'Hotspot은 근처 Hotspot의 Beacon을 수신합니다',
        bottomTitle: 'Beacon은 어떻게 작동하나요?',
        bottomBody:
          'Beacon은 Hotspot이 전송하는 특수 패킷으로 다른 인접 Hotspot에서 수신할 수 있습니다.\n\n이러한 신호를 통해 네트워크는 서로 수신 범위 내에 있는 Hotspot을 확인할 수 있습니다. 이러한 인접한 Hotspot을 ’감시’라고 하며 귀하의 Beacon을 수신하는 Hotspot이 감시 목록에 추가됩니다.',
      },
      {
        topTitle: 'Beacon 수신',
        topBody: 'Hotspot은 근처 Hotspot의 Beacon을 수신합니다',
        bottomTitle: 'Beacon은 어떻게 작동하나요?',
        bottomBody:
          'Beacon은 Hotspot이 전송하는 특수 패킷으로 다른 인접 Hotspot에서 수신할 수 있습니다.\n\n이러한 신호를 통해 네트워크는 서로 수신 범위 내에 있는 Hotspot을 확인할 수 있습니다. 이러한 인접한 Hotspot을 ’감시’라고 하며 귀하의 Beacon을 수신하는 Hotspot이 감시 목록에 추가됩니다.',
      },
      {
        topTitle: 'Beacon 수신',
        topBody: 'Hotspot은 근처 Hotspot의 Beacon을 수신합니다',
        bottomTitle: 'Beacon은 어떻게 작동하나요?',
        bottomBody:
          'Beacon은 Hotspot이 전송하는 특수 패킷으로 다른 인접 Hotspot에서 수신할 수 있습니다.\n\n이러한 신호를 통해 네트워크는 서로 수신 범위 내에 있는 Hotspot을 확인할 수 있습니다. 이러한 인접한 Hotspot을 ’감시’라고 하며 귀하의 Beacon을 수신하는 Hotspot이 감시 목록에 추가됩니다.',
      },
    ],
    next: '가이드를 읽었음',
  },
  generic: {
    clear: '지우기',
    done: '완료',
    disabled: '장애가있는',
    understand: '내용을 이해함',
    blocks: '블록',
    active: '활성화',
    skip: '건너뛰기',
    next: '다음',
    need_help: '지원 요청',
    scan_again: '다시 스캔',
    submit: '제출',
    balance: '잔액',
    continue: '계속',
    skip_for_now: '지금은 건너뛰기',
    go_to_account: '내 계정으로 이동',
    go_to_settings: '설정으로 이동',
    hotspot: 'Hotspot',
    location: '위치',
    unable_to_get_location: '위치를 확인하지 못했습니다',
    location_blocked:
      '위치 기능이 꺼져 있습니다. 휴대폰 설정으로 이동하여 위치 서비스를 허용하세요.',
    challenger: 'Challenger',
    learn_more: '자세히 알아보기',
    cancel: '취소',
    ok: '확인',
    unknown: '알 수 없음',
    online: '온라인',
    offline: '오프라인',
    fee: '수수료',
    to: '수신처',
    from: '발신처',
    new: '새로 생성',
    save: '저장',
    connect: '연결',
    go_back: '돌아가기',
    forget: '잊어버림',
    error: '오류 발생',
    loading: '로드 중...',
    copy: '복사',
    address: '주소',
    invalid_password: '잘못된 암호입니다',
    something_went_wrong: '문제가 발생했습니다',
    hnt_to_currency: '{{currencyType}}. CoinGecko의 데이터',
    search_location: '주소 또는 장소 검색',
    unavailable: '사용할 수 없음',
    minutes: '{{count}} 분',
    minutes_plural: '{{count}} 분',
    seconds: '{{count}} 초',
    seconds_plural: '{{count}} 초',
    one: '하나',
    swipe_to_confirm: '스와이프하여 확인',
  },
  hotspot_setup: {
    selection: {
      title: 'Hotspot\n선택.',
      subtitle: '어떤 종류의 Hotspot을\n추가하시겠어요?',
    },
    education: {
      title: 'Hotspot\n배치.',
      cards: [
        {
          title: '좋은 장소에 배치하세요',
          subtitle:
            'Hotspot은 하늘이 보이고 다른 Hotspot에서 최소한 300m 이상 떨어진 장소를 좋아합니다. ',
        },
        {
          title: '숨기지 마세요',
          subtitle:
            'Hotspot을 침실용 탁자나 책장에 숨겨서는 안 됩니다. 그 대신 창가에 두세요.',
        },
        {
          title: '건물이 신호를 차단할 수 있습니다',
          subtitle:
            '주변 건물로 인해 주변 기기에 대한 Hotspot의 커버리지가 감소될 수 있습니다.',
        },
        {
          title: '마지막으로 오류가 발생하지 않도록 주의하세요.',
          subtitle:
            'Hotspot을 금속망에서 멀리 떨어진 곳에 두세요. 금속망은 무선 신호를 상당 부분 차단할 수 있습니다.',
        },
      ],
      next: '가이드를 읽었음',
    },
    diagnostics: {
      title: '진단 도구',
    },
    power: {
      title: '전원 켜기',
      next: '전원을 켰습니다',
    },
    pair: {
      title: 'Bluetooth',
      alert_no_permissions: {
        title: 'Bluetooth 승인',
        body:
          'Helium이 Bluetooth를 사용하려면 권한이 필요합니다. 설정에서 Bluetooth 권한을 활성화할 수 있습니다.',
      },
      alert_ble_off: {
        title: 'Bluetooth 활성화',
        body:
          '페어링을 시작하려면 Bluetooth를 켜세요. 등록이 완료될 때까지 Bluetooth를 켜두세요.',
      },
      scan: '내 Hotspot 스캔',
    },
    ble_scan: {
      title: 'Hotspot 스캔',
      cancel: '스캔 취소',
      connecting: '{{hotspotName}}에 연결',
    },
    ble_select: {
      hotspots_found: 'Hotspot이 {{count}}개 발견되었습니다.',
      hotspots_found_plural: 'Hotspot {{count}}개 발견',
      subtitle: 'Hotspot을 선택하여 계속하세요.',
    },
    ble_error: {
      title: 'Hotspot을 찾을 수 없음',
      enablePairing: '페어링 모드 활성화',
      pairingInstructions:
        'Bluetooth를 활성화하려면 제조업체 지침을 참조하세요',
    },
    wifi_scan: {
      title: 'Wi-Fi',
      settings_title: 'Wi-Fi 설정',
      subtitle: 'Hotspot을 연결하려는 Wi-Fi 네트워크를 선택합니다.',
      ethernet: '그 대신에 이더넷을 사용합니다',
      connection_failed: '연결에 실패했습니다. 다시 시도해 주세요',
      disconnect_failed: '분리에 실패했습니다. 다시 시도해 주세요',
      connected:
        'Hotspot이 <green>온라인</green> 상태이며 %{network}에 연결되었습니다.',
      scan_fail_subtitle:
        'Hotspot 근처에 Wi-Fi 네트워크가 없습니다. 라우터가 온라인 상태이고 근처에 있는지 확인하세요.',
      tip: '<blue>Wi-Fi가 숨김으로 설정되었는지</blue> 확인하셨나요?',
      saved_networks: '구성된 네트워크',
      available_networks: '사용 가능한 네트워크',
      disconnect_help:
        '암호를 업데이트하거나 새 네트워크에 연결하려면 먼저 이전 네트워크를 삭제하세요.',
      disconnect: '네트워크 삭제',
      not_found_title: 'Wi-Fi 네트워크를 찾을 수 없음',
      not_found_desc:
        'Hotspot이 부팅되고 사용 가능한 네트워크를 찾는 데 최대 3분이 소요될 수 있습니다.',
      scan_networks: '네트워크 스캔',
    },
    disconnect_dialog: {
      title: '네트워크를 삭제하시겠어요?',
      body: '이 Hotspot은 더 이상 {{wifiName}}에 자동으로 연결되지 않습니다.',
    },
    wifi_password: {
      join_title: '암호 입력',
      update_title: 'Wi-Fi 업데이트',
      message:
        '현재 이 네트워크에 Hotspot이 연결되어 있습니다. 암호를 변경하면 Hotspot이 오프라인 상태가 될 수 있습니다.',
      error_title: '유효하지 않은 암호',
      subtitle:
        '이 네트워크에 Hotspot을 연결하려면 Wi-Fi의 자격 증명을 입력하세요.',
      placeholder: '암호',
      show_password: '암호 표시',
      hide_password: '암호 숨기기',
      connecting: '네트워크에 연결',
      forget: '잊어버림',
      forget_network: '네트워크 삭제',
      forget_alert_title: '네트워크를 삭제하시겠어요?',
      forget_alert_message: '이 Hotspot은 더 이상 자동으로 연결되지 않습니다 ',
    },
    ethernet: {
      title: '이더넷을 사용하세요',
      subtitle: 'Hotspot을 인터넷 라우터의 사용 가능한 활성 포트에 연결합니다.',
      secure: '이더넷 케이블을 단단히 연결하세요',
      next: 'Hotspot이 연결되었습니다',
    },
    firmware_update: {
      title: '업데이트 사용 가능',
      subtitle: '계속하려면 Hotspot의 펌웨어를 업데이트해야 합니다.',
      current_version: '현재 버전',
      required_version: '필수 버전',
      explanation:
        'Hotspot은 자동으로 업데이트를 확인합니다. 이 작업은 약 10분 정도 걸릴 수 있습니다. 연결한 상태로 두고 나중에 다시 확인하세요.',
      next: '확인',
    },
    onboarding_error: {
      title: '온보딩 오류',
      subtitle:
        '온보딩 서버에서 Hotspot을 찾을 수 없습니다. 다음 단계는 Hotspot 제조업체에 문의하시기 바랍니다.',
      next: '설정 종료',
      disconnected: 'Hotspot 연결 중에 오류가 발생했습니다. 다시 시도하세요.',
      title_connect_failed: 'Hotspot 페어링 실패',
      body_connect_failed:
        'Hotspot Miner가 요청에 응답할 수 없습니다. Hotspot을 재부팅하고 나중에 다시 시도하세요.',
    },
    add_hotspot: {
      title: 'Hotspot 추가',
      subtitle:
        'Hotspot을 추가하려면 진위 여부를 확인하기 위해 약간의 수수료(Data Credit 비용)가 필요합니다.',
      checking_status: 'Hotspot 상태 확인 중...',
      already_added:
        '이미 이 Hotspot을 지갑에 추가했습니다. 다음 화면으로 이동하여 위치를 확인합니다.',
      not_owned: '이 Hotspot을 소유하고 있지 않으며 지갑에 추가할 수 없습니다.',
      label: '현재 Hotspot 추가 수수료(Data Credit 비용)',
      help_link: 'Data Credit이란 무엇인가요?',
      support_title: 'Data Credit이란 무엇인가요?',
      support_answer:
        'Helium Network를 통해 데이터를 전송하려면 Data Credit이 필요합니다.',
      error:
        'Hotspot 추가를 진행할 수 없습니다. Helium에서 Hotspot을 구매한 경우, support@helium.com에 문의하고 mac 주소({{mac}})를 포함해 주시기 바랍니다.',
      back: 'Hotspot 페어링으로 돌아가기',
      wait_error_title: '다시 시도해 주세요',
      wait_error_body:
        'Hotspot Miner가 시작을 기다리고 있습니다. 몇 분 후에 다시 시도해 주세요.',
      add_hotspot_error_body:
        'Hotspot 추가 트랜잭션을 구성하는 중에 오류가 발생했습니다. 다시 시도하세요.',
      assert_loc_error_body:
        '위치 확인 트랜잭션을 구성하는 중에 오류가 발생했습니다. 다시 시도하세요.',
      assert_loc_error_no_loc:
        '선택된 위치가 유효하지 않습니다. 다시 시도하세요.',
      no_onboarding_key_title: '온보딩 키를 찾을 수 없음',
      no_onboarding_key_message: '다시 시도하시겠습니까?',
    },
    enable_location: {
      title: 'Hotspot\n위치 설정',
      subtitle:
        'Hotspot의 위치를 설정해야 합니다. 휴대전화를 사용하여 이 작업을 수행할 수 있습니다.',
      p_1: '먼저 휴대전화의 위치에 액세스할 수 있는 권한을 요청받게 됩니다.',
      settings_p_1:
        'Hotspot 위치를 업데이트하려면 추가 위치 권한이 필요합니다.',
      settings_p_2:
        "아래 버튼을 탭하면 설정으로 이동합니다. 'Location(위치)'에서 'While using the App(앱을 사용하는 동안)'을 탭합니다.",
      next: '권한 요청',
      cancel: '아니요, 나중에 설정하겠습니다',
    },
    location_fee: {
      title: '위치 수수료',
      subtitle_free: '위치 수수료($10)가 선불 결제되었습니다.',
      subtitle_fee:
        '이 위치를 확인하려면 $10의 위치 수수료(DC)를 지불해야 합니다.',
      confirm_location: '선택한 위치가 올바른지 확인하고 Hotspot을 등록하세요.',
      pending_p_1:
        '이 Hotspot에는 블록체인에서 보류 중인 위치 확인 트랜잭션이 있습니다.',
      pending_p_2:
        'Hotspot의 위치를 변경하려면 이전 트랜잭션이 완료될 때까지 기다린 후 위치를 업데이트하세요.',
      balance: '잔액:',
      fee: '수수료:',
      no_funds: '계정 잔액에 HNT가 부족합니다',
      calculating_text: 'HNT 금액 계산',
      error_title: '오류 발생',
      error_body:
        '수수료 데이터를 로드하는 중에 오류가 발생했습니다. 다시 시도하세요.',
      next: 'Hotspot 등록',
      fee_next: '수수료 지불 및 Hotspot 등록',
      gain_label: 'TX / RX 증가:',
      elevation_label: '높이:',
      gain: '{{gain}}dBi',
      elevation: '{{count}}m',
      elevation_plural: '{{count}}m',
    },
    location: {
      title: 'Hotspot 위치',
      next: '위치 설정',
    },
    progress: {
      title: 'Hotspot 등록',
      subtitle: '몇 분 정도 걸릴 수 있으므로 이 화면을 닫아도 됩니다.',
      next: '지갑으로 이동',
    },
    error: {
      alertTitle: '서버가 응답할 수 없음',
      alertMessage:
        '서버 요청 시간이 초과되어 지금은 Hotspot을 추가할 수 없습니다.\n\nsupport@helium.com에 문의하고 MAC 주소(%{mac})를 적어주시기 바랍니다.',
    },
    skip_location: {
      title: 'Hotspot 추가',
      subtitle_1: '위치를 나중에 확인하기로 결정했습니다.',
      subtitle_2: '향후 설정에서 위치를 업데이트하세요.',
    },
    not_owner: {
      title: '이 Hotspot은 이미 소유자가 있습니다.',
      subtitle_1: '다른 사람을 위해\n호스팅하고 계십니까?',
      subtitle_1_no_follow:
        'Wi-Fi를 업데이트하는 호스트인 경우, 지금 설정을 종료할 수 있습니다.',
      subtitle_2:
        'Hotspot을 팔로우하면 앱을 통해 소유하지 않은 Hotspot을 모니터링할 수 있습니다.',
      contact_manufacturer:
        'Hotspot 소유자라면(예: 구매한 경우) Hotspot 제조업체에 문의하세요.',
    },
    owned_hotspot: {
      title: '이 Hotspot을 이미 소유하고 있습니다',
      subtitle_1: '이 Hotspot은 이미 온보딩된 것으로 보입니다.',
      subtitle_2:
        'Hotspot의 Wi-Fi 또는 위치를 업데이트하려면 Hotspot의 설정으로 이동하세요.',
    },
  },
  account_import: {
    word_entry: {
      title: '복구 시드\n문구 입력',
      directions: '<b>{{ordinal}}</b> 단어 입력',
      placeholder: '{{ordinal}} 단어',
      subtitle: '복구 시드 문구는\n대소문자를 구분하지 않음',
    },
    confirm: {
      title: '시드 문구\n확인',
      subtitle:
        '입력하신 12개의 단어입니다. 수정이 필요한 경우 이 중 하나를 탭하세요.',
      next: '시드 문구 제출',
    },
    complete: {
      title: '계정 복구 중...',
      subtitle: '잠시만 기다려 주세요.',
    },
    alert: {
      title: '오류 발생',
      body: '이 시드 문구는 Helium 계정과 일치하지 않습니다',
    },
  },
  wallet: {
    title: '내 지갑',
    copiedToClipboard: '{{address}}이(가) 클립 보드에 복사됨',
    share: '공유',
    intro_body:
      '이 계정 탭은 보유한 HNT 또는 Data Credit에 대한 가상 지갑 역할을 수행합니다.',
    intro_slides: [
      { title: 'HNT 수신', body: '주소 또는 QR 코드에 액세스하세요.' },
      {
        title: 'HNT 전송',
        body: 'QR 코드를 스캔하거나 세부사항을 직접 입력하세요.',
      },
      {
        title: '사용자 계정 차트',
        body: '녹색은 계정에 <green>추가</green>되는 HNT를 나타냅니다.',
      },
      {
        title: '사용자 계정 차트',
        body: '파란색은 계정에서 <blue>차감</blue>되는 HNT를 나타냅니다.',
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
      payment: 'HNT 전송',
      dcBurn: 'HNT 버닝',
      transfer: 'Hotspot 전송',
    },
    available: '{{ amount }} 사용 가능',
    address: {
      label: '받는 사람 주소',
      label_transfer: '구매자 주소',
      placeholder: '주소 입력',
      seller: '판매자 주소',
    },
    amount: {
      label: '금액(HNT)',
      label_transfer: '요청 금액(HNT)',
      placeholder: '0',
      placeholder_transfer: '(옵션) Hotspot에 대한 결제 요청',
    },
    dcAmount: {
      label: '(DC)와 동일한 금액',
      placeholder: '0',
    },
    memo: {
      label: '메모',
      placeholder: '메모 입력... (옵션)',
    },
    sendMax: '최대 전송',
    button: {
      payment: 'HNT 전송',
      dcBurn: 'HNT 버닝',
      transfer_complete: '이체 완료',
    },
    qrInfo: 'QR 정보',
    error: '이 트랜잭션을 제출하는 중에 오류가 발생했습니다. 다시 시도하세요.',
    deployModePaymentsDisabled: '배포 모드에서는 결제가 비활성화됩니다.',
    hotspot_label: 'Hotspot',
    last_activity: '마지막으로 보고된 활동: {{activity}}',
    label_error: '계정에 충분한 HNT가 없습니다.',
    scan: {
      title: 'QR 코드 사용 방법',
      send: 'HNT 전송',
      send_description: 'Helium 주소를 빠르게 스캔하여 HNT를 전송합니다.',
      burn: 'HNT를 DC로 소진',
      burn_description:
        '기기 네트워크 연결 비용을 지불하기 위해 HNT를 Data Credit으로 소진할 수 있습니다. Data Credit은 양도할 수 없습니다.',
      view: 'QR 코드 보기',
      view_description:
        'QR 코드를 공유하여 HNT를 예치하거나 다른 사람으로부터 전송받을 수 있습니다.',
      learn_more: '자세히 알아보기',
      parse_code_error: 'QR 코드를 구문 분석할 수 없음',
      invalid_hotspot_address: 'QR 코드의 핫스팟 주소가 없거나 잘못되었습니다.',
      invalid_sender_address:
        'QR 코드의 보낸 사람 주소는 유효한 지갑 계정 주소가 아닙니다.',
      mismatched_sender_address:
        'QR 코드의 보낸 사람 주소가 지갑 계정 주소와 일치하지 않습니다. 계속하려면 주소가 일치해야 합니다.',
    },
    send_max_fee: {
      error_title: '최대 오류 전송',
      error_description:
        '최대 잔액 전송 수수료를 계산할 수 없습니다.\n\n최대 전송을 탭하고 다시 시도하세요.',
    },
  },
  more: {
    title: '설정',
    sections: {
      security: {
        title: '보안',
        enablePin: 'PIN 활성화',
        requirePin: 'PIN 요청',
        resetPin: 'PIN 초기화',
        requirePinForPayments: '결제 시 PIN 필요',
        authIntervals: {
          immediately: '즉시',
          after_1_min: '1분 후',
          after_5_min: '5분 후',
          after_15_min: '15분 후',
          after_1_hr: '1시간 후',
          after_4_hr: '4시간 후',
        },
        revealWords: '단어 공개',
        deployMode: {
          title: '배포 모드',
          subtitle:
            '이 모드는 지갑에 추가 보호 기능을 추가하여 일부 앱 기능을 제한합니다.',
          inDeployMode: '배포 모드에서:',
          cantViewWords: '12개의 보안 단어를 볼 수 없습니다',
          cantTransferHotspots: '이 계정에서 핫스팟을 전송할 수 없습니다',
          canOnlySendFunds: '송금만 가능',
          otherAccount: '기타 지정된 계정',
          enableButton: '배포 모드 활성화',
          disableInstructions:
            '이 기능을 비활성화하려면 로그아웃해야 합니다. 지금 12개의 단어를 모두 적어두는 것을 잊지 마십시오.',
          addressLabel: '허용된 계정 주소...',
        },
      },
      learn: {
        title: '알아보기',
        tokenEarnings: '토큰 획득',
        heliumtoken: 'Helium 토큰',
        coverage: '네트워크 커버리지',
        hotspotPlacement: 'Hotspot 배치',
        support: '지원',
        troubleshooting: '문제 해결',
        joinDiscord: 'Helium Discord 참여',
      },
      app: {
        title: '앱',
        enableHapticFeedback: '햅틱 피드백 활성화',
        convertHntToCurrency: 'HNT를 통화로 변환',
        language: '언어',
        signOut: '로그아웃',
        signOutAlert: {
          title: '경고!',
          body:
            '계정에서 로그 아웃합니다. 12개의 복구 단어를 가지고 계십니까? 그렇지 않으면 다음에 대한 액세스 권한을 잃게됩니다:\n\n - Hotspot\n - HNT\n - 지갑',
        },
      },
    },
  },
  auth: {
    title: 'PIN 입력',
    error: '잘못된 PIN',
    enter_current: '계속하려면 현재 PIN을 입력하세요',
  },
  hotspots: {
    sort_by: 'Hotspot 정렬 기준',
    new: {
      title: '새 Hotspot 추가',
      subtitle:
        'Hotspot을 방금 추가했다면 잠시 기다려 주세요. 네트워크가 Hotspot을 전파하는 데 몇 분 정도 걸립니다.',
      setup: 'Hotspot 설정',
      explorer: '내 주변의 Hotspot 보기',
    },
    owned: {
      title: '내 Hotspot',
      title_no_hotspots: 'Hotspot',
      your_hotspots: '내 Hotspot',
      filter: {
        new: '최신 Hotspot',
        near: '가장 가까운 Hotspot',
        earn: '가장 많이 채굴한 Hotspot',
        offline: '오프라인 Hotspot',
        followed: '팔로우하는 Hotspot',
      },
    },
    search: {
      title: 'Hotspot 검색',
      my_hotspots: '내 Hotspot',
      all_hotspots: '모든 Hotspot',
      placeholder: '검색...',
      recent_searches: '최근 검색',
      tips: '검색 팁',
      tips_body:
        'Hotspot 이름(예: 장난스러운 동물 이름) 또는 장소 이름(예: 뉴욕시)을 입력하세요.\n\n참고: 최근 10분 이내에 추가된 Hospot은 나타나지 않을 수 있습니다.',
    },
    empty: {
      body: '아직 Hotspot을 추가하거나 팔로우하지 않았습니다.',
      failed:
        'API 또는 네트워크 중단으로 인해 Hotspot을 가져 오는 데 문제가 있습니다. 나중에 다시 시도해 주세요.',
    },
    list: {
      no_offline: '오프라인 Hotspot 없음',
      online: '온라인 Hotspot',
      no_results: '결과 없음',
    },
    ticker:
      '{{formattedHotspotCount}}Hotspot • 오라클 가격: {{oraclePrice}}• 블록 시간: {{formattedBlockTime}}초 • ',
    ticker_no_block:
      '{{formattedHotspotCount}}Hotspot • 오라클 가격: {{oraclePrice}}• ',
  },
  permissions: {
    location: {
      title: '위치 권한',
      message:
        'Helium이 Bluetooth 검색을 위해 사용자의 위치에 액세스하고 위치 확인을 활성화해야 합니다. 이 정보는 절대 판매되거나 공유되지 않습니다.',
    },
  },
  time: {
    morning: '아침',
    evening: '저녁',
    afternoon: '오후',
  },
  notifications: {
    tapToReadMore: '탭하여 자세히 알아보기',
    share: '공유',
    list: { title: 'Notifications' },
    none: {
      title: '알림이\n없습니다',
      subtitle:
        '여기에서 Hotspot 및 The People’s Network에 대한 뉴스, 업데이트 및 알림을 받을 수 있습니다.',
    },
  },
  transactions: {
    pending: '보류 중',
    mining: '채굴 보상',
    sent: 'HNT 전송',
    burnHNT: 'HNT 버닝',
    received: 'HNT 수신',
    added: '블록체인에 Hotspot 추가',
    location: '위치 확인',
    location_v2: 'Hotspot 업데이트',
    transfer: 'Hotspot 전송',
    transferSell: 'Hotspot 전송(판매)',
    transferBuy: 'Hotspot 전송(구매)',
    view: '보기',
    view_transactions: '트랜잭션 보기',
    filter: {
      all: '모든 활동',
      mining: '채굴 보상',
      payment: '결제 트랜잭션',
      hotspot: 'Hotspot 트랜잭션',
      pending: '트랜잭션 보류 중',
    },
    no_results: '결과 없음',
  },
  hotspot_settings: {
    title: 'Hotspot 설정',
    pairing: {
      title: 'Wi-Fi 업데이트 또는 진단 도구 실행',
      subtitle: '계속하기 전에 페어링해야 합니다.',
      scan: '페어링',
    },
    transfer: {
      title: 'Hotspot 전송',
      subtitle: '다른 Helium 지갑으로 전송합니다.',
      begin: 'Hotspot 전송 시작',
    },
    update: {
      title: 'Hotspot 업데이트',
      subtitle: 'Hotspot 위치 또는 안테나 세부사항입니다.',
    },
    discovery: {
      title: 'Discovery 모드',
      subtitle: '이상적인 Hotspot 배치를 식별합니다.',
      no_location_error: {
        title: 'Discovery 모드를 시작할 수 없음',
        message: 'Discovery 모드를 시작하기 전에 Hotspot 위치를 설정하세요.',
      },
      unasserted_hotspot_warning: {
        title: 'Hotspot 위치가 없음',
        message:
          '응답하는 Hotspot을 시각화하기 위해 휴대폰 위치가 Hotspot의 자리 표시자로 사용됩니다.',
      },
    },
    diagnostics: {
      title: '진단 보고서',
      no_hotspots: 'Hotspot을 찾을 수 없음',
      scan_again: '다시 스캔',
      generating_report: '보고서 생성',
      p2p: 'Peer-to-Peer 연결',
      no_connection: '연결되지 않음',
      outbound: '아웃바운드',
      outbound_help:
        'Hotspot을 블록체인의 피어에 연결할 수 없습니다. 이는 라우터 문제, 인터넷 연결 없음 또는 수신되는 연결을 차단하는 방화벽 때문일 수 있습니다.',
      inbound: '인바운드',
      inbound_help:
        '블록체인 피어를 Hotspot에 연결할 수 없습니다. 이는 라우터 문제, 인터넷 연결 없음 또는 수신되는 연결을 차단하는 방화벽 때문일 수 있습니다.',
      activity: '활동',
      blockchain_sync: '블록체인 동기화',
      synced: '{{percent}} 동기화됨',
      blockchain_height_help:
        '채굴을 시작하기 전에 Hotspot을 100% 동기화해야 합니다. 인터넷 속도에 따라 몇 시간 이상 걸릴 수 있습니다. Hotspot의 전원을 켜고 인터넷에 연결된 상태를 유지하세요.',
      last_challenged: '마지막 Challenge 처리',
      last_challenged_help:
        '인접 Hotspot이 귀하의 Hotspot 위치를 확인할 수 없습니다. 대부분의 경우, 이는 무선 신호가 도달할 수 없는 영역에 안테나가 있기 때문입니다(건물로 차단됨, 안테나가 아래로 향함, 안테나가 실내에 위치함).',
      firmware: 'Hotspot 펌웨어',
      hotspot_type: 'Hotspot 제조사',
      app_version: '앱 버전',
      wifi_mac: 'Wi-Fi MAC',
      eth_mac: '이더넷 MAC',
      nat_type: 'NAT 유형',
      ip: 'IP 주소',
      report_generated: '보고서 생성',
      send_to_support: '지원팀에 보고서 보내기',
      help_link: '가능한 솔루션에 대해 자세히 알아보기',
      email_client_missing:
        '설치된 호환 가능한 이메일 클라이언트를 찾을 수 없습니다',
      other_info: '추가 정보',
      unavailable_warning:
        '* Hotspot이 완전히 부팅되기 전에는 진단 도구를 사용하지 못할 수 있습니다. 데이터가 누락된 경우 돌아가서 진단 보고서를 다시 생성하세요.',
    },
    wifi: {
      title: 'Wi-Fi 네트워크',
      connected_via: '다음을 통해 연결',
      not_connected: '연결되지 않음',
      available_wifi: '사용 가능한 Wi-Fi 네트워크',
      show_password: '암호 표시',
      hide_password: '암호 숨기기',
      ethernet: '이더넷',
    },
    options: {
      paired: 'Hotspot과 페어링',
      diagnostic: '진단 도구',
      wifi: 'Wi-Fi 네트워크',
      reassert: '위치 업데이트',
      firmware: 'Hotspot 펌웨어',
    },
    reassert: {
      remaining:
        '무료 </purple></b> Hotspot 위치 확인 업데이트가 <b><purple>{{count}}개 남아 있습니다.',
      remaining_plural:
        '무료 </purple></b> Hotspot 위치 확인 업데이트가 <b><purple>{{count}}개 남아 있습니다.',
      change_location: '위치 변경',
      confirm: '확인함',
      cost: '위치 재확인에 소요되는 비용:',
      insufficient_funds:
        '이 확인을 위해 사용할 수 있는\n자금이 없습니다. HNT를 획득하세요.',
      confirm_location: 'Hotspot 위치 변경을 확인하세요',
      charge: '{{amount}}의 금액이 청구됩니다.',
      pending_message: '위치 업데이트가 보류 중입니다.',
      assert_pending: '확인 보류 중...',
      failTitle: 'Hotspot 재확인에 실패했습니다',
      failSubtitle: '나중에 다시 시도하세요',
      current_location: '현재 위치',
      new_location: '새로운 위치',
      antenna_details: '안테나/높이 세부 정보',
      update_antenna: '안테나 업데이트',
      submit: 'Hotspot 업데이트 트랜잭션이 제출되었으며 보류 중입니다.',
      already_pending:
        '트랜잭션이 보류 중일 때에는 Hotspot을 업데이트할 수 없습니다. 나중에 다시 시도하세요.',
    },
  },
  hotspot_details: {
    checklist: '체크리스트',
    title: 'Hotspot 세부사항',
    owner: '{{address}}이(가) 소유함',
    owner_you: '사용자가 소유함',
    pass_rate: '통과 비율',
    reward_title: 'HNT 보상',
    witness_title: '평균 감시',
    challenge_title: 'Challenge',
    challenge_sub_title: '(감시, challenger, 또는 challengee)',
    picker_title: '이전',
    overview: '개요',
    no_location: '위치 없음',
    picker_options: { 7: '지난 7일', 14: '지난 14일', 30: '지난 30일' },
    picker_prompt: '범위 선택',
    status_online: '온라인',
    status_offline: '주의 필요',
    status_syncing: '동기화 중',
    relayed: '전달됨',
    status_prompt_online: {
      title: 'Hotspot이 온라인 상태이며 동기화 중입니다.',
      subtitle_active: '상태: 블록 {{hotspotBlock}}의 {{currentBlock}}',
      subtitle_starting: '동기화 시작...',
    },
    status_prompt_offline: {
      title: 'Hotspot이 오프라인이고 동기화되지 않았습니다.',
    },
    options: {
      settings: '설정',
      viewExplorer: '탐색기에서 보기',
      share: '공유',
    },
    no_location_title: '확인된 위치 없음',
    no_location_body: '시작하려면 Hotspot과 페어링하세요.',
    percent_synced: '{{percent}}% 동기화됨',
    starting_sync: '동기화 시작...',
    relay_prompt: {
      title: 'Hotspot 전달됨',
      message:
        'Hotspot 연결이 채굴에 영향을 미칠 수 있는 네트워크의 다른 Hotspot을 통해 전달되고 있습니다. 릴레이에서 Hotspot을 제거하려면 문제 해결 가이드를 참조하세요.',
    },
  },
  transfer: {
    title: 'Hotspot 전송',
    heading: 'Hotspot 중 하나의 소유권을 안전하게 변경하세요.',
    body:
      'Hotspot이 전송되면 더 이상 앱에서 이 Hotspot을 볼 수 없으며 이 Hotspot에서 HNT를 획득할 수 없습니다.\n\n전송을 계속하려면 아래 상자에 Hotspot 이름을 입력하세요.',
    button_title: '전송 계속',
    input_placeholder: '여기에 Hotspot 이름 입력',
    exists_alert_title: '전송이 이미 존재함',
    exists_alert_body: '이 Hotspot에 대해 보류 중인 활성 전송이 있습니다.',
    amount_changed_alert_title: '요청 금액 변경',
    amount_changed_alert_body:
      '판매자가 요청한 금액이 변경되었습니다. 요청된 새로운 금액은 {{amount}} HNT입니다.',
    nonce_alert_title: '전송을 완료할 수 없음',
    nonce_alert_body:
      '판매자가 Hotspot 전송 트랜잭션을 시작한 후 HNT를 보내거나 받은 것 같습니다. Hotspot 판매자에게 연락하여 새로운 Hotspot 전송 트랜잭션을 생성하고 Hotspot 전송이 완료될 때까지 무관한 결재 트랜잭션을 피하세요.',
    incomplete_alert_title: '전송이 완료되지 않음',
    incomplete_alert_body:
      '이 전송을 완료할 수 없습니다. 승인된 구매자인지 확인하거나 판매자에게 자세한 내용을 문의하세요.',
    canceled_alert_title: '전송이 취소됨',
    canceled_alert_body:
      '이 전송은 더 이상 활성화되지 않습니다. 판매자에게 자세한 내용을 문의하세요.',
    notification_button: '트랜잭션 보기',
    deployModeTransferDisableTitle: '핫스팟 전송 비활성화됨',
    deployModeTransferDisabled: '배포 모드에서는 핫스팟 전송이 비활성화됩니다.',
    cancel: {
      button_title: '전송 보류. 취소하려면 탭하세요.',
      failed_alert_title: '전송을 취소할 수 없음',
      failed_alert_body: 'API에서 응답이 없습니다. 다시 시도하세요.',
      alert_title: 'Hotspot 전송 취소',
      alert_body:
        '{{gateway}}에 대해 {{buyer}}에게 보낼 보류 중인 Hotspot 전송이 있습니다.\n\n그래도 취소하시겠습니까?',
      alert_back: '돌아가기',
      alert_confirm: '전송 취소',
    },
    unknown: '알 수 없음',
  },
  activity_details: {
    security_tokens: 'Security Token',
    reward: '보상',
    from: '발신처',
    to: '수신처',
    memo: '메모',
    location: '위치',
    seller: '판매자',
    buyer: '구매자',
    owner: '소유자',
    my_account: '내 계정',
    view_block: '블록 보기',
    elevation: '높이',
    antenna: '안테나',
    rewardTypes: {
      poc_challengees: 'PoC',
      poc_challengers: 'Challenger',
      poc_witnesses: '감시',
      consensus: 'Consensus',
      data_credits: '패킷 전송',
      securities: 'Security Token',
    },
    staking_fee_payer: '{{payer}}에 의해 결제됨',
  },
  checklist: {
    title: '체크리스트',
    blocks: {
      not:
        'Hotspot은 채굴에 앞서 반드시 완전히 동기화되어야 합니다. 새로운 Hotspot은 동기화에 최대 96시간이 소요될 수 있습니다.',
      full: 'Hotspot이 완전히 동기화되었습니다.',
      partial:
        'Hotspot은 Helium 블록체인에 블록 {{count}}개가 더 요구되며 대략{{percent}}% 정도 동기화되었습니다.',
      partial_plural:
        'Hotspot은 Helium 블록체인에 블록 {{count}}개가 더 요구되며 대략 {{percent}}% 정도 동기화되었습니다.',
      title: '블록체인 동기화',
    },
    status: {
      online: 'Hotspot이 인터넷에 연결되었습니다.',
      offline:
        'Hotspot이 온라인 상태가 아닙니다. 동기화 및 채굴을 위해서는 Hotspot이 온라인 상태여야 합니다.',
      title: 'Hotspot 상태',
    },
    challenger: {
      success: 'Hotspot이 블록 {{count}}개 전에 Challenge를 발행했습니다.',
      success_plural:
        'Hotspot이 블록 {{count}}개 전에 Challenge를 발행했습니다.',
      fail:
        'Hotspot이 Challenge를 아직 발행하지 않았습니다. Hotspot은 240 블록 또는 약 4시간마다 자동으로 Challenge를 생성합니다.',
      title: 'Challenge 생성',
    },
    challenge_witness: {
      success: 'Hotspot이 최근 Challenge를 감시했습니다.',
      fail: 'Hotspot이 근처 Hotspot의 Challenge를 수신합니다.',
      title: 'Challenge 감시',
    },
    witness: {
      success: '이 Hotspot의 감시 목록에는 Hotspot {{count}}개가 있습니다.',
      success_plural:
        '이 Hotspot의 감시 목록에는 Hotspot {{count}}개가 있습니다.',
      fail:
        '아직 감시가 없습니다. 새로운 Hotspot이나 최근 위치 또는 안테나 설정이 업데이트된 Hotspot에는 감시가 없습니다.',
      title: '감시 목록',
    },
    challengee: {
      success:
        'Hotspot이 블록 {{count}}개 전에 마지막으로 Challenge에 참여했습니다.',
      success_plural:
        'Hotspot이 블록 {{count}}개 전에 마지막으로 Challenge에 참여했습니다.',
      fail:
        '온라인 Hotspot은 240 블록(또는 4 시간)마다 Challenge를 받으며 Challenge를 받기까지 다소 시간이 소요될 수 있습니다.',
      title: 'Challenge 통과',
    },
    data_transfer: {
      success: 'Hotspot이 최근 데이터 패킷을 전송했습니다.',
      fail:
        'Hotspot이 자동으로 기기 데이터를 전송하고 HNT를 획득합니다. 이 Hotspot은 아직 데이터를 전송하지 않았습니다.',
      title: '데이터 전송',
    },
    auto: '자동',
    auto_hours: '몇 시간마다',
    complete: '완료',
    online: '온라인',
  },
  discovery: {
    troubleshooting_guide: '문제 해결 가이드',
    syncing_prompt: {
      title: 'Discovery 모드를 시작할 수 없음',
      message: 'Hotspot이 완전히 동기화되어야 합니다. 나중에 다시 시도하세요.',
    },
    offline_prompt: {
      title: 'Discovery 모드를 시작할 수 없음',
      message:
        'Hotspot이 오프라인 상태입니다. 인터넷에 연결하고 다시 시도하세요.',
    },
    relay_prompt: {
      title: 'Hotspot 전달됨',
      message:
        'Discovery 모드가 실행되는 전달된 Hotspot은 인접한 Hotspot에서 응답을 받지 못할 수 있습니다. 릴레이에서 Hotspot을 제거하려면 문제 해결 가이드를 참조하세요.',
    },
    session_error_prompt: {
      title: 'Discovery 모드를 시작할 수 없음',
      message:
        'Hotspot이 릴레이에서 뒤쳐져 응답하지 않을 수 있습니다. 라우터 설정을 확인하고 다시 시도하세요.',
    },
    begin: {
      title: 'Discovery 모드',
      subtitle:
        '{{duration}} 동안 라디오 패킷을 전송하여 어떤 Hotspot에서 사용자가 수신되는지 확인합니다.',
      body:
        'Discovery 모드는 현재 하루에 최대 {{requestsPerDay}} 세션까지 무료로 사용할 수 있습니다.',
      previous_sessions: '이전 세션',
      last_30_days: '(지난 30일)',
      start_session: '새 세션 시작',
      no_sessions: '오늘은 세션이 종료되었습니다.\n내일 다시 시도하세요.',
      responses: '응답 {{count}}개',
      responses_plural: '응답 {{count}}개',
      initiation_error: '세션을 시작할 수 없음',
      error: {
        title: '오류 발생',
        subtitle:
          'Discovery 모드를 로드하는 중에 문제가 발생했습니다. 나중에 다시 시도하세요',
      },
      location_opts: {
        hotspot: '임시 위치 사용*',
        asserted: '확인된 위치 사용',
        info:
          '*위치를 설정하기 전에 Hotspot 범위를 테스트하려는 경우 유용합니다.',
      },
    },
    results: {
      title: 'Discovery 모드 결과',
      share: '결과 공유',
      responded: '응답한 Hotspot',
      elapsed_time: '경과 시간',
      result_time: '결과 시간',
      searching: '검색',
      distance: '{{distance}}{{unit}} 떨어져 있음',
      added_to_followed: '다음의 Hotspot에 추가됨',
    },
    share: {
      subject: 'Discovery 결과',
      hotspot_name: 'Hotspot 이름',
      packets_heard: '수신된 패킷',
    },
  },
  antennas: {
    onboarding: {
      title: '안테나 설정',
      subtitle: 'Hotspot의 안테나 및 높이 세부 정보를 제출하세요.',
      gain: 'TX / RX 증가',
      dbi: 'dBi',
      elevation: '높이 (미터)',
      select: '안테나 선택',
    },
    elevation_info: {
      title: 'Hotspot 높이',
      desc:
        '안테나가 지면에 비해 얼마나 높은지 추정하세요. 단층집의 지붕에 있는 안테나는 일반적으로 5미터입니다.',
    },
    gain_info: {
      title: '안테나 TX / RX 증가',
      desc:
        '1과 15 사이에서 소수점 한 자리까지의 값입니다. Hotspot 또는 안테나 제조업체에서 제공합니다.',
    },
  },
}
