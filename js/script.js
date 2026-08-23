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
    // Dynamically update the FormSubmit _subject field before submit
    form.addEventListener("submit", function () {
      var name    = (form.querySelector("[name='name']").value    || "").trim();
      var service = (form.querySelector("[name='service']").value || "Quote Request").trim();
      var subjectField = document.getElementById("fs-subject");
      if (subjectField) {
        subjectField.value = "Quote Request: " + service + " \u2014 " + name;
      }
      // Allow the native POST to FormSubmit to proceed (no preventDefault)
    });
  }

  // ===== Photo upload drop zone =====
  var fileInput = document.getElementById("photos");
  var dropZone  = document.getElementById("file-drop-zone");
  var fileNames = document.getElementById("file-names");

  if (fileInput && dropZone && fileNames) {
    function updateFileNames(files) {
      if (!files || files.length === 0) {
        fileNames.textContent = "";
        return;
      }
      if (files.length > 3) {
        fileNames.textContent = "⚠ Please select up to 3 photos only.";
        fileNames.style.color = "#d68d7c";
        fileInput.value = "";
        return;
      }
      fileNames.style.color = "";
      fileNames.textContent = Array.from(files).map(function (f) { return f.name; }).join(" · ");
    }

    fileInput.addEventListener("change", function () {
      updateFileNames(fileInput.files);
    });

    dropZone.addEventListener("dragover", function (e) {
      e.preventDefault();
      dropZone.classList.add("drag-over");
    });

    dropZone.addEventListener("dragleave", function () {
      dropZone.classList.remove("drag-over");
    });

    dropZone.addEventListener("drop", function (e) {
      e.preventDefault();
      dropZone.classList.remove("drag-over");
      var dt = e.dataTransfer;
      if (dt && dt.files.length) {
        fileInput.files = dt.files;
        updateFileNames(dt.files);
      }
    });
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
