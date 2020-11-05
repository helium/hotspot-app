# Hotspot App

Helium hotspot app for iOS and Android built using [React Native](https://reactnative.dev).

## Getting Started

### React Native Dev Setup

If you have already set up react native on your machine, skip to the [installing](#Installing) section.

#### React Native dependencies

You will need Node, Watchman, Yarn, the React Native command line interface, Android Studio, and Xcode.

While you can use any editor of your choice to develop your app, you will need to install Xcode and Android Studio in order to set up the necessary tooling to build your React Native app for iOS and Android.

A good free editor is [Visual Studio Code](https://code.visualstudio.com/).

#### Node, Watchman, Yarn

We recommend installing Node, Yarn, and Watchman using [Homebrew](http://brew.sh/). Run the following commands in a Terminal after installing Homebrew:

```
brew install node
brew install watchman
brew install yarn
```

If you have already installed Node on your system, make sure it is up to date with the LTS version.

Watchman is a tool by Facebook for watching changes in the filesystem. It is highly recommended you install it for better performance.

#### The React Native CLI

Node comes with npm, which lets you install the React Native command line interface.

Run the following command in a Terminal:

```
npm install -g react-native-cli
```

If you get an error like Cannot find module 'npmlog', try installing npm directly:

```
curl -0 -L https://npmjs.org/install.sh | sudo sh.
```

#### Xcode

The easiest way to install Xcode is via the [Mac App Store](https://itunes.apple.com/us/app/xcode/id497799835?mt=12). Installing Xcode will also install the iOS Simulator and all the necessary tools to build your iOS app.

If you have already installed Xcode on your system, make sure it is up to date.

#### Command Line Tools

You will also need to install the Xcode Command Line Tools. Open Xcode, then choose "Preferences..." from the Xcode menu. Go to the Locations panel and install the tools by selecting the most recent version in the Command Line Tools dropdown.

#### Java Development Kit

React Native requires the Java SE Development Kit (JDK). [Download and install JDK 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) if needed.

#### Android development environment

Setting up your development environment can be somewhat tedious if you're new to Android development. If you're already familiar with Android development, there are a few things you may need to configure. In either case, please make sure to carefully follow the next few steps.

##### 1. Install Android Studio

[Download and install Android Studio](https://developer.android.com/studio/index.html). Choose a "Custom" setup when prompted to select an installation type. Make sure the boxes next to all of the following are checked:

- Android SDK
- Android SDK Platform
- Performance (Intel ® HAXM)
- Android Virtual Device

Then, click "Next" to install all of these components.

If the checkboxes are grayed out, you will have a chance to install these components later on.
Once setup has finalized and you're presented with the Welcome screen, proceed to the next step.

##### 2. Install the Android SDK

Android Studio installs the latest Android SDK by default. Building a React Native app with native code, however, requires the Android 28 SDK in particular. Additional Android SDKs can be installed through the SDK Manager in Android Studio.

The SDK Manager can be accessed from the "Welcome to Android Studio" screen. Click on "Configure", then select "SDK Manager".

Select the "SDK Platforms" tab from within the SDK Manager, then check the box next to "Show Package Details" in the bottom right corner. Look for and expand the Android 28 entry, then make sure the following items are all checked:

- Google APIs
- Android SDK Platform 28
- Intel x86 Atom_64 System Image
- Google APIs Intel x86 Atom_64 System Image

Next, select the "SDK Tools" tab and check the box next to "Show Package Details" here as well. Look for and expand the "Android SDK Build-Tools" entry, then make sure that 30-rc1, 29.0.3, and 28.0.3 are selected.

Finally, click "Apply" to download and install the Android SDK and related build tools.

##### 3. Configure the ANDROID_HOME environment variable

The React Native tools require some environment variables to be set up in order to build apps with native code.

Add the following lines to your \$HOME/.bash_profile config file:

```
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## Installing

### Dependencies

Install 3rd party dependencies

```
yarn install
```

You also need [cocoapods](https://cocoapods.org/) for iOS

```
sudo gem install cocoapods
```

Then install the pods for iOS (Not needed for Android)

```
yarn pod-install
```

If the app is not working you may want to clean your workspace and then follow the running the app section below

```
yarn clean-install
yarn clean-start
```

### Running The App

#### iOS

The fastest way to run the app is on the iOS simulator. Just type:

```
yarn ios
```

Or for a release build:

```
yarn ios-release
```

You can also open the `helium.xcworkspace` file in the `/ios` folder using xcode and run the app on your device or any other simulator.

#### Android

Similar to iOS, run

```
yarn android
```

Or for a release build:

```
yarn android-release
```

You can also open the Android project in Android Studio by selecting `open an existing project` and selecting the `/android` folder.

# Debugging

See [React Native Debugging](https://reactnative.dev/docs/debugging.html).

## Recommended tools

---

### **_Reactotron_**

The app is configured to use the [Reactotron](https://github.com/infinitered/reactotron) app which can be used to:

- view your application state
- show API requests & responses
- perform quick performance benchmarks
- subscribe to parts of your application state
- display messages similar to `console.log`
- track global errors with source-mapped stack traces including saga stack traces!
- dispatch actions like a government-run mind control experiment
- hot swap your app's state using Redux or mobx-state-tree
- track your sagas
- show image overlay in React Native
- track your Async Storage in React Native

The latest version of Reactotron can be downloaded [here](https://github.com/infinitered/reactotron/releases)

### **_React Native Debugger_**

See [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
