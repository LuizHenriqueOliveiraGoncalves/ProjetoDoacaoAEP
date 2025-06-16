document.addEventListener("DOMContentLoaded", function () {
  const mapContainer = document.getElementById("map");
  if (!mapContainer) return;

  const map = L.map("map").setView([-23.304452, -51.169582], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  const markers = L.markerClusterGroup();  // ✅ Grupo para clusterização

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("jwtToken");
  const API_BASE_URL = "https://localhost:7261/api";

  let endpoint = "";

  if (user && user.type.toLowerCase() === "ngo") {
    endpoint = `${API_BASE_URL}/donation/all`;
  } else if (user) {
    endpoint = `${API_BASE_URL}/donation/MyDonations`;
  } else {
    console.error("Usuário não autenticado ou sem tipo definido.");
    return;
  }

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

      donations.forEach((donation) => {
        if (donation.pickupLatitude && donation.pickupLongitude) {
          const marker = L.marker([donation.pickupLatitude, donation.pickupLongitude]);

          marker.bindPopup(`
            <strong>${donation.title}</strong><br>
            ${donation.description}<br>
            ${donation.creatorStreet}, ${donation.creatorNumber}, ${donation.creatorNeighborhood} - ${donation.creatorCity}/${donation.creatorState}
          `);

          markers.addLayer(marker);  // ✅ Adiciona cada marker ao cluster
        }
      });

      map.addLayer(markers);  // ✅ Adiciona o grupo ao mapa
    })
    .catch((error) => {
      console.error("Erro ao carregar as doações:", error);
    });
});
