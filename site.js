/*
  This file builds the page from content.js and adds the interactions
  (menu, opening projects, picture gallery, swipe, enlarged pictures).
  To change text, pictures, skills or projects, edit content.js instead.
*/
(function () {
  const S = window.SITE;
  if (!S) return; // index.html shows the error box

  // ---------- small helpers ----------
  function el(tag, cls, text, attrs) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    if (attrs) Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }
  function add(parent) {
    for (let i = 1; i < arguments.length; i++) if (arguments[i]) parent.appendChild(arguments[i]);
    return parent;
  }
  function list(value) { return value == null ? [] : (Array.isArray(value) ? value : [value]); }
  function ul(cls, items) {
    const node = el("ul", cls);
    items.forEach(function (item) { node.appendChild(el("li", null, item)); });
    return node;
  }
  function $(id) { return document.getElementById(id); }

  // ---------- person, hero, contact ----------
  const person = S.person || {};
  const fullName = [person.firstName, person.lastName].filter(Boolean).join(" ");
  document.querySelectorAll("[data-name]").forEach(function (n) { n.textContent = fullName; });
  document.querySelectorAll("[data-email]").forEach(function (n) { n.href = "mailto:" + person.email; });
  document.querySelectorAll("[data-linkedin]").forEach(function (n) { n.href = person.linkedin; });
  const cv = person.cv && typeof person.cv === "object" ? person.cv : {};
  const invite = $("cv-invite");
  const inviteEmail = $("cv-invite-email");
  $("cv-invite-title").textContent = cv.title || "I would love to get to know you";
  $("cv-invite-text").textContent = cv.text || "Let's schedule a call or grab a coffee.";
  inviteEmail.textContent = cv.button || "Send me an email";
  inviteEmail.href = "mailto:" + (person.email || "")
    + "?subject=" + encodeURIComponent(cv.subject || "Let's schedule a call or grab a coffee")
    + "&body=" + encodeURIComponent(cv.body || "Hi Patryk,\n\nI would like to schedule a call or grab a coffee.\n\n");
  $("cv-invite-hint").textContent = person.email
    ? "Opens your email app, addressed to " + person.email + "."
    : "";

  let inviteFocus = null;
  function openInvite(from) {
    inviteFocus = from || document.activeElement;
    invite.hidden = false;
    document.body.classList.add("invite-open");
    invite.querySelector(".invite-close").focus();
  }
  function closeInvite() {
    if (invite.hidden) return;
    invite.hidden = true;
    document.body.classList.remove("invite-open");
    if (inviteFocus) inviteFocus.focus();
  }
  document.querySelectorAll("[data-cv]").forEach(function (n) {
    n.addEventListener("click", function () { openInvite(n); });
  });
  invite.querySelector(".invite-close").addEventListener("click", closeInvite);
  invite.addEventListener("click", function (event) {
    if (event.target === invite) closeInvite();
  });

  const hero = S.hero || {};
  $("hero-eyebrow").textContent = hero.eyebrow || "";
  add($("hero-name"), document.createTextNode(person.firstName || ""), el("br"), document.createTextNode(person.lastName || ""));
  $("hero-tagline").textContent = hero.tagline || "";
  $("hero-photo").src = person.photo;
  $("hero-photo").alt = "Portrait of " + fullName;

  const contact = S.contact || {};
  $("contact-title").textContent = contact.title || "";
  $("contact-text").textContent = contact.text || "";

  // ---------- stats ----------
  list(S.stats).forEach(function (stat) {
    if (stat.icon) {
      add($("stats"), add(el("div", "stat stat-languages"),
        el("img", "stat-lang-icon", null, { src: stat.icon, alt: stat.alt || "Languages" }),
        ul("stat-list", list(stat.lines))));
    } else {
      add($("stats"), add(el("div", "stat"),
        el("span", "stat-num", stat.number),
        el("span", "stat-label", stat.label)));
    }
  });

  // ---------- about ----------
  list(S.about).forEach(function (text) { $("about-text").appendChild(el("p", null, text)); });

  // ---------- portfolio ----------
  const projects = list(S.projects).filter(function (p) { return !p.draft; });
  const ordered = projects.filter(function (p) { return p.featured !== false; })
    .concat(projects.filter(function (p) { return p.featured === false; }));
  const workList = $("work-list");
  let workMore = null;

  function split(heading) {
    const node = add(el("div", "cs-split"), el("p", "cs-type", heading));
    for (let i = 1; i < arguments.length; i++) if (arguments[i]) node.appendChild(arguments[i]);
    return node;
  }

  function projectText(p) {
    const parts = [];
    const facts = list(p.facts);
    if (facts.length || p.challenge) {
      const factsNode = facts.length ? el("div", "cs-facts") : null;
      facts.forEach(function (f) {
        add(factsNode, add(el("p", "cs-fact"), el("span", "cs-fact-num", f.number), el("span", "cs-fact-label", f.label)));
      });
      const challenge = Array.isArray(p.challenge) ? ul("cs-highlights", p.challenge)
        : (p.challenge ? el("p", "cs-hook", p.challenge) : null);
      parts.push(split("About the challenge", factsNode, challenge));
    }
    const badges = list(p.badges);
    if (list(p.contribution).length || badges.length) {
      const tags = badges.length ? el("div", "cs-tags") : null;
      badges.forEach(function (b) { tags.appendChild(el("span", "cs-tag", b)); });
      parts.push(split("My contribution", list(p.contribution).length ? ul("cs-highlights", list(p.contribution)) : null, tags));
    }
    if (list(p.note).length) parts.push(ul("cs-highlights", list(p.note)));
    return parts;
  }

  ordered.forEach(function (p, index) {
    const isOpen = !!p.open;
    const item = el("article", "work-item" + (isOpen ? " open" : ""));
    if (p.id) item.id = "work-" + p.id;
    const head = add(el("button", "work-head", null, { type: "button", "aria-expanded": isOpen ? "true" : "false" }),
      el("span", "n", (index + 1 < 10 ? "0" : "") + (index + 1)),
      el("span", "tag", p.tag || ""),
      el("span", "name", p.title || ""),
      el("span", "flip", "+", { "aria-hidden": "true" }));
    const body = el("div", "work-body");
    body.hidden = !isOpen;
    const images = list(p.images);

    if (images.length) {
      const first = images[0];
      const study = el("article", "case-study");
      const thumbs = el("div", "cs-thumbs");
      images.forEach(function (image, i) {
        const fit = image.fill ? "cover" : "contain";
        add(thumbs, add(el("button", "cs-thumb" + (i === 0 ? " active" : ""), null, {
          type: "button",
          "aria-label": "Show picture " + (i + 1) + (image.caption ? ": " + image.caption : ""),
          "data-fit": fit,
          "data-caption": image.caption || ""
        }), el("img", image.fill ? null : "fit", null, { src: image.file, alt: image.description || image.caption || "", loading: "lazy" })));
      });
      const content = el("div", "cs-content");
      projectText(p).forEach(function (part) { content.appendChild(part); });
      add(study,
        add(el("div", "cs-hero" + (first.fill ? "" : " cs-hero--fit")),
          el("img", null, null, { src: first.file, alt: first.description || first.caption || "", loading: "lazy" })),
        el("p", "cs-caption", first.caption || ""),
        thumbs,
        add(el("div", "cs-body"), content));
      body.appendChild(study);
    } else {
      const note = el("div", "work-note");
      projectText(p).forEach(function (part) { note.appendChild(part); });
      body.appendChild(note);
    }

    add(item, add(el("h3", "work-heading"), head), body);
    if (p.featured === false) {
      if (!workMore) workMore = workList.appendChild(el("div", "work-more"));
      workMore.appendChild(item);
    } else {
      workList.appendChild(item);
    }
  });

  // ---------- skills ----------
  // A skill links to a project when it names one ({ name, project }) or when
  // a project has a badge with the same name. Otherwise it is a plain badge.
  function projectForSkill(skill) {
    if (skill.project) return projects.find(function (p) { return p.id === skill.project; });
    const wanted = skill.name.trim().toLowerCase();
    return projects.find(function (p) {
      return p.id && list(p.badges).some(function (b) { return b.trim().toLowerCase() === wanted; });
    });
  }

  function openWork(item) {
    document.querySelectorAll(".work-item.open").forEach(function (open) {
      if (open === item) return;
      open.classList.remove("open");
      open.querySelector(".work-head").setAttribute("aria-expanded", "false");
      open.querySelector(".work-body").hidden = true;
    });
    item.classList.add("open");
    item.querySelector(".work-head").setAttribute("aria-expanded", "true");
    item.querySelector(".work-body").hidden = false;
  }


  list(S.skills).forEach(function (entry) {
    const skill = typeof entry === "string" ? { name: entry } : entry;
    const project = projectForSkill(skill);
    const target = project ? $("work-" + project.id) : null;
    const tag = el(target ? "a" : "span", "skill-tag", skill.name);
    if (target) {
      tag.href = "#" + target.id;
      tag.addEventListener("click", function (event) {
        event.preventDefault();
        openWork(target);
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    $("skills-grid").appendChild(tag);
  });

  // ---------- publications ----------
  list(S.publications).forEach(function (pub) {
    const title = pub.url
      ? el("a", "pub-title", pub.title, { href: pub.url, target: "_blank", rel: "noopener noreferrer" })
      : el("p", "pub-title", pub.title);
    const body = add(el("div"), title);
    if (pub.status) body.appendChild(el("p", "pub-status", pub.status));
    body.appendChild(el("p", "pub-meta", pub.details));
    add($("pub-list"), add(el("article", "pub-item"), el("span", "pub-badge", pub.type), body));
  });

  // ---------- interactions ----------
  const nav = document.querySelector("nav");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("nav-links");

  toggle.addEventListener("click", function () {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.textContent = open ? "Close" : "Menu";
  });

  links.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "Menu";
    });
  });

  document.querySelectorAll(".work-head").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const item = btn.closest(".work-item");
      if (item.classList.contains("open")) {
        item.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        item.querySelector(".work-body").hidden = true;
      } else {
        openWork(item);
      }
    });
  });

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  let lastFocus = null;

  function openLightbox(src, alt, caption) {
    lastFocus = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightboxCaption.textContent = caption || "";
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    lightbox.querySelector(".lightbox-close").focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.removeAttribute("src");
    document.body.classList.remove("lightbox-open");
    if (lastFocus) lastFocus.focus();
  }

  function markCaption(caption) {
    if (!caption || caption.clientWidth === 0) return;
    caption.classList.toggle("is-long", caption.scrollWidth > caption.clientWidth + 1);
  }

  document.querySelectorAll(".cs-caption").forEach(function (caption) {
    markCaption(caption);
    if (window.ResizeObserver) {
      new ResizeObserver(function () { markCaption(caption); }).observe(caption);
    }
  });

  document.querySelectorAll(".cs-hero").forEach(function (hero) {
    hero.setAttribute("role", "button");
    hero.tabIndex = 0;
    hero.setAttribute("aria-label", "Enlarge image");
    hero.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        hero.click();
      }
    });
    hero.addEventListener("click", function () {
      const img = hero.querySelector("img");
      const study = hero.closest(".case-study");
      const caption = study.querySelector(".cs-caption");
      openLightbox(img.src, img.alt, caption ? caption.textContent : "");
    });
  });

  document.querySelectorAll(".cs-thumbs").forEach(function (strip) {
    const slider = document.createElement("div");
    slider.className = "cs-slider";
    const prev = document.createElement("button");
    const next = document.createElement("button");
    prev.type = "button";
    next.type = "button";
    prev.className = "cs-slider-btn";
    next.className = "cs-slider-btn";
    prev.setAttribute("aria-label", "Previous pictures");
    next.setAttribute("aria-label", "Next pictures");
    prev.textContent = "‹";
    next.textContent = "›";
    strip.parentNode.insertBefore(slider, strip);
    slider.appendChild(prev);
    slider.appendChild(strip);
    slider.appendChild(next);

    function update() {
      const max = strip.scrollWidth - strip.clientWidth;
      const overflow = max > 4;
      prev.hidden = !overflow || strip.scrollLeft <= 2;
      next.hidden = !overflow || strip.scrollLeft >= max - 2;
    }

    prev.addEventListener("click", function () {
      strip.scrollBy({ left: -(128 + 10) * 2, behavior: "smooth" });
    });
    next.addEventListener("click", function () {
      strip.scrollBy({ left: (128 + 10) * 2, behavior: "smooth" });
    });
    strip.addEventListener("scroll", update);
    if (window.ResizeObserver) new ResizeObserver(update).observe(strip);
    update();
  });

  document.querySelectorAll(".cs-thumb").forEach(function (thumb) {
    thumb.addEventListener("click", function () {
      const study = thumb.closest(".case-study");
      const hero = study.querySelector(".cs-hero");
      const heroImg = hero.querySelector("img");
      const img = thumb.querySelector("img");
      heroImg.src = img.src;
      heroImg.alt = img.alt;
      hero.classList.toggle("cs-hero--fit", thumb.dataset.fit === "contain");
      const caption = study.querySelector(".cs-caption");
      if (caption) {
        caption.textContent = thumb.dataset.caption || "";
        markCaption(caption);
      }
      study.querySelectorAll(".cs-thumb").forEach(function (item) {
        item.classList.toggle("active", item === thumb);
      });
    });
  });

  // Swipe left/right on the main image to change pictures on touch screens.
  document.querySelectorAll(".case-study").forEach(function (study) {
    const hero = study.querySelector(".cs-hero");
    const thumbs = Array.prototype.slice.call(study.querySelectorAll(".cs-thumb"));
    if (!hero || thumbs.length < 2) return;
    let startX = 0, startY = 0, tracking = false, swiped = false;

    hero.addEventListener("touchstart", function (event) {
      if (event.touches.length !== 1) { tracking = false; return; }
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      tracking = true;
      swiped = false;
    }, { passive: true });

    hero.addEventListener("touchend", function (event) {
      if (!tracking) return;
      tracking = false;
      const t = event.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      let index = thumbs.findIndex(function (item) { return item.classList.contains("active"); });
      if (index < 0) index = 0;
      const target = dx < 0 ? index + 1 : index - 1;
      if (target < 0 || target >= thumbs.length) return;
      swiped = true;
      thumbs[target].click();
      const strip = thumbs[target].parentNode;
      const s = strip.getBoundingClientRect();
      const r = thumbs[target].getBoundingClientRect();
      strip.scrollBy({ left: (r.left + r.width / 2) - (s.left + s.width / 2), behavior: "smooth" });
    }, { passive: true });

    hero.addEventListener("touchcancel", function () { tracking = false; });

    // A swipe must not also count as a tap that opens the lightbox.
    hero.addEventListener("click", function (event) {
      if (swiped) {
        swiped = false;
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    }, true);
  });

  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox || event.target.classList.contains("lightbox-close")) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    if (!lightbox.hidden) closeLightbox();
    else closeInvite();
  });
})();
