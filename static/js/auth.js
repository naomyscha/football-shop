(() => {
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return "";
  };

  const csrfToken = getCookie("csrftoken");
  const toast = window.SoccerellaToast || {
    show: () => {},
    enqueue: () => {},
  };

  const renderErrors = (container, errors) => {
    if (!container) return;
    if (!errors || Object.keys(errors).length === 0) {
      container.classList.add("hidden");
      container.innerHTML = "";
      return;
    }
    container.innerHTML = "";
    const fragment = document.createDocumentFragment();
    Object.entries(errors).forEach(([field, values]) => {
      values.forEach((msg) => {
        const line = document.createElement("p");
        line.className = "text-sm";
        if (field !== "__all__") {
          line.textContent = `${field}: ${msg}`;
        } else {
          line.textContent = msg;
        }
        fragment.appendChild(line);
      });
    });
    container.appendChild(fragment);
    container.classList.remove("hidden");
  };

  const showAlert = (container, message, type = "success") => {
    if (!container) return;
    container.classList.add("hidden");
    container.innerHTML = "";
    if (!message) return;
    const base = "px-4 py-3 rounded-md text-sm border transition";
    const palette =
      type === "error"
        ? "bg-red-50 border-red-200 text-red-700"
        : "bg-green-50 border-green-200 text-green-700";
    const wrapper = document.createElement("div");
    wrapper.className = `${base} ${palette}`;
    wrapper.textContent = message;
    container.appendChild(wrapper);
    container.classList.remove("hidden");
    setTimeout(() => container.classList.add("hidden"), 3000);
  };

  document.querySelectorAll("[data-auth-form]").forEach((form) => {
    const apiUrl = form.dataset.api;
    const redirectUrl = form.dataset.redirect;
    const errorsBox = form.querySelector("[data-form-errors]");
    const alertBox = form.querySelector("[data-form-alert]");
    const submitButton = form.querySelector("[data-submit-label]");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!apiUrl) return;

      const formData = new FormData(form);
      const payload = {};
      formData.forEach((value, key) => {
        payload[key] = value;
      });

      renderErrors(errorsBox, null);
      if (alertBox) {
        alertBox.classList.add("hidden");
        alertBox.innerHTML = "";
      }

      submitButton.dataset.originalText = submitButton.textContent;
      submitButton.textContent = "Processing...";
      submitButton.disabled = true;

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });
        const data = await response.json();

        if (!response.ok) {
          renderErrors(errorsBox, data.errors || { __all__: ["Unable to submit form."] });
          submitButton.textContent = submitButton.dataset.originalText;
          submitButton.disabled = false;
          return;
        }

        renderErrors(errorsBox, null);
        const isRegister = apiUrl.includes("register");
        const successTitle = isRegister ? "Account created" : "Welcome back";
        const successMessage =
          data.message || (isRegister ? "Your Soccerella account is ready." : "Signed in successfully.");
        showAlert(alertBox, successMessage, "success");
        if (redirectUrl) {
          toast.enqueue(successTitle, successMessage, "success");
        } else {
          toast.show(successTitle, successMessage, "success");
        }
        submitButton.textContent = submitButton.dataset.originalText;
        setTimeout(() => {
          submitButton.disabled = false;
          if (redirectUrl) {
            window.location.href = redirectUrl;
          }
        }, 500);
      } catch (error) {
        renderErrors(errorsBox, { __all__: [error.message] });
        submitButton.textContent = submitButton.dataset.originalText;
        submitButton.disabled = false;
      }
    });
  });
  const params = new URLSearchParams(window.location.search);
  if (params.get("logged_out")) {
    toast.show("Signed out", "You have been logged out.", "info");
    params.delete("logged_out");
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params}` : ""}`;
    window.history.replaceState({}, document.title, newUrl);
  }

  document.querySelectorAll("[data-logout-link]").forEach((button) => {
    button.addEventListener("click", async () => {
      const endpoint = button.dataset.endpoint || "/api/auth/logout/";
      const redirectOverride = button.dataset.redirect;
      button.disabled = true;
      button.classList.add("opacity-70");
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "X-CSRFToken": csrfToken,
            Accept: "application/json",
          },
        });
        const data = await response.json();
        if (!response.ok) {
          toast.show("Logout failed", data.errors?.__all__?.[0] || "Please try again.", "error");
          button.disabled = false;
          button.classList.remove("opacity-70");
          return;
        }
        const successMessage = data.message || "You are signed out.";
        toast.enqueue("Signed out", successMessage, "info");
        const redirectTarget = data.redirect || redirectOverride || "/";
        window.location.href = redirectTarget;
      } catch (error) {
        toast.show("Logout failed", error.message, "error");
        button.disabled = false;
        button.classList.remove("opacity-70");
      }
    });
  });
})();
