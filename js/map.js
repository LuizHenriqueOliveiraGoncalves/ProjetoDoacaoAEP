// map.js
// Inicializa o mapa Leaflet e mostra marcadores das doações com coordenadas

document.addEventListener("DOMContentLoaded", function () {
  const mapContainer = document.getElementById("map");
  if (!mapContainer) return;

  // Inicializa mapa centrado em coordenadas fixas
  const map = L.map("map").setView([-23.304452, -51.169582], 13);

  // Adiciona camada base OpenStreetMap
  L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  // Cria grupo de marcadores para clusterização
  const markers = L.markerClusterGroup();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("jwtToken");
  const API_BASE_URL = "https://feedthefuturebr-apawdadbdxg7enay.brazilsouth-01.azurewebsites.net/api";

  let endpoint = "";

  // Define endpoint de doações dependendo do tipo do usuário
  if (user && user.type.toLowerCase() === "ngo") {
    endpoint = `${API_BASE_URL}/donation/all`;
  } else if (user) {
    endpoint = `${API_BASE_URL}/donation/MyDonations`;
  } else {
    console.error("Usuário não autenticado ou sem tipo definido.");
    return;
  }

  // Busca doações da API
  fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao buscar as doações");
      return response.json();
    })
    .then((donations) => {
      if (donations.length === 0) {
        console.log("Nenhuma doação encontrada.");
        return;
      }

      // Para cada doação com coordenadas, cria marcador e popup
      donations.forEach((donation) => {
        if (donation.pickupLatitude && donation.pickupLongitude) {
          const marker = L.marker([donation.pickupLatitude, donation.pickupLongitude]);

          marker.bindPopup(`
            <strong>${donation.title}</strong><br>
            ${donation.description}<br>
            ${donation.creatorStreet}, ${donation.creatorNumber}, ${donation.creatorNeighborhood} - ${donation.creatorCity}/${donation.creatorState}
          `);

          markers.addLayer(marker);
        }
      });

      // Adiciona o grupo de marcadores ao mapa
      map.addLayer(markers);
    })
    .catch((error) => {
      console.error("Erro ao carregar as doações:", error);
    });
});
