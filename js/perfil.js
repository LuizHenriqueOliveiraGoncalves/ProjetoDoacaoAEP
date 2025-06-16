// perfil.js
// Sistema completo para gerenciamento e edição do perfil do usuário

const API_BASE_URL = "https://localhost:7261";

document.addEventListener("DOMContentLoaded", function () {
  if (!checkAuthentication()) return;
  loadProfileData();
  setupEventListeners();
});

// Verifica se o usuário está autenticado, redireciona se não
function checkAuthentication() {
  const token = localStorage.getItem("jwtToken");
  const userData = localStorage.getItem("user");
  if (!token || !userData) {
    window.location.href = "/index.html?redirect=perfil";
    return false;
  }
  return true;
}

// Carrega dados do perfil da API e atualiza UI
async function loadProfileData() {
  try {
    const token = localStorage.getItem("jwtToken");
    const user = JSON.parse(localStorage.getItem("user"));
    updateProfileUI(user);

    const response = await fetch(`${API_BASE_URL}/api/Auth/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      handleUnauthorized();
      return;
    }

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const profileData = await response.json();
    updateProfileUI(profileData);
    localStorage.setItem("user", JSON.stringify(profileData));
  } catch (error) {
    console.error("Erro ao carregar perfil:", error);
    showToast("Erro ao carregar dados do perfil", "error");
  }
}

// Atualiza a interface do perfil com os dados do usuário
function updateProfileUI(userData) {
  if (!userData) return;
  updateHeader(userData);
  updateSidebar(userData);
  updatePersonalInfo(userData);
  updateStats(userData);
}

function updateHeader(userData) {
  const headerUserName = document.getElementById("headerUserName");
  if (headerUserName) {
    headerUserName.textContent = userData.name || "Usuário";
  }

  const userAvatar = document.querySelector(".user-avatar .default-avatar");
  if (userAvatar) {
    const initials = getInitials(userData.name);
    userAvatar.textContent = initials;
  }
}

function updateSidebar(userData) {
  const profileName = document.getElementById("profile-name");
  const profileType = document.getElementById("profile-type");

  if (profileName) {
    profileName.textContent = userData.name || "Usuário";
  }

  if (profileType) {
    profileType.textContent =
      userData.type === "business" ? "Doador/Receptor" : "ONG";
  }

  const profileAvatar = document.querySelector(".profile-avatar .avatar-image");
  if (profileAvatar) {
    const initials = getInitials(userData.name);
    profileAvatar.innerHTML = initials;
  }
}

function updatePersonalInfo(userData) {
  setElementText(
    "account-type",
    userData.type === "business" ? "Doador/Receptor" : "ONG"
  );
  setElementText("full-name", userData.name || "Não informado");
  setElementText(
    "document-number",
    formatDocument(userData.documentNumber) || "Não informado"
  );

  const ngoTypeGroup = document.getElementById("ngo-type-group");
  if (ngoTypeGroup) {
    if (userData.type === "ngo") {
      ngoTypeGroup.style.display = "block";
      setElementText("ngo-type", userData.ngoType || "Não informado");
    } else {
      ngoTypeGroup.style.display = "none";
    }
  }

  setElementText("email", userData.email || "Não informado");
  setElementText("phone", userData.phone || "Não informado");

  const addressParts = [
    userData.street,
    userData.number,
    userData.neighborhood,
    userData.city,
    userData.state,
  ].filter(Boolean);
  setElementText("full-address", addressParts.join(", ") || "Não informado");

  setElementText(
    "created-at",
    formatDate(userData.createdAt) || "Não informado"
  );
}

function updateStats(userData) {
  const userType = userData.type;
  const memberSince = formatDate(userData.createdAt) || "-";
  setElementText("member-since", memberSince);

  if (userType === "ngo") {
    // Se for ONG, mostra quantidade de doações reservadas
    fetchReservedDonationsCount()
      .then((count) => {
        setElementText("donations-count", count);
        setElementText("donations-label", "Doações Reservadas");
      })
      .catch((error) => {
        console.error("Erro ao buscar reservas:", error);
        setElementText("donations-count", "0");
        setElementText("donations-label", "Doações Reservadas");
      });
  } else {
    // Se for doador, mostra doações realizadas
    fetchMyDonationsCount()
      .then((count) => {
        setElementText("donations-count", count);
        setElementText("donations-label", "Doações Realizadas");
      })
      .catch((error) => {
        console.error("Erro ao buscar doações:", error);
        setElementText("donations-count", "0");
        setElementText("donations-label", "Doações Realizadas");
      });
  }

  setElementText("food-amount", "0 kg");
  setElementText("people-helped", "0");
}

async function fetchReservedDonationsCount() {
  const token = localStorage.getItem("jwtToken");
  const response = await fetch(`${API_BASE_URL}/api/Donation/reserved-by-me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Erro ao buscar doações reservadas");
  return (await response.json()).length;
}

async function fetchMyDonationsCount() {
  const token = localStorage.getItem("jwtToken");
  const response = await fetch(`${API_BASE_URL}/api/Donation/mydonations`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Erro ao buscar minhas doações");
  return (await response.json()).length;
}

function setupEventListeners() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("user");
      window.location.href = "/index.html";
    });
  }

  const editProfileBtn = document.getElementById("edit-profile-btn");
  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", function () {
      toggleEditMode(true);
    });
  }

  const cancelEditBtn = document.getElementById("cancel-edit-btn");
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", function () {
      toggleEditMode(false);
    });
  }

  const editForm = document.getElementById("profile-edit-form");
  if (editForm) {
    editForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveProfileChanges();
    });
  }
}

// Alterna entre modo visualização e edição do perfil
function toggleEditMode(editMode) {
  const viewMode = document.getElementById("profile-view-mode");
  const editForm = document.getElementById("profile-edit-form");

  if (viewMode && editForm) {
    if (editMode) {
      viewMode.style.display = "none";
      editForm.style.display = "block";
      populateEditForm();
    } else {
      viewMode.style.display = "block";
      editForm.style.display = "none";
    }
  }
}

// Preenche o formulário de edição com dados atuais do usuário
function populateEditForm() {
  const userData = JSON.parse(localStorage.getItem("user"));
  if (!userData) return;

  setInputValue("edit-type", userData.type || "business");
  setInputValue("edit-name", userData.name || "");
  setInputValue("edit-document", userData.documentNumber || "");
  setInputValue("edit-ngo-type", userData.ngoType || "");
  setInputValue("edit-email", userData.email || "");
  setInputValue("edit-phone", userData.phone || "");
  setInputValue("edit-cep", userData.CEP || "");
  setInputValue("edit-street", userData.street || "");
  setInputValue("edit-neighborhood", userData.neighborhood || "");
  setInputValue("edit-city", userData.city || "");
  setInputValue("edit-state", userData.state || "");
  setInputValue("edit-number", userData.number || "");

  const ngoTypeGroup = document.getElementById("edit-ngo-type-group");
  if (ngoTypeGroup) {
    ngoTypeGroup.style.display = userData.type === "ngo" ? "block" : "none";
  }

  // Configura auto-complete para o CEP
  setupCepAutoComplete();
}

// Auto-completa endereço com base no CEP usando API viacep
function setupCepAutoComplete() {
  const cepField = document.getElementById("edit-cep");
  if (!cepField) return;

  cepField.addEventListener("blur", async function () {
    const cep = cepField.value.replace(/\D/g, "");

    if (cep.length !== 8) {
      showToast("CEP inválido. Deve conter 8 dígitos.", "error");
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        showToast("CEP não encontrado. Preencha manualmente.", "error");
        return;
      }

      setInputValue("edit-street", data.logradouro || "");
      setInputValue("edit-neighborhood", data.bairro || "");
      setInputValue("edit-city", data.localidade || "");
      setInputValue("edit-state", data.uf || "");
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      showToast("Erro ao buscar dados do CEP.", "error");
    }
  });
}

// Salva alterações do perfil via PUT na API
async function saveProfileChanges() {
  const token = localStorage.getItem("jwtToken");

  const updatedData = {
    type: document.getElementById("edit-type").value,
    name: document.getElementById("edit-name").value,
    documentNumber: document.getElementById("edit-document").value,
    ngoType: document.getElementById("edit-ngo-type").value,
    email: document.getElementById("edit-email").value,
    phone: document.getElementById("edit-phone").value,
    cep: document.getElementById("edit-cep").value,
    street: document.getElementById("edit-street").value,
    neighborhood: document.getElementById("edit-neighborhood").value,
    city: document.getElementById("edit-city").value,
    state: document.getElementById("edit-state").value,
    number: document.getElementById("edit-number").value,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/Auth/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error(`Erro ao salvar perfil: ${response.status}`);
    }

    const updatedUser = await response.json();
    localStorage.setItem("user", JSON.stringify(updatedUser));

    showToast("Perfil atualizado com sucesso!");
    toggleEditMode(false);
    loadProfileData();
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    showToast("Erro ao atualizar perfil", "error");
  }
}

// Trata situação de usuário não autorizado, limpa sessão e redireciona
function handleUnauthorized() {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("user");
  window.location.href = "/index.html?session_expired=1";
}

// Funções auxiliares para facilitar alteração do texto e valor dos elementos
function setElementText(elementId, text) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = text;
  }
}

function setInputValue(elementId, value) {
  const input = document.getElementById(elementId);
  if (input) {
    input.value = value;
  }
}

// Formata CPF/CNPJ para visualização amigável
function formatDocument(doc) {
  if (!doc) return "";
  const cleaned = doc.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  } else if (cleaned.length === 14) {
    return cleaned.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  }
  return doc;
}

// Formata data para formato brasileiro
function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  } catch {
    return dateString;
  }
}

// Obtém iniciais do nome do usuário para avatar
function getInitials(name) {
  if (!name) return "US";
  return name
    .split(" ")
    .filter((part) => part.length > 0)
    .map((part) => part[0].toUpperCase())
    .join("")
    .substring(0, 2);
}

// Função simples para mostrar toast (pode ser substituída por versão do common-ui.js)
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
