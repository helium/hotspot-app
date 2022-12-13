import antennas from './antennas'
import hotspots from './hotspots'

export default {
  antennas,
  hotspots,
  id: 24, // your maker id
  supportEmail: 'iot.support@milesight.com', // your support email
  makerApp: {
    makerAppName: 'Milesight App',
    ios: '',
    android:
      'https://play.google.com/store/apps/details?id=com.milesight.hotspot',
    forceRedirect: true,
  },
}
