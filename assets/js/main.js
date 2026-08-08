/* ===== PDFly — main.js ===== */

(function () {
  const saved = localStorage.getItem('pdfly-theme');
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('darkToggle');
  if (btn) btn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('pdfly-theme', isDark ? 'dark' : 'light');
  });
  const menuBtn = document.getElementById('mobileMenu');
  const mobileNav = document.getElementById('mobileNav');
  if (menuBtn && mobileNav) menuBtn.addEventListener('click', () => mobileNav.classList.toggle('hidden'));
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
});

let toastContainer;
function getToastContainer() {
  if (!toastContainer) { toastContainer = document.createElement('div'); toastContainer.className = 'toast-container'; document.body.appendChild(toastContainer); }
  return toastContainer;
}

function showToast(message, type = 'success', duration = 3500) {
  const container = getToastContainer();
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span style="font-size:16px;line-height:1">${icons[type]||'✓'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.classList.add('leaving'); setTimeout(() => toast.remove(), 300); }, duration);
}

function setupDropZone(zone, input, onFiles, opts = {}) {
  if (!zone || !input) return;
  if (opts.multiple) input.multiple = true;
  if (opts.accept) input.accept = opts.accept;
  zone.addEventListener('click', () => input.click());
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', e => { if (!zone.contains(e.relatedTarget)) zone.classList.remove('drag-over'); });
  zone.addEventListener('drop', e => { e.preventDefault(); zone.classList.remove('drag-over'); const files = Array.from(e.dataTransfer.files); if (files.length) onFiles(files); });
  input.addEventListener('change', () => { const files = Array.from(input.files); if (files.length) { onFiles(files); input.value = ''; } });
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

function setLoading(btn, loading, originalText) {
  if (loading) { btn.dataset.original = btn.innerHTML; btn.innerHTML = `<span class="spinner"></span><span>Processing…</span>`; btn.disabled = true; }
  else { btn.innerHTML = btn.dataset.original || originalText || 'Done'; btn.disabled = false; }
}

function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => { const r = new FileReader(); r.onload = e => resolve(e.target.result); r.onerror = reject; r.readAsArrayBuffer(file); });
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => { const r = new FileReader(); r.onload = e => resolve(e.target.result); r.onerror = reject; r.readAsDataURL(file); });
}

function animateProgress(barId, from, to, duration = 600) {
  const bar = document.getElementById(barId);
  if (!bar) return;
  const start = performance.now();
  function step(now) { const p = Math.min((now - start) / duration, 1); bar.style.width = (from + (to - from) * p) + '%'; if (p < 1) requestAnimationFrame(step); }
  requestAnimationFrame(step);
}
