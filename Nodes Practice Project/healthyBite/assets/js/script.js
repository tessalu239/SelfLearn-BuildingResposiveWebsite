const scrollEffect = () => {
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.classList.add("bg-transfer");
    } else {
      navbar.classList.remove("bg-transfer");
    }
  });
};
document.addEventListener("DOMContentLoaded", scrollEffect);
