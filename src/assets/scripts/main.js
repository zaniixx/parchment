(function themeToggle() {
  var btn = document.getElementById("theme-toggle");
  if (!btn) return;

  function isDark() {
    return document.documentElement.getAttribute("data-theme") === "dark";
  }

  function sync() {
    var dark = isDark();
    btn.setAttribute("aria-pressed", dark);
    btn.textContent = dark ? "LIGHT MODE" : "DARK MODE";
  }

  sync();

  btn.addEventListener("click", function () {
    var next = isDark() ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("parchment-theme", next);
    } catch (err) {
      /* localStorage unavailable (private mode, etc.) - theme just won't persist */
    }
    sync();
  });
})();

(function collapsibleNav() {
  var nav = document.querySelector(".site-nav--mobile");
  if (!nav) return;

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.removeAttribute("open");
    });
  });
})();

(function scrollReveal() {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var items = document.querySelectorAll(".feed-item, .gallery-grid figure");
  if (!items.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px" }
  );

  items.forEach(function (item) {
    item.classList.add("reveal");
    observer.observe(item);
  });
})();

(function siteSearch() {
  var toggle = document.getElementById("site-search-toggle");
  var panel = document.getElementById("site-search-panel");
  var input = document.getElementById("site-search-input");
  var results = document.getElementById("site-search-results");
  if (!toggle || !panel || !input || !results) return;

  var indexUrl = input.getAttribute("data-search-index");
  var entries = null;
  var loading = null;

  function ensureLoaded() {
    if (entries) return Promise.resolve(entries);
    if (!loading) {
      loading = fetch(indexUrl)
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          entries = data;
          return entries;
        })
        .catch(function () {
          entries = [];
          return entries;
        });
    }
    return loading;
  }

  function render(matches) {
    results.innerHTML = "";

    if (!matches.length) {
      var empty = document.createElement("li");
      empty.className = "site-search-empty";
      empty.textContent = "No matches.";
      results.appendChild(empty);
      results.hidden = false;
      return;
    }

    matches.slice(0, 8).forEach(function (item) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = item.url;
      a.textContent = item.title;
      li.appendChild(a);
      if (item.excerpt) {
        var p = document.createElement("p");
        p.className = "site-search-excerpt";
        p.textContent = item.excerpt;
        li.appendChild(p);
      }
      results.appendChild(li);
    });
    results.hidden = false;
  }

  function runSearch(query) {
    query = query.trim();
    if (!query) {
      results.hidden = true;
      results.innerHTML = "";
      return;
    }

    ensureLoaded().then(function (data) {
      var matches;
      if (query.charAt(0) === "#") {
        var tag = query.slice(1).toLowerCase();
        matches = !tag
          ? []
          : data.filter(function (item) {
              return (item.tags || []).some(function (t) {
                return t.toLowerCase().indexOf(tag) !== -1;
              });
            });
      } else {
        var q = query.toLowerCase();
        matches = data.filter(function (item) {
          return (
            item.title.toLowerCase().indexOf(q) !== -1 ||
            (item.excerpt || "").toLowerCase().indexOf(q) !== -1
          );
        });
      }
      render(matches);
    });
  }

  function openPanel() {
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    ensureLoaded();
    input.focus();
  }

  function closePanel() {
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    input.value = "";
    results.hidden = true;
    results.innerHTML = "";
  }

  toggle.addEventListener("click", function () {
    if (panel.hidden) openPanel();
    else closePanel();
  });

  input.addEventListener("input", function () {
    runSearch(input.value);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !panel.hidden) closePanel();
  });

  document.addEventListener("click", function (event) {
    if (!panel.hidden && !event.target.closest(".site-search")) closePanel();
  });
})();

function reportNetworkTiming() {
  var body = document.getElementById("net-timing-body");
  if (!body) return;

  var nav = performance.getEntriesByType("navigation")[0];
  if (!nav) {
    body.textContent = "Timing data unavailable in this browser.";
    return;
  }

  var dns = Math.round(nav.domainLookupEnd - nav.domainLookupStart);
  var tcp = Math.round(nav.connectEnd - nav.connectStart);
  var ttfb = Math.round(nav.responseStart - nav.requestStart);
  var download = Math.round(nav.responseEnd - nav.responseStart);
  var total = Math.round(nav.responseEnd - nav.startTime);

  var rows = [
    ["DNS lookup", dns],
    ["TCP connect", tcp],
    ["Time to first byte", ttfb],
    ["Download", download],
    ["Total", total],
  ];

  body.innerHTML = rows
    .map(function (row) {
      return "<dt>" + row[0] + "</dt><dd>" + row[1] + " ms</dd>";
    })
    .join("");
}

if (document.readyState === "complete") {
  reportNetworkTiming();
} else {
  window.addEventListener("load", reportNetworkTiming);
}
