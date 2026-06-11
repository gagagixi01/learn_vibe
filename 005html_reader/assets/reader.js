const button = document.querySelector(".menu-button");
const sidebar = document.querySelector("#sidebar");

if (button && sidebar) {
  button.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
}
