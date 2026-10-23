(function () {
  "use strict";

  var C = window.CALMA_CONFIG;
  var STORAGE_KEY = "calma-cart";
  var cart = loadCart();

  var fmt = new Intl.NumberFormat(C.locale, { style: "currency", currency: C.moneda });
  var $ = function (sel) { return document.querySelector(sel); };

  function waLink(text) {
    return "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(text);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function loadCart() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return saved && typeof saved === "object" ? saved : {};
    } catch (e) {
      return {};
    }
  }

  function saveCart() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) { /* sin almacenamiento */ }
  }

  function flavorById(id) {
    return C.sabores.filter(function (s) { return s.id === id; })[0];
  }

  // Precio medio por botella suelta, para calcular el ahorro de cada plan.
  var avgBottle = C.sabores.reduce(function (sum, s) { return sum + s.precio; }, 0) / C.sabores.length;

  // ---------- Textos de configuración ----------
  document.querySelectorAll("[data-config]").forEach(function (el) {
    el.textContent = C[el.getAttribute("data-config")];
  });
  $("#year").textContent = new Date().getFullYear();
  $("#footerWa").href = waLink("Hola " + C.marca + ", tengo una pregunta:");
  $("#footerMail").href = "mailto:" + C.email;
  $("#faqEnvio").textContent =
    "El envío cuesta " + fmt.format(C.costeEnvio) + " y es gratis a partir de " +
    fmt.format(C.envioGratisDesde) + ". El pedido mínimo es de " + fmt.format(C.pedidoMinimo) +
    ". En las suscripciones el envío siempre está incluido.";

  // ---------- Sabores ----------
  function renderFlavors() {
    $("#flavorGrid").innerHTML = C.sabores.map(function (s) {
      var qty = cart[s.id] || 0;
      var controls = s.disponible
        ? '<div class="qty">' +
            '<button type="button" data-dec="' + s.id + '" aria-label="Quitar ' + escapeHtml(s.nombre) + '">−</button>' +
            "<output>" + qty + "</output>" +
            '<button type="button" data-inc="' + s.id + '" aria-label="Añadir ' + escapeHtml(s.nombre) + '">+</button>' +
          "</div>"
        : '<span class="soldout">Agotado</span>';
      return (
        '<article class="card">' +
          '<div class="swatch" style="background:' + escapeHtml(s.color) + '"></div>' +
          "<h3>" + escapeHtml(s.nombre) + "</h3>" +
          "<p>" + escapeHtml(s.descripcion) + "</p>" +
          '<div class="meta">' +
            '<span><span class="price">' + fmt.format(s.precio) + '</span> <span class="small">· ' + escapeHtml(s.formato) + "</span></span>" +
            controls +
          "</div>" +
        "</article>"
      );
    }).join("");
  }

  $("#flavorGrid").addEventListener("click", function (e) {
    var inc = e.target.getAttribute("data-inc");
    var dec = e.target.getAttribute("data-dec");
    if (inc) changeQty(inc, 1);
    if (dec) changeQty(dec, -1);
  });

  function changeQty(id, delta) {
    var next = Math.max(0, (cart[id] || 0) + delta);
    if (next === 0) delete cart[id]; else cart[id] = next;
    saveCart();
    renderFlavors();
    renderCart();
  }

  // ---------- Planes de suscripción ----------
  function renderPlans() {
    $("#planGrid").innerHTML = C.planes.map(function (p) {
      var perBottle = p.precio / p.botellas;
      var saving = Math.round((1 - perBottle / avgBottle) * 100);
      var href = p.stripeLink || waLink(
        "Hola " + C.marca + ", quiero apuntarme al plan " + p.nombre + " (" + p.botellas +
        " botellas " + p.frecuencia + ", " + fmt.format(p.precio) + "). Mis sabores favoritos son: "
      );
      var label = p.stripeLink ? "Suscribirme" : "Suscribirme por WhatsApp";
      return (
        '<article class="card plan' + (p.destacado ? " featured" : "") + '">' +
          (p.destacado ? '<span class="badge">Más elegido</span>' : "") +
          "<h3>" + escapeHtml(p.nombre) + "</h3>" +
          '<p class="big">' + fmt.format(p.precio) + "</p>" +
          '<p class="small">' + escapeHtml(p.frecuencia) + "</p>" +
          "<ul>" +
            "<li>" + p.botellas + " botellas por entrega</li>" +
            "<li>" + fmt.format(perBottle) + " / botella" +
              (saving > 0 ? ' · <span class="save">ahorras ' + saving + "%</span>" : "") + "</li>" +
            "<li>Envío incluido</li>" +
            "<li>Pausa o cancela cuando quieras</li>" +
          "</ul>" +
          '<a class="btn ' + (p.destacado ? "btn-primary" : "btn-ghost") + '" href="' + escapeHtml(href) +
            '" target="_blank" rel="noopener">' + label + "</a>" +
        "</article>"
      );
    }).join("");

    $("#portalNote").innerHTML = C.stripePortal
      ? '¿Ya eres socio? <a href="' + escapeHtml(C.stripePortal) + '" target="_blank" rel="noopener">Gestiona tu suscripción</a>.'
      : "¿Ya eres socio? Escríbenos por WhatsApp para pausar, cambiar o cancelar.";
  }

  // ---------- Carrito ----------
  function cartLines() {
    return Object.keys(cart).map(function (id) {
      var s = flavorById(id);
      return s ? { sabor: s, qty: cart[id], subtotal: s.precio * cart[id] } : null;
    }).filter(Boolean);
  }

  function cartSummary() {
    var lines = cartLines();
    var bottles = lines.reduce(function (n, l) { return n + l.qty; }, 0);
    var subtotal = lines.reduce(function (n, l) { return n + l.subtotal; }, 0);
    var shipping = subtotal === 0 || subtotal >= C.envioGratisDesde ? 0 : C.costeEnvio;
    return { lines: lines, bottles: bottles, subtotal: subtotal, shipping: shipping, total: subtotal + shipping };
  }

  function renderCart() {
    var s = cartSummary();
    $("#cartCount").textContent = s.bottles;
    $("#cartEmpty").hidden = s.lines.length > 0;
    $("#orderForm").hidden = s.lines.length === 0;

    $("#cartList").innerHTML = s.lines.map(function (l) {
      return (
        "<li><div><div class=\"name\">" + escapeHtml(l.sabor.nombre) + "</div>" +
        '<div class="sub">' + l.qty + " × " + fmt.format(l.sabor.precio) + "</div></div>" +
        '<div class="qty">' +
          '<button type="button" data-dec="' + l.sabor.id + '" aria-label="Quitar">−</button>' +
          "<output>" + l.qty + "</output>" +
          '<button type="button" data-inc="' + l.sabor.id + '" aria-label="Añadir">+</button>' +
        "</div></li>"
      );
    }).join("");

    if (!s.lines.length) { $("#cartTotals").innerHTML = ""; return; }
    var hint = s.shipping > 0
      ? '<span class="hint">Te faltan ' + fmt.format(C.envioGratisDesde - s.subtotal) + " para envío gratis</span>"
      : "";
    $("#cartTotals").innerHTML =
      "<div><span>Subtotal</span><span>" + fmt.format(s.subtotal) + "</span></div>" +
      "<div><span>Envío</span><span>" + (s.shipping ? fmt.format(s.shipping) : "Gratis") + "</span></div>" +
      hint +
      '<div class="total"><span>Total</span><span>' + fmt.format(s.total) + "</span></div>";
  }

  $("#cartList").addEventListener("click", function (e) {
    var inc = e.target.getAttribute("data-inc");
    var dec = e.target.getAttribute("data-dec");
    if (inc) changeQty(inc, 1);
    if (dec) changeQty(dec, -1);
  });

  $("#orderForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var s = cartSummary();
    var msg = $("#formMsg");
    if (s.subtotal < C.pedidoMinimo) {
      msg.textContent = "El pedido mínimo es de " + fmt.format(C.pedidoMinimo) + ".";
      return;
    }
    msg.textContent = "";
    var data = new FormData(e.target);
    var text =
      "Hola " + C.marca + ", quiero hacer un pedido:\n\n" +
      s.lines.map(function (l) { return "• " + l.qty + " × " + l.sabor.nombre + " (" + fmt.format(l.subtotal) + ")"; }).join("\n") +
      "\n\nSubtotal: " + fmt.format(s.subtotal) +
      "\nEnvío: " + (s.shipping ? fmt.format(s.shipping) : "Gratis") +
      "\nTotal: " + fmt.format(s.total) +
      "\n\nNombre: " + data.get("nombre") +
      "\nDirección: " + data.get("direccion") +
      (data.get("notas") ? "\nNotas: " + data.get("notas") : "");
    window.open(waLink(text), "_blank", "noopener");
  });

  // ---------- Panel ----------
  var drawer = $("#drawer");
  var backdrop = $("#drawerBackdrop");
  function openDrawer() {
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    backdrop.hidden = false;
  }
  function closeDrawer() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    backdrop.hidden = true;
  }
  $("#cartOpen").addEventListener("click", openDrawer);
  $("#cartClose").addEventListener("click", closeDrawer);
  backdrop.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDrawer(); });

  renderFlavors();
  renderPlans();
  renderCart();
})();
