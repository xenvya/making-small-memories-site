import { business, services } from "../data/business";
const menu = document.querySelector<HTMLButtonElement>(".menu-toggle");
const nav = document.querySelector<HTMLElement>("#main-nav");
menu?.addEventListener("click", () => {
  const expanded = menu.getAttribute("aria-expanded") === "true";
  menu.setAttribute("aria-expanded", String(!expanded));
  nav?.classList.toggle("open", !expanded);
});
nav?.addEventListener("click", (event) => {
  if ((event.target as HTMLElement).closest("a")) {
    nav.classList.remove("open");
    menu?.setAttribute("aria-expanded", "false");
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav?.classList.contains("open")) {
    nav.classList.remove("open");
    menu?.setAttribute("aria-expanded", "false");
    menu?.focus();
  }
});
const form = document.querySelector<HTMLFormElement>("#consultation-form");
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const interest = String(data.get("interest") || "a consultation");
  const name = String(data.get("name") || "").trim();
  const body = `Hello John,\n\nI would like to arrange a consultation about ${interest.toLowerCase()}. Please let me know the next steps and a suitable time to talk.\n\n${name ? `Thank you,\n${name}` : "Thank you."}`;
  window.location.href = `mailto:${business.email}?subject=${encodeURIComponent(`Consultation: ${interest}`)}&body=${encodeURIComponent(body)}`;
  const status = document.querySelector("#email-status");
  if (status)
    status.textContent =
      "Your email app should open with a draft. If it does not, use John’s email address or phone number alongside this form.";
});
document.querySelectorAll<HTMLElement>("[data-interest]").forEach((link) =>
  link.addEventListener("click", () => {
    const select = document.querySelector<HTMLSelectElement>("#interest");
    if (
      select &&
      [...select.options].some((o) => o.value === link.dataset.interest)
    )
      select.value = link.dataset.interest!;
  }),
);
const tabs = [...document.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
function activateTab(tab: HTMLButtonElement) {
  tabs.forEach((t) => {
    const selected = t === tab;
    t.setAttribute("aria-selected", String(selected));
    t.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(t.getAttribute("aria-controls")!);
    if (panel) panel.hidden = !selected;
  });
}
tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => activateTab(tab));
  tab.addEventListener("keydown", (e) => {
    let next: number | undefined;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = tabs.length - 1;
    if (next !== undefined) {
      e.preventDefault();
      activateTab(tabs[next]);
      tabs[next].focus();
    }
  });
});
const guideLinks = [
  ...document.querySelectorAll<HTMLAnchorElement>("[data-guide-link]"),
];
if (guideLinks.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        if (entry.isIntersecting)
          guideLinks.forEach((link) => {
            const active = link.hash === `#${entry.target.id}`;
            link.classList.toggle("active", active);
            if (active) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
    },
    { rootMargin: "-12% 0px -52% 0px", threshold: 0 },
  );
  document
    .querySelectorAll(".guide-entry")
    .forEach((entry) => observer.observe(entry));
}
const media = window.matchMedia("(prefers-reduced-motion: reduce)");
const landscape = document.querySelector<HTMLElement>(".horizon-landscape img");
let raf = 0;
function updateLandscape() {
  raf = 0;
  if (!landscape) return;
  if (media.matches) {
    landscape.style.transform = "";
    return;
  }
  const rect = landscape.parentElement!.getBoundingClientRect();
  if (rect.bottom > 0 && rect.top < innerHeight)
    landscape.style.transform = `scale(1.06) translateY(${Math.max(-12, Math.min(12, -rect.top * 0.025))}px)`;
}
if (landscape) {
  window.addEventListener(
    "scroll",
    () => {
      if (!raf) raf = requestAnimationFrame(updateLandscape);
    },
    { passive: true },
  );
  media.addEventListener("change", updateLandscape);
  updateLandscape();
}
const dialog = document.querySelector<HTMLDialogElement>(".calendar-dialog");
let calendarLoaded = false;
// Cal.com's documented bootstrap queues instructions until the script loads.
type CalFunction = ((...args: unknown[]) => void) & {
  q: unknown[][];
  loaded?: boolean;
  ns: Record<string, CalFunction>;
};
declare global {
  interface Window {
    Cal?: CalFunction;
  }
}
function loadCalendar(link: string) {
  if (calendarLoaded) return;
  calendarLoaded = true;
  const cal = ((...args: unknown[]) => {
    cal.q.push(args);
  }) as CalFunction;
  cal.q = [];
  cal.ns = {};
  cal.loaded = true;
  window.Cal = cal;
  const script = document.createElement("script");
  script.src = "https://app.cal.com/embed/embed.js";
  script.async = true;
  script.onerror = () => {
    const target = document.querySelector("#cal-inline");
    if (target)
      target.textContent =
        "Please use the calendar link below to choose your appointment.";
    calendarLoaded = false;
    script.remove();
  };
  document.head.append(script);
  cal("init", { origin: "https://cal.com" });
  cal("inline", {
    elementOrSelector: "#cal-inline",
    calLink: link,
    config: { layout: "month_view" },
  });
  cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
}
document
  .querySelector("[data-open-calendar]")
  ?.addEventListener("click", () => {
    if (!dialog) return;
    dialog.showModal();
    loadCalendar(dialog.dataset.calendar!);
  });
dialog
  ?.querySelector(".dialog-close")
  ?.addEventListener("click", () => dialog.close());
dialog?.addEventListener("click", (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      dialog.close();
  }
});
// Keep modal keyboard traversal predictable across browser/embedded-frame behavior.
dialog?.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;
  const focusable = [
    ...dialog.querySelectorAll<HTMLElement>(
      'button, a[href], input, select, iframe, [tabindex="0"]',
    ),
  ].filter((el) => el.getClientRects().length > 0);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
});

// Presentation flows never submit personal/payment data or reserve availability.
const previewDialogs = [
  ...document.querySelectorAll<HTMLDialogElement>(".experience-dialog"),
];
document
  .querySelectorAll<HTMLButtonElement>("[data-open-demo]")
  .forEach((button) =>
    button.addEventListener("click", () => {
      const target = document.getElementById(
        button.dataset.openDemo!,
      ) as HTMLDialogElement;
      target.showModal();
      target.scrollTop = 0;
    }),
  );
previewDialogs.forEach((modal) => {
  modal
    .querySelector("[data-close-demo]")
    ?.addEventListener("click", () => modal.close());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      const r = modal.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        modal.close();
    }
  });
  modal.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const items = [
      ...modal.querySelectorAll<HTMLElement>(
        "button:not(:disabled),a[href],select",
      ),
    ].filter((el) => el.getClientRects().length);
    if (e.shiftKey && document.activeElement === items[0]) {
      e.preventDefault();
      items.at(-1)?.focus();
    } else if (!e.shiftKey && document.activeElement === items.at(-1)) {
      e.preventDefault();
      items[0]?.focus();
    }
  });
});
const daysContainer = document.querySelector(".demo-days");
let chosenDay = "";
let chosenTime = "";
const dayStart = new Date();
dayStart.setDate(dayStart.getDate() + 1);
const monthLabel = document.querySelector("[data-demo-month]");
if (monthLabel)
  monthLabel.textContent = dayStart.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
for (let offset = 0; offset < 14 && daysContainer; offset++) {
  const day = new Date(dayStart);
  day.setDate(day.getDate() + offset);
  const label = day.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute("aria-pressed", "false");
  button.setAttribute("aria-label", `Sample date: ${label}`);
  const weekday = document.createElement("span");
  weekday.textContent = day.toLocaleDateString("en-US", { weekday: "short" });
  button.append(weekday, document.createTextNode(String(day.getDate())));
  button.addEventListener("click", () => {
    chosenDay = label;
    daysContainer
      .querySelectorAll("button")
      .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    updateBookingPreview();
  });
  daysContainer.append(button);
}
function updateBookingPreview() {
  const summary = document.querySelector("[data-booking-summary]");
  if (summary)
    summary.textContent =
      chosenDay && chosenTime
        ? `${chosenDay} · ${chosenTime} Eastern Time`
        : "Select a day and time to continue.";
  const next = document.querySelector<HTMLButtonElement>(
    "[data-booking-review]",
  );
  if (next) next.disabled = !(chosenDay && chosenTime);
}
document.querySelectorAll<HTMLButtonElement>("[data-time]").forEach((button) =>
  button.addEventListener("click", () => {
    chosenTime = button.dataset.time!;
    document
      .querySelectorAll("[data-time]")
      .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    updateBookingPreview();
  }),
);
function bookingStage(stage: string) {
  document
    .querySelectorAll<HTMLElement>("[data-booking-stage]")
    .forEach((el) => (el.hidden = el.dataset.bookingStage !== stage));
}
document
  .querySelector("[data-booking-review]")
  ?.addEventListener("click", () => {
    document.querySelector("[data-review-service]")!.textContent =
      document.querySelector<HTMLSelectElement>("#demo-service")!.value;
    document.querySelector("[data-review-date]")!.textContent =
      `${chosenDay} · ${chosenTime}`;
    bookingStage("review");
    document
      .querySelector<HTMLAnchorElement>('[data-booking-stage="review"] .button')
      ?.focus();
  });
document.querySelector("[data-booking-back]")?.addEventListener("click", () => {
  bookingStage("choose");
  document.querySelector<HTMLSelectElement>("#demo-service")?.focus();
});
document
  .querySelectorAll<HTMLButtonElement>("[data-pay-mode]")
  .forEach((button) =>
    button.addEventListener("click", () => {
      document
        .querySelectorAll("[data-pay-mode]")
        .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
      const full = button.dataset.payMode === "full";
      document.querySelector("[data-pay-label]")!.textContent = full
        ? "Payment in full"
        : "Installment terms";
      document.querySelector("[data-checkout-mode]")!.textContent = full
        ? "One-time payment"
        : "Installment plan · schedule agreed with John";
    }),
  );
document
  .querySelector<HTMLSelectElement>("#payment-service")
  ?.addEventListener("change", (e) => {
    document.querySelector("[data-checkout-service]")!.textContent = (
      e.target as HTMLSelectElement
    ).value;
  });
function paymentStage(stage: string) {
  document
    .querySelectorAll<HTMLElement>("[data-payment-stage]")
    .forEach((el) => (el.hidden = el.dataset.paymentStage !== stage));
}
document
  .querySelector("[data-payment-finish]")
  ?.addEventListener("click", () => {
    paymentStage("done");
    document
      .querySelector<HTMLAnchorElement>('[data-payment-stage="done"] .button')
      ?.focus();
  });
document.querySelector("[data-payment-back]")?.addEventListener("click", () => {
  paymentStage("checkout");
  document.querySelector<HTMLButtonElement>("[data-payment-finish]")?.focus();
});

const directionButtons = [
  ...document.querySelectorAll<HTMLButtonElement>("[data-direction]"),
];
directionButtons.forEach((button) =>
  button.addEventListener("click", () => {
    const index = Number(button.dataset.direction);
    const service = services[index];
    directionButtons.forEach((b) =>
      b.setAttribute("aria-pressed", String(b === button)),
    );
    document.querySelector("[data-direction-label]")!.textContent =
      service.label;
    document.querySelector("[data-direction-title]")!.textContent =
      service.short;
    document.querySelector("[data-direction-description]")!.textContent =
      service.description;
    document.querySelector(".direction-counter")!.textContent = `0${index + 1}`;
    (
      document.querySelector("[data-direction-cta]") as HTMLElement
    ).dataset.interest = service.label;
    const feature = document.querySelector(".direction-feature");
    if (feature && !media.matches)
      feature.animate(
        [
          { opacity: 0.5, transform: "translateY(8px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 350, easing: "ease-out" },
      );
  }),
);
const depth = document.querySelector<HTMLElement>("[data-depth]");
if (depth) {
  depth.addEventListener("pointermove", (e) => {
    if (media.matches || e.pointerType !== "mouse") return;
    const r = depth.getBoundingClientRect();
    depth.style.setProperty(
      "--portrait-y",
      `${((e.clientY - r.top) / r.height - 0.5) * 12}px`,
    );
  });
  depth.addEventListener("pointerleave", () =>
    depth.style.setProperty("--portrait-y", "0px"),
  );
}
const arrival = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (!media.matches) entry.target.classList.add("reveal-arrived");
        arrival.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);
document
  .querySelectorAll(".portrait-frame,.service-row,.guide-entry,.steps>li")
  .forEach((el) => arrival.observe(el));
