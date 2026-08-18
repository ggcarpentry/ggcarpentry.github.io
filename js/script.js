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

      var action = form.getAttribute("action") || "";
      var placeholder = action.indexOf("YOUR_FORM_ID") !== -1;

      if (placeholder) {
        // Formspree endpoint hasn't been configured yet — fall back to mailto
        // so the message still reaches contact@gandgcarpentry.com.
        var data = new FormData(form);
        var subject = encodeURIComponent("Website inquiry from " + (data.get("name") || "website visitor"));
        var body = encodeURIComponent(
          "Name: " + data.get("name") + "\n" +
          "Email: " + data.get("email") + "\n" +
          "Phone: " + data.get("phone") + "\n" +
          "Service: " + data.get("service") + "\n\n" +
          data.get("message")
        );
        window.location.href = "mailto:contact@gandgcarpentry.com?subject=" + subject + "&body=" + body;
        showStatus("Opening your email app to send this to contact@gandgcarpentry.com…", "ok");
        return;
      }

      showStatus("Sending…", "");
      fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            showStatus("Thanks — your message is on its way. We'll be in touch soon.", "ok");
          } else {
            showStatus("Something went wrong sending that. Please email contact@gandgcarpentry.com directly.", "err");
          }
        })
        .catch(function () {
          showStatus("Something went wrong sending that. Please email contact@gandgcarpentry.com directly.", "err");
        });
    });

    function showStatus(msg, kind) {
      status.textContent = msg;
      status.className = "form-status show" + (kind ? " " + kind : "");
    }
  }
});
