(() => {
  const TOAST_KEY = "soccerella_toast_queue";

  const ensureContainer = () => {
    let container = document.getElementById("toast-root");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-root";
      container.className =
        "fixed z-[60] top-4 right-4 flex flex-col gap-3 pointer-events-none";
      document.body.appendChild(container);
    }
    return container;
  };

  const palettes = {
    success: {
      wrapper: "bg-pink-500 text-white shadow-lg shadow-pink-500/30",
      icon: "✨",
    },
    error: {
      wrapper: "bg-red-500 text-white shadow-lg shadow-red-500/30",
      icon: "⚠️",
    },
    info: {
      wrapper: "bg-blue-500 text-white shadow-lg shadow-blue-500/30",
      icon: "ℹ️",
    },
  };

  const buildToast = (title, message, type = "info") => {
    const palette = {
      ...palettes.info,
      ...(palettes[type] || {}),
    };
    const purify = window.DOMPurify;
    const safeTitle = title ? (purify ? purify.sanitize(title) : title) : "";
    const safeMessage = message ? (purify ? purify.sanitize(message) : message) : "";
    const wrapper = document.createElement("div");
    wrapper.className =
      "pointer-events-auto rounded-xl px-4 py-3 text-sm font-medium flex items-start gap-3 transition transform translate-y-2 opacity-0";
    wrapper.classList.add(...palette.wrapper.split(" "));
    wrapper.innerHTML = `
      <span class="text-lg leading-none pt-0.5">${palette.icon}</span>
      <div class="space-y-1 max-w-xs">
        ${safeTitle ? `<h4 class="font-semibold text-[0.95rem]">${safeTitle}</h4>` : ""}
        ${safeMessage ? `<p class="text-sm font-normal leading-snug text-white/90">${safeMessage}</p>` : ""}
      </div>
      <button type="button" class="ml-auto text-white/80 hover:text-white focus:outline-none" aria-label="Close toast">✕</button>
    `;

    const closeBtn = wrapper.querySelector("button");
    closeBtn.addEventListener("click", () => dismissToast(wrapper));
    setTimeout(() => wrapper.classList.remove("translate-y-2", "opacity-0"), 20);
    return wrapper;
  };

  const dismissToast = (toast) => {
    toast.classList.add("translate-y-2", "opacity-0");
    setTimeout(() => toast.remove(), 180);
  };

  const showToast = (title, message, type = "info", timeout = 3200) => {
    if (!title && !message) return;
    const container = ensureContainer();
    const toast = buildToast(title, message, type);
    container.appendChild(toast);
    if (timeout > 0) {
      setTimeout(() => dismissToast(toast), timeout);
    }
  };

  const enqueue = (title, message, type = "info", timeout = 3200) => {
    const queue = JSON.parse(sessionStorage.getItem(TOAST_KEY) || "[]");
    queue.push({ title, message, type, timeout });
    sessionStorage.setItem(TOAST_KEY, JSON.stringify(queue));
  };

  const flushQueue = () => {
    const queueRaw = sessionStorage.getItem(TOAST_KEY);
    if (!queueRaw) return;
    sessionStorage.removeItem(TOAST_KEY);
    try {
      const queue = JSON.parse(queueRaw);
      if (Array.isArray(queue)) {
        queue.forEach((item) => showToast(item.title, item.message, item.type, item.timeout));
      }
    } catch (error) {
      console.warn("Failed to parse toast queue:", error);
    }
  };

  window.SoccerellaToast = { show: showToast, enqueue };
  window.showToast = showToast;

  document.addEventListener("DOMContentLoaded", flushQueue);
})();
