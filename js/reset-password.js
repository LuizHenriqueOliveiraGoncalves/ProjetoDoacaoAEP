// reset-password.js
// Controle do formulário de redefinição de senha via token

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  const form = document.getElementById("resetPasswordForm");
  const messageDiv = document.getElementById("resetMessage");

  // Se token inválido, mostra erro e oculta formulário
  if (!token) {
    showToast("Token inválido ou expirado. Por favor, solicite um novo link.", "error");
    form.style.display = "none";
    return;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Valida tamanho mínimo da senha
    if (newPassword.length < 6) {
      showToast("A nova senha deve ter pelo menos 6 caracteres.", "error");
      return;
    }

    // Confirma se as senhas coincidem
    if (newPassword !== confirmPassword) {
      showToast("As senhas digitadas não coincidem.", "error");
      return;
    }

    try {
      // Envia nova senha para API
      const response = await fetch("http://localhost:5098/api/Auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token,
          newPassword: newPassword
        })
      });

      if (response.ok) {
        showToast("Senha redefinida com sucesso! Redirecionando para o login...", "success");

        setTimeout(() => {
          window.location.href = "/index.html";
        }, 3000);
      } else {
        const errorText = await response.text();
        showToast(`Erro: ${errorText}`, "error");
      }
    } catch (error) {
      console.error("Erro:", error);
      showToast("Erro ao conectar com o servidor. Tente novamente.", "error");
    }
  });

  // Função toast reutilizável dentro deste arquivo
  function showToast(message, type = "info") {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    toastMessage.textContent = message;

    toast.classList.remove("success", "error", "info");
    toast.classList.add("show", type);

    setTimeout(() => {
      toast.classList.remove("show", "success", "error", "info");
    }, 4000);
  }
});
