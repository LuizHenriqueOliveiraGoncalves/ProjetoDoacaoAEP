
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });

         // Mostrar campos específicos conforme tipo de cadastro
    const regType = document.getElementById('regType');
    const documentHint = document.getElementById('documentHint');
    
    regType.addEventListener('change', function() {
      const type = this.value;
      const ngoFields = document.querySelector('.ngo-field');
        
      ngoFields.style.display = (type === 'ngo') ? 'block' : 'none';
      
      // Atualizar dica do campo de documento
      if (type === 'business') {
        documentHint.textContent = 'Insira o CPF (000.000.000-00)';
      } else if (type === 'ngo') {
        documentHint.textContent = 'Insira o CNPJ (00.000.000/0000-00)';
      } else {
        documentHint.textContent = '';
      }
    });

    // Máscara para CPF/CNPJ
    document.getElementById('regDocumentNumber').addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      
      if (value.length <= 11) {
        // Formata CPF (000.000.000-00)
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      } else {
        // Formata CNPJ (00.000.000/0000-00)
        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
      }
      
      e.target.value = value;
    });

    // Máscara para telefone
    document.getElementById('regPhone').addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      
      if (value.length > 2) {
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
      }
      if (value.length > 10) {
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
      }
      
      e.target.value = value;
    });

    // Validação de confirmação de senha
    const passwordField = document.getElementById('regPassword');
    const confirmPasswordField = document.getElementById('regConfirmPassword');
    const passwordMismatch = document.getElementById('passwordMismatch');
    
    function ValidacaoSenha() {
      if (passwordField.value !== confirmPasswordField.value) {
        confirmPasswordField.setCustomValidity('As senhas não coincidem');
        passwordMismatch.style.display = 'block';
      } else {
        confirmPasswordField.setCustomValidity('');
        passwordMismatch.style.display = 'none';
      }
    }
    
    passwordField.addEventListener('input', ValidacaoSenha);
    confirmPasswordField.addEventListener('input', ValidacaoSenha);

    // Validação de CPF/CNPJ
    document.getElementById('registerForm').addEventListener('submit', function(e) {
      const docField = document.getElementById('regDocumentNumber');
      const cleanDoc = docField.value.replace(/\D/g, '');
      
      if (regType.value === 'business' && cleanDoc.length !== 11) {
        e.preventDefault();
        alert('Por favor, insira um CPF (11 dígitos)');
        docField.focus();
        return false;
      }
      
      if (regType.value === 'ngo' && cleanDoc.length !== 14) {
        e.preventDefault();
        alert('Por favor, insira CNPJ (14 dígitos) válido');
        docField.focus();
        return false;
      }
      
      if (!ValidacaoDocumento(cleanDoc)) {
        e.preventDefault();
        alert('Documento inválido. Por favor, verifique o CPF/CNPJ informado.');
        docField.focus();
        return false;
      }
    });

    // Funções de validação CPF/CNPJ
    function ValidacaoDocumento(document) {
      if (document.length === 11) {
        return validateCPF(document);
      } else if (document.length === 14) {
        return validateCNPJ(document);
      }
      return false;
    }

    function validateCPF(cpf) {
      if (/^(\d)\1{10}$/.test(cpf)) return false;
      
      let sum = 0;
      let remainder;
      
      for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i-1, i)) * (11 - i);
      }
      remainder = (sum * 10) % 11;
      
      if ((remainder === 10) || (remainder === 11)) remainder = 0;
      if (remainder !== parseInt(cpf.substring(9, 10))) return false;
      
      sum = 0;
      for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i-1, i)) * (12 - i);
      }
      remainder = (sum * 10) % 11;
      
      if ((remainder === 10) || (remainder === 11)) remainder = 0;
      if (remainder !== parseInt(cpf.substring(10, 11))) return false;
      
      return true;
    }

    function validateCNPJ(cnpj) {
      if (/^(\d)\1{13}$/.test(cnpj)) return false;
      
      let size = cnpj.length - 2;
      let numbers = cnpj.substring(0, size);
      const digits = cnpj.substring(size);
      let sum = 0;
      let pos = size - 7;
      
      for (let i = size; i >= 1; i--) {
        sum += numbers.charAt(size - i) * pos--;
        if (pos < 2) pos = 9;
      }
      
      let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
      if (result !== parseInt(digits.charAt(0))) return false;
      
      size = size + 1;
      numbers = cnpj.substring(0, size);
      sum = 0;
      pos = size - 7;
      
      for (let i = size; i >= 1; i--) {
        sum += numbers.charAt(size - i) * pos--;
        if (pos < 2) pos = 9;
      }
      
      result = sum % 11 < 2 ? 0 : 11 - sum % 11;
      if (result !== parseInt(digits.charAt(1))) return false;
      
      return true;
    }
    }

    // Funcionalidade dos modais
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const registerBtnHero = document.getElementById('registerBtnHero');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const closeRegisterModal = document.getElementById('closeRegisterModal');
    const showRegisterModal = document.getElementById('showRegisterModal');
    const showLoginModal = document.getElementById('showLoginModal');

    // Abrir modais
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'block';
        });
    }

    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            registerModal.style.display = 'block';
        });
    }

    if (registerBtnHero) {
        registerBtnHero.addEventListener('click', function(e) {
            e.preventDefault();
            registerModal.style.display = 'block';
        });
    }

    // Fechar modais
    if (closeLoginModal) {
        closeLoginModal.addEventListener('click', function() {
            loginModal.style.display = 'none';
        });
    }

    if (closeRegisterModal) {
        closeRegisterModal.addEventListener('click', function() {
            registerModal.style.display = 'none';
        });
    }

    // Altear entre modais
    if (showRegisterModal) {
        showRegisterModal.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'none';
            registerModal.style.display = 'block';
        });
    }

    if (showLoginModal) {
        showLoginModal.addEventListener('click', function(e) {
            e.preventDefault();
            registerModal.style.display = 'none';
            loginModal.style.display = 'block';
        });
    }

    // Fechar modais quando clicado fora
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (e.target === registerModal) {
            registerModal.style.display = 'none';
        }
    });

    // Logica do Tipo de Cadastro selecionado
    const regType = document.getElementById('regType');    
    const ngoFields = document.querySelectorAll('.ngo-field');

    if (regType) {
        regType.addEventListener('change', function() {
            if (this.value === 'ngo') {          
                ngoFields.forEach(field => field.style.display = 'block');
            } else {              
                ngoFields.forEach(field => field.style.display = 'none');
            }
        });
    }

    // Formulario enviado ou realizado
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('Mensagem enviada com sucesso!');
            this.reset();
        });
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('Inscrição realizada com sucesso!');
            this.reset();
        });
    }

    // Notificação de Operação 
    function showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(function() {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // Smooth scroll para os links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') !== '#' && 
                !this.getAttribute('id')?.includes('show') && 
                this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (!targetId) return;
                
                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Cabeçalho scroll efeito
    const header = document.getElementById('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '15px 0';
            header.style.boxShadow = '';
        }
    });

    // Inicializar outros componentes se necessário
    window.addEventListener('load', function() {
        // Inicia o codigo aqui
    });
});

