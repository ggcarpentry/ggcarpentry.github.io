// ===== Mobile nav toggle =====
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ===== Portfolio filter =====
  var filterBtns = document.querySelectorAll(".filter-btn");
  var cards = document.querySelectorAll(".folio-card");
  if (filterBtns.length && cards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var cat = btn.getAttribute("data-filter");
        cards.forEach(function (card) {
          var match = cat === "all" || card.getAttribute("data-category") === cat;
          card.style.display = match ? "" : "none";
        });
      });
    });
  }

  // ===== Contact form =====
  var form = document.getElementById("contact-form");
  if (form) {
    var status = document.getElementById("form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var data = new FormData(form);
      var name = (data.get("name") || "").toString().trim();
      var phone = (data.get("phone") || "").toString().trim();
      var email = (data.get("email") || "").toString().trim();
      var service = (data.get("service") || "Quote Request").toString().trim();
      var location = (data.get("location") || "Broward / Miami-Dade").toString().trim();
      var message = (data.get("message") || "").toString().trim();

      var subject = "Quote Request: " + service + " — " + name;
      var body = [
        "G&G CARPENTRY — QUOTE REQUEST",
        "=============================",
        "Name:     " + name,
        "Phone:    " + phone,
        "Email:    " + email,
        "Service:  " + service,
        "Location: " + location,
        "",
        "Job Details & Scope:",
        "-------------------",
        message
      ].join("\n");

      var mailtoUrl = "mailto:contact@gandgcarpentry.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

      window.location.href = mailtoUrl;

      status.innerHTML =
        '<div style="margin-bottom:0.75rem;">Opening your email client to send your inquiry directly to <strong>contact@gandgcarpentry.com</strong>.</div>' +
        '<div style="display:flex; gap:0.6rem; flex-wrap:wrap;">' +
        '<button type="button" id="copy-btn" class="btn btn-ghost" style="padding:0.45em 0.9em; font-size:0.76rem;">Copy Details to Clipboard</button>' +
        '<a href="' + mailtoUrl + '" class="btn btn-ghost" style="padding:0.45em 0.9em; font-size:0.76rem;">Re-open Email App</a>' +
        '</div>';
      status.className = "form-status show ok";

      var copyBtn = document.getElementById("copy-btn");
      if (copyBtn) {
        copyBtn.addEventListener("click", function () {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(body).then(function () {
              copyBtn.textContent = "✓ Copied to Clipboard!";
              setTimeout(function () {
                copyBtn.textContent = "Copy Details to Clipboard";
              }, 2500);
            }).catch(function () {
              copyFallback(body, copyBtn);
            });
          } else {
            copyFallback(body, copyBtn);
          }
        });
      }
    });

    function copyFallback(text, btn) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        btn.textContent = "✓ Copied to Clipboard!";
        setTimeout(function () {
          btn.textContent = "Copy Details to Clipboard";
        }, 2500);
      } catch (err) {
        btn.textContent = "Please copy manually";
      }
      document.body.removeChild(ta);
    }
  }

  // ===== Portfolio Lightbox =====
  var folioMedias = document.querySelectorAll(".folio-media");
  if (folioMedias.length) {
    var lightbox = document.createElement("div");
    lightbox.className = "folio-lightbox";
    lightbox.innerHTML =
      '<div class="folio-lightbox-content">' +
      '<button class="folio-lightbox-close" aria-label="Close image lightbox">&times;</button>' +
      '<img class="folio-lightbox-img" src="" alt="">' +
      '<div class="folio-lightbox-caption"></div>' +
      '</div>';
    document.body.appendChild(lightbox);

    var lightboxImg = lightbox.querySelector(".folio-lightbox-img");
    var lightboxCap = lightbox.querySelector(".folio-lightbox-caption");
    var lightboxClose = lightbox.querySelector(".folio-lightbox-close");

    folioMedias.forEach(function (media) {
      var img = media.querySelector("img");
      if (!img) return;
      media.addEventListener("click", function () {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || "Portfolio image";
        var card = media.closest(".folio-card");
        var title = card ? card.querySelector("h3") : null;
        lightboxCap.textContent = title ? title.textContent : (img.alt || "");
        lightbox.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });

    function closeLightbox() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }

    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("open")) {
        closeLightbox();
      }
    });
  }
});
