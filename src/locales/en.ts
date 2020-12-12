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
  stats: {
    title: 'Stats:',
  },
  account_setup: {
    welcome: {
      title: 'Welcome to Helium',
      subtitle:
        "Host a Hotspot and earn Helium tokens, a new cryptocurrency, for building the world's first peer-to-peer wireless network, The People's Network.",
      get_started: "Let's get started.",
      create_account: 'Create an Account',
      import_account: 'Import Existing Account',
    },
    warning: {
      title: 'An account that is completely yours',
      subtitle:
        'Your Helium account belongs only to you and is protected by <b>12 unique words</b>.',
      recover:
        "You'll need these words if you need to recover your account or move it to a different phone",
    },
    generating: 'GENERATING YOUR 12 UNIQUE WORDS',
    passphrase: {
      title1: 'Write These',
      title2: '12 Words Down',
      warning_1:
        'Helium Inc <red>cannot help recover your account</red>, so make sure to write these down and store them securely.',
      warning_2: "<red>Don't lose these 12 words!</red>",
      next: "OK, they're written down",
    },
    confirm: {
      title: 'Confirm Your Words',
      subtitle: 'Select the {{ordinal}} word',
      forgot: 'I forgot my words',
      failed: {
        title: 'Sorry...',
        subtitle_1: "You've reentered the seed phrase incorrectly.",
        subtitle_2: 'Please try again.',
        try_again: 'Try Again',
      },
    },
    success: {
      title: "You're all set!",
      subtitle_1:
        "You've confirmed your account. Please remember to keep it safe.",
      subtitle_2:
        "Now let's secure your new account on this phone with a PIN code.",
      next: 'Secure account with PIN',
    },
    create_pin: {
      title: 'Create PIN',
      subtitle: 'Create a PIN to secure your account',
      failed: 'Your PIN did not match. Please try again.',
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
    title: 'How does a Hotspot earn Tokens?',
    slides: [
      {
        title: '1. Earning by Issuing Challenges',
        body:
          'Encrypted messages are sent from Hotspots over the internet to target areas, creating a challenge in the process.',
      },
      {
        title: '2. Earn with Proof-of-Coverage',
        body:
          "Hotspots earn Helium when they validate their peer's wireless coverage. Amount earned depends on how often it is directly involved in Proof-of-Coverage activity.",
      },
      {
        title: '3. Earn by Witnessing',
        body:
          'Hotspots that hear Proof-of-Coverage that were not intended for them can "witness" those challenges and submit them to the blockchain.',
      },
      {
        title: '4. Earn by Transferring Data',
        body:
          'Hotspots that transfer data from LongFi devices on the network earn Helium proportional to the amount sent.',
      },
      {
        title: '5. Earn with Consensus Group',
        body:
          'The highest scoring Hotspots are elected to a consensus group which forms transactions into blocks and adds them to the blockchain. Hotspots earn Helium when participating in Consensus.',
      },
    ],
    next: "I've read the guide",
  },
  generic: {
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
      subtitle_1:
        'Helium Hotspot enables anyone to earn cryptocurrency, Helium (HNT), for providing wireless coverage for low power Internet of Things devices.',
      subtitle_2: 'Would you like to set up your hotspot now?',
      next: 'Set up Hotspot',
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
        '<b><white>Diagnostic support allows Helium to identify issues with your Hotspot in a secure way.</white></b>\n\nHelium will never have access to private keys and will only ever be able to access your Hotspot and not any other devices on your Network.\n\nIf you would like to opt-out of diagnostic support please email <purpleMain><b>support@helium.com</b></purpleMain> from the email used to purchase the Hotspot.',
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
    },
    ble_select: {
      title: 'Nearby Hotspots',
      hotspots_found: '{{count}} Hotspot found.',
      hotspots_found_plural: '{{count}} Hotspots found.',
      subtitle: 'Select your Hotspot to continue.',
    },
    ble_error: {
      title: 'No Hotspots Found',
      subtitle: "We're not having much luck finding any Hotspots nearby.",
      tips: [
        'Are you <green>within a few feet</green> of your Hotspot?',
        "Is your phone's <blue>Bluetooth turned on</blue>?",
        'Did you <purple>push the pairing button</purple>?',
        'It can take <purple>up to a minute</purple> to find the RAK Hotspot Miner.',
      ],
    },
    wifi_scan: {
      title: 'Set Up Wi-Fi',
      settings_title: 'Wi-Fi Settings',
      subtitle:
        'Your Hotspot has found Wi-Fi network nearby. Select yours so we can get the Hotspot online.',
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
      join_title: 'Join Wi-Fi',
      update_title: 'Update Wi-Fi',
      message:
        'The Hotspot is currently connected to this network. Changing the password can cause the Hotspot to go offline.',
      error_title: 'Invalid Password',
      subtitle: "What's your Wi-Fi password?",
      placeholder: 'Password',
      show_password: 'Show Password',
      hide_password: 'Hide Password',
      connecting: 'Connecting...',
      forget: 'Forget',
      forget_network: 'Forget Network',
      forget_alert_title: 'Forget Network?',
      forget_alert_message:
        'The Hotspot will no longer automatically connect to ',
    },
    ethernet: {
      title: "Let's use Ethernet",
      subtitle:
        'Plug your Hotspot into an available and active port on your internet router.',
      secure: 'Please connect your ethernet cable securely',
      next: 'My Hotspot is Connected',
    },
    firmware_update: {
      title: 'Firmware Update Required',
      subtitle: 'This Hotspot needs a firmware update before it can continue',
      current_version: 'Current Version: {{version}}',
      required_version: 'Required Version: {{minVersion}}',
      explanation:
        'This Hotspot will check for updates automatically. This can take about 10 minutes. Leave it plugged in and check back later.',
      next: 'Got it',
    },
    genesis: {
      title: 'Helium Hotspot',
      subtitle: 'Zero On-Boarding Fees',
      p:
        'As a creator of the Helium Network, your first time adding the Hotspot and setting its location will have <b>zero fees</b>.',
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
      title: 'Confirm Location',
      subtitle: 'Enable Location Services',
      p_1:
        "Your phone can be used to help find your Hotspot's location. An accurate location means more Proof-of-Coverage Challenges.",
      p_2: 'Location Services Permissions can be updated in app settings.',
      settings_p_1:
        "In order to update your Hotspot's location, we'll need additional location permissions.",
      settings_p_2:
        "Tap the button below to be taken to Settings. Under 'Location' tap 'While using the App'.",
      next: 'Enable Location Services',
      cancel: "No thanks, I'll set it up later",
    },
    location_fee: {
      title: 'Confirm Location',
      subtitle: 'The fee to confirm your location is:',
      pending_p_1:
        'Your Hotspot has a Confirm Location transaction pending in the blockchain.',
      pending_p_2:
        "If you'd like to change the Hotspot's location, wait for the previous transaction to complete before updating its location.",
      free_title: 'FREE',
      free_text:
        "The first time you confirm a Hotspot's location is free of any charges.",
      free_subtext:
        'However, changing the location of a Hotspot more than 300 meters will incur a small fee next time.',
      no_funds:
        'There is insufficient HNT in your account balance. Unable to confirm location.',
      calculating_text: 'Calculating HNT Amount',
      error_title: 'Error',
      error_body: 'There was an error loading fee data. Please try again.',
    },
    location: {
      title: 'Where are you?',
      update_title: 'Update Location',
      subtitle:
        "Fine-tune your Hotspot's location by pinching and dragging the pin.",
      finding: 'Please wait while we acquire GPS',
      next: 'Confirm Hotspot Location',
    },
    progress: {
      title: 'REGISTERING HOTSPOT',
      p_1:
        'Adding a Hotspot means submitting a transaction to the blockchain. This appears as a pending transaction like the one below.',
      p_2:
        "Pending transactions take time to clear so we'll let you know when it's done.",
      p_3: 'Tap continue to explore the rest of the app.',
      pending_txn: {
        name: 'YOUR HOTSPOT NAME',
      },
      example: 'example transaction',
      next: 'Continue to Accounts',
    },
    error: {
      alertTitle: 'Servers Unable to Respond',
      alertMessage:
        'Request to servers have timed out and we cannot add your Hotspot at this time.\n\nPlease contact support@helium.com and note MAC address %{mac}.',
    },
  },
  account_import: {
    word_entry: {
      title: 'Enter Recovery Seed Phrase',
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
  },
  send: {
    title: 'Send HNT',
  },
  more: {
    sections: {
      security: {
        title: 'security',
        enablePin: 'Enable PIN',
        requirePin: 'Require PIN',
        resetPin: 'Reset PIN',
        requirePinForPayments: 'Require PIN for Payments',
        auth_intervals: {
          immediately: 'Immediately',
          after_1_min: 'After 1 minute',
          after_5_min: 'After 5 minutes',
          after_15_min: 'After 15 minutes',
          after_1_hr: 'After 1 hour',
          after_4_hr: 'After 4 hours',
        },
      },
      learn: { title: 'learn' },
      advanced: { title: 'advanced' },
      account: {
        title: 'account',
        signOut: 'Sign out',
        signOutAlert: {
          title: 'Warning!',
          body:
            'This will remove all account info from this device. The only way to restore access to your account and Hotspots will be by using your 12 word recovery seed phrase.',
        },
      },
      app: { title: 'app' },
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
  },
  permissions: {
    location: {
      title: 'Location Permission',
      message:
        'Helium Wallet needs access to your location for Bluetooth LE discovery.',
    },
  },
}
