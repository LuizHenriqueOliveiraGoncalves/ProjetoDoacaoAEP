document.addEventListener('DOMContentLoaded', function() {
    // Initialize with some sample donations
    initializeSampleData();
    
    // Add donation form functionality would be added here in a real app
    // This would typically be on a separate page after login
    
    // Helper functions for donations
    function createDonation(donationData) {
        // Calculate environmental impact
        const environmentalImpact = calculateEnvironmentalImpact(donationData.quantity);
        
        // Save donation to localStorage
        let donations = JSON.parse(localStorage.getItem('donations')) || [];
        donations.push(donationData);
        localStorage.setItem('donations', JSON.stringify(donations));
        
        // Save environmental impact
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
    
    function calculateEnvironmentalImpact(quantity) {
        // Simple calculation - in a real app this would be more sophisticated
        // based on food type, distance, etc.
        const co2PerKg = 2.5; // kg of CO2 saved per kg of food not wasted
        const waterPerKg = 1000; // liters of water saved per kg of food not wasted
        
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
    
    // Initialize sample data for testing
    function initializeSampleData() {
        // Only add sample data if none exists
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
                    businessType: 'restaurant',
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
                    businessType: 'supermarket',
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
                    expirationDate: new Date(Date.now() + 2*24*60*60*1000), // 2 days from now
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
                    expirationDate: new Date(Date.now() + 3*24*60*60*1000), // 3 days from now
                    pickupAddress: 'Rua Augusta, 500, São Paulo - SP',
                    pickupLatitude: -23.553430,
                    pickupLongitude: -46.647053,
                    deliveryType: 'pickup',
                    status: 'available',
                    createdAt: new Date()
                }
            ];
            
            // Calculate and save environmental impacts
            const sampleImpacts = sampleDonations.map(donation => {
                const impact = calculateEnvironmentalImpact(donation.quantity);
                return {
                    id: generateUUID(),
                    donationId: donation.id,
                    co2Saved: impact.co2Saved,
                    waterSaved: impact.waterSaved,
                    createdAt: new Date()
                };
            });
            
            // Save to localStorage
            const users = [...sampleBusinesses, ...sampleNGOs];
            
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('donations', JSON.stringify(sampleDonations));
            localStorage.setItem('environmentalImpacts', JSON.stringify(sampleImpacts));
            localStorage.setItem('reservations', JSON.stringify([]));
            
            console.log('Sample data initialized');
        }
    }
});
