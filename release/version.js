window.MLLP_UPDATE = {
  "version": "5.8",
  "apkUrl": "https://github.com/ganapph4-jpg/mamaslove-owner-dashboard/releases/download/v5.8/MamasLoveLaundryPOS-5.8.apk",
  "size": 644915,
  "notes": "Offline detection is now native. The APK itself was missing Android's network-state permission, which is why the phone always claimed to be online and the 'No internet' strip never showed; it is now declared in the manifest, so the phone reports the real connection instantly. The check behind it was also made cheaper: it asks your own shop server first (free), then Firebase (no documents read, so nothing is billed), and only then Google; while offline it retries once a minute, then every two, then every five instead of constantly."
};
