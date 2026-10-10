"use strict";
const languageButton = document.getElementById("language");
let language = "en";
try {
  language = localStorage.getItem("vaxirmusic-language") === "th" ? "th" : "en";
} catch {}
function setLanguage(next) {
  language = next;
  document.documentElement.lang = language;
  document.querySelectorAll("[data-en][data-th]").forEach((element) => {
    element.textContent = element.dataset[language];
  });
  languageButton.innerHTML =
    (language === "en" ? "ไทย" : "EN") + ' <span aria-hidden="true">↗</span>';
  languageButton.setAttribute(
    "aria-label",
    language === "en" ? "Switch to Thai" : "เปลี่ยนเป็นภาษาอังกฤษ",
  );
  try {
    localStorage.setItem("vaxirmusic-language", language);
  } catch {}
}
languageButton.addEventListener("click", () =>
  setLanguage(language === "en" ? "th" : "en"),
);
setLanguage(language);

// Keep the published website release usable while future app releases are
// picked up automatically from the repository used by the in-app updater.
const websiteRepository = "VaxirMusic/vaxirmusic.github.io";
const appRepository = "shxp3/VaxirMusic";
const versionLabel = document.getElementById("release-version");
const sizeLabel = document.getElementById("release-size");
let displayedVersion = parseReleaseVersion(
  versionLabel.textContent.replace(/^Version /, ""),
);
let displayedSource = "static";

function parseReleaseVersion(value) {
  if (typeof value !== "string" || !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(value)) {
    throw new Error("Invalid release version");
  }
  const parts = value.split(".").map(Number);
  if (parts.some((part) => !Number.isSafeInteger(part) || part > 65535)) {
    throw new Error("Invalid release version");
  }
  return parts;
}

function compareReleaseVersions(first, second) {
  for (let index = 0; index < first.length; index++) {
    if (first[index] !== second[index]) return first[index] > second[index] ? 1 : -1;
  }
  return 0;
}

function validAssetSize(size, maximum) {
  return Number.isSafeInteger(size) && size > 0 && size <= maximum;
}

function websiteRelease(release) {
  parseReleaseVersion(release.version);
  const base = `https://github.com/${websiteRepository}/releases/`;
  const trustedDownload = `${base}latest/download/setup.exe`;
  if (!validAssetSize(release.size_bytes, 1024 ** 3) ||
      typeof release.sha256 !== "string" || !/^[a-fA-F0-9]{64}$/.test(release.sha256) ||
      release.download_url !== trustedDownload) {
    throw new Error("Invalid website release");
  }
  return {
    version: release.version,
    size: release.size_bytes,
    download: trustedDownload,
    checksum: `${base}latest/download/setup.sha256`,
    releases: `${base}tag/v${release.version}`,
    released: release.released,
    sha256: release.sha256.toLowerCase(),
  };
}

function sourceRelease(release) {
  if (release.draft !== false || release.prerelease !== false ||
      typeof release.tag_name !== "string" || !release.tag_name.startsWith("v") ||
      !Array.isArray(release.assets)) {
    throw new Error("Invalid stable release");
  }
  const version = release.tag_name.slice(1);
  parseReleaseVersion(version);
  const base = `https://github.com/${appRepository}/releases/download/${release.tag_name}/`;
  const installer = release.assets.filter((asset) => asset.name === "setup.exe");
  const checksum = release.assets.filter((asset) => asset.name === "setup.sha256");
  if (installer.length !== 1 || checksum.length !== 1 ||
      installer[0].state !== "uploaded" || checksum[0].state !== "uploaded" ||
      installer[0].browser_download_url !== `${base}setup.exe` ||
      checksum[0].browser_download_url !== `${base}setup.sha256` ||
      !validAssetSize(installer[0].size, 1024 ** 3) || !validAssetSize(checksum[0].size, 65536)) {
    throw new Error("Release downloads are not ready");
  }
  const digest = installer[0].digest;
  if (digest != null && (typeof digest !== "string" || !/^sha256:[a-fA-F0-9]{64}$/.test(digest))) {
    throw new Error("Invalid release checksum");
  }
  return {
    version,
    size: installer[0].size,
    download: `${base}setup.exe`,
    checksum: `${base}setup.sha256`,
    releases: `https://github.com/${appRepository}/releases/tag/${release.tag_name}`,
    released: typeof release.published_at === "string" ? release.published_at.slice(0, 10) : "",
    sha256: digest ? digest.slice(7).toLowerCase() : "",
  };
}

function displayRelease(release, source) {
  const version = parseReleaseVersion(release.version);
  const comparison = compareReleaseVersions(version, displayedVersion);
  if (comparison < 0 || (comparison === 0 &&
      (source === "source" || displayedSource === "source"))) return;
  // Apply version, size, and all links together; a slower local response must
  // never replace a newer source release that has already been displayed.
  document.querySelectorAll(".download-link").forEach((link) => {
    link.href = release.download;
  });
  document.querySelector(".checksum-link").href = release.checksum;
  document.querySelector(".releases-link").href = release.releases;
  versionLabel.textContent = "Version " + release.version;
  sizeLabel.textContent = (release.size / 1000000).toFixed(1) + " MB";
  const metadata = document.querySelector(".release-meta");
  metadata.dataset.releaseDate = release.released || "";
  metadata.dataset.releaseSha256 = release.sha256;
  displayedVersion = version;
  displayedSource = source;
}

async function loadRelease(url, parse, source) {
  try {
    const response = await fetch(url, { cache: "no-cache" });
    if (!response.ok) return;
    displayRelease(parse(await response.json()), source);
  } catch {
    // The static download remains available offline and on API rate limits.
  }
}

loadRelease("release.json", websiteRelease, "website");
loadRelease(`https://api.github.com/repos/${appRepository}/releases/latest`, sourceRelease, "source");
