const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("section[id]");

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
        const targetId = anchor.getAttribute("href");
        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

function updateActiveNavLink() {
    let activeId = "";
    const scrollY = window.scrollY;

    sections.forEach((section) => {
        const offset = section.offsetTop - 170;
        const height = section.offsetHeight;
        if (scrollY >= offset && scrollY < offset + height) {
            activeId = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
    });
}

window.addEventListener("scroll", updateActiveNavLink, { passive: true });
window.addEventListener("load", updateActiveNavLink);
