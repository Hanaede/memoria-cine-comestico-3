document.addEventListener("DOMContentLoaded", () => {
    // Función de throttling para optimizar eventos frecuentes
    function throttle(callback, delay) {
        let lastCall = 0
        return (...args) => {
            const now = new Date().getTime()
            if (now - lastCall < delay) {
                return
            }
            lastCall = now
            return callback(...args)
        }
    }

    // Animación para elementos al hacer scroll
    const animateOnScroll = () => {
        const sections = document.querySelectorAll(".content-block")

        sections.forEach((section) => {
            const sectionTop = section.getBoundingClientRect().top
            const windowHeight = window.innerHeight

            if (sectionTop < windowHeight * 0.75) {
                section.classList.add("in-view")

                // Animar elementos dentro de la sección
                const elements = section.querySelectorAll(
                    ".block-header, .timeline-container, .comites-wrapper, .inscripcion-container, .ponentes-gallery, .organizadores-container",
                )
                elements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add("in-view")
                    }, 100 * index)
                })
            }
        })
    }

    // Ejecutar animación al cargar la página
    setTimeout(animateOnScroll, 500)

    // Ejecutar animación al hacer scroll
    window.addEventListener("scroll", throttle(animateOnScroll, 200))

    // Timeline navigation
    const timelineNavItems = document.querySelectorAll(".timeline-nav-item")
    const timelineDays = document.querySelectorAll(".timeline-day")

    timelineNavItems.forEach((item) => {
        item.addEventListener("click", function () {
            const dayId = this.getAttribute("data-day")

            // Actualizar navegación
            timelineNavItems.forEach((navItem) => navItem.classList.remove("active"))
            this.classList.add("active")

            // Actualizar contenido
            timelineDays.forEach((day) => {
                day.classList.remove("active")
                if (day.id === dayId) {
                    day.classList.add("active")
                }
            })
        })
    })

    // Comités tabs
    const comiteTabs = document.querySelectorAll(".comite-tab")
    const comitePanels = document.querySelectorAll(".comite-panel")

    comiteTabs.forEach((tab) => {
        tab.addEventListener("click", function () {
            const comiteId = this.getAttribute("data-comite")

            // Actualizar tabs
            comiteTabs.forEach((t) => t.classList.remove("active"))
            this.classList.add("active")

            // Actualizar contenido
            comitePanels.forEach((panel) => {
                panel.classList.remove("active")
                if (panel.id === comiteId) {
                    panel.classList.add("active")
                }
            })
        })
    })

    // Ponentes gallery
    const galleryTrack = document.querySelector(".gallery-track")
    const ponenteCards = document.querySelectorAll(".ponente-card")
    const prevButton = document.querySelector(".gallery-arrow.prev")
    const nextButton = document.querySelector(".gallery-arrow.next")
    const paginationCurrent = document.querySelector(".pagination-current")
    const paginationTotal = document.querySelector(".pagination-total")

    if (galleryTrack && ponenteCards.length > 0) {
        let currentSlide = 0
        const totalSlides = ponenteCards.length

        // Actualizar paginación total
        if (paginationTotal) {
            paginationTotal.textContent = totalSlides.toString().padStart(2, "0")
        }

        // Función para actualizar el slider
        const updateGallery = () => {
            // Actualizar posición del track
            galleryTrack.style.transform = `translateX(-${currentSlide * 100}%)`

            // Actualizar paginación
            if (paginationCurrent) {
                paginationCurrent.textContent = (currentSlide + 1).toString().padStart(2, "0")
            }
        }

        // Event listeners para los botones
        if (prevButton) {
            prevButton.addEventListener("click", () => {
                currentSlide = currentSlide > 0 ? currentSlide - 1 : totalSlides - 1
                updateGallery()
            })
        }

        if (nextButton) {
            nextButton.addEventListener("click", () => {
                currentSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0
                updateGallery()
            })
        }

        // Autoplay del slider
        let autoplayInterval

        const startAutoplay = () => {
            autoplayInterval = setInterval(() => {
                currentSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0
                updateGallery()
            }, 5000)
        }

        const stopAutoplay = () => {
            clearInterval(autoplayInterval)
        }

        // Iniciar autoplay
        startAutoplay()

        // Detener autoplay al interactuar
        galleryTrack.addEventListener("mouseenter", stopAutoplay)
        galleryTrack.addEventListener("mouseleave", startAutoplay)
    }

    // Navegación de secciones
    const sectionLinks = document.querySelectorAll(".section-link")
    const sections = document.querySelectorAll(".content-block")

    const updateActiveSection = () => {
        const scrollPosition = window.scrollY

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop - 100
            const sectionHeight = section.offsetHeight

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                sectionLinks.forEach((link) => link.classList.remove("active"))
                if (sectionLinks[index]) {
                    sectionLinks[index].classList.add("active")
                }
            }
        })
    }

    window.addEventListener("scroll", throttle(updateActiveSection, 200))

    sectionLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault()
            const targetId = this.getAttribute("href")
            const targetSection = document.querySelector(targetId)

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: "smooth",
                })
            }
        })
    })

    // Scroll indicator en hero
    const scrollIndicator = document.querySelector(".scroll-indicator")
    if (scrollIndicator) {
        scrollIndicator.addEventListener("click", () => {
            const firstSection = document.getElementById("horario")
            if (firstSection) {
                window.scrollTo({
                    top: firstSection.offsetTop,
                    behavior: "smooth",
                })
            }
        })
    }
})

