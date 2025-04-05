
document.addEventListener('DOMContentLoaded', function() {
    // Registration functionality
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form validation
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('As senhas não conferem!');
                return;
            }
            
            // Get form data
            const formData = {
                id: generateUUID(),
                name: document.getElementById('regName').value,
                email: document.getElementById('regEmail').value,
                phone: document.getElementById('regPhone').value,
                address: document.getElementById('regAddress').value,
                type: document.getElementById('regType').value,
                documentNumber: document.getElementById('regDocumentNumber').value,
                password: password, // In a real app, this would be hashed
                createdAt: new Date()
            };
            
            // Add type-specific fields
            if (formData.type === 'business') {
                formData.businessType = document.getElementById('businessType').value;
            } else if (formData.type === 'ngo') {
                formData.ngoType = document.getElementById('ngoType').value;
            }
            
            // Save user to localStorage
            saveUser(formData);
            
            // Show success message and close modal
            showToast('Cadastro realizado com sucesso!');
            document.getElementById('registerModal').style.display = 'none';
            registerForm.reset();
        });
    }
    
    // Login functionality
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const user = authenticateUser(email, password);
            
            if (user) {
                // Save logged in user
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Show success message
                showToast('Login realizado com sucesso!');
                document.getElementById('loginModal').style.display = 'none';
                loginForm.reset();
                
                // Redirect or update UI for logged in user
                // This will be expanded in a real application
                updateUIForLoggedInUser(user);
            } else {
                alert('Email ou senha incorretos!');
            }
        });
    }
    
    // Helper functions
    function saveUser(userData) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check if email already exists
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
        // This can be expanded for different user types
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        
        if (loginBtn) loginBtn.textContent = 'Minha Conta';
        if (registerBtn) registerBtn.style.display = 'none';
        
        // We would update more UI elements based on user type here
        console.log(`Logged in as: ${user.name} (${user.type})`);
    }
    
    // Check if user is already logged in
    function checkLoggedInUser() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            updateUIForLoggedInUser(currentUser);
        }
    }
    
    // Show toast notification
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
    
    // Check logged in user on page load
    checkLoggedInUser();
});
