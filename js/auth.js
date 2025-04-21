
document.addEventListener('DOMContentLoaded', function() {
  
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
          
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('As senhas não conferem!');
                return;
            }
            
            
            const formData = {
                id: generateUUID(),
                name: document.getElementById('regName').value,
                email: document.getElementById('regEmail').value,
                phone: document.getElementById('regPhone').value,
                address: document.getElementById('regAddress').value,
                type: document.getElementById('regType').value,
                documentNumber: document.getElementById('regDocumentNumber').value,
                password: password, 
                createdAt: new Date()
            };
            
           
             if (formData.type === 'ngo') {
                formData.ngoType = document.getElementById('ngoType').value;
            }
            
           
            saveUser(formData);
            
            
            showToast('Cadastro realizado com sucesso!');
            document.getElementById('registerModal').style.display = 'none';
            registerForm.reset();
        });
    }
    
  
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const user = authenticateUser(email, password);
            
            if (user) {
               
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                
                showToast('Login realizado com sucesso!');
                document.getElementById('loginModal').style.display = 'none';
                loginForm.reset();
                
               
                updateUIForLoggedInUser(user);
            } else {
                alert('Email ou senha incorretos!');
            }
        });
    }
    
 
    function saveUser(userData) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        
       
        const existingUser = users.find(user => user.email === userData.email);
        if (existingUser) {
            alert('Este email já está cadastrado!');
            return false;
        }
        
        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    }
    
    function authenticateUser(email, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        return users.find(user => user.email === email && user.password === password) || null;
    }
    
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    function updateUIForLoggedInUser(user) {
       
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        
        if (loginBtn) loginBtn.textContent = 'Minha Conta';
        if (registerBtn) registerBtn.style.display = 'none';
        
       
        console.log(`Logged in as: ${user.name} (${user.type})`);
    }
    

    function checkLoggedInUser() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            updateUIForLoggedInUser(currentUser);
        }
    }
    
  
    function showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.classList.add('show');
            
            setTimeout(function() {
                toast.classList.remove('show');
            }, 3000);
        }
    }
    
   
    checkLoggedInUser();
});
