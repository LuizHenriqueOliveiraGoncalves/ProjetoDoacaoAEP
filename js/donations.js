document.addEventListener("DOMContentLoaded", async function () {
  const API_BASE_URL = "https://localhost:7261/api";
  const donationGrid = document.getElementById("donationGrid");
  let currentDonations = [];

  async function refreshUserProfile() {
    const token = localStorage.getItem("jwtToken");
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/Auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        console.warn("Não foi possível atualizar o perfil do usuário");
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil do usuário:", error);
    }
  }

  async function fetchApi(endpoint, method = "GET", body = null) {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      showToast("Sessão expirada. Por favor, faça login novamente.", "error");
      redirectToLogin();
      throw new Error("Token não encontrado");
    }

    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    if (body) options.body = JSON.stringify(body);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

      if (response.status === 401) {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("user");
        showToast("Sessão expirada. Por favor, faça login novamente.", "error");
        redirectToLogin();
        return;
      }

      if (!response.ok)
        throw new Error(`Erro na requisição: ${response.status}`);

      // Se o status for 204 (No Content), retorne null
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("Erro na chamada API:", error);
      showToast(error.message, "error");
      throw error;
    }
  }

  function redirectToLogin() {
    window.location.href = "/index.html";
  }

  async function loadDonations(sort = "date") {
    try {
      donationGrid.innerHTML =
        '<div class="loading">Carregando doações...</div>';

      await refreshUserProfile(); // ✅ Atualiza o usuário antes de carregar

      const user = JSON.parse(localStorage.getItem("user"));
      let endpoint = "/Donation/MyDonations";

      if (user && user.type?.toLowerCase() === "ngo") {
        endpoint = "/Donation/all";
      }

      let donations = await fetchApi(`${endpoint}?sort=${sort}`);

      if (user && user.type?.toLowerCase() === "ngo") {
        donations = donations.filter((d) => d.isReserved === false);
      }

      currentDonations = donations;

      displayDonations(donations);
    } catch (error) {
      handleLoadError(error);
    }
  }

  function handleLoadError(error) {
    console.error("Erro ao carregar doações:", error);
    donationGrid.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Erro ao carregar doações. Tente recarregar a página.</p>
      </div>
    `;
  }

  function displayDonations(donations) {
    if (donations.length === 0) {
      const user = JSON.parse(localStorage.getItem("user"));
      const message =
        user?.type?.toLowerCase() === "ngo"
          ? "Nenhuma doação disponível no sistema"
          : "Você ainda não cadastrou nenhuma doação";

      donationGrid.innerHTML = `
        <div class="no-results">
          <i class="fas fa-box-open"></i>
          <h3>${message}</h3>
        </div>
      `;
      return;
    }

    donationGrid.innerHTML = "";
    const user = JSON.parse(localStorage.getItem("user"));

    donations.forEach((donation) => {
      const expirationDate = new Date(donation.expirationDate);
      const formattedDate = expirationDate.toLocaleDateString("pt-BR");
      const isOngUser = user?.type?.toLowerCase() === "ngo";
      const isMyDonation = donation.creatorId === user?.id;
      const isReserved = donation.isReserved === true;

      const creatorAddress = donation.creatorStreet
        ? `${donation.creatorStreet}, ${donation.creatorNumber || "S/N"} - ${
            donation.creatorNeighborhood
          }, ${donation.creatorCity}/${donation.creatorState}`
        : "Endereço não informado";

      const donationCard = document.createElement("div");
      donationCard.className = `donation-card ${
        isMyDonation ? "my-donation" : ""
      }`;

      donationCard.innerHTML = `
  <div class="donation-content">
    <h3 class="donation-title">${donation.title}</h3>
    
    <div class="donation-meta">
      <i class="fas fa-tag"></i>
      <span>${donation.category}</span>
    </div>

    <div class="donation-meta">
      <i class="fas fa-map-marker-alt"></i>
      <span>${creatorAddress}</span>
    </div>

    <div class="donation-meta">
      <i class="fas fa-calendar-alt"></i>
      <span>Validade: ${formattedDate}</span>
    </div>

    <p class="donation-description">${donation.description}</p>

    <div class="donation-footer">
      <div class="donation-impact-line">
        <div class="donation-quantity">${donation.quantity} ${
        donation.unit
      }</div>
        <span title="CO2 Impact">🌱 ${donation.co2Impact || 0}kg CO2</span>
        <span title="Water Impact">💧 ${donation.waterImpact || 0}L</span>
      </div>

      ${
        isOngUser && !isMyDonation && !isReserved
          ? `<button class="btn btn-primary reserve-btn" data-id="${donation.id}">Reservar</button>`
          : ""
      }
      ${
        isReserved && !isMyDonation
          ? `<span class="donation-status">Reservada</span>`
          : ""
      }
      ${
        isMyDonation
          ? `<button class="btn btn-danger delete-btn" data-id="${donation.id}">Excluir</button>`
          : ""
      }
    </div>
  </div>
`;

      donationGrid.appendChild(donationCard);
    });

    document.querySelectorAll(".reserve-btn").forEach((btn) => {
      btn.addEventListener("click", () => reserveDonation(btn.dataset.id));
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => deleteDonation(btn.dataset.id));
    });
  }

  async function reserveDonation(donationId) {
    try {
      await fetchApi(`/Donation/${donationId}/reserve`, "PATCH");
      showToast("Doação reservada com sucesso!");
      loadDonations(document.getElementById("sort").value);
    } catch (error) {
      showToast("Erro ao reservar doação: " + error.message, "error");
    }
  }

  async function deleteDonation(donationId) {
    showConfirmToast(
      "Tem certeza que deseja excluir esta doação?",
      async () => {
        try {
          await fetchApi(`/Donation/${donationId}/creator`, "DELETE");
          showToast("Doação excluída com sucesso!");
          loadDonations(document.getElementById("sort").value);
        } catch (error) {
          showToast("Erro ao excluir doação: " + error.message, "error");
        }
      }
    );
  }

  function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    toast.className = `toast show ${type}`;
    toastMessage.textContent = message;

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  function filterDonations(searchTerm) {
    if (!searchTerm) {
      return displayDonations(currentDonations);
    }

    const filtered = currentDonations.filter(
      (donation) =>
        donation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    displayDonations(filtered);
  }

  function showConfirmToast(message, onConfirm) {
    const toast = document.getElementById("confirmToast");
    const toastMessage = document.getElementById("confirmMessage");
    const confirmYes = document.getElementById("confirmYes");
    const confirmNo = document.getElementById("confirmNo");

    toastMessage.textContent = message;
    toast.classList.add("show");

    // Remove qualquer listener antigo
    confirmYes.onclick = null;
    confirmNo.onclick = null;

    confirmYes.onclick = () => {
      toast.classList.remove("show");
      onConfirm();
    };

    confirmNo.onclick = () => {
      toast.classList.remove("show");
    };
  }

  async function sortDonations(sortBy) {
    await loadDonations(sortBy);
  }

  document.getElementById("searchBtn").addEventListener("click", () => {
    const searchTerm = document.getElementById("searchInput").value;
    filterDonations(searchTerm);
  });

  document.getElementById("searchInput").addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      const searchTerm = document.getElementById("searchInput").value;
      filterDonations(searchTerm);
    }
  });

  document.getElementById("sort").addEventListener("change", (event) => {
    sortDonations(event.target.value);
  });

  await loadDonations();

  setInterval(() => {
    loadDonations(document.getElementById("sort").value);
  }, 120000);
});
