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
    copy: 'Copy',
    address: 'Address',
    invalid_password: 'You password is incorrect',
    something_went_wrong: 'Something went wrong',
    hnt_to_currency: '{{currencyType}}. Data from CoinGecko',
    search_location: 'Search for an address or place',
  },
  hotspot_setup: {
    selection: {
      title: 'Choose\nyour Hotspot.',
      subtitle: 'What kind of Hotspot do you\nwish to add?',
      helium: 'Helium Hotspot',
      rak: 'RAK Hotspot Miner',
      nebrain: 'Nebra Indoor Hotspot',
      nebraout: 'Nebra Outdoor Hotspot',
      bobcat: 'Bobcat Miner 300',
      syncrobit: 'SyncroB.it Hotspot',
      third_party_header: 'Other Hotspots',
      helium_edition: 'For the Helium Network',
      fine_print:
        'RAK Hotspot Miners have special firmware preloaded by RAK. Double check your hardware is a RAK Hotspot Miner before proceeding.',
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
      nebra_p_1:
        '<b><white>Diagnostic support allows Nebra LTD to identify issues with your Hotspot in a secure way.</white></b>\n\nNebra will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>support@nebra.com</b></purple> from the email used to purchase the Hotspot.',
      bobcat_p_1:
        '<b><white>Diagnostic support allows Bobcat to identify issues with your Hotspot in a secure way.</white></b>\n\nBobcat will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>support@bobcatminer.com</b></purple> from the email used to purchase the Hotspot.',
      syncrobit_p_1:
        '<b><white>Diagnostic support allows SyncroB.it to identify issues with your Hotspot in a secure way.</white></b>\n\nSyncroB.it will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purple><b>support@syncrob.it</b></purple> from the email used to purchase the Hotspot.',
    },
    power: {
      title: 'Power Up',
      next: "I'm powered up",
      helium_subtitle_1:
        'Attach the antenna and plug in the provided power adapter.',
      rak_subtitle_1:
        'Plug in the provided power adapter into an outlet near a window.',
      nebrain_subtitle_1:
        'Attach the antenna and plug in the provided power adapter near a window.',
      nebraout_subtitle_1:
        'Attach the antenna and connect to an appropriate power source.',
      bobcat_subtitle_1:
        'Plug in the provided power adapter into an outlet near a window and screw in the provided antenna on the back of the Hotspot.',
      syncrobit_subtitle_1: 'Attach the antenna and plug in the device',
      helium_subtitle_2:
        'Your Hotspot will boot up, and its light will become Green when ready.',
      rak_subtitle_2:
        'The RAK Hotspot Miner will show a red LED light once it’s powered on.',
      nebrain_subtitle_2:
        'The Nebra Indoor Hotspot will have a green LED light up once it’s powered on.',
      nebraout_subtitle_2:
        'The Nebra Outdoor Hotspot will have multiple lights come on once it’s powered on.',
      bobcat_subtitle_2:
        'The Hotspot is ready when the light goes from red to yellow.',
      syncrobit_subtitle_2:
        'The SyncroB.it Hotspot LED bar will light up blue once it’s powered on.',
    },
    pair: {
      title: 'Bluetooth',
      helium_subtitle_1:
        'Press the black button on your Hotspot. Its light should turn blue.',
      rak_subtitle_1: 'There is no pairing button on the RAK Hotspot Miner.',
      nebrain_subtitle_1:
        'Hold down the button on the back of the Nebra Indoor Hotspot until it starts flashing.',
      nebraout_subtitle_1:
        'There is no pairing button on the Nebra Outdoor Hotspot.',
      bobcat_subtitle_1:
        'Use the provided pin to press the BT Button on the back of the Hotspot and hold for 5 seconds.',
      syncrobit_subtitle_1:
        'There is no pairing button on the SyncroB.it Hotspot.',
      helium_subtitle_2:
        "Ensure your phone's bluetooth is on before proceeding",
      rak_subtitle_2:
        'Bluetooth is automatically enabled for 5 minutes after the RAK Hotspot Miner is powered on.\n\nHotspot can take up to 1 minute to fully boot up.',
      nebrain_subtitle_2:
        'Once the LED is slowly blinking and is ready to pair.\n\nPress Next to scan.',
      nebraout_subtitle_2:
        'Bluetooth is automatically enabled for 10 minutes after the Nebra Outdoor Hotspot is powered on.\n\nHotspot can take up to 1 minute to fully boot up.',
      bobcat_subtitle_2:
        'The hotspot is ready to pair when the light goes from yellow to blue.\n\nMake sure your phone’s Bluetooth is turned on!',
      syncrobit_subtitle_2:
        'Bluetooth is automatically enabled for 5 minutes after the SyncroB.it Hotspot is powered on.\n\nHotspot can take up to 1 minute to fully boot up.',
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
      not_found_title: 'No Wi-Fi Networks Found',
      not_found_desc:
        'It can take up to 3 minutes for the Hotspot to boot and find available networks.',
      scan_networks: 'Scan Networks',
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
    onboarding_error: {
      title: 'Onboarding Error',
      subtitle:
        'Unable to find Hotspot in the Onboarding Server. Please contact the Hotspot manufacturer for next steps.',
      next: 'Exit Setup',
      disconnected:
        'There was an error connecting to the Hotspot. Please try again.',
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
      add_hotspot_error_body:
        'There was an error constructing the Add Hotspot transaction. Please try again.',
      assert_loc_error_body:
        'There was an error constructing the Assert Location transaction. Please try again.',
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
    skip_location: {
      title: 'Add Hotspot',
      subtitle_1: 'You have decided to assert location later.',
      subtitle_2: 'Update your location later from settings.',
    },
    not_owner: {
      title: 'Unable to proceed with setup',
      subtitle_1: 'Hotspot belongs to another account.',
      subtitle_2: "If you're a Host updating Wi-Fi, you may exit setup now.",
    },
    owned_hotspot: {
      title: 'You already own this Hotspot',
      subtitle_1: 'Looks like this Hotspot is already onboarded.',
      subtitle_2:
        'To update your Hotspot’s Wi-Fi or location, go to your Hotspot’s Settings.',
    },
  },
  account_import: {
    word_entry: {
      title: 'Enter Recovery\nSeed Phrase',
      directions: 'Enter the <b>{{ordinal}}</b> Word',
      placeholder: '{{ordinal}} word',
      subtitle: 'Recovery Seed Phrases are not\ncase-sensitive',
    },
    confirm: {
      title: 'Please Confirm\nSeed Phrase',
      subtitle:
        'Here are the 12 words you’ve entered. Tap on any of them if you need to edit.',
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
    intro_body:
      'This Account tab acts as a virtual wallet for any HNT or Data Credits you hold.',
    intro_slides: [
      { title: 'Receive HNT', body: 'Access your address or QR code.' },
      { title: 'Send HNT', body: 'Scan a QR code or enter details manually.' },
      {
        title: 'Chart your account',
        body: 'Green signifies HNT being <green>added</green> to your account.',
      },
      {
        title: 'Chart your account',
        body: 'Blue signifies HNT <blue>leaving</blue> your account.',
      },
    ],
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
    label_error: 'You do not have enough HNT in your account.',
    stale_error:
      'Hotspot has not had Beacon or Witness activity in the last {{blocks}} blocks.',
    scan: {
      title: 'Ways to use a QR Code',
      send: 'Send HNT',
      send_description: 'Quickly scan a Helium address to send HNT.',
      burn: 'Burn HNT to DC',
      burn_description:
        'HNT can be burned into Data Credits to pay for device network connectivity. DCs are non-transferable.',
      view: 'View QR Code',
      view_description:
        'Share your QR Code to deposit or receive HNT from others.',
      learn_more: 'Learn More',
    },
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
        heliumtoken: 'Helium Token',
        coverage: 'Network Coverage',
        hotspotPlacement: 'Hotspot Placement',
        support: 'Support',
        troubleshooting: 'Troubleshooting',
        joinDiscord: 'Join Helium Discord',
      },
      app: {
        title: 'App',
        enableHapticFeedback: 'Enable Haptic Feedback',
        convertHntToCurrency: 'Convert HNT to Currency',
        language: 'Language',
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
    sort_by: 'Sort Hotspots By',
    new: {
      title: 'Add a New Hotspot',
      subtitle:
        'If you just added a Hotspot, hang tight. It takes a few moments for the Network to propagate the Hotspot.',
      setup: 'Set up Hotspot',
      explorer: 'View Hotspots Around Me',
    },
    owned: {
      title: 'My Hotspots',
      title_no_hotspots: 'Hotspots',
      reward_summary: 'Your Hotspot mined {{hntAmount}} in the past 24 hours.',
      reward_summary_plural:
        'Your {{count}} Hotspots mined {{hntAmount}} in the past 24 hours.',
      your_hotspots: 'Your Hotspots',
      filter: {
        new: 'Newest Hotspots',
        near: 'Nearest Hotspots',
        earn: 'Top Earning Hotspots',
        offline: 'Offline Hotspots',
      },
    },
    empty: {
      body: "You haven't added or followed any Hotspots yet.",
    },
    list: {
      no_offline: 'NO OFFLINE HOTSPOTS',
      online: 'ONLINE HOTSPOTS',
    },
  },
  permissions: {
    location: {
      title: 'Location Permission',
      message:
        'Helium needs access to your location for Bluetooth discovery and to enable location assertion. This information will never be sold or shared.',
    },
  },
  time: {
    morning: 'Morning',
    evening: 'Evening',
    afternoon: 'Afternoon',
    day_header: 'Good\n{{timeOfDay}}.',
  },
  notifications: {
    tapToReadMore: 'Tap to read more',
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
    view_transactions: 'View Transactions',
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
      title: 'Update Wi-Fi or Run Diagnostics',
      subtitle: 'Paring required before proceeding.',
      scan: 'Pair',
    },
    transfer: {
      title: 'Transfer Hotspot',
      subtitle: 'Send to another Helium Wallet.',
      begin: 'Begin Hotspot Transfer',
    },
    update: {
      title: 'Update Hotspot',
      subtitle: 'Hotspot location or antenna details.',
    },
    discovery: {
      title: 'Discovery Mode',
      subtitle: 'Identify ideal Hotspot placement.',
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
      hotspot_type: 'Hotspot Maker',
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
        'You have <b><purple>{{count}} free remaining</purple></b> Hotspot Location Assert Update.',
      remaining_plural:
        'You have <b><purple>{{count}} free remaining</purple></b> Hotspot Location Assert Updates.',
      change_location: 'Change Location',
      confirm: 'I Confirm',
      cost: 'The cost to reasserting location is:',
      insufficient_funds:
        'You do not have the funds available to make\nthis assert. Acquire HNT.',
      confirm_location: "Please confirm your Hotspot's change in location",
      charge: 'You will be charged {{amount}}.',
      pending_message: 'Location update pending.',
      assert_pending: 'Assert Pending...',
      failTitle: 'Failed to reassert hotspot',
      failSubtitle: 'Please try again later',
    },
  },
  hotspot_details: {
    title: 'Hotspot Details',
    owner: 'Owned by {{address}}',
    owner_you: 'Owned by you',
    pass_rate: 'PASS RATE',
    reward_title: 'HNT Rewards',
    witness_title: 'Average Witnesses',
    challenge_title: 'Challenges',
    challenge_sub_title: '(witness, challenger, or challengee)',
    picker_title: 'Past',
    picker_options: ['24 Hours', '7 Days', '14 Days', '30 Days'],
    picker_prompt: 'Select Range',
    status_online: 'Online',
    status_offline: 'Needs Attention',
    options: {
      settings: 'Settings',
      viewExplorer: 'View on Explorer',
      share: 'Share',
    },
    no_location_title: 'No Asserted Location',
    no_location_body: 'Pair with the Hotspot to begin.',
    percent_synced: '{{percent}}% Synced',
    starting_sync: 'Starting Sync...',
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
      button_title: 'Transfer Pending. Tap to Cancel.',
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
    staking_fee_payer: 'Paid By {{payer}}',
  },
  checklist: {
    title: 'Checklist',
    blocks: {
      not:
        'Hotspots must be fully synced before they can mine. New Hotspots can take up to 48 hours to sync.',
      full: 'Hotspot is fully synced.',
      partial:
        'Hotspot is {{count}} block behind the Helium blockchain and is roughly {{percent}}% synced.',
      partial_plural:
        'Hotspot is {{count}} blocks behind the Helium blockchain and is roughly {{percent}}% synced.',
      title: 'Sync to Blockchain',
    },
    status: {
      online: 'Hotspot is connected to the internet.',
      offline:
        'Hotspot is not online. Hotspots must be online to sync and mine.',
      title: 'Hotspot Status',
    },
    challenger: {
      success: 'Hotspot issued a challenge {{count}} block ago.',
      success_plural: 'Hotspot issued a challenge {{count}} blocks ago.',
      fail:
        "Hotspot hasn't issued a challenge yet. Hotspots create challenges automatically.",
      title: 'Create a Challenge',
    },
    challenge_witness: {
      success: 'Hotspot has witnessed a challenge recently.',
      fail: 'Your Hotspot will listen for challenges from nearby Hotspots.',
      title: 'Witness a Challenge',
    },
    witness: {
      success: 'This Hotspot has {{count}} Hotspot in its witness list.',
      success_plural:
        'This Hotspot has {{count}} Hotspots in its witness list.',
      fail:
        'No witnesses yet. Newly added Hotspots may take a few days to populate their witnesses.',
      title: 'Witness List',
    },
    challengee: {
      success: 'Hotspot last participated in a challenge {{count}} block ago.',
      success_plural:
        'Hotspot last participated in a challenge {{count}} blocks ago.',
      fail:
        'It can take a few hours to pass a challenge once a witness list is created.',
      title: 'Pass a Challenge',
    },
    data_transfer: {
      success: 'Hotspot has transferred data packets recently.',
      fail:
        "Hotspots automatically transfer device data and earn HNT. This Hotspot hasn't transferred data yet.",
      title: 'Transfer Data',
    },
    auto: 'AUTO',
    auto_hours: 'EVERY FEW HOURS',
    complete: 'COMPLETE',
    online: 'ONLINE',
  },
  discovery: {
    begin: {
      title: 'Discovery Mode',
      subtitle:
        'Find out which Hotspots can hear you by sending radio packets for a short period of time.',
      body: 'Discovery Mode is free to use for now, up to 5 sessions per day.',
      previous_sessions: 'Previous Sessions',
      last_30_days: '(Last 30 Days)',
      start_session: 'Begin New Session',
      no_sessions: 'You’ve run out of sessions for today.\nTry again tomorrow.',
      responses: '{{count}} response',
      responses_plural: '{{count}} responses',
      error: {
        title: 'Error',
        subtitle:
          'There was a problem loading discovery mode. Please try again later',
      },
    },
    results: {
      title: 'Discovery Mode Results',
      share: 'Share Results',
      responded: 'Hotspots Responded',
      elapsed_time: 'Time Elapsed',
      result_time: 'Time of Results',
      searching: 'Searching',
      distance: '{{distance}} {{unit}} away',
    },
    share: {
      subject: 'Discovery Results',
      hotspot_name: 'Hotspot Name',
      packets_heard: 'Packets Heard',
    },
  },
}
