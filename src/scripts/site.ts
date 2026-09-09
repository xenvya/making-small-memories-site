import { business } from "../data/business";
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
