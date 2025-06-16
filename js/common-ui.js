function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");
  const toastIcon = toast.querySelector(".toast-content i");

  toast.classList.remove("success", "error", "info", "show");
  toastIcon.className = "";

  toastMessage.textContent = message;

  if (type === "success") {
    toast.classList.add("success");
    toastIcon.classList.add("fas", "fa-check-circle");
  } else if (type === "error") {
    toast.classList.add("error");
    toastIcon.classList.add("fas", "fa-times-circle");
  } else if (type === "info") {
    toast.classList.add("info");
    toastIcon.classList.add("fas", "fa-info-circle");
  }

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2100);
}

function showUserProfile(user) {
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const userProfile = document.getElementById("userProfile");
  const userName = document.getElementById("userName");

  if (loginBtn) loginBtn.parentElement.style.display = "none";
  if (registerBtn) registerBtn.parentElement.style.display = "none";

  if (userProfile) {
    userProfile.style.display = "flex";
    if (userName) {
      userName.textContent = user.name || user.email.split("@")[0];
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const jwtToken = localStorage.getItem("jwtToken");
  const userData = localStorage.getItem("user");
  if (jwtToken && userData) {
    showUserProfile(JSON.parse(userData));
  }
});

document.getElementById("logoutBtn")?.addEventListener("click", function (e) {
  e.preventDefault();
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("user");
  window.location.reload();
});

