# VaxirMusic downloads

Official download page: https://vaxirmusic.github.io/

Static HTML, CSS, and JavaScript. English and Thai are available from the language button. Product screenshots are captured from the native Windows app. No build step or external script service is needed.

GitHub Pages publishes the root of `main`. `.nojekyll` serves the files directly.

The HTML and `release.json` provide a working fallback for the website repository's **v1.1.0** release. Every release must attach `setup.exe` and `setup.sha256` with those exact names. Update `release.json` and the HTML version, size, date, and hash metadata when publishing another fallback release.

`app.js` also checks the latest stable release of `shxp3/VaxirMusic`, the repository used by the Windows app's updater and automated release workflow. It switches both download buttons, the checksum link, release link, version, and size together only for a strictly newer numeric version with exactly one uploaded installer and checksum. Asset URLs must point to the same tag in that app repository; drafts, prereleases, malformed metadata, missing assets, and unsafe URLs are ignored. A slow fallback response cannot replace a newer release already displayed.

When the app repository has no release, the network is unavailable, GitHub rate limits the request, or the response is invalid or older, the current website release stays available. JavaScript is optional for downloading the fallback installer. Future successful pushes to the app repository can therefore update the website's download without another website commit.

Older app versions need one setup update to **1.1.0 or later** to gain in-app updates. After that, **Settings → Check update** offers **Update now** or **Later**. **Auto update** is on by default and checks, downloads, installs, and restarts at startup; users can turn it off. Windows still asks for administrator permission before installation. Canceling leaves the current version installed, and updates or uninstalling preserve saved favorites, history, and preferences.

The application uses `https://vaxirmusic.github.io/` in its `discord.json` download setting. This lets Discord point to the same page across future releases.

VaxirMusic is not affiliated with Google, YouTube, or Discord.
