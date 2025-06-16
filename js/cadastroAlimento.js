// cadastroAlimento.js
// Controla o envio do formulário de cadastro de doação de alimento

document
  .getElementById("donationForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // Evita o envio tradicional para controlar via JS

    // Função para mostrar notificações de toast (sucesso, erro, etc)
    function showToast(message, type = "success") {
      const toast = document.getElementById("toast");
      const toastMessage = document.getElementById("toastMessage");

      toastMessage.textContent = message;
      toast.classList.remove("success", "error", "info");
      toast.classList.add("show", type);

      setTimeout(() => {
        toast.classList.remove("show");
      }, 2000); // Oculta após 2 segundos
    }

    // Captura dados do formulário
    const formData = {
      title: document.getElementById("title").value,
      category: document.getElementById("category").value,
      description: document.getElementById("description").value,
      quantity: parseFloat(document.getElementById("quantity").value),
      unit: document.getElementById("unit").value,
      expirationDate: document.getElementById("expirationDate").value,
      pickupLatitude:
        parseFloat(document.getElementById("pickupLatitude").value) || null,
      pickupLongitude:
        parseFloat(document.getElementById("pickupLongitude").value) || null,
    };

    try {
      // Envia os dados para a API via POST
      const response = await fetch("https://localhost:7261/api/donation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast("✔️ Doação cadastrada com sucesso!", "success");

        // Após o sucesso, aguarda e redireciona para a página de doações
        setTimeout(() => {
          document.body.classList.add("fade-out");
          setTimeout(() => {
            window.location.href = "doacoes.html";
          }, 600); // Delay para animação
        }, 2000);
      } else {
        const error = await response.json();
        showToast(`❌ Erro: ${error.message}`, "error");
      }
    } catch (error) {
      console.error("Erro:", error);
      showToast("❌ Erro ao cadastrar doação", "error");
    }
  });
