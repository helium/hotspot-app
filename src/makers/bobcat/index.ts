import antennas from './antennas'
import hotspots from './hotspots'

const bobcat = {
  antennas,
  hotspots,
  id: 6,
  supportEmail: 'support@bobcatminer.com',
  makerApp: {
    makerAppName: 'Bobber App',
    ios: 'https://apps.apple.com/app/id1595267515',
    android:
      'https://play.google.com/store/apps/details?id=com.bobcatminer.hotspot',
    forceRedirect: true,
  },
}

export default bobcat
