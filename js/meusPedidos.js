// meusPedidos.js
// Controla a visualização dos pedidos reservados por uma ONG

// Redireciona para login se não houver token
if (!localStorage.getItem("jwtToken")) {
  window.location.href = "login.html";
}

// Abre modal de detalhes do contato
function abrirModal(nome, telefone, email) {
  document.getElementById("modalNome").textContent = nome;
  document.getElementById("modalTelefone").textContent = telefone;
  document.getElementById("modalEmail").textContent = email;
  document.getElementById("detalhesModal").style.display = "flex";
}

// Fecha o modal
function fecharModal() {
  document.getElementById("detalhesModal").style.display = "none";
}

// Verifica se o usuário é ONG antes de carregar os pedidos
async function verificarTipoUsuarioAntesDeCarregar() {
  const token = localStorage.getItem("jwtToken");

  try {
    const response = await fetch("https://localhost:7261/api/Auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Erro ao obter perfil do usuário");

    const perfil = await response.json();

    if (perfil.type.toLowerCase() !== "ngo") {
      window.location.href = "doacoes.html";
      return;
    }

    const loadingEl = document.getElementById("loadingMessage");
    if (loadingEl) loadingEl.style.display = "none";

    carregarDoacoesReservadas();
  } catch (error) {
    console.error("Erro na verificação de tipo de usuário:", error);
    window.location.href = "doacoes.html";
  }
}

// Carrega doações reservadas pela ONG
async function carregarDoacoesReservadas() {
  const token = localStorage.getItem("jwtToken");

  try {
    const response = await fetch(
      "https://localhost:7261/api/Donation/reserved-by-me",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) throw new Error("Erro ao buscar doações reservadas");

    const doacoes = await response.json();
    criarCardsDoacoes(doacoes);
  } catch (error) {
    console.error(error);
    alert("Erro ao carregar suas doações reservadas.");
  }
}

// Cria cards HTML dinamicamente para as doações
function criarCardsDoacoes(doacoes) {
  const container = document.getElementById("cardContainer");
  container.innerHTML = "";

  doacoes.forEach((item) => {
    const card = document.createElement("div");
    card.className = "donation-card";

    card.innerHTML = `
      <h4>${item.title}</h4>
      <p><i class="fas fa-tag"></i> ${item.category}</p>
      <p><i class="fas fa-map-marker-alt"></i> ${item.creatorStreet}, ${
      item.creatorNumber
    } - ${item.creatorNeighborhood}, ${item.creatorCity}/${
      item.creatorState
    }</p>
      <p><i class="fas fa-calendar-alt"></i> Validade: ${new Date(
        item.expirationDate
      ).toLocaleDateString()}</p>
      <p>${item.description}</p>
      <div class="donation-icons">
        <span class="highlight">${item.quantity} ${item.unit}</span>
        <span><i class="fas fa-seedling"></i> ${
          item.co2Impact ?? 0
        }kg CO2</span>
        <span><i class="fas fa-tint"></i> ${item.waterImpact ?? 0}L</span>
      </div>
      <div style="margin-top: 15px;">
        <button class="btn btn-secondary" onclick="abrirModal('${
          item.creatorName
        }', '${item.creatorPhone}', '${
      item.creatorEmail
    }')">Mais Detalhes</button>
        <button class="btn btn-success coletado-btn" data-id="${
          item.id
        }" >Coletado</button>
      </div>
    `;

    container.appendChild(card);
  });
}

// Toast de confirmação para ações que precisam de confirmação
function showConfirmToast(message, onConfirm) {
  const confirmToast = document.getElementById("confirmToast");
  const confirmMessage = document.getElementById("confirmMessage");

  confirmMessage.textContent = message;
  confirmToast.classList.add("show");

  const yesBtn = document.getElementById("confirmYes");
  const noBtn = document.getElementById("confirmNo");

  const cleanup = () => {
    confirmToast.classList.remove("show");
    yesBtn.onclick = null;
    noBtn.onclick = null;
  };

  yesBtn.onclick = () => {
    cleanup();
    onConfirm();
  };

  noBtn.onclick = () => {
    cleanup();
  };
}

// Função para mostrar toasts estilizados (sucesso, erro, info)
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");
  const toastIcon = toast.querySelector(".toast-content i");

  toast.classList.remove("success", "error", "info", "show");
  toastIcon.className = "";

  toastMessage.textContent = message;

  if (type === "success") {
    toast.classList.add("success");
    toastIcon.classList.add("fas", "fa-check-circle");
  } else if (type === "error") {
    toast.classList.add("error");
    toastIcon.classList.add("fas", "fa-times-circle");
  } else if (type === "info") {
    toast.classList.add("info");
    toastIcon.classList.add("fas", "fa-info-circle");
  }

  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => toast.classList.remove("show"), 2100);
}

// Evento global para o botão "Coletado" para marcar doação como coletada (deleta)
document.addEventListener("click", async function (e) {
  if (e.target && e.target.classList.contains("coletado-btn")) {
    const donationId = e.target.getAttribute("data-id");
    const token = localStorage.getItem("jwtToken");

    showConfirmToast(
      "Tem certeza que deseja marcar esta doação como coletada?",
      async () => {
        try {
          const response = await fetch(
            `https://localhost:7261/api/donation/${donationId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            showToast("✔️ Doação marcada como coletada!", "success");
            e.target.closest(".donation-card").remove();
          } else {
            const result = await response.json();
            showToast(
              `❌ Erro: ${result.message || "Não foi possível excluir."}`,
              "error"
            );
          }
        } catch (error) {
          console.error("Erro ao marcar como coletada:", error);
          showToast("❌ Falha na comunicação com o servidor.", "error");
        }
      }
    );
  }
});

// Ao carregar a página, verifica o tipo do usuário para carregar pedidos reservados
document.addEventListener(
  "DOMContentLoaded",
  verificarTipoUsuarioAntesDeCarregar
);
