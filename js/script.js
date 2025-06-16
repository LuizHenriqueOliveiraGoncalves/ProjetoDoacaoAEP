document.addEventListener("DOMContentLoaded", function () {
  // =============================================
  // MENU TOGGLE FUNCTIONALITY
  // =============================================
  // Controla o botão que abre/fecha o menu no mobile
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav");

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      nav.classList.toggle("active"); // adiciona/remove a classe 'active' para mostrar/ocultar o menu
    });
  }

  // =============================================
  // FUNÇÕES PARA LIMPAR CAMPOS DOS FORMULÁRIOS
  // =============================================

  // Limpa todos os campos do formulário de registro (cadastro)
  function limparCamposRegistro() {
    // Campos principais
    document.getElementById("regType").value = "";
    document.getElementById("regName").value = "";
    document.getElementById("regDocumentNumber").value = "";
    document.getElementById("ngoType").value = "";
    document.getElementById("regEmail").value = "";
    document.getElementById("regPhone").value = "";
    document.getElementById("regPassword").value = "";
    document.getElementById("regConfirmPassword").value = "";

    // Campos de endereço
    document.getElementById("regCEP").value = "";
    document.getElementById("regStreet").value = "";
    document.getElementById("regNeighborhood").value = "";
    document.getElementById("regCity").value = "";
    document.getElementById("regState").value = "";
    document.getElementById("regNumber").value = "";

    // Resetar campo tipo para placeholder
    document.getElementById("regType").selectedIndex = 0;

    // Esconder campos específicos de ONG
    document.querySelector(".ngo-field").style.display = "none";

    // Limpar mensagens de erro visuais
    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach((msg) => (msg.style.display = "none"));

    // Esconder mensagem de senha não coincidente
    document.getElementById("passwordMismatch").style.display = "none";
  }

  // Limpa os campos do formulário de login
  function limparCamposLogin() {
    document.getElementById("loginEmail").value = "";
    document.getElementById("loginPassword").value = "";

    // Limpar mensagens de erro do login
    const errorMessages = document.querySelectorAll(
      "#loginForm .error-message"
    );
    errorMessages.forEach((msg) => (msg.style.display = "none"));
  }

  // =============================================
  // VALIDAÇÃO E MÁSCARAS DOS FORMULÁRIOS
  // =============================================
  const setupFormValidation = () => {
    const regType = document.getElementById("regType");
    const documentHint = document.getElementById("documentHint");

    if (regType) {
      // Quando o tipo de usuário muda, mostra/esconde campos específicos e altera a dica do documento
      regType.addEventListener("change", function () {
        const type = this.value;
        const ngoFields = document.querySelector(".ngo-field");

        ngoFields.style.display = type === "ngo" ? "block" : "none";

        if (type === "business") {
          documentHint.textContent = "Insira o CPF (000.000.000-00)";
        } else if (type === "ngo") {
          documentHint.textContent = "Insira o CNPJ (00.000.000/0000-00)";
        } else {
          documentHint.textContent = "";
        }
      });

      // Máscara para CPF e CNPJ (formatação durante a digitação)
      document
        .getElementById("regDocumentNumber")
        .addEventListener("input", function (e) {
          let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não é número

          if (value.length <= 11) {
            // CPF
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d)/, "$1.$2");
            value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
          } else {
            // CNPJ
            value = value.replace(/^(\d{2})(\d)/, "$1.$2");
            value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
            value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
            value = value.replace(/(\d{4})(\d)/, "$1-$2");
          }

          e.target.value = value;
        });

      // Máscara para telefone
      document
        .getElementById("regPhone")
        .addEventListener("input", function (e) {
          let value = e.target.value.replace(/\D/g, "");

          if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
          }
          if (value.length > 10) {
            value = value.replace(/(\d)(\d{4})$/, "$1-$2");
          }

          e.target.value = value;
        });

      // Validação da confirmação de senha
      const passwordField = document.getElementById("regPassword");
      const confirmPasswordField =
        document.getElementById("regConfirmPassword");
      const passwordMismatch = document.getElementById("passwordMismatch");

      function validatePassword() {
        if (passwordField.value !== confirmPasswordField.value) {
          confirmPasswordField.setCustomValidity("As senhas não coincidem");
          passwordMismatch.style.display = "block";
        } else {
          confirmPasswordField.setCustomValidity("");
          passwordMismatch.style.display = "none";
        }
      }

      passwordField.addEventListener("input", validatePassword);
      confirmPasswordField.addEventListener("input", validatePassword);

      // Validação do documento no envio do formulário
      document
        .getElementById("registerForm")
        .addEventListener("submit", function (e) {
          const docField = document.getElementById("regDocumentNumber");
          const cleanDoc = docField.value.replace(/\D/g, "");

          if (regType.value === "business" && cleanDoc.length !== 11) {
            e.preventDefault();
            alert("Por favor, insira um CPF (11 dígitos)");
            docField.focus();
            return false;
          }

          if (regType.value === "ngo" && cleanDoc.length !== 14) {
            e.preventDefault();
            alert("Por favor, insira CNPJ (14 dígitos) válido");
            docField.focus();
            return false;
          }
        });
    }
  };

  // =============================================
  // FUNÇÕES PARA VALIDAR CPF E CNPJ (OFFICIAL)
  // =============================================

  const validateDocument = (document) => {
    if (document.length === 11) {
      return validateCPF(document);
    } else if (document.length === 14) {
      return validateCNPJ(document);
    }
    return false;
  };

  // Valida CPF pelo algoritmo oficial
  const validateCPF = (cpf) => {
    if (/^(\d)\1{10}$/.test(cpf)) return false; // Números repetidos inválidos

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  };

  // Valida CNPJ pelo algoritmo oficial
  const validateCNPJ = (cnpj) => {
    if (/^(\d)\1{13}$/.test(cnpj)) return false;

    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    const digits = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;

    size = size + 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;

    return true;
  };

  // =============================================
  // GERENCIAMENTO DE MODAIS
  // =============================================

  const setupModals = () => {
    // Botões que abrem modais
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const registerBtnHero = document.getElementById("registerBtnHero");

    // Modais
    const loginModal = document.getElementById("loginModal");
    const registerModal = document.getElementById("registerModal");

    // Botões para fechar modais
    const closeLoginModal = document.getElementById("closeLoginModal");
    const closeRegisterModal = document.getElementById("closeRegisterModal");

    // Links para trocar modais (ex: ir para cadastro ao clicar em "não tem conta?")
    const showRegisterModal = document.getElementById("showRegisterModal");
    const showLoginModal = document.getElementById("showLoginModal");

    // Abrir modal de login
    if (loginBtn) {
      loginBtn.addEventListener("click", function (e) {
        e.preventDefault();
        loginModal.style.display = "block";
      });
    }

    // Abrir modal de registro
    if (registerBtn) {
      registerBtn.addEventListener("click", function (e) {
        e.preventDefault();
        registerModal.style.display = "block";
      });
    }

    // Abrir modal de registro pelo botão no hero (área principal)
    if (registerBtnHero) {
      registerBtnHero.addEventListener("click", function (e) {
        e.preventDefault();
        registerModal.style.display = "block";
      });
    }

    // Fechar modal de login
    if (closeLoginModal) {
      closeLoginModal.addEventListener("click", function () {
        limparCamposLogin();
        loginModal.style.display = "none";
      });
    }

    // Fechar modal de registro
    if (closeRegisterModal) {
      closeRegisterModal.addEventListener("click", function () {
        limparCamposRegistro();
        registerModal.style.display = "none";
      });
    }

    // Trocar para modal de registro ao clicar no link
    if (showRegisterModal) {
      showRegisterModal.addEventListener("click", function (e) {
        e.preventDefault();
        limparCamposRegistro();
        loginModal.style.display = "none";
        registerModal.style.display = "block";
      });
    }

    // Trocar para modal de login ao clicar no link
    if (showLoginModal) {
      showLoginModal.addEventListener("click", function (e) {
        e.preventDefault();
        limparCamposLogin();
        registerModal.style.display = "none";
        loginModal.style.display = "block";
      });
    }

    // Fechar modais ao clicar fora deles
    window.addEventListener("click", function (e) {
      if (e.target === loginModal) {
        limparCamposLogin();
        loginModal.style.display = "none";
      }
      if (e.target === registerModal) {
        limparCamposRegistro();
        registerModal.style.display = "none";
      }
    });
  };

  // =============================================
  // MANIPULAÇÃO DE ENVIO DE FORMULÁRIOS DE CONTATO E NEWSLETTER
  // =============================================

  const setupFormSubmissions = () => {
    const contactForm = document.getElementById("contactForm");
    const newsletterForm = document.getElementById("newsletterForm");

    if (contactForm) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        showToast("Mensagem enviada com sucesso!");
        this.reset();
      });
    }

    if (newsletterForm) {
      newsletterForm.addEventListener("submit", function (e) {
        e.preventDefault();
        showToast("Inscrição realizada com sucesso!");
        this.reset();
      });
    }
  };

  // =============================================
  // FUNÇÃO PARA MOSTRAR NOTIFICAÇÕES TOAST
  // =============================================

  function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");
    const toastIcon = toast.querySelector(".toast-content i");

    // Remove classes anteriores para evitar conflitos
    toast.classList.remove("success", "error", "info", "show");
    toastIcon.className = "";

    toastMessage.textContent = message;

    // Define ícones e cores conforme o tipo da mensagem
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

    // Exibe o toast com um pequeno delay para animação
    setTimeout(() => {
      toast.classList.add("show");
    }, 100);

    // Esconde o toast após 2 segundos
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2100);
  }

  // =============================================
  // ROLAGEM SUAVE PARA LINKS INTERNOS
  // =============================================

  const setupSmoothScroll = () => {
    // Para todos links que começam com #
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        // Ignora casos especiais para evitar conflito com modais
        if (
          this.getAttribute("href") !== "#" &&
          !this.getAttribute("id")?.includes("show") &&
          this.getAttribute("href").startsWith("#")
        ) {
          e.preventDefault();

          const targetId = this.getAttribute("href");
          if (!targetId) return;

          const targetElement = document.querySelector(targetId);
          if (!targetElement) return;

          // Rola suavemente até o elemento (descontando header fixo)
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth",
          });
        }
      });
    });
  };

  // =============================================
  // EFEITO NO HEADER AO SCROLL
  // =============================================

  const setupHeaderScrollEffect = () => {
    const header = document.getElementById("header");
    if (header) {
      window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
          header.style.padding = "10px 0";
          header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
        } else {
          header.style.padding = "15px 0";
          header.style.boxShadow = "";
        }
      });
    }
  };

  // =============================================
  // INTEGRAÇÃO COM A API (LOGIN E REGISTRO)
  // =============================================

  const API_BASE_URL = "https://localhost:7261/api";

  const setupApiIntegration = () => {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");
    const cepField = document.getElementById("regCEP");

    // Registro de usuário
    if (registerForm) {
      registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = {
          type: document.getElementById("regType").value,
          name: document.getElementById("regName").value,
          documentNumber: document.getElementById("regDocumentNumber").value,
          ngoType:
            document.getElementById("regType").value === "ngo"
              ? document.getElementById("ngoType").value
              : null,
          email: document.getElementById("regEmail").value,
          phone: document.getElementById("regPhone").value,
          cep: document.getElementById("regCEP").value,
          street: document.getElementById("regStreet").value,
          neighborhood: document.getElementById("regNeighborhood").value,
          city: document.getElementById("regCity").value,
          state: document.getElementById("regState").value,
          number: document.getElementById("regNumber").value,
          password: document.getElementById("regPassword").value,
        };

        try {
          const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });

          const result = await response.json();

          if (response.ok) {
            showToast("✔️ Cadastro realizado com sucesso!", "success");

            if (result.token) {
              localStorage.setItem("jwtToken", result.token);
              localStorage.setItem("user", JSON.stringify(result.user));
            }

            setTimeout(() => {
              document.body.classList.add("fade-out");
              setTimeout(() => {
                window.location.href = "/index.html";
              }, 600); // Espera a transição (fade) terminar
            }, 2000);
          } else {
            showToast(`❌ Erro: ${result.message}`, "error");
          }
        } catch (error) {
          showToast("❌ Erro ao conectar com o servidor", "error");
          console.error("Erro:", error);
        }
      });
    }

    // Login do usuário
    if (loginForm) {
      loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = {
          email: document.getElementById("loginEmail").value,
          password: document.getElementById("loginPassword").value,
        };

        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });

          const result = await response.json();

          if (response.ok) {
            showToast("✔️ Login realizado com sucesso!", "success");

            localStorage.setItem("jwtToken", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));

            setTimeout(() => {
              document.body.classList.add("fade-out");
              setTimeout(() => {
                window.location.href = "/index.html";
              }, 600);
            }, 2000);
          } else {
            showToast(`❌ Erro: ${result.message}`, "error");
          }
        } catch (error) {
          showToast("❌ Erro ao conectar com o servidor", "error");
          console.error("Erro:", error);
        }
      });
    }

    // Autocomplete de endereço pelo CEP usando API viacep
    if (cepField) {
      cepField.addEventListener("blur", async function () {
        const cepInput = this;
        const cep = this.value.replace(/\D/g, "");

        if (cep.length !== 8) {
          cepInput.classList.add("invalid");
          return;
        }

        try {
          cepInput.classList.add("loading");
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const data = await response.json();
          cepInput.classList.remove("loading");

          if (data.erro) {
            cepInput.classList.add("invalid");
            throw new Error("CEP não encontrado");
          }

          const fieldsToFill = {
            regStreet: data.logradouro,
            regNeighborhood: data.bairro,
            regCity: data.localidade,
            regState: data.uf,
          };

          Object.entries(fieldsToFill).forEach(([id, value]) => {
            const field = document.getElementById(id);
            if (field) {
              field.value = value;
              field.classList.add("auto-filled");
            }
          });

          cepInput.classList.add("valid");
          cepInput.classList.remove("invalid");
        } catch (error) {
          console.error("Erro ao buscar CEP:", error);
          cepInput.classList.remove("loading");
          cepInput.classList.add("invalid");
        }
      });

      // Máscara do CEP (formato 00000-000)
      cepField.addEventListener("input", function () {
        this.value = this.value
          .replace(/\D/g, "")
          .replace(/^(\d{5})(\d)/, "$1-$2");
      });
    }
  };

  // =============================================
  // VERIFICAÇÃO DE AUTENTICAÇÃO
  // =============================================

  const checkAuth = () => {
    const token = localStorage.getItem("jwtToken");
    const publicPages = ["/index.html", "/reset-password.html"];

    const isPublicPage = publicPages.some((page) =>
      window.location.pathname.includes(page)
    );

    // Se não autenticado e não estiver em página pública, redireciona para login
    if (!token && !isPublicPage) {
      window.location.href = "/index.html";
    }
  };

  // Se estiver autenticado, mostra o perfil na interface
  const jwtToken = localStorage.getItem("jwtToken");
  const userData = localStorage.getItem("user");

  if (jwtToken && userData) {
    showUserProfile(JSON.parse(userData));
  }

  // =============================================
  // SUPORTE A RECUPERAÇÃO DE SENHA
  // =============================================

  const setupPasswordRecovery = () => {
    const forgotPasswordLink = document.getElementById("forgotPasswordLink");
    const forgotPasswordModal = document.getElementById("forgotPasswordModal");
    const closeForgotPasswordModal = document.getElementById(
      "closeForgotPasswordModal"
    );
    const loginModal = document.getElementById("loginModal");
    const forgotPasswordForm = document.getElementById("forgotPasswordForm");

    if (forgotPasswordLink && forgotPasswordModal) {
      forgotPasswordLink.addEventListener("click", function (e) {
        e.preventDefault();
        limparCamposRecuperacao();
        loginModal.style.display = "none";
        forgotPasswordModal.style.display = "block";
      });
    }

    if (closeForgotPasswordModal) {
      closeForgotPasswordModal.addEventListener("click", function () {
        forgotPasswordModal.style.display = "none";
        loginModal.style.display = "block";
      });
    }

    if (forgotPasswordForm) {
      forgotPasswordForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const email = document.getElementById("recoveryEmail").value.trim();

        if (!email || !validateEmail(email)) {
          showToast("Por favor, insira um e-mail válido.", "error");
          return;
        }

        try {
          const response = await fetch(`${API_BASE_URL}/Auth/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });

          const resultText = await response.text();

          if (response.ok) {
            showToast(
              "✔️ Link de recuperação enviado com sucesso! Verifique sua caixa de entrada.",
              "success"
            );
            forgotPasswordModal.style.display = "none";
            loginModal.style.display = "block";
          } else {
            showToast(`❌ Erro: ${resultText}`, "error");
          }
        } catch (error) {
          console.error("Erro ao enviar recuperação de senha:", error);
          showToast("❌ Falha ao conectar com o servidor.", "error");
        }
      });
    }

    function limparCamposRecuperacao() {
      document.getElementById("recoveryEmail").value = "";
      const errorMessages = document.querySelectorAll(
        "#forgotPasswordForm .error-message"
      );
      errorMessages.forEach((msg) => (msg.style.display = "none"));
    }

    // Validação simples de e-mail com regex
    function validateEmail(email) {
      const re = /\S+@\S+\.\S+/;
      return re.test(email);
    }
  };

  // =============================================
  // CARREGAMENTO DE ESTATÍSTICAS
  // =============================================

  async function loadStatsCounters() {
    const apiBaseUrl = "https://localhost:7261/api";
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      console.warn(
        "Usuário não autenticado. Não será possível carregar estatísticas."
      );
      return;
    }

    try {
      // Busca estatísticas dos usuários (ONGs, empresas)
      const userResponse = await fetch(`${apiBaseUrl}/auth/user-stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userStats = await userResponse.json();

      // Busca estatísticas das doações
      const donationResponse = await fetch(
        `${apiBaseUrl}/auth/donation-stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const donationStats = await donationResponse.json();

      // Atualiza contadores na interface
      const businessEl = document.getElementById("businessCount");
      const donationEl = document.getElementById("donationCount");
      const ngoEl = document.getElementById("ngoCount");

      if (businessEl) businessEl.textContent = userStats.businesses ?? 0;
      if (donationEl)
        donationEl.textContent = donationStats.totalDonations ?? 0;
      if (ngoEl) ngoEl.textContent = userStats.ngos ?? 0;
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  }

  // Carrega as estatísticas assim que a página termina de carregar
  document.addEventListener("DOMContentLoaded", loadStatsCounters);

  // =============================================
  // INICIALIZAÇÃO DE TODAS AS FUNÇÕES
  // =============================================

  const init = () => {
    setupFormValidation();
    setupModals();
    setupPasswordRecovery();
    setupFormSubmissions();
    setupSmoothScroll();
    setupHeaderScrollEffect();
    setupApiIntegration();
    checkAuth();
    loadStatsCounters();
  };

  init();
});

// =============================================
// FUNÇÃO PARA EXIBIR PERFIL DO USUÁRIO NO HEADER
// =============================================

function showUserProfile(user) {
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const userProfile = document.getElementById("userProfile");
  const userName = document.getElementById("userName");

  // Esconde botões de login e cadastro
  if (loginBtn) loginBtn.parentElement.style.display = "none";
  if (registerBtn) registerBtn.parentElement.style.display = "none";

  // Mostra perfil do usuário no header com nome
  if (userProfile) {
    userProfile.style.display = "flex";
    if (userName) {
      userName.textContent = user.name || user.email.split("@")[0];
    }
  }
}

// =============================================
// EVENTO DE LOGOUT
// =============================================
document.getElementById("logoutBtn")?.addEventListener("click", function (e) {
  e.preventDefault();
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("user");
  window.location.reload();
});
