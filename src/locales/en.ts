export default {
  back: 'Back',
  ordinals: [
    '1st',
    '2nd',
    '3rd',
    '4th',
    '5th',
    '6th',
    '7th',
    '8th',
    '9th',
    '10th',
    '11th',
    '12th',
  ],
  account_setup: {
    welcome: {
      title: 'Welcome\nto Helium',
      subtitle:
        'Host a Hotspot and earn <b><purple>$HNT</purple></b>,\na new cryptocurrency,\nfor building The People’s Network.',
      create_account: 'Create an Account',
      import_account: 'Import Existing Account',
    },
    warning: {
      title: 'Creating\nSecure Account.',
      subtitle:
        'Helium accounts are protected by\n<b><purple>12 unique words</purple></b>, that act as\na password for signing in or\nrecovering accounts.',
      generate: 'Generate my 12 words',
    },
    generating: 'GENERATING YOUR 12 WORDS...',
    passphrase: {
      title: 'Your 12 Word\nPassword',
      subtitle:
        'It is crucial you <b>write all of these\n12 words down, in order</b>.\n\n<red>Helium cannot recover these words.</red>',
      warning: 'Helium cannot recover these words',
      next: 'I have written these down',
    },
    confirm: {
      title: 'Confirm\nYour Words',
      subtitle:
        'Which word below was your <b><purple>{{ordinal}} word?</purple></b>',
      forgot: 'I forgot my words',
      failed: {
        title: 'Sorry...',
        subtitle_1: "You've reentered the seed phrase incorrectly.",
        subtitle_2: 'Please try again.',
        try_again: 'Try Again',
      },
    },
    create_pin: {
      title: 'Set PIN Code',
      subtitle:
        'As a final secure step, let’s secure your account with a PIN Code.',
    },
    confirm_pin: {
      title: 'Repeat PIN',
      subtitle: 'Re-enter your PIN',
    },
    enable_notifications: {
      title: 'Enable Notifications',
      subtitle:
        'Be alerted when important updates happen to your account or to your Hotspots.',
      mining: 'Hotspot is Mining',
      later: "No thanks, I'll set it up later",
    },
  },
  learn: {
    title: 'How do I earn\nHNT?',
    slides: [
      {
        topTitle: 'Listen for Beacons',
        topBody: 'Your Hotspot will listen for beacons from nearby Hotspots',
        bottomTitle: 'How do Beacons work?',
        bottomBody:
          'Beacons are special packets, transmitted by Hotspots, that can be heard by any other neighbouring Hotspots.\n\nThese signals allow the Network to determine which Hotspots are within receiving range of each other. These neighbours are called ‘witnesses’ and Hotspots that hear your beacon are added to your Witness List.',
      },
      {
        topTitle: 'Listen for Beacons',
        topBody: 'Your Hotspot will listen for beacons from nearby Hotspots',
        bottomTitle: 'How do Beacons work?',
        bottomBody:
          'Beacons are special packets, transmitted by Hotspots, that can be heard by any other neighbouring Hotspots.\n\nThese signals allow the Network to determine which Hotspots are within receiving range of each other. These neighbours are called ‘witnesses’ and Hotspots that hear your beacon are added to your Witness List.',
      },
      {
        topTitle: 'Listen for Beacons',
        topBody: 'Your Hotspot will listen for beacons from nearby Hotspots',
        bottomTitle: 'How do Beacons work?',
        bottomBody:
          'Beacons are special packets, transmitted by Hotspots, that can be heard by any other neighbouring Hotspots.\n\nThese signals allow the Network to determine which Hotspots are within receiving range of each other. These neighbours are called ‘witnesses’ and Hotspots that hear your beacon are added to your Witness List.',
      },
    ],
    next: "I've read the guide",
  },
  generic: {
    done: 'Done',
    understand: 'I understand',
    blocks: 'Blocks',
    active: 'Active',
    skip: 'Skip',
    next: 'Next',
    need_help: 'I Need Help',
    scan_again: 'Scan Again',
    submit: 'Submit',
    balance: 'Your Balance',
    continue: 'Continue',
    skip_for_now: 'Skip for now',
    go_to_account: 'Go to My Account',
    go_to_settings: 'Go to Settings',
    hotspot: 'Hotspot',
    location: 'Location',
    challenger: 'Challenger',
    learn_more: 'Learn More',
    cancel: 'Cancel',
    ok: 'OK',
    unknown: 'Unknown',
    online: 'Online',
    offline: 'Offline',
    fee: 'Fee',
    to: 'To',
    from: 'From',
    new: 'New',
    save: 'Save',
    connect: 'Connect',
    go_back: 'Go Back',
    forget: 'Forget',
    error: 'Error',
    loading: 'Loading...',
  },
  hotspot_setup: {
    selection: {
      title: 'Choose\nyour Hotspot.',
      subtitle: 'What kind of Hotspot do you\nwish to add?',
      option_one: 'Helium\nHotspot',
      option_two: 'RAK\nHotspot Miner',
      third_party_header: 'Other Hotspots',
      helium_edition: 'For the Helium Network',
      fine_print:
        'RAK Hotspot Miners have special firmware preloaded by RAK. Double check your hardware is a RAK Hotspot Miner before proceeding.',
    },
    start: {
      title: 'Set up Hotspot',
      subtitle:
        'Hotspots allow you to earn HNT by building out The People’s Network.',
      info: 'How does this work? ⓘ',
      next: "Let's get started",
      not_now: 'Not right now',
    },
    education: {
      title: 'Placing\nyour Hotspot.',
      cards: [
        {
          title: 'Give me a nice view',
          subtitle:
            'Hotspots love places where they can see plenty of sky and spaced at least 300 meters away from other Hotspots. ',
        },
        {
          title: "Don't hide me",
          subtitle:
            "Hotspots shouldn't hide in a nightstand or bookcase. Put it next to a window instead.",
        },
        {
          title: 'Buildings may block my signals',
          subtitle:
            "Nearby buildings may decrease your Hotspot's coverage for nearby devices.",
        },
        {
          title: 'Finally - I hate bug screens!',
          subtitle:
            'Try to keep your Hotspot away from metal meshes, which can block radio signals dramatically.',
        },
      ],
      next: "I've read the guide",
    },
    diagnostics: {
      title: 'Diagnostics',
      p_1:
        '<b><white>Diagnostic support allows Helium to identify issues with your Hotspot in a secure way.</white></b>\n\nHelium will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>support@helium.com</b></purple> from the email used to purchase the Hotspot.',
    },
    power: {
      title: 'Power Up',
      next: "I'm powered up",
      subtitle_1: 'Attach the antenna and plug in the provided power adapter.',
      rak_subtitle_1:
        'Plug in the provided power adapter into an outlet near a window.',
      subtitle_2:
        'Your Hotspot will boot up, and its light will become Green when ready.',
      rak_subtitle_2:
        'The RAK Hotspot Miner will show a red LED light once it’s powered on.',
    },
    pair: {
      title: 'Bluetooth',
      subtitle_1:
        'Press the black button on your Hotspot. Its light should turn blue.',
      rak_subtitle_1: 'There is no pairing button on the RAK Hotspot Miner.',
      subtitle_2: "Ensure your phone's bluetooth is on before proceeding",
      rak_subtitle_2:
        'Bluetooth is automatically enabled for 5 minutes after the RAK Hotspot Miner is powered on.\n\nHotspot can take up to 1 minute to fully boot up.\n\nPress Next to scan.',
      alert_no_permissions: {
        title: 'Authorize Bluetooth',
        body:
          'Helium needs permission to use Bluetooth. You can enable Bluetooth permission in Settings.',
      },
      alert_ble_off: {
        title: 'Enable Bluetooth',
        body:
          'To start pairing, turn on Bluetooth. Keep Bluetooth on until you finish registration.',
      },
      scan: 'Scan for my Hotspot',
    },
    ble_scan: {
      title: 'SCANNING FOR HOTSPOTS',
      cancel: 'Cancel Scan',
      connecting: 'Connecting to {{hotspotName}}',
    },
    ble_select: {
      hotspots_found: '{{count}} Hotspot found.',
      hotspots_found_plural: '{{count}} Hotspots found',
      subtitle: 'Select your Hotspot to continue.',
    },
    ble_error: {
      title: 'No Hotspots Found',
      enablePairing: 'Enable Pairing Mode',
      pairingInstructions:
        'Refer to manufacturer instructions to enable Bluetooth',
    },
    wifi_scan: {
      title: 'Wi-Fi',
      settings_title: 'Wi-Fi Settings',
      subtitle:
        'Select the Wi-Fi network you’d like your Hotspot to connect to.',
      ethernet: 'Use Ethernet Instead',
      connection_failed: 'Connection failed, please try again',
      disconnect_failed: 'Disconnect failed, please try again',
      connected:
        'Your Hotspot is <green>Online</green> and connected to %{network}.',
      scan_fail_subtitle:
        'Your Hotspot has found no Wi-Fi networks nearby. Check your router is online and nearby.',
      tip: 'Did you check if your <blue>Wi-fi is set to hidden</blue>?',
      saved_networks: 'Configured Network',
      available_networks: 'Available Networks',
      disconnect_help:
        'To update the password or connect to a new network, first forget the old network.',
      disconnect: 'Forget Network',
    },
    disconnect_dialog: {
      title: 'Forget Network?',
      body: 'The Hotspot will no longer automatically connect to {{wifiName}}.',
    },
    wifi_password: {
      join_title: 'Enter Password',
      update_title: 'Update Wi-Fi',
      message:
        'The Hotspot is currently connected to this network. Changing the password can cause the Hotspot to go offline.',
      error_title: 'Invalid Password',
      subtitle:
        'Enter your Wi-Fi’s credentials to connect your Hotspot to this Network.',
      placeholder: 'Password',
      show_password: 'Show Password',
      hide_password: 'Hide Password',
      connecting: 'Connecting to Network',
      forget: 'Forget',
      forget_network: 'Forget Network',
      forget_alert_title: 'Forget Network?',
      forget_alert_message:
        'This Hotspot will no longer automatically connect to ',
    },
    ethernet: {
      title: "Let's use Ethernet",
      subtitle:
        'Plug your Hotspot into an available and active port on your internet router.',
      secure: 'Please connect your ethernet cable securely',
      next: 'My Hotspot is Connected',
    },
    firmware_update: {
      title: 'Update Available',
      subtitle: 'Your Hotspot needs a firmware update before you can continue.',
      current_version: 'Current Version',
      required_version: 'Required Version',
      explanation:
        'Your Hotspot will check for updates automatically. This can take about 10 minutes. Leave it plugged in and check back later.',
      next: 'Got it',
    },
    add_hotspot: {
      title: 'Add Hotspot',
      subtitle:
        'Adding Hotspots requires a small fee (paid in Data Credits) to verify its authenticity.',
      checking_status: 'Checking Hotspot status...',
      already_added:
        'You already added this hotspot to your wallet. Continue to the next screen to assert its location.',
      not_owned:
        'You do not own this hotspot and cannot add it to your wallet.',
      label: 'CURRENT ADD HOTSPOT FEE (PAID IN DATA CREDITS)',
      help_link: 'What are Data Credits?',
      support_title: 'What are Data Credits?',
      support_answer:
        'Data Credits are required to send data over the Helium Network.',
      error:
        'Cannot proceed with Add Hotspot. If you purchased the Hotspot from Helium, please contact support@helium.com and include mac address {{mac}}',
      back: 'Back to Hotspot Pairing',
      wait_error_title: 'Please Try Again',
      wait_error_body:
        'Hotspot miner is waiting to start. Please try again in a few minutes.',
    },
    enable_location: {
      title: 'Set Hotspot\nLocation',
      subtitle:
        'We need to set a location for your Hotspot. We can use your phone to do this.',
      p_1: 'First, we’ll ask for permission to access your phone’s location.',
      settings_p_1:
        "In order to update your Hotspot's location, we'll need additional location permissions.",
      settings_p_2:
        "Tap the button below to be taken to Settings. Under 'Location' tap 'While using the App'.",
      next: 'Ask for Permissions',
      cancel: "No thanks, I'll set it up later",
    },
    location_fee: {
      title: 'Location Fee',
      subtitle_free: 'Your Location Fee ($10) has been prepaid.',
      subtitle_fee:
        'You need to pay a $10 Location Fee (in DC) to confirm this location.',
      confirm_location:
        'Confirm the location selected is correct and register your Hotspot.',
      pending_p_1:
        'Your Hotspot has a Confirm Location transaction pending in the blockchain.',
      pending_p_2:
        "If you'd like to change the Hotspot's location, wait for the previous transaction to complete before updating its location.",
      balance: 'Balance:',
      fee: 'Fee:',
      no_funds: 'There is insufficient HNT in your account balance',
      calculating_text: 'Calculating HNT Amount',
      error_title: 'Error',
      error_body: 'There was an error loading fee data. Please try again.',
      next: 'Register Hotspot',
      fee_next: 'Pay Fee & Register Hotspot',
    },
    location: {
      title: 'Hotspot Location',
      next: 'Set Location',
    },
    progress: {
      title: 'REGISTERING HOTSPOT',
      subtitle:
        'This can take a few minutes so feel free to close this screen.',
      next: 'Go to Wallet',
    },
    error: {
      alertTitle: 'Servers Unable to Respond',
      alertMessage:
        'Request to servers have timed out and we cannot add your Hotspot at this time.\n\nPlease contact support@helium.com and note MAC address %{mac}.',
    },
  },
  account_import: {
    word_entry: {
      title: 'Enter Recovery\nSeed Phrase',
      directions: 'Enter the <b>{{ordinal}}</b> Word',
      placeholder: '{{ordinal}} word',
      subtitle: 'Recovery Seed Phrases are not case-sensitive',
    },
    confirm: {
      title: 'Confirm Seed Phrase',
      subtitle:
        "Here are the 12 words you've entered. If needed, you can tap the words to update.",
      next: 'Submit Seed Phrase',
    },
    complete: {
      title: 'Recovering Account...',
      subtitle: 'This will just take a moment.',
    },
    alert: {
      title: 'Error',
      body: "This seed phrase doesn't correspond to a Helium account",
    },
  },
  wallet: {
    title: 'My Wallet',
    copiedToClipboard: 'Copied {{address}} to clipboard',
    share: 'Share',
  },
  send: {
    title: {
      payment: 'Send HNT',
      dcBurn: 'Burn HNT',
      transfer: 'Transfer Hotspot',
    },
    available: '{{ amount }} Available',
    address: {
      label: 'Recipient Address',
      label_transfer: 'Buyer Address',
      placeholder: 'Enter Address...',
      seller: 'Seller Address',
    },
    amount: {
      label: 'Amount (HNT)',
      label_transfer: 'Requested Amount (HNT)',
      placeholder: '0',
      placeholder_transfer: '(Optional) Request Payment for Hotspot...',
    },
    dcAmount: {
      label: 'Equivalent To (DC)',
      placeholder: '0',
    },
    memo: {
      label: 'Memo',
      placeholder: 'Enter Memo... (optional)',
    },
    sendMax: 'Send Max',
    button: {
      payment: 'Send HNT',
      dcBurn: 'Burn HNT',
      transfer_request: 'Send Transfer Request',
      transfer_complete: 'Complete Transfer',
    },
    qrInfo: 'QR INFO',
    error: 'There was an error submitting this transaction. Please try again.',
    hotspot_label: 'Hotspot',
    last_activity: 'LAST REPORTED ACTIVITY: {{activity}}',
  },
  more: {
    title: 'Settings',
    sections: {
      security: {
        title: 'Security',
        enablePin: 'Enable PIN',
        requirePin: 'Require PIN',
        resetPin: 'Reset PIN',
        requirePinForPayments: 'Require PIN for Payments',
        authIntervals: {
          immediately: 'Immediately',
          after_1_min: 'After 1 minute',
          after_5_min: 'After 5 minutes',
          after_15_min: 'After 15 minutes',
          after_1_hr: 'After 1 hour',
          after_4_hr: 'After 4 hours',
        },
        revealWords: 'Reveal Words',
      },
      learn: {
        title: 'Learn',
        tokenEarnings: 'Token Earnings',
        hotspotPlacement: 'Hotspot Placement',
        support: 'Support',
        troubleshooting: 'Troubleshooting',
        joinDiscord: 'Join Helium Discord',
      },
      account: {
        title: 'Account',
        language: 'Language',
        units: 'Units',
        signOut: 'Sign Out',
        signOutAlert: {
          title: 'Warning!',
          body:
            'This will remove all account info from this device. The only way to restore access to your account and Hotspots will be by using your 12 word recovery seed phrase.',
        },
      },
    },
  },
  auth: {
    title: 'Enter Your PIN',
    error: 'Incorrect PIN',
    enter_current: 'Enter your current PIN to continue',
  },
  hotspots: {
    new: {
      title: 'Add a New Hotspot',
      subtitle:
        'If you just added a Hotspot, hang tight. It takes a few moments for the Network to propagate the Hotspot.',
      setup: 'Set up Hotspot',
      explorer: 'Global Hotspot Explorer',
    },
    owned: {
      title: 'My Hotspots',
      reward_summary: 'Your Hotspot mined {{hntAmount}} in the past 24 hours.',
      reward_summary_plural:
        'Your {{count}} Hotspots mined {{hntAmount}} in the past 24 hours.',
      your_hotspots: 'Your Hotspots',
    },
    empty: {
      body: "You haven't added or followed any Hotspots yet.",
    },
  },
  permissions: {
    location: {
      title: 'Location Permission',
      message:
        'Helium Wallet needs access to your location for Bluetooth LE discovery.',
    },
  },
  time: {
    morning: 'Morning',
    evening: 'Evening',
    afternoon: 'Afternoon',
    day_header: 'Good\n{{timeOfDay}}.',
  },
  notifications: {
    share: 'SHARE',
    list: { title: 'Notifications' },
    none: {
      title: 'You have no\nNotifications',
      subtitle:
        'Here you’ll get news, updates and alerts about your Hotspots and The People’s Network.',
    },
  },
  transactions: {
    pending: 'Pending',
    mining: 'Mining Rewards',
    sent: 'Sent HNT',
    burnHNT: 'Burn HNT',
    received: 'Received HNT',
    added: 'Hotspot Added to Blockchain',
    location: 'Confirm Location',
    transfer: 'Hotspot Transfer',
    transferSell: 'Transfer Hotspot (Sell)',
    transferBuy: 'Transfer Hotspot (Buy)',
    view: 'View',
    filter: {
      all: 'All Activity',
      mining: 'Mining Rewards',
      payment: 'Payment Transactions',
      hotspot: 'Hotspot Transactions',
      pending: 'Pending Transactions',
    },
    no_results: 'No Results',
  },
  hotspot_settings: {
    title: 'Hotspot Settings',
    pairing: {
      title: 'Hotspot Pairing Required',
      subtitle:
        'Press the button on your Helium Hotspot, or power-cycle your RAK Hotspot Miner.',
      scan: 'Scan for my Hotspot',
    },
    transfer: {
      title: 'Transfer Hotspot',
      subtitle: 'Transfer Hotspot to another Helium Wallet Account.',
      begin: 'Begin Hotspot Transfer',
    },
    diagnostics: {
      title: 'Diagnostic Report',
      no_hotspots: 'No Hotspots Found',
      scan_again: 'Scan again',
      generating_report: 'Generating Report',
      p2p: 'Peer-to-Peer Connections',
      no_connection: 'No Connection',
      outbound: 'Outbound',
      outbound_help:
        'Hotspot unable to connect to peers on the blockchain. This can be due to router issues, no internet connection, or a firewall blocking incoming connections.',
      inbound: 'Inbound',
      inbound_help:
        'Blockchain peers cannot to reach Hotspot. This can be due to router issues, no internet connection, or a firewall blocking incoming connections.',
      activity: 'Activity',
      blockchain_sync: 'Blockchain Sync',
      synced: '{{percent}} Synced',
      blockchain_height_help:
        'Hotspot must be 100% synced before it can start mining. This can take several hours or more depending on your internet speed. Keep the Hotspot powered on and connected to the internet.',
      last_challenged: 'Last Challenged',
      last_challenged_help:
        'Neighboring Hotspots have not been able to verify your Hotspot location. In most cases, this is because the antenna is in an area where radio signals can’t reach (buildings blocking, antenna pointed down, antenna indoors).',
      firmware: 'Hotspot Firmware',
      hotspot_type: 'Hotspot Type',
      app_version: 'App Version',
      wifi_mac: 'Wi-Fi MAC',
      eth_mac: 'Ethernet MAC',
      nat_type: 'NAT Type',
      ip: 'IP Address',
      report_generated: 'Report Generated',
      send_to_support: 'Send Report to Support',
      help_link: 'Read more for possible solutions',
      email_client_missing:
        'Could not find a compatible email client installed',
      other_info: 'Other Information',
    },
    wifi: {
      title: 'Wi-Fi Network',
      connected_via: 'Connected via',
      not_connected: 'Not Connected',
      available_wifi: 'Available Wi-Fi Networks',
      show_password: 'Show Password',
      hide_password: 'Hide Password',
      ethernet: 'Ethernet',
    },
    options: {
      paired: 'Paired with Hotspot',
      diagnostic: 'Diagnostics',
      wifi: 'Wi-Fi Network',
      reassert: 'Update Location',
      firmware: 'Hotspot Firmware',
    },
    reassert: {
      remaining:
        'You have <b><purple>{{count}}</purple></b> free remaining Hotspot Location Assert Update.',
      remaining_plural:
        'You have <b><purple>{{count}}</purple></b> free remaining Hotspot Location Assert Updates.',
      change_location: 'Change Location',
      confirm: 'I Confirm',
    },
  },
  hotspot_details: {
    title: 'Hotspot Details',
    owner: 'Owned by {{address}}',
    pass_rate: 'PASS RATE',
    reward_title: 'HNT Rewards',
    witness_title: 'Witnesses',
    challenge_title: 'Challenges',
    picker_title: 'Past',
    picker_options: ['24 Hours', '7 Days', '14 Days', '30 Days'],
    status_online: 'Online',
    status_offline: 'Needs Attention',
    options: {
      settings: 'Settings',
      viewExplorer: 'View on Explorer',
      share: 'Share',
    },
  },
  transfer: {
    title: 'Transfer Hotspot',
    heading: 'Securely change ownership for one of your Hotspots.',
    body:
      'Once the Hotspot is transferred, you will no longer see the Hotspot in the app and earn HNT from this Hotspot.\n\nTo proceed with the transfer, type the Hotspot name in the box below.',
    button_title: 'Continue Transfer',
    input_placeholder: 'Type Hotspot name here...',
    exists_alert_title: 'Transfer Already Exists',
    exists_alert_body: 'You have an active pending transfer for this Hotspot.',
    amount_changed_alert_title: 'Requested Amount Changed',
    amount_changed_alert_body:
      'The amount requested by the seller has changed. The new amount requested is {{amount}} HNT.',
    nonce_alert_title: 'Unable to Complete Transfer',
    nonce_alert_body:
      'Looks like you sent or received HNT after the seller initiated the Transfer Hotspot transaction. Please contact the Hotspot seller to create a new Transfer Hotspot transaction and avoid unrelated payment transactions until Transfer Hotspot is complete.',
    incomplete_alert_title: 'Transfer Incomplete',
    incomplete_alert_body:
      'This transfer cannot be completed. Ensure you are the authorized buyer, or contact the seller for more information.',
    canceled_alert_title: 'Transfer Canceled',
    canceled_alert_body:
      'This transfer is no longer active. Please contact the seller for more information.',
    fine_print:
      'Hotspot will transfer once the buyer accepts and completes the transaction.',
    notification_button: 'View Transaction',
    cancel: {
      button_title: 'Cancel Transfer',
      failed_alert_title: 'Unable to Cancel Transfer',
      failed_alert_body: 'No response from the API. Please try again.',
      alert_title: 'Cancel Hotspot Transfer',
      alert_body:
        'There is a pending Hotspot Transfer to {{buyer}} for {{gateway}}.\n\nAre you sure you want to cancel?',
      alert_back: 'Back',
      alert_confirm: 'Cancel Transfer',
    },
    unknown: 'UNKNOWN',
  },
  activity_details: {
    security_tokens: 'Security Tokens',
    reward: 'Reward',
    from: 'From',
    to: 'To',
    memo: 'Memo',
    location: 'Location',
    seller: 'Seller',
    buyer: 'Buyer',
    owner: 'Owner',
    my_account: 'My Account',
    view_block: 'View Block',
    rewardTypes: {
      poc_challengees: 'PoC',
      poc_challengers: 'Challenger',
      poc_witnesses: 'Witness',
      consensus: 'Consensus',
      data_credits: 'Packet Transfer',
      securities: 'Security Tokens',
    },
  },
}
