/* Einwilligungs-Banner (Spotify-Player, Meta-Pixel). Keine externen Ressourcen.
   Meta-Pixel-ID unten eintragen, sobald vorhanden. Ohne ID wird nie etwas an Meta gesendet. */
(function () {
  'use strict';
  var META_PIXEL_ID = ''; // z. B. '123456789012345'
  var KEY = 'mel-consent-v1';

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; }
  }
  function write(v) {
    try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {}
  }

  function loadSpotify() {
    document.querySelectorAll('.spotify-consent button').forEach(function (b) { b.click(); });
  }

  function loadMeta() {
    if (!META_PIXEL_ID || window.fbq) return;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  function apply(c) {
    if (!c) return;
    if (c.spotify) loadSpotify();
    if (c.meta) loadMeta();
  }

  var css = '\
.cc-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;background:#f8f5f0;color:#4a4038;border:1px solid #e7ddd1;border-radius:16px;box-shadow:0 12px 40px rgba(40,30,20,.22);padding:22px 22px 18px;font:400 14px/1.55 Inter,system-ui,sans-serif}\
.cc-banner h2{margin:0 0 6px;font:500 20px/1.2 Newsreader,Georgia,serif;color:#4a4038}\
.cc-banner p{margin:0 0 12px;color:#6b5e52}\
.cc-banner a{color:inherit}\
.cc-opts{display:none;margin:0 0 14px;padding:12px 14px;background:#efe7dc;border-radius:12px}\
.cc-banner.is-open .cc-opts{display:block}\
.cc-opts label{display:flex;gap:10px;align-items:flex-start;margin:0 0 10px;cursor:pointer}\
.cc-opts label:last-child{margin:0}\
.cc-opts input{margin-top:3px;accent-color:#a3907d}\
.cc-opts small{display:block;color:#8d7f70}\
.cc-btns{display:flex;flex-wrap:wrap;gap:8px}\
.cc-btns button{flex:1 1 auto;cursor:pointer;font:600 13px Inter,system-ui,sans-serif;letter-spacing:.04em;padding:12px 18px;border-radius:999px;border:1px solid #b8a899;background:transparent;color:#4a4038}\
.cc-btns button.cc-primary{background:#b8a899;color:#fff}\
.cc-btns button:hover{background:#a3907d;color:#fff;border-color:#a3907d}\
.cc-banner .cc-links{margin:14px 0 0;font-size:12px;color:#8d7f70}';

  function build() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var el = document.createElement('div');
    el.className = 'cc-banner'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Cookie-Einstellungen');
    var metaRow = META_PIXEL_ID ? '<label><input type="checkbox" id="cc-meta"><span>Marketing (Meta-Pixel)<small>Misst Besuche und Anfragen für Instagram- und Facebook-Werbung. Daten gehen an Meta.</small></span></label>' : '';
    el.innerHTML = '<h2>Deine Privatsphäre</h2>' +
      '<p>Ich nutze nur das Nötigste. Mit deiner Zustimmung zeige ich außerdem meine Spotify-Playlist direkt an' + (META_PIXEL_ID ? ' und messe meine Werbung' : '') + '. Du kannst jederzeit widerrufen.</p>' +
      '<div class="cc-opts">' +
      '<label><input type="checkbox" checked disabled><span>Notwendig<small>Speichert nur diese Auswahl auf deinem Gerät.</small></span></label>' +
      '<label><input type="checkbox" id="cc-spotify"><span>Spotify-Player<small>Verbindung zu Spotify, deine IP-Adresse wird übertragen.</small></span></label>' + metaRow +
      '</div>' +
      '<div class="cc-btns"><button type="button" id="cc-reject">Ablehnen</button><button type="button" id="cc-custom">Auswahl</button><button type="button" id="cc-accept" class="cc-primary">Alle akzeptieren</button></div>' +
      '<p class="cc-links"><a href="datenschutz.html">Datenschutz</a> · <a href="impressum.html">Impressum</a></p>';
    document.body.appendChild(el);

    function save(c) { c.ts = Date.now(); write(c); el.remove(); apply(c); }
    var sp = el.querySelector('#cc-spotify'), mt = el.querySelector('#cc-meta');
    var cur = read(); if (cur) { sp.checked = !!cur.spotify; if (mt) mt.checked = !!cur.meta; }
    el.querySelector('#cc-reject').onclick = function () { save({ spotify: false, meta: false }); };
    el.querySelector('#cc-accept').onclick = function () { save({ spotify: true, meta: !!META_PIXEL_ID }); };
    el.querySelector('#cc-custom').onclick = function () {
      if (!el.classList.contains('is-open')) { el.classList.add('is-open'); this.textContent = 'Auswahl speichern'; return; }
      save({ spotify: sp.checked, meta: mt ? mt.checked : false });
    };
  }

  function init() {
    var c = read();
    if (c) apply(c); else build();
    document.querySelectorAll('[data-consent-open]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var old = document.querySelector('.cc-banner'); if (old) old.remove();
        build();
      });
    });
  }
  if (document.readyState === 'complete') init(); else window.addEventListener('load', init);
})();
