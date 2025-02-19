
    document.addEventListener("DOMContentLoaded", function () {
        const servicesSection = document.querySelector(".services");
    
        // Intersection Observer for Fade-in Effect
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    servicesSection.classList.add("fade-in");
                } else {
                    servicesSection.classList.remove("fade-in");
                }
            });
        }, { threshold: 0.3 });
    
        observer.observe(servicesSection);


    });

              // Smooth Scroll on Button Click
              document.querySelector(".cta").addEventListener("click", function() {
            document.querySelector(".services").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });




