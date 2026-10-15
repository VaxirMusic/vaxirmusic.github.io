# VaxirMusic downloads

Official download page: https://vaxirmusic.github.io/

Static HTML, CSS, and JavaScript. English and Thai are available from the language button. No build step is required. GitHub Pages publishes the root of `main`.

The HTML and `release.json` describe release **v1.1.6** in this public repository. Each release attaches `setup.exe` and `setup.sha256`. Update the HTML version, size, release date, and SHA-256 together with `release.json` when publishing a new fallback.

Both `app.js` and the Windows app check the latest stable release of `VaxirMusic/vaxirmusic.github.io`. The application source repository is private and cannot provide unauthenticated updates. Website downloads and in-app updates use the same public release assets.

The page switches its download links and metadata together only for a newer valid release with exactly one uploaded installer and checksum. Drafts, prereleases, malformed metadata, unsafe URLs, and missing assets are ignored. A delayed fallback cannot replace a newer release. The static links remain usable without JavaScript or if the API is unavailable.

Apps that still check the private repository need setup 1.1.5 installed once to use the public update feed. Future releases can then use **Settings > Check update > Update now**, or **Auto update** at startup. Windows asks for administrator permission. Favorites, history, and preferences are preserved.

For testing 1.1.5, the app workspace includes `dist/update-test/setup-1.1.4.exe`, an older local build using the corrected public feed. Install it and open the installed app to test upgrading to 1.1.5. Auto update is enabled by default; disable it before a manual check if you want to test the prompt.

The application uses `https://vaxirmusic.github.io/` for its Discord download button.

VaxirMusic is not affiliated with Google, YouTube, or Discord.
