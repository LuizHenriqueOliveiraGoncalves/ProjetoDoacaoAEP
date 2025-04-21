document.addEventListener('DOMContentLoaded', function() {

    initializeSampleData();

    function CriacaoDoacao(donationData) {
 
        const environmentalImpact = CalculoImpacto(donationData.quantity);
        

        let donations = JSON.parse(localStorage.getItem('donations')) || [];
        donations.push(donationData);
        localStorage.setItem('donations', JSON.stringify(donations));
        

        let impacts = JSON.parse(localStorage.getItem('environmentalImpacts')) || [];
        impacts.push({
            id: generateUUID(),
            donationId: donationData.id,
            co2Saved: environmentalImpact.co2Saved,
            waterSaved: environmentalImpact.waterSaved,
            createdAt: new Date()
        });
        localStorage.setItem('environmentalImpacts', JSON.stringify(impacts));
        
        return true;
    }
    
    function CalculoImpacto(quantity) {
       
        const co2PerKg = 2.5; 
        const waterPerKg = 1000; 
        
        return {
            co2Saved: quantity * co2PerKg,
            waterSaved: quantity * waterPerKg
        };
    }
    
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    
    function initializeSampleData() {
        if (!localStorage.getItem('donations')) {
            const sampleBusinesses = [
                {
                    id: 'business-1',
                    name: 'Restaurante Boa Mesa',
                    email: 'contato@boamesa.com',
                    phone: '11988887777',
                    address: 'Av. Paulista, 1000, São Paulo - SP',
                    type: 'business',
                    documentNumber: '12345678000190',
                    password: 'password123',
                    createdAt: new Date()
                },
                {
                    id: 'business-2',
                    name: 'Supermercado Economia',
                    email: 'contato@economia.com',
                    phone: '11977776666',
                    address: 'Rua Augusta, 500, São Paulo - SP',
                    type: 'business',
                    documentNumber: '98765432000190',
                    password: 'password123',
                    createdAt: new Date()
                }
            ];
            
            const sampleNGOs = [
                {
                    id: 'ngo-1',
                    name: 'Ação Solidária',
                    email: 'contato@acaosolidaria.org',
                    phone: '11966665555',
                    address: 'Rua Oscar Freire, 300, São Paulo - SP',
                    type: 'ngo',
                    documentNumber: '12345678000199',
                    ngoType: 'foodBank',
                    password: 'password123',
                    createdAt: new Date()
                }
            ];
            
            const sampleDonations = [
                {
                    id: generateUUID(),
                    businessId: 'business-1',
                    title: 'Sobras do almoço',
                    description: 'Arroz, feijão e legumes variados',
                    category: 'prepared',
                    quantity: 10,
                    unit: 'kg',
                    expirationDate: new Date(Date.now() + 2*24*60*60*1000), 
                    pickupAddress: 'Av. Paulista, 1000, São Paulo - SP',
                    pickupLatitude: -23.561778,
                    pickupLongitude: -46.655600,
                    deliveryType: 'pickup',
                    status: 'available',
                    createdAt: new Date()
                },
                {
                    id: generateUUID(),
                    businessId: 'business-2',
                    title: 'Frutas e legumes',
                    description: 'Banana, maçã, tomate e cenoura',
                    category: 'produce',
                    quantity: 15,
                    unit: 'kg',
                    expirationDate: new Date(Date.now() + 3*24*60*60*1000), 
                    pickupAddress: 'Rua Augusta, 500, São Paulo - SP',
                    pickupLatitude: -23.553430,
                    pickupLongitude: -46.647053,
                    deliveryType: 'pickup',
                    status: 'available',
                    createdAt: new Date()
                }
            ];
            
            // Calcula e salva o impacto ambiental para cada doação
            const sampleImpacts = sampleDonations.map(donation => {
                const impact = CalculoImpacto(donation.quantity);
                return {
                    id: generateUUID(),
                    donationId: donation.id,
                    co2Saved: impact.co2Saved,
                    waterSaved: impact.waterSaved,
                    createdAt: new Date()
                };
            });
            
           
            const users = [...sampleBusinesses, ...sampleNGOs];
            
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('donations', JSON.stringify(sampleDonations));
            localStorage.setItem('environmentalImpacts', JSON.stringify(sampleImpacts));
            localStorage.setItem('reservations', JSON.stringify([]));
            
            console.log('Sample data initialized');
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Pega data doacao
    const donations = JSON.parse(localStorage.getItem('donations')) || [];
    const donationGrid = document.getElementById('donationGrid');
    

    function displayDonations() {
      if (donations.length === 0) {
        donationGrid.innerHTML = `
          <div class="no-results">
            <i class="fas fa-box-open" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
            <h3>Nenhuma doação disponível</h3>
            <p>No momento não há doações disponíveis. Volte mais tarde.</p>
          </div>
        `;
        return;
      }
      
      donationGrid.innerHTML = '';
      
      donations.forEach(donation => {
        if (donation.status === 'available') {
          // Format expiration date
          const expirationDate = new Date(donation.expirationDate);
          const formattedDate = expirationDate.toLocaleDateString('pt-BR');
          
          // Create donation card
          const donationCard = document.createElement('div');
          donationCard.className = 'donation-card';
          donationCard.innerHTML = `
            <div class="donation-image" style="display: flex; justify-content: center; align-items: center; background-color: #f5f5f5;">
              <i class="fas fa-utensils" style="font-size: 3rem; color: #4CAF50;"></i>
            </div>
            <div class="donation-content">
              <h3 class="donation-title">${donation.title}</h3>
              <div class="donation-meta">
                <i class="fas fa-map-marker-alt"></i>
                <span>${donation.pickupAddress.substring(0, 30)}...</span>
              </div>
              <div class="donation-meta">
                <i class="fas fa-calendar-alt"></i>
                <span>Validade: ${formattedDate}</span>
              </div>
              <p class="donation-description">${donation.description}</p>
              <div class="donation-footer">
                <div class="donation-quantity">
                  ${donation.quantity} ${donation.unit}
                </div>
                <button class="btn btn-primary reserve-btn" data-id="${donation.id}">Reservar</button>
              </div>
            </div>
          `;
          
          donationGrid.appendChild(donationCard);
        }
      });
      
 
      const reserveBtns = document.querySelectorAll('.reserve-btn');
      reserveBtns.forEach(btn => {
        btn.addEventListener('click', function() {
          const donationId = this.getAttribute('data-id');
          reserveDonation(donationId);
        });
      });
    }
    
    displayDonations();
    
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    searchBtn.addEventListener('click', function() {
      const searchTerm = searchInput.value.toLowerCase();
      filterDonations(searchTerm);
    });
    
    searchInput.addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
        const searchTerm = searchInput.value.toLowerCase();
        filterDonations(searchTerm);
      }
    });
    
    function filterDonations(searchTerm) {
      const filteredDonations = donations.filter(donation => {
        return donation.status === 'available' && (
          donation.title.toLowerCase().includes(searchTerm) ||
          donation.description.toLowerCase().includes(searchTerm) ||
          donation.category.toLowerCase().includes(searchTerm)
        );
      });
      
      updateDonationDisplay(filteredDonations);
    }
    
    function updateDonationDisplay(filteredDonations) {
      if (filteredDonations.length === 0) {
        donationGrid.innerHTML = `
          <div class="no-results">
            <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
            <h3>Nenhuma doação encontrada</h3>
            <p>Tente outra busca ou verifique mais tarde.</p>
          </div>
        `;
        return;
      }
      
      donationGrid.innerHTML = '';
      
      filteredDonations.forEach(donation => {

        const expirationDate = new Date(donation.expirationDate);
        const formattedDate = expirationDate.toLocaleDateString('pt-BR');
        

        const donationCard = document.createElement('div');
        donationCard.className = 'donation-card';
        donationCard.innerHTML = `
          <div class="donation-image" style="display: flex; justify-content: center; align-items: center; background-color: #f5f5f5;">
            <i class="fas fa-utensils" style="font-size: 3rem; color: #4CAF50;"></i>
          </div>
          <div class="donation-content">
            <h3 class="donation-title">${donation.title}</h3>
            <div class="donation-meta">
              <i class="fas fa-map-marker-alt"></i>
              <span>${donation.pickupAddress.substring(0, 30)}...</span>
            </div>
            <div class="donation-meta">
              <i class="fas fa-calendar-alt"></i>
              <span>Validade: ${formattedDate}</span>
            </div>
            <p class="donation-description">${donation.description}</p>
            <div class="donation-footer">
              <div class="donation-quantity">
                ${donation.quantity} ${donation.unit}
              </div>
              <button class="btn btn-primary reserve-btn" data-id="${donation.id}">Reservar</button>
            </div>
          </div>
        `;
        
        donationGrid.appendChild(donationCard);
      });
    }
    
 
    const sortSelect = document.getElementById('sort');
    sortSelect.addEventListener('change', function() {
      const sortValue = this.value;
      sortDonations(sortValue);
    });
    
    function sortDonations(sortBy) {
      let sortedDonations = [...donations].filter(d => d.status === 'available');
      
      switch(sortBy) {
        case 'date':
          sortedDonations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'expiration':
          sortedDonations.sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate));
          break;
        case 'distance':
         
          break;
      }
      
      updateDonationDisplay(sortedDonations);
    }
  });
  

  function reserveDonation(donationId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
      document.getElementById('loginModal').style.display = 'block';
      document.getElementById('toastMessage').textContent = 'Você precisa estar logado para reservar uma doação.';
      document.getElementById('toast').classList.add('show');
      setTimeout(() => {
        document.getElementById('toast').classList.remove('show');
      }, 3000);
      return;
    }
    
    if (currentUser.type !== 'ngo') {
      document.getElementById('toastMessage').textContent = 'Apenas ONGs podem reservar doações.';
      document.getElementById('toast').classList.add('show');
      setTimeout(() => {
        document.getElementById('toast').classList.remove('show');
      }, 3000);
      return;
    }
    
    const donations = JSON.parse(localStorage.getItem('donations')) || [];
    const donationIndex = donations.findIndex(d => d.id === donationId);
    
    if (donationIndex >= 0) {
      donations[donationIndex].status = 'reserved';
      
   
      const reservation = {
        id: generateUUID(),
        donationId: donationId,
        ngoId: currentUser.id,
        scheduledDate: new Date(Date.now() + 24*60*60*1000), 
        status: 'scheduled',
        createdAt: new Date()
      };
      

      const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
      reservations.push(reservation);
      
    
      localStorage.setItem('donations', JSON.stringify(donations));
      localStorage.setItem('reservations', JSON.stringify(reservations));
      
      document.getElementById('toastMessage').textContent = 'Doação reservada com sucesso! A coleta foi agendada para amanhã.';
      document.getElementById('toast').classList.add('show');
      setTimeout(() => {
        document.getElementById('toast').classList.remove('show');
        
        window.location.reload();
      }, 3000);
    }
  }
  
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
  }
