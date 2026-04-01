/**
 * Lecture PDF viewer (Mozilla PDF.js). Load pdf.min.js before this script.
 * Markup: [data-ros2-pdf-root][data-pdf-url]
 */
(function () {
  var WORKER_SRC =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

  function qs(root, sel) {
    return root.querySelector(sel);
  }

  function setHidden(el, hidden) {
    if (!el) return;
    el.hidden = !!hidden;
  }

  function initRoot(root) {
    var url = root.getAttribute("data-pdf-url");
    if (!url) return;

    var toolbar = qs(root, "[data-pdf-toolbar]");
    var statusEl = qs(root, "[data-pdf-status]");
    var pagesEl = qs(root, "[data-pdf-pages]");
    var errEl = qs(root, "[data-pdf-error]");
    var zoomInBtn = qs(root, "[data-zoom-in]");
    var zoomOutBtn = qs(root, "[data-zoom-out]");
    var fitBtn = qs(root, "[data-fit-width]");
    var pageLabel = qs(root, "[data-page-label]");

    var state = {
      pdf: null,
      scale: 1.25,
      renderGen: 0,
    };

    function showError(msg) {
      setHidden(statusEl, true);
      setHidden(toolbar, true);
      pagesEl.innerHTML = "";
      errEl.textContent = msg;
      setHidden(errEl, false);
    }

    function showLoading() {
      setHidden(errEl, true);
      setHidden(toolbar, true);
      statusEl.textContent = "Loading PDF…";
      setHidden(statusEl, false);
      pagesEl.innerHTML = "";
    }

    function applyScaleFromFitWidth() {
      if (!state.pdf) return;
      state.pdf.getPage(1).then(function (first) {
        var base = first.getViewport({ scale: 1 });
        var w = pagesEl.clientWidth || root.clientWidth || 800;
        var pad = 24;
        state.scale = Math.max(0.5, Math.min(2.5, (w - pad) / base.width));
        renderAll();
      });
    }

    function renderAll() {
      if (!state.pdf) return;
      var gen = ++state.renderGen;
      setHidden(statusEl, true);
      pagesEl.innerHTML = "";
      var pdf = state.pdf;
      var scale = state.scale;
      var chain = Promise.resolve();
      for (var i = 1; i <= pdf.numPages; i++) {
        (function (num) {
          chain = chain.then(function () {
            if (gen !== state.renderGen) return null;
            return pdf.getPage(num).then(function (page) {
              if (gen !== state.renderGen) return null;
              var viewport = page.getViewport({ scale: scale });
              var canvas = document.createElement("canvas");
              var ctx = canvas.getContext("2d");
              canvas.className = "ros2-pdf-page-canvas";
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              var wrap = document.createElement("div");
              wrap.className = "ros2-pdf-page-wrap";
              wrap.appendChild(canvas);
              pagesEl.appendChild(wrap);
              var task = page.render({
                canvasContext: ctx,
                viewport: viewport,
              });
              return task.promise;
            });
          });
        })(i);
      }
      chain
        .then(function () {
          if (gen !== state.renderGen) return;
          if (pageLabel) pageLabel.textContent = pdf.numPages + " pages";
          setHidden(toolbar, false);
        })
        .catch(function (e) {
          if (gen !== state.renderGen) return;
          showError(
            "Could not render PDF: " + (e && e.message ? e.message : String(e))
          );
        });
    }

    function loadPdfWithNativeIframe() {
      setHidden(errEl, true);
      setHidden(statusEl, true);
      setHidden(toolbar, true);
      pagesEl.innerHTML = "";
      pagesEl.classList.add("ros2-pdf-pages--native");
      var iframe = document.createElement("iframe");
      iframe.className = "ros2-pdf-native-iframe";
      iframe.title = "Lecture PDF";
      iframe.setAttribute("src", url);
      pagesEl.appendChild(iframe);
    }

    function loadPdf() {
      if (window.location.protocol === "file:") {
        loadPdfWithNativeIframe();
        return;
      }
      if (typeof pdfjsLib === "undefined") {
        showError("PDF engine failed to load. Check your network connection.");
        return;
      }
      pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_SRC;
      showLoading();
      pdfjsLib
        .getDocument(url)
        .promise.then(function (pdf) {
          state.pdf = pdf;
          if (pageLabel) pageLabel.textContent = pdf.numPages + " pages";
          applyScaleFromFitWidth();
        })
        .catch(function (e) {
          var hint =
            "Could not open the PDF. Save your file as lecture.pdf in the Tutorial folder shown above, then refresh.";
          var detail = e && e.message ? " (" + e.message + ")" : "";
          showError(hint + detail);
        });
    }

    if (fitBtn) fitBtn.addEventListener("click", applyScaleFromFitWidth);
    if (zoomInBtn) {
      zoomInBtn.addEventListener("click", function () {
        state.scale = Math.min(2.75, state.scale * 1.15);
        renderAll();
      });
    }
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener("click", function () {
        state.scale = Math.max(0.45, state.scale / 1.15);
        renderAll();
      });
    }

    loadPdf();
  }

  function boot() {
    document.querySelectorAll("[data-ros2-pdf-root]").forEach(initRoot);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
