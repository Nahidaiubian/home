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

const revealTargets = document.querySelectorAll(
    ".main-content > section, .research-item, .score-card, .expertise-category, .interest-item"
);

revealTargets.forEach((item) => item.classList.add("reveal-ready"));

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealTargets.forEach((item) => revealObserver.observe(item));
} else {
    revealTargets.forEach((item) => item.classList.add("is-visible"));
}
