/* Registers the service worker and offers a custom "Install app" button.
   Safe no-op in browsers that don't support these APIs. */
(function () {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js").catch(function (err) {
      console.warn("PDFly: service worker registration failed", err);
    });
  }

  // Capture the browser's install prompt so we can trigger it from our
  // own "Install app" button instead of waiting for the native mini-infobar.
  var deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredPrompt = e;
    document.querySelectorAll("[data-pwa-install]").forEach(function (btn) {
      btn.hidden = false;
    });
  });

  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest("[data-pwa-install]");
    if (!btn || !deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.finally(function () {
      deferredPrompt = null;
      document.querySelectorAll("[data-pwa-install]").forEach(function (b) {
        b.hidden = true;
      });
    });
  });

  window.addEventListener("appinstalled", function () {
    document.querySelectorAll("[data-pwa-install]").forEach(function (btn) {
      btn.hidden = true;
    });
  });
})();
