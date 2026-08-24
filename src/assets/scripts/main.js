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
