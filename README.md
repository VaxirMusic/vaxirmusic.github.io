# VaxirMusic downloads

Official download page: https://vaxirmusic.github.io/

Static HTML, CSS, and JavaScript. English and Thai are available from the language button. Product screenshots are captured from the native Windows app. No build step or external script service is needed.

GitHub Pages publishes the root of `main`. `.nojekyll` serves the files directly.

The download buttons use `https://github.com/VaxirMusic/vaxirmusic.github.io/releases/latest/download/setup.exe`. Every release must attach `setup.exe` and `setup.sha256` with those exact names. Update `release.json` with the version, installer size, release date, and SHA-256 when publishing a new release.

The application uses `https://vaxirmusic.github.io/` in its `discord.json` download setting. This lets Discord point to the same page across future releases.

VaxirMusic is not affiliated with Google, YouTube, or Discord.
