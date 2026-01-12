document.addEventListener("DOMContentLoaded", () => {
    const certificatePreview = document.getElementById("certificate-preview");
    const skillsPreview = document.getElementById("skills-preview");
    const previewImg = certificatePreview.querySelector("img");
    const learningOutcomes = skillsPreview.querySelector(".learning-outcomes");
    const coreSkills = skillsPreview.querySelector(".core-skills");
    
    let hideTimer = null;

    document.querySelectorAll(".certificate-link").forEach(link => {
        link.addEventListener("mouseenter", () => {
            clearTimeout(hideTimer);
            
            // Show Certificate Image (Right Side)
            let imageSrc = link.getAttribute("data-preview");
            if (imageSrc) {
                previewImg.src = imageSrc;
                certificatePreview.style.display = "flex";
                requestAnimationFrame(() => {
                    certificatePreview.classList.add("show");
                });
            }
            
            // Show Skills Info (Left Side)
            let skillsData = link.getAttribute("data-skills");
            if (skillsData) {
                let parts = skillsData.split("|");
                let outcomes = parts[0] ? parts[0].replace("Learning Outcomes: ", "") : "N/A";
                let skills = parts[1] ? parts[1].replace("Core Skills: ", "") : "N/A";
                
                learningOutcomes.textContent = outcomes;
                coreSkills.textContent = skills;
                
                skillsPreview.style.display = "block";
                requestAnimationFrame(() => {
                    skillsPreview.classList.add("show");
                });
            }
        });

        link.addEventListener("mouseleave", () => {
            hideTimer = setTimeout(() => {
                certificatePreview.classList.remove("show");
                skillsPreview.classList.remove("show");
                
                setTimeout(() => {
                    certificatePreview.style.display = "none";
                    skillsPreview.style.display = "none";
                    previewImg.src = "";
                }, 200);
            }, 150);
        });
    });

    // Keep previews open when hovering over them
    [certificatePreview, skillsPreview].forEach(preview => {
        preview.addEventListener("mouseenter", () => {
            clearTimeout(hideTimer);
        });

        preview.addEventListener("mouseleave", () => {
            certificatePreview.classList.remove("show");
            skillsPreview.classList.remove("show");
            
            setTimeout(() => {
                certificatePreview.style.display = "none";
                skillsPreview.style.display = "none";
                previewImg.src = "";
            }, 200);
        });
    });
});
