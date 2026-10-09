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
fetch("release.json", { cache: "no-cache" })
  .then((response) => {
    if (!response.ok) throw new Error("Release metadata unavailable");
    return response.json();
  })
  .then((release) => {
    document.getElementById("release-version").textContent =
      "Version " + release.version;
    document.getElementById("release-size").textContent =
      (release.size_bytes / 1000000).toFixed(1) + " MB";
  })
  .catch(() => {});
