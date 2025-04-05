
document.addEventListener('DOMContentLoaded', function() {
    // Map functionality
    const mapContainer = document.getElementById('map');
    
    if (mapContainer) {
        // Add Google Maps script dynamically
        // In a real application, you would replace YOUR_API_KEY with an actual Google Maps API key
        // loadGoogleMapsScript();
        
        // For demo purposes, we'll create a simple map placeholder
        createMapPlaceholder(mapContainer);
    }
    
    function loadGoogleMapsScript() {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        
        // Global callback function for the Google Maps API
        window.initMap = function() {
            const map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: -23.550520, lng: -46.633308 }, // São Paulo coordinates
                zoom: 12
            });
            
            // Add markers for donations from localStorage
            const donations = JSON.parse(localStorage.getItem('donations')) || [];
            
            donations.forEach(donation => {
                if (donation.status === 'available' && donation.pickupLatitude && donation.pickupLongitude) {
                    const marker = new google.maps.Marker({
                        position: { lat: donation.pickupLatitude, lng: donation.pickupLongitude },
                        map: map,
                        title: donation.title
                    });
                    
                    const infoWindow = new google.maps.InfoWindow({
                        content: `<div><h3>${donation.title}</h3><p>${donation.description}</p><p>Quantidade: ${donation.quantity} ${donation.unit}</p><button onclick="reserveDonation('${donation.id}')">Reservar</button></div>`
                    });
                    
                    marker.addListener('click', function() {
                        infoWindow.open(map, marker);
                    });
                }
            });
        };
    }
    
    function createMapPlaceholder(container) {
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
    
    // Global function to reserve a donation
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
            
            // Create reservation
            const reservation = {
                id: generateUUID(),
                donationId: donationId,
                ngoId: currentUser.id,
                scheduledDate: new Date(Date.now() + 24*60*60*1000), // Schedule for tomorrow
                status: 'scheduled',
                createdAt: new Date()
            };
            
            // Save reservation
            const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
            reservations.push(reservation);
            
            // Update localStorage
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
