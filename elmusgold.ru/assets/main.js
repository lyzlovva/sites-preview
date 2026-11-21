/* Шапка, мобильное меню, копирование и печать реквизитов. Без внешних зависимостей. */
(function () {
  var hd = document.querySelector('[data-hd]');
  if (hd) {
    var onScroll = function () { hd.classList.toggle('is-solid', window.scrollY > 24); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    var set = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('span').textContent = open ? 'Закрыть' : 'Меню';
      document.documentElement.classList.toggle('menu-open', open);
    };
    toggle.addEventListener('click', function () { set(toggle.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
    window.matchMedia('(min-width: 1101px)').addEventListener('change', function () { set(false); });
  }

  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var table = document.querySelector(btn.getAttribute('data-copy'));
      if (!table) return;
      var text = Array.prototype.map.call(table.querySelectorAll('tr'), function (tr) {
        return tr.cells[0].textContent.trim() + ': ' + tr.cells[1].textContent.replace(/\s+/g, ' ').trim();
      }).join('\n');
      var done = function () {
        var label = btn.textContent;
        btn.textContent = 'Скопировано';
        setTimeout(function () { btn.textContent = label; }, 1800);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done);
      } else {
        var ta = document.createElement('textarea');
        ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (err) {}
        document.body.removeChild(ta);
      }
    });
  });

  document.querySelectorAll('[data-print]').forEach(function (btn) {
    btn.addEventListener('click', function () { window.print(); });
  });
})();

/* Раскрытие информации: открыть раздел, на который ведёт ссылка (#charter и т. п.) */
(function () {
  function openFromHash() {
    var id = location.hash.slice(1);
    var el = id && document.getElementById(id);
    if (el && el.tagName === 'DETAILS') { el.open = true; el.scrollIntoView(); }
  }
  window.addEventListener('hashchange', openFromHash);
  document.addEventListener('DOMContentLoaded', openFromHash);
})();
