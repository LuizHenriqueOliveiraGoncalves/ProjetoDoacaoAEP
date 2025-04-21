
document.addEventListener('DOMContentLoaded', function() {
    // Funcionalidades do mapa
    const mapContainer = document.getElementById('map');
    
    if (mapContainer) {
       //Geolocalização
       CriacaMapaPlac(mapContainer);
    }
    
// Geolocalização
    /*
    function loadGoogleMapsScript() {
      
    }*/
    
    function CriacaMapaPlac(container) {
        container.innerHTML = `
            <div style="height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #f5f5f5; border-radius: 8px;">
                <i class="fas fa-map-marked-alt" style="font-size: 3rem; color: #4CAF50; margin-bottom: 1rem;"></i>
                <h3 style="margin-bottom: 0.5rem;">Mapa de doações</h3>
                <p style="color: #666; text-align: center;">Este é um espaço reservado para o mapa. No aplicativo real, um mapa interativo mostraria as doações próximas.</p>
                <button class="btn btn-primary" style="margin-top: 1rem;" id="viewDonationsBtn">Ver Doações Disponíveis</button>
            </div>
        `;
        
        // Add click handler for the button
        const viewDonationsBtn = document.getElementById('viewDonationsBtn');
        if (viewDonationsBtn) {
            viewDonationsBtn.addEventListener('click', function() {
                const donations = JSON.parse(localStorage.getItem('donations')) || [];
                const availableDonations = donations.filter(d => d.status === 'available');
                
                if (availableDonations.length > 0) {
                    alert(`Há ${availableDonations.length} doações disponíveis na sua região.`);
                } else {
                    alert('Não há doações disponíveis no momento.');
                }
            });
        }
    }
    
    // Funcao global para reservar doação
    window.reserveDonation = function(donationId) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (!currentUser) {
            alert('Você precisa estar logado para reservar uma doação.');
            document.getElementById('loginModal').style.display = 'block';
            return;
        }
        
        if (currentUser.type !== 'ngo') {
            alert('Apenas ONGs podem reservar doações.');
            return;
        }
        
        const donations = JSON.parse(localStorage.getItem('donations')) || [];
        const donationIndex = donations.findIndex(d => d.id === donationId);
        
        if (donationIndex >= 0) {
            donations[donationIndex].status = 'reserved';
            
            // Criacao da reserva
            const reservation = {
                id: generateUUID(),
                donationId: donationId,
                ngoId: currentUser.id,
                scheduledDate: new Date(Date.now() + 24*60*60*1000),
                status: 'scheduled',
                createdAt: new Date()
            };
            
            // Reserva a doação
            const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
            reservations.push(reservation);
            
            // Atualiza o localStorage
            localStorage.setItem('donations', JSON.stringify(donations));
            localStorage.setItem('reservations', JSON.stringify(reservations));
            
            alert('Doação reservada com sucesso! A coleta foi agendada para amanhã.');
        }
    };
    
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
});
