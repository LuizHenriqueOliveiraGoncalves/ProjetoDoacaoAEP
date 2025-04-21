document.addEventListener('DOMContentLoaded', function() {
   
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('expirationDate').setAttribute('min', formattedDate);

    //Deixar assim por enquanto
    /*
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.type !== 'business') {
      // Create login message
      const formContainer = document.querySelector('.form-container');
      formContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <i class="fas fa-lock" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
          <h3>Acesso restrito</h3>
          <p>Apenas estabelecimentos cadastrados podem doar alimentos.</p>
          <div style="margin-top: 1.5rem;">
            <button class="btn btn-primary" id="loginRedirect">Fazer Login</button>
            <button class="btn btn-secondary" id="registerRedirect">Cadastrar-se</button>
          </div>
        </div>
      `;
      
      // Add event listeners to buttons
      document.getElementById('loginRedirect').addEventListener('click', function() {
        document.getElementById('loginModal').style.display = 'block';
      });
      
      document.getElementById('registerRedirect').addEventListener('click', function() {
        document.getElementById('registerModal').style.display = 'block';
      });
      
      return;
    }
    */



    const previewBtn = document.getElementById('previewBtn');
    const donationPreview = document.getElementById('donationPreview');
    
    previewBtn.addEventListener('click', function() {
      const formData = getFormData();
      
      if (!validateForm()) {
        document.getElementById('toastMessage').textContent = 'Por favor, preencha todos os campos obrigatórios.';
        document.getElementById('toast').classList.add('show');
        setTimeout(() => {
          document.getElementById('toast').classList.remove('show');
        }, 3000);
        return;
      }
      

      const previewContent = donationPreview.querySelector('.preview-content');
      const expirationDate = new Date(formData.expirationDate);
      
      previewContent.innerHTML = `
        <div class="preview-item"><span class="preview-label">Título:</span> ${formData.title}</div>
        <div class="preview-item"><span class="preview-label">Descrição:</span> ${formData.description}</div>
        <div class="preview-item"><span class="preview-label">Categoria:</span> ${getCategoryName(formData.category)}</div>
        <div class="preview-item"><span class="preview-label">Quantidade:</span> ${formData.quantity} ${formData.unit}</div>
        <div class="preview-item"><span class="preview-label">Data de Validade:</span> ${expirationDate.toLocaleDateString('pt-BR')}</div>
        <div class="preview-item"><span class="preview-label">Tipo de Entrega:</span> ${formData.deliveryType === 'pickup' ? 'Retirada no Local' : 'Entrega'}</div>
        <div class="preview-item"><span class="preview-label">Endereço:</span> ${formData.pickupAddress}</div>
      `;
      
      const impact = calculateEnvironmentalImpact(formData.quantity);
      document.getElementById('co2Impact').textContent = `${impact.co2Saved.toFixed(1)} kg de CO2 economizados`;
      document.getElementById('waterImpact').textContent = `${impact.waterSaved.toFixed(0)} L de água economizados`;

      donationPreview.style.display = 'block';
    });
    

    const donationForm = document.getElementById('donationForm');
    
    donationForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (!validateForm()) {
        document.getElementById('toastMessage').textContent = 'Por favor, preencha todos os campos obrigatórios.';
        document.getElementById('toast').classList.add('show');
        setTimeout(() => {
          document.getElementById('toast').classList.remove('show');
        }, 3000);
        return;
      }
      
      const formData = getFormData();
      
      const donation = {
        id: generateUUID(),
        businessId: currentUser.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        expirationDate: new Date(formData.expirationDate),
        pickupAddress: formData.pickupAddress,
        pickupLatitude: parseFloat(formData.pickupLatitude),
        pickupLongitude: parseFloat(formData.pickupLongitude),
        deliveryType: formData.deliveryType,
        status: 'available',
        createdAt: new Date()
      };
      

      let donations = JSON.parse(localStorage.getItem('donations')) || [];
      donations.push(donation);
      localStorage.setItem('donations', JSON.stringify(donations));
      

      const impact = calculateEnvironmentalImpact(donation.quantity);
      let impacts = JSON.parse(localStorage.getItem('environmentalImpacts')) || [];
      impacts.push({
        id: generateUUID(),
        donationId: donation.id,
        co2Saved: impact.co2Saved,
        waterSaved: impact.waterSaved,
        createdAt: new Date()
      });
      localStorage.setItem('environmentalImpacts', JSON.stringify(impacts));


      document.getElementById('toastMessage').textContent = 'Doação cadastrada com sucesso!';
      document.getElementById('toast').classList.add('show');
      

      donationForm.reset();
      donationPreview.style.display = 'none';
      
 
      setTimeout(() => {
        document.getElementById('toast').classList.remove('show');
        window.location.href = 'doacoes.html';
      }, 3000);
    });
    

    function getFormData() {
      return {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        quantity: document.getElementById('quantity').value,
        unit: document.getElementById('unit').value,
        expirationDate: document.getElementById('expirationDate').value,
        deliveryType: document.getElementById('deliveryType').value,
        pickupAddress: document.getElementById('pickupAddress').value,
        pickupLatitude: document.getElementById('pickupLatitude').value,
        pickupLongitude: document.getElementById('pickupLongitude').value
      };
    }
    
    function validateForm() {
      const requiredFields = [
        'title', 'description', 'category', 'quantity', 
        'unit', 'expirationDate', 'deliveryType'
      ];
      
      for (let field of requiredFields) {
        const element = document.getElementById(field);
        if (!element.value) {
          element.focus();
          return false;
        }
      }
      
      return true;
    }
    
    function calculateEnvironmentalImpact(quantity) {
     
      const co2PerKg = 2.5; 
      const waterPerKg = 1000;
      
    
      let quantityInKg = parseFloat(quantity);
      const unit = document.getElementById('unit').value;
      
      if (unit === 'g') {
        quantityInKg = quantityInKg / 1000;
      }
      
      return {
        co2Saved: quantityInKg * co2PerKg,
        waterSaved: quantityInKg * waterPerKg
      };
    }
    
    function getCategoryName(category) {
      const categories = {
        'prepared': 'Alimentos Preparados',
        'produce': 'Frutas e Vegetais',
        'bakery': 'Padaria e Confeitaria',
        'canned': 'Alimentos Enlatados',
        'dairy': 'Laticínios',
        'meat': 'Carnes',
        'grain': 'Grãos e Cereais',
        'other': 'Outros'
      };
      
      return categories[category] || category;
    }
    
    function generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
      });
    }
  });