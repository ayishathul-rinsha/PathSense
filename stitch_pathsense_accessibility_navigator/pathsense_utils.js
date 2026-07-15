/* PathSense Global Utilities
   Handles: Dark Mode, Font Size, Settings Persistence
   Include this script on every page BEFORE </body>
*/

(function() {
  'use strict';

  // ─── SETTINGS MANAGEMENT ─────────────────────────────────────
  const PS = window.PathSense = window.PathSense || {};

  PS.getSettings = function() {
    try {
      return JSON.parse(localStorage.getItem('ps_settings')) || {};
    } catch(e) { return {}; }
  };

  PS.saveSetting = function(key, value) {
    const s = PS.getSettings();
    s[key] = value;
    localStorage.setItem('ps_settings', JSON.stringify(s));
  };

  PS.applySettings = function() {
    const s = PS.getSettings();
    const html = document.documentElement;

    // Dark mode
    if (s.darkMode) {
      html.classList.remove('light');
      html.classList.add('dark');
      document.body.style.backgroundColor = '#191c1e';
      document.body.style.color = '#e0e3e5';
    } else {
      html.classList.remove('dark');
      html.classList.add('light');
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    }

    // Font size
    if (s.largeFont) {
      html.style.fontSize = '120%';
    } else {
      html.style.fontSize = '';
    }

    // High contrast
    if (s.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };

  // Apply settings immediately on script load
  PS.applySettings();

  // ─── RATING BAR HELPER ────────────────────────────────────────
  PS.createRatingBar = function(value, max) {
    max = max || 5;
    let html = '<div class="flex gap-1 flex-1 h-3">';
    for (let i = 1; i <= max; i++) {
      if (i <= value) {
        html += '<div class="flex-1 bg-primary rounded-sm"></div>';
      } else {
        html += '<div class="flex-1 border-2 border-outline-variant rounded-sm"></div>';
      }
    }
    html += '</div>';
    return html;
  };

  // ─── STAR RATING HELPER ──────────────────────────────────────
  PS.createStars = function(rating, maxStars) {
    maxStars = maxStars || 5;
    let html = '';
    for (let i = 1; i <= maxStars; i++) {
      if (i <= Math.floor(rating)) {
        html += '<span class="material-symbols-outlined text-primary" style="font-variation-settings: \'FILL\' 1;">star</span>';
      } else if (i - 0.5 <= rating) {
        html += '<span class="material-symbols-outlined text-primary">star_half</span>';
      } else {
        html += '<span class="material-symbols-outlined text-outline-variant">star</span>';
      }
    }
    return html;
  };

  // ─── SCORE BADGE COLOR ────────────────────────────────────────
  PS.getScoreBadgeClass = function(score) {
    if (score >= 85) return 'bg-secondary-container text-on-secondary-container';
    if (score >= 60) return 'bg-tertiary-fixed text-on-tertiary-fixed';
    return 'bg-error-container text-on-error-container';
  };

  // ─── TOAST NOTIFICATION ──────────────────────────────────────
  PS.toast = function(message, type) {
    type = type || 'success';
    const colors = {
      success: 'bg-secondary text-on-secondary',
      error: 'bg-error text-on-error',
      info: 'bg-primary text-on-primary'
    };
    const toast = document.createElement('div');
    toast.className = `fixed bottom-24 left-1/2 -translate-x-1/2 ${colors[type]} px-8 py-4 rounded-xl shadow-2xl z-[9999] font-label-lg text-label-lg flex items-center gap-3 transition-all duration-300 opacity-0 translate-y-4`;
    toast.innerHTML = `<span class="material-symbols-outlined">${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}</span>${message}`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.classList.remove('opacity-0', 'translate-y-4');
    });
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-4');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  // ─── GLOBAL FETCH INTERCEPTOR FOR DEPLOYMENT ─────────────────
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    let url = typeof input === 'string' ? input : (input instanceof Request ? input.url : '');
    if (url.startsWith('/api/') || url.startsWith(window.location.origin + '/api/')) {
      const apiBase = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? ''
        : (window.PathSense_API_BASE_URL || 'https://pathsense-backend.onrender.com');
      
      if (typeof input === 'string') {
        if (input.startsWith(window.location.origin + '/api/')) {
          input = apiBase + input.substring(window.location.origin.length);
        } else {
          input = apiBase + input;
        }
      } else if (input instanceof Request) {
        const cleanPath = input.url.startsWith(window.location.origin)
          ? input.url.substring(window.location.origin.length)
          : input.url;
        input = new Request(apiBase + cleanPath, input);
      }
    }
    return originalFetch(input, init);
  };

})();
