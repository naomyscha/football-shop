(() => {
  const modalClassVisible = ["flex"];

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return "";
  };

  const csrfToken = getCookie("csrftoken");
  const productPage = document.querySelector("[data-products-page]");
  const detailPage = document.querySelector("[data-product-detail-page]");
  const toast = window.SoccerellaToast || {
    show: () => {},
    enqueue: () => {},
  };

  // Utility helpers -------------------------------------------------------
  const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID").format(Number(value) || 0);

  const buildUrlFromTemplate = (template, id) =>
    template.replace(/0(\/)?$/, `${id}$1`);

  const createAlert = (element, message, type = "success") => {
    if (!element) return;
    element.classList.add("hidden");
    element.innerHTML = "";
    if (!message) return;
    const base = "px-4 py-3 rounded-md text-sm border transition";
    const palette =
      type === "error"
        ? "bg-red-50 border-red-200 text-red-700"
        : type === "info"
        ? "bg-blue-50 border-blue-200 text-blue-700"
        : "bg-green-50 border-green-200 text-green-700";
    const wrapper = document.createElement("div");
    wrapper.className = `${base} ${palette}`;
    wrapper.textContent = message;
    element.appendChild(wrapper);
    element.classList.remove("hidden");
    setTimeout(() => element.classList.add("hidden"), 3500);
  };

  const renderFormErrors = (container, errors) => {
    if (!container) return;
    if (!errors || Object.keys(errors).length === 0) {
      container.classList.add("hidden");
      container.innerHTML = "";
      return;
    }
    container.innerHTML = "";
    const fragment = document.createDocumentFragment();
    Object.entries(errors).forEach(([field, messages]) => {
      messages.forEach((msg) => {
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

  // Product listing + CRUD ------------------------------------------------
  if (productPage) {
    const state = {
      filter: "all",
      products: new Map(),
      editingId: null,
      deleteId: null,
    };

    const grid = document.querySelector("[data-product-grid]");
    const alertBox = document.getElementById("product-alert");
    const loadingBox = document.getElementById("product-loading");
    const emptyState = document.getElementById("product-empty");
    const errorBox = document.getElementById("product-error");
    const refreshButton = document.querySelector("[data-refresh-products]");
    const modal = document.getElementById("product-modal");
    const form = document.getElementById("product-form");
    const formErrors = document.getElementById("product-form-errors");
    const modalTitle = document.getElementById("product-modal-title");
    const modalSubtitle = document.getElementById("product-modal-subtitle");
    const submitButton = form?.querySelector("[data-submit-label]");
    const template = document.getElementById("product-card-template");
    const deleteModal = document.getElementById("product-delete-modal");
    const deleteName = deleteModal?.querySelector("[data-delete-product-name]");
    const deleteConfirm = deleteModal?.querySelector("[data-delete-confirm]");
    const deleteCancel = deleteModal?.querySelector("[data-delete-cancel]");

    const listUrl = grid?.dataset.apiList;
    const createUrl = grid?.dataset.apiCreate;
    const updateTemplate = grid?.dataset.apiUpdateTemplate;
    const deleteTemplate = grid?.dataset.apiDeleteTemplate;
    const pageDetailTemplate = grid?.dataset.pageDetailTemplate;

    const toggleButtons = (activeFilter) => {
      document.querySelectorAll("[data-filter]").forEach((btn) => {
        const isActive = btn.dataset.filter === activeFilter;
        btn.classList.toggle("bg-pink-500", isActive);
        btn.classList.toggle("text-white", isActive);
        btn.classList.toggle("border-transparent", isActive);
        btn.classList.toggle("text-gray-700", !isActive);
        btn.classList.toggle("bg-white", !isActive);
        btn.classList.toggle("border-gray-300", !isActive);
      });
    };

    const setLoading = (loading) => {
      if (!grid) return;
      if (loading) {
        loadingBox?.classList.remove("hidden");
        grid.innerHTML = "";
        grid.classList.add("hidden");
        emptyState?.classList.add("hidden");
        errorBox?.classList.add("hidden");
      } else {
        loadingBox?.classList.add("hidden");
        grid.classList.remove("hidden");
      }
    };

    const renderProducts = (products) => {
      if (!grid || !template) return;
      grid.innerHTML = "";
      errorBox?.classList.add("hidden");
      loadingBox?.classList.add("hidden");

      if (!products.length) {
        emptyState?.classList.remove("hidden");
        grid.classList.add("hidden");
        return;
      }
      emptyState?.classList.add("hidden");
      grid.classList.remove("hidden");

      products.forEach((product) => {
        const fragment = template.content.cloneNode(true);
        const article = fragment.querySelector("[data-product-card]");

        article.dataset.productId = product.id;

        const img = fragment.querySelector("[data-product-thumbnail]");
        const placeholder = fragment.querySelector("[data-product-placeholder]");
        if (product.thumbnail) {
          img.src = product.thumbnail;
          img.alt = product.name;
          img.classList.remove("hidden");
          placeholder.classList.add("hidden");
        } else {
          img.classList.add("hidden");
          placeholder.classList.remove("hidden");
        }

        fragment.querySelector("[data-product-name]").textContent = product.name;
        fragment.querySelector("[data-product-category]").textContent =
          product.category || "Uncategorized";
        fragment.querySelector("[data-product-description]").textContent =
          product.description || "(No description)";
        fragment.querySelector("[data-product-price]").textContent = `Rp ${formatCurrency(
          product.price
        )}`;

        const detailLink = fragment.querySelector("[data-product-detail]");
        if (pageDetailTemplate) {
          detailLink.href = buildUrlFromTemplate(pageDetailTemplate, product.id);
        } else {
          detailLink.href = `product/${product.id}/`;
        }

        const ownerActions = fragment.querySelector("[data-owner-actions]");
        if (product.is_owner) {
          ownerActions.classList.remove("hidden");
        } else {
          ownerActions.classList.add("hidden");
        }

        grid.appendChild(fragment);
      });
    };

    const fetchProducts = async (filter = state.filter) => {
      if (!listUrl) return;
      state.filter = filter;
      toggleButtons(filter);
      setLoading(true);
      try {
        const response = await fetch(`${listUrl}?filter=${encodeURIComponent(filter)}`, {
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error("Failed to load products.");
        const data = await response.json();
        const products = data.products || [];
        state.products.clear();
        products.forEach((prod) => state.products.set(prod.id, prod));
        setLoading(false);
        renderProducts(products);
      } catch (error) {
        setLoading(false);
        createAlert(alertBox, error.message, "error");
        grid.classList.add("hidden");
        grid.innerHTML = "";
        emptyState?.classList.add("hidden");
        if (errorBox) {
          errorBox.textContent = error.message || "Unable to load products.";
          errorBox.classList.remove("hidden");
        }
      }
    };

    const openModal = (mode, product = null) => {
      if (!modal || !form) return;
      renderFormErrors(formErrors, null);
      form.reset();
      state.editingId = mode === "edit" && product ? product.id : null;
      form.dataset.mode = mode;

      if (mode === "edit" && product) {
        modalTitle.textContent = "Edit Product";
        modalSubtitle.textContent = "Update your product details";
        submitButton.textContent = "Save Changes";

        form.querySelector("#product-id").value = product.id;
        form.querySelector("#product-name").value = product.name || "";
        form.querySelector("#product-price").value = product.price || "";
        form.querySelector("#product-thumbnail").value = product.thumbnail || "";
        form.querySelector("#product-category").value = product.category || "";
        form.querySelector("#product-description").value = product.description || "";
        form.querySelector("#product-featured").checked = Boolean(product.is_featured);
      } else {
        modalTitle.textContent = "Create Product";
        modalSubtitle.textContent = "Share a new item with the marketplace";
        submitButton.textContent = "Publish Product";
      }

      modal.classList.remove("hidden");
      modalClassVisible.forEach((cls) => modal.classList.add(cls));
      modal.setAttribute("aria-hidden", "false");
    };

    const closeModal = () => {
      if (!modal || !form) return;
      modal.classList.add("hidden");
      modalClassVisible.forEach((cls) => modal.classList.remove(cls));
      modal.setAttribute("aria-hidden", "true");
      form.reset();
      renderFormErrors(formErrors, null);
      form.dataset.mode = "create";
      state.editingId = null;
      submitButton.disabled = false;
      submitButton.textContent = submitButton.dataset.originalText || submitButton.textContent;
    };

    const openDeleteModal = (product) => {
      if (!deleteModal || !product) return;
      state.deleteId = product.id;
      if (deleteName) {
        deleteName.textContent = `${product.name} · Rp ${formatCurrency(product.price)}`;
      }
      deleteModal.classList.remove("hidden");
      modalClassVisible.forEach((cls) => deleteModal.classList.add(cls));
      deleteModal.setAttribute("aria-hidden", "false");
    };

    const closeDeleteModal = () => {
      if (!deleteModal) return;
      deleteModal.classList.add("hidden");
      modalClassVisible.forEach((cls) => deleteModal.classList.remove(cls));
      deleteModal.setAttribute("aria-hidden", "true");
      state.deleteId = null;
    };

    const submitProduct = async (event) => {
      event.preventDefault();
      if (!form) return;

      const mode = form.dataset.mode || "create";
      const payload = {
        name: form.querySelector("#product-name").value.trim(),
        price: form.querySelector("#product-price").value,
        thumbnail: form.querySelector("#product-thumbnail").value.trim(),
        category: form.querySelector("#product-category").value.trim(),
        description: form.querySelector("#product-description").value.trim(),
        is_featured: form.querySelector("#product-featured").checked,
      };

      const targetUrl =
        mode === "edit" && state.editingId
          ? updateTemplate
            ? buildUrlFromTemplate(updateTemplate, state.editingId)
            : null
          : createUrl;

      if (!targetUrl) {
        renderFormErrors(formErrors, { __all__: ["Unable to resolve endpoint."] });
        return;
      }

      const method = "POST";

      submitButton.dataset.originalText = submitButton.textContent;
      submitButton.textContent = mode === "edit" ? "Saving..." : "Publishing...";
      submitButton.disabled = true;

      try {
        const response = await fetch(targetUrl, {
          method,
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok) {
          renderFormErrors(formErrors, data.errors || { __all__: ["Failed to save product."] });
          submitButton.textContent = submitButton.dataset.originalText;
          submitButton.disabled = false;
          return;
        }

        closeModal();
        renderFormErrors(formErrors, null);
        const successTitle = mode === "edit" ? "Changes saved" : "Product published";
        const successMessage =
          data.message || (mode === "edit" ? "Your listing is up to date." : "Your product is now live.");
        createAlert(alertBox, successMessage, "success");
        toast.show(successTitle, successMessage, "success");
        await fetchProducts(state.filter);
      } catch (error) {
        renderFormErrors(formErrors, { __all__: [error.message] });
        submitButton.textContent = submitButton.dataset.originalText;
        submitButton.disabled = false;
      }
    };

    const deleteProduct = async (id) => {
      if (!deleteTemplate || !id) return;
      const url = buildUrlFromTemplate(deleteTemplate, id);
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "X-CSRFToken": csrfToken,
            Accept: "application/json",
          },
        });
        const data = await response.json();
        if (!response.ok) {
          createAlert(alertBox, data.errors?.__all__?.[0] || "Failed to delete product.", "error");
          return;
        }
        closeDeleteModal();
        const successMessage = data.message || "Product deleted.";
        createAlert(alertBox, successMessage, "success");
        toast.show("Product removed", successMessage, "success");
        await fetchProducts(state.filter);
      } catch (error) {
        createAlert(alertBox, error.message, "error");
      }
    };

    // Event bindings ------------------------------------------------------
    document.querySelectorAll("[data-modal-trigger]").forEach((trigger) => {
      trigger.addEventListener("click", () => openModal("create"));
    });

    document.querySelectorAll("[data-modal-dismiss]").forEach((btn) => {
      btn.addEventListener("click", closeModal);
    });

    modal?.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeModal();
        closeDeleteModal();
      }
    });

    refreshButton?.addEventListener("click", () => {
      refreshButton.classList.add("animate-pulse");
      fetchProducts(state.filter).finally(() => {
        refreshButton.classList.remove("animate-pulse");
      });
    });

    document.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const { filter } = btn.dataset;
        fetchProducts(filter);
      });
    });

    form?.addEventListener("submit", submitProduct);

    deleteConfirm?.addEventListener("click", () => {
      if (state.deleteId) {
        deleteProduct(state.deleteId);
      }
    });

    deleteCancel?.addEventListener("click", closeDeleteModal);

    deleteModal?.addEventListener("click", (event) => {
      if (event.target === deleteModal) {
        closeDeleteModal();
      }
    });

    grid?.addEventListener("click", (event) => {
      const actionButton = event.target.closest("[data-action]");
      if (!actionButton) return;

      const card = actionButton.closest("[data-product-card]");
      const id = Number(card?.dataset.productId);
      if (!id) return;

      const product = state.products.get(id);
      if (actionButton.dataset.action === "edit" && product) {
        openModal("edit", product);
      } else if (actionButton.dataset.action === "delete" && product) {
        openDeleteModal(product);
      }
    });

    fetchProducts();
  }

  // Product detail --------------------------------------------------------
  if (detailPage) {
    const container = detailPage;
    const loadingState = container.querySelector("[data-detail-loading]");
    const errorState = container.querySelector("[data-detail-error]");
    const contentSections = container.querySelectorAll("[data-detail-content]");
    const alertBox = container.querySelector("[data-detail-alert]");
    const detailApiTemplate = container.dataset.apiDetailTemplate;
    const deleteTemplate = container.dataset.apiDeleteTemplate;
    const productId = Number(container.dataset.productId);
    const redirectAfterDelete = container.dataset.redirect;
    const ownerActions = container.querySelector("[data-detail-owner-actions]");
    const manageLinks = container.querySelectorAll("[data-detail-manage-link]");
    const deleteButton = container.querySelector("[data-detail-delete]");
    const deleteModal = document.getElementById("product-delete-modal");
    const deleteName = deleteModal?.querySelector("[data-delete-product-name]");
    const deleteConfirm = deleteModal?.querySelector("[data-delete-confirm]");
    const deleteCancel = deleteModal?.querySelector("[data-delete-cancel]");
    let currentProduct = null;

    const textMap = {
      name: container.querySelector("[data-detail-name]"),
      category: container.querySelector("[data-detail-category]"),
      id: container.querySelector("[data-detail-id]"),
      description: container.querySelector("[data-detail-description]"),
      thumbnail: container.querySelector("[data-detail-thumbnail]"),
      thumbnailLink: container.querySelector("[data-detail-thumbnail-link]"),
      owner: container.querySelector("[data-detail-owner]"),
    };
    const priceNodes = container.querySelectorAll("[data-detail-price]");

    const heroImage = container.querySelector("[data-detail-image]");
    const heroPlaceholder = container.querySelector("[data-detail-image-placeholder]");

    const viewState = (state) => {
      if (loadingState) loadingState.classList.toggle("hidden", state !== "loading");
      if (errorState) errorState.classList.toggle("hidden", state !== "error");
      if (contentSections.length) {
        contentSections.forEach((section) => {
          section.classList.toggle("hidden", state !== "ready");
        });
      }
      container.classList.toggle("is-loaded", state === "ready");
    };

    const openDeleteModal = () => {
      if (!deleteModal || !currentProduct) return;
      if (deleteName) {
        deleteName.textContent = `${currentProduct.name} · Rp ${formatCurrency(currentProduct.price)}`;
      }
      deleteModal.classList.remove("hidden");
      modalClassVisible.forEach((cls) => deleteModal.classList.add(cls));
      deleteModal.setAttribute("aria-hidden", "false");
    };

    const closeDeleteModal = () => {
      if (!deleteModal) return;
      deleteModal.classList.add("hidden");
      modalClassVisible.forEach((cls) => deleteModal.classList.remove(cls));
      deleteModal.setAttribute("aria-hidden", "true");
    };

    const populateDetail = (product) => {
      if (!product) return;
      currentProduct = product;

      if (product.name) {
        document.title = `${product.name} · Soccerella`;
      }

      if (textMap.name) textMap.name.textContent = product.name;
      if (textMap.category) textMap.category.textContent = product.category || "Uncategorized";
      if (priceNodes.length) {
        const formatted = `Rp ${formatCurrency(product.price)}`;
        priceNodes.forEach((node) => {
          node.textContent = formatted;
        });
      }
      if (textMap.id) textMap.id.textContent = `#${product.id}`;
      if (textMap.description) textMap.description.textContent =
        product.description || "(No description)";
      if (textMap.owner) textMap.owner.textContent = product.owner || "Anonymous seller";

      if (heroImage) {
        if (product.thumbnail) {
          heroImage.src = product.thumbnail;
          heroImage.alt = product.name;
          heroImage.classList.remove("hidden");
          heroPlaceholder?.classList.add("hidden");
        } else {
          heroImage.classList.add("hidden");
          heroPlaceholder?.classList.remove("hidden");
        }
      }

      if (textMap.thumbnail) {
        textMap.thumbnail.textContent = product.thumbnail || "—";
      }
      if (textMap.thumbnailLink) {
        if (product.thumbnail) {
          textMap.thumbnailLink.href = product.thumbnail;
          textMap.thumbnailLink.classList.remove("hidden");
        } else {
          textMap.thumbnailLink.classList.add("hidden");
        }
      }

      if (ownerActions) {
        ownerActions.classList.toggle("hidden", !product.is_owner);
      }
      if (deleteButton) {
        deleteButton.dataset.productId = product.id;
      }
      manageLinks.forEach((link) => {
        const template = link.dataset.template;
        if (template) {
          link.href = buildUrlFromTemplate(template, product.id);
        }
      });

      viewState("ready");
    };

    const fetchDetail = async () => {
      if (!detailApiTemplate || !productId) return;
      viewState("loading");
      try {
        const url = buildUrlFromTemplate(detailApiTemplate, productId);
        const response = await fetch(url, {
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error("Failed to fetch product detail.");
        const data = await response.json();
        populateDetail(data.product);
      } catch (error) {
        if (errorState) {
          errorState.textContent = error.message;
        }
        viewState("error");
      }
    };

    fetchDetail();

    const deleteListing = async () => {
      const id = currentProduct?.id || productId;
      if (!deleteTemplate || !id) return;

      try {
        const url = buildUrlFromTemplate(deleteTemplate, id);
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "X-CSRFToken": csrfToken,
            Accept: "application/json",
          },
        });
        const data = await response.json();
        if (!response.ok) {
          createAlert(alertBox, data.errors?.__all__?.[0] || "Failed to delete product.", "error");
          return;
        }
        closeDeleteModal();
        const successMessage = data.message || "Product deleted.";
        createAlert(alertBox, successMessage, "success");
        toast.enqueue("Product removed", successMessage, "success");
        setTimeout(() => {
          window.location.href = redirectAfterDelete || "/";
        }, 800);
      } catch (error) {
        createAlert(alertBox, error.message, "error");
      }
    };

    deleteButton?.addEventListener("click", openDeleteModal);
    deleteConfirm?.addEventListener("click", deleteListing);
    deleteCancel?.addEventListener("click", closeDeleteModal);
    deleteModal?.addEventListener("click", (event) => {
      if (event.target === deleteModal) {
        closeDeleteModal();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeDeleteModal();
      }
    });
  }

  // Standalone product form (add / edit) ----------------------------------
  const productFormPage = document.querySelector("[data-product-form-page]");
  if (productFormPage) {
    const mode = productFormPage.dataset.mode || "create";
    const createUrl = productFormPage.dataset.apiCreate;
    const updateTemplate = productFormPage.dataset.apiUpdateTemplate;
    const detailTemplate = productFormPage.dataset.apiDetailTemplate;
    const redirectUrl = productFormPage.dataset.redirect;
    const productId = Number(productFormPage.dataset.productId);

    const form = productFormPage.querySelector("form");
    const errorsBox = productFormPage.querySelector("[data-form-errors]");
    const alertBox = productFormPage.querySelector("[data-form-alert]");
    const submitButton = form?.querySelector("[data-submit-label]");

    const fillForm = (product) => {
      if (!form || !product) return;
      form.querySelector("#product-name").value = product.name || "";
      form.querySelector("#product-price").value = product.price || "";
      form.querySelector("#product-thumbnail").value = product.thumbnail || "";
      form.querySelector("#product-category").value = product.category || "";
      form.querySelector("#product-description").value = product.description || "";
      form.querySelector("#product-featured").checked = Boolean(product.is_featured);
    };

    const loadProduct = async () => {
      if (mode !== "edit" || !detailTemplate || !productId) return;
      try {
        const url = buildUrlFromTemplate(detailTemplate, productId);
        const response = await fetch(url, { headers: { Accept: "application/json" } });
        if (!response.ok) throw new Error("Failed to load product.");
        const data = await response.json();
        fillForm(data.product);
      } catch (error) {
        createAlert(alertBox, error.message, "error");
      }
    };

    const submit = async (event) => {
      event.preventDefault();
      if (!form) return;

      const payload = {
        name: form.querySelector("#product-name").value.trim(),
        price: form.querySelector("#product-price").value,
        thumbnail: form.querySelector("#product-thumbnail").value.trim(),
        category: form.querySelector("#product-category").value.trim(),
        description: form.querySelector("#product-description").value.trim(),
        is_featured: form.querySelector("#product-featured").checked,
      };

      const isEdit = mode === "edit";
      const url = isEdit && updateTemplate && productId
        ? buildUrlFromTemplate(updateTemplate, productId)
        : createUrl;
      if (!url) {
        renderFormErrors(errorsBox, { __all__: ["Unable to resolve endpoint."] });
        return;
      }
      const method = "POST";

      submitButton.dataset.originalText = submitButton.textContent;
      submitButton.textContent = isEdit ? "Saving..." : "Publishing...";
      submitButton.disabled = true;

      try {
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok) {
          renderFormErrors(errorsBox, data.errors || { __all__: ["Failed to save product."] });
          submitButton.textContent = submitButton.dataset.originalText;
          submitButton.disabled = false;
          return;
        }

        renderFormErrors(errorsBox, null);
        const successTitle = isEdit ? "Changes saved" : "Product published";
        const successMessage = data.message || (isEdit ? "Your listing is up to date." : "Your product is ready.");
        createAlert(alertBox, successMessage, "success");
        if (redirectUrl) {
          toast.enqueue(successTitle, successMessage, "success");
        } else {
          toast.show(successTitle, successMessage, "success");
        }
        if (redirectUrl) {
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 1000);
        } else if (!isEdit) {
          form.reset();
        }
        submitButton.textContent = submitButton.dataset.originalText;
        submitButton.disabled = false;
      } catch (error) {
        renderFormErrors(errorsBox, { __all__: [error.message] });
        submitButton.textContent = submitButton.dataset.originalText;
        submitButton.disabled = false;
      }
    };

    form?.addEventListener("submit", submit);
    loadProduct();
  }
})();
