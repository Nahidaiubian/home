document.addEventListener("DOMContentLoaded", () => {
    const previewBox = document.getElementById("certificate-preview");
    const iframe = previewBox.querySelector("iframe");

    document.querySelectorAll(".certification-card a").forEach(link => {
        link.addEventListener("mouseenter", () => {
            iframe.src = link.href;
            previewBox.style.display = "block";
        });

        link.addEventListener("mouseleave", () => {
            previewBox.style.display = "none";
            iframe.src = "";
        });
    });
});
