/* MODELO ARTISTA — GUARÁ AGENCY
 * Interações sem dependências: calendário, galeria, navegação, vídeo e formulário.
 */
(() => {
  "use strict";
  const config = window.ARTIST_CONFIG || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const today = new Date();
  const localISO = (d) => [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
  const todayISO = localISO(today);
  const monthFormatter = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });
  const shortDateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long" });
  let toastTimer = null;

  function notify(message) {
    const toast = $("#toast");
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("show");
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 4400);
  }

  // Header, progresso de leitura e navegação mobile.
  const header = $("#site-header");
  const progress = $("#scroll-progress");
  const menuToggle = $("#menu-toggle");
  const nav = $("#primary-nav");
  function updateScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 34);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (max > 0 ? Math.max(0, Math.min(100, window.scrollY / max * 100)) : 0) + "%";
  }
  window.addEventListener("scroll", updateScroll, { passive: true });
  window.addEventListener("resize", updateScroll, { passive: true });
  updateScroll();

  function closeMenu() {
    if (!nav || !menuToggle) return;
    nav.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    document.body.classList.remove("menu-open");
  }
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const open = !nav.classList.contains("open");
      nav.classList.toggle("open", open);
      menuToggle.classList.toggle("open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      document.body.classList.toggle("menu-open", open);
    });
    $$("a[href^='#']", nav).forEach(link => link.addEventListener("click", closeMenu));
    window.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
    window.addEventListener("resize", () => { if (window.innerWidth > 980) closeMenu(); });
  }

  // Estado ativo da navegação e entrada delicada das seções.
  const pageSections = $$("main section[id]");
  if ("IntersectionObserver" in window) {
    const activeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        $$(".nav-link").forEach(link => link.classList.toggle("active", link.getAttribute("href") === "#" + id));
      });
    }, { rootMargin: "-28% 0px -62% 0px", threshold: 0 });
    pageSections.forEach(s => activeObserver.observe(s));

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const revealTargets = $$(".section-intro, .calendar-card, .agenda-side, .music-layout, .video-frame, .about-copy-inner, .gallery-grid, .contact-lead, .contact-card, .press-layout");
      const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add("visible"); revealObserver.unobserve(entry.target); }
      }), { threshold: 0.06, rootMargin: "0px 0px -30px 0px" });
      revealTargets.forEach(el => { el.classList.add("reveal"); revealObserver.observe(el); });
    }
  }

  // Calendário mensal: datas configuráveis em config.js, acessível por teclado.
  const shows = (Array.isArray(config.shows) ? config.shows : [])
    .filter(show => show && /^\d{4}-\d{2}-\d{2}$/.test(show.date))
    .slice().sort((a, b) => a.date.localeCompare(b.date));
  const showsByDate = new Map();
  for (const show of shows) {
    if (!showsByDate.has(show.date)) showsByDate.set(show.date, []);
    showsByDate.get(show.date).push(show);
  }
  let displayedMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  let selectedDate = null;
  const grid = $("#calendar-grid");
  const title = $("#month-title");
  const selectedShow = $("#selected-show");

  function renderSelectedShow() {
    if (!selectedShow) return;
    selectedShow.replaceChildren();
    const current = selectedDate ? (showsByDate.get(selectedDate) || []) : [];
    if (!current.length) {
      const p = document.createElement("p");
      p.textContent = "Selecione uma data marcada no calendário para ver os detalhes do evento.";
      selectedShow.appendChild(p);
      return;
    }
    const dateText = shortDateFormatter.format(new Date(selectedDate + "T12:00:00"));
    const date = document.createElement("p");
    date.className = "show-date";
    date.textContent = dateText.toUpperCase();
    selectedShow.appendChild(date);
    for (const item of current) {
      const place = document.createElement("p");
      place.className = "show-location";
      place.textContent = [item.title, item.city && item.state ? "· " + item.city + "/" + item.state : ""].filter(Boolean).join(" ");
      const type = document.createElement("span");
      type.className = "show-type";
      type.textContent = item.type || (item.public ? "Show" : "Evento privado");
      selectedShow.append(place, type);
    }
  }

  function renderCalendar() {
    if (!grid || !title) return;
    const year = displayedMonth.getFullYear();
    const month = displayedMonth.getMonth();
    const monthText = monthFormatter.format(displayedMonth);
    title.textContent = monthText.charAt(0).toUpperCase() + monthText.slice(1);
    grid.replaceChildren();

    const startWeekday = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    for (let i = 0; i < startWeekday; i++) {
      const empty = document.createElement("span");
      empty.className = "day other-month";
      empty.setAttribute("aria-hidden", "true");
      grid.appendChild(empty);
    }

    for (let day = 1; day <= days; day++) {
      const dateISO = localISO(new Date(year, month, day));
      const events = showsByDate.get(dateISO) || [];
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "day";
      btn.textContent = String(day).padStart(2, "0");
      btn.setAttribute("aria-label", day + " de " + monthText + (events.length ? ": " + events.length + " show(s) marcado(s)" : ", sem show"));
      if (dateISO === todayISO) { btn.classList.add("today"); btn.setAttribute("aria-current", "date"); }
      if (events.length) btn.classList.add("has-show");
      if (selectedDate === dateISO) { btn.classList.add("selected"); btn.setAttribute("aria-pressed", "true"); }
      else btn.setAttribute("aria-pressed", "false");
      btn.addEventListener("click", () => {
        if (!events.length) {
          notify("Sem apresentação cadastrada nessa data. Consulte outras datas ou envie um pedido de show.");
          return;
        }
        selectedDate = dateISO;
        renderCalendar();
        renderSelectedShow();
      });
      grid.appendChild(btn);
    }
  }
  const currentMonthMatches = shows.filter(s => s.date >= todayISO && s.date.slice(0, 7) === localISO(displayedMonth).slice(0, 7));
  if (currentMonthMatches.length) selectedDate = currentMonthMatches[0].date;
  else {
    const future = shows.find(s => s.date >= todayISO);
    if (future) {
      selectedDate = future.date;
      displayedMonth = new Date(Number(future.date.slice(0, 4)), Number(future.date.slice(5, 7)) - 1, 1);
    }
  }
  renderCalendar();
  renderSelectedShow();
  function changeMonth(direction) {
    displayedMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + direction, 1);
    const matching = shows.find(s => s.date.slice(0, 7) === localISO(displayedMonth).slice(0, 7));
    selectedDate = matching ? matching.date : null;
    renderCalendar();
    renderSelectedShow();
  }
  $("#calendar-prev")?.addEventListener("click", () => changeMonth(-1));
  $("#calendar-next")?.addEventListener("click", () => changeMonth(1));

  // Spotify: URL e incorporação opcionais sem reproduzir conteúdo não licenciado.
  $$("[data-config-link='spotify']").forEach(link => {
    if (typeof config.spotifyUrl === "string" && /^https:\/\/open\.spotify\.com\//.test(config.spotifyUrl)) {
      link.href = config.spotifyUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else {
      link.removeAttribute("target");
      link.addEventListener("click", event => {
        event.preventDefault();
        notify("Modelo demonstrativo: configure o link oficial do Spotify em config.js.");
      });
    }
  });
  if (typeof config.spotifyEmbedUrl === "string" && /^https:\/\/open\.spotify\.com\/embed\//.test(config.spotifyEmbedUrl)) {
    const slot = document.createElement("div");
    slot.className = "spotify-embed";
    slot.style.margin = "-9px 0 30px";
    const iframe = document.createElement("iframe");
    iframe.src = config.spotifyEmbedUrl;
    iframe.width = "100%";
    iframe.height = "152";
    iframe.style.border = "0";
    iframe.style.borderRadius = "8px";
    iframe.loading = "lazy";
    iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    iframe.title = "Player oficial do Spotify do artista";
    slot.appendChild(iframe);
    $(".tracklist")?.insertAdjacentElement("afterend", slot);
  }

  // YouTube: iframe só é criado após clique, evitando baixar o player antecipadamente.
  const play = $("#video-play");
  const frame = $("#video-frame");
  play?.addEventListener("click", () => {
    const id = typeof config.youtubeVideoId === "string" ? config.youtubeVideoId.trim() : "";
    if (!/^[a-zA-Z0-9_-]{11}$/.test(id)) {
      notify("Modelo demonstrativo: informe o ID do vídeo oficial em config.js para ativar o player.");
      return;
    }
    const iframe = document.createElement("iframe");
    iframe.title = "Vídeo oficial do artista no YouTube";
    iframe.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    frame?.appendChild(iframe);
    play.remove();
  });

  // Galeria com lightbox nativo: ESC, clique fora e setas de teclado.
  const galleryButtons = $$(".gallery-item");
  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightbox-image");
  const lightboxCaption = $("#lightbox-caption");
  let galleryIndex = 0;

  function gallerySet(index) {
    if (!galleryButtons.length || !lightboxImage) return;
    galleryIndex = (index + galleryButtons.length) % galleryButtons.length;
    const originalImage = $("img", galleryButtons[galleryIndex]);
    if (!originalImage) return;
    try {
      const src = new URL(originalImage.currentSrc || originalImage.src);
      if (src.hostname === "images.unsplash.com") { src.searchParams.set("w", "1800"); src.searchParams.set("q", "90"); }
      lightboxImage.src = src.href;
    } catch { lightboxImage.src = originalImage.src; }
    lightboxImage.alt = originalImage.alt;
    if (lightboxCaption) lightboxCaption.textContent = String(galleryIndex + 1).padStart(2, "0") + " / " + String(galleryButtons.length).padStart(2, "0");
  }
  galleryButtons.forEach((button, index) => button.addEventListener("click", () => {
    gallerySet(index);
    if (typeof lightbox?.showModal === "function") {
      lightbox.showModal();
      document.body.classList.add("lightbox-open");
    } else {
      notify("Seu navegador não oferece suporte à visualização ampliada.");
    }
  }));
  function closeLightbox() {
    if (lightbox?.open) lightbox.close();
    document.body.classList.remove("lightbox-open");
  }
  $("#lightbox-close")?.addEventListener("click", closeLightbox);
  $("#lightbox-prev")?.addEventListener("click", () => gallerySet(galleryIndex - 1));
  $("#lightbox-next")?.addEventListener("click", () => gallerySet(galleryIndex + 1));
  lightbox?.addEventListener("close", () => document.body.classList.remove("lightbox-open"));
  lightbox?.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", e => {
    if (!lightbox?.open) return;
    if (e.key === "ArrowLeft") gallerySet(galleryIndex - 1);
    if (e.key === "ArrowRight") gallerySet(galleryIndex + 1);
  });

  // Contratação: dados ficam no navegador; WhatsApp recebe o texto pré-preenchido.
  const form = $("#booking-form");
  const dateInput = $("#booking-date");
  if (dateInput) dateInput.min = todayISO;
  form?.addEventListener("submit", e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    const name = String(fields.get("name") || "").trim();
    const city = String(fields.get("city") || "").trim();
    const date = String(fields.get("date") || "");
    const type = String(fields.get("type") || "").trim();
    const message = String(fields.get("message") || "").trim();
    if (!name || !city || !date || !type) { notify("Preencha todos os campos obrigatórios."); return; }
    if (date < todayISO) { notify("Selecione uma data atual ou futura."); dateInput?.focus(); return; }
    const formattedDate = date.split("-").reverse().join("/");
    const lines = [
      "Olá! Gostaria de consultar a disponibilidade para contratar um show.",
      "",
      "*Responsável:* " + name,
      "*Cidade / estado:* " + city,
      "*Data prevista:* " + formattedDate,
      "*Tipo de evento:* " + type
    ];
    if (message) lines.push("*Mensagem adicional:* " + message);
    lines.push("", "Enviado pelo site do artista.");
    const digits = String(config.whatsappNumber || "").replace(/\D/g, "");
    const url = "https://wa.me/" + (digits || "") + "?text=" + encodeURIComponent(lines.join("\n"));
    window.open(url, "_blank", "noopener,noreferrer");
    if (!digits) notify("Demonstração: escolha um destinatário no WhatsApp. Configure o número de contratação em config.js.");
  });

  // Instagram oficial opcional; não inventar perfis de artistas demonstrativos.
  $("[data-config-link='instagram']").forEach(link => {
    if (typeof config.instagramUrl === "string" && /^https:\/\/(www\.)?instagram\.com\//.test(config.instagramUrl)) {
      link.href = config.instagramUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else {
      link.addEventListener("click", e => {
        e.preventDefault();
        notify("Modelo demonstrativo: informe o Instagram oficial em config.js.");
      });
    }
  });

  // Press kit permite trocar destino local por link oficial da produtora.
  const press = $(".press-layout .button");
  if (press && typeof config.pressKitUrl === "string" && config.pressKitUrl.trim()) {
    press.href = config.pressKitUrl;
    if (/^https?:\/\//.test(config.pressKitUrl)) { press.target = "_blank"; press.rel = "noopener noreferrer"; }
  }
  const year = $("#year");
  if (year) year.textContent = String(today.getFullYear());
})();