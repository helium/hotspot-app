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
      understand: 'I Understand',
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
}
