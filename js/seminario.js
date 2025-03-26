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
        const sections = document.querySelectorAll(".seminario-section")

        sections.forEach((section) => {
            const sectionTop = section.getBoundingClientRect().top
            const windowHeight = window.innerHeight

            if (sectionTop < windowHeight * 0.75) {
                section.classList.add("in-view")

                // Animar elementos dentro de la sección
                const elements = section.querySelectorAll(
                    ".timeline-tabs, .day-events, .comite-grid, .fechas-grid, .modalidades-grid, .action-buttons, .ponentes-slider, .logos-container",
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

    // Tabs para días del horario
    const dayTabs = document.querySelectorAll(".day-tab")
    const dayContents = document.querySelectorAll(".day-content")

    dayTabs.forEach((tab) => {
        tab.addEventListener("click", function () {
            const dayId = this.getAttribute("data-day")

            // Actualizar tabs
            dayTabs.forEach((t) => t.classList.remove("active"))
            this.classList.add("active")

            // Actualizar contenido
            dayContents.forEach((content) => {
                content.classList.remove("active")
                if (content.id === dayId) {
                    content.classList.add("active")
                }
            })
        })
    })

    // Tabs para comités
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

    // Slider de ponentes
    const sliderTrack = document.querySelector(".ponentes-track")
    const slides = document.querySelectorAll(".ponente-slide")
    const prevButton = document.querySelector(".slider-arrow.prev")
    const nextButton = document.querySelector(".slider-arrow.next")
    const dots = document.querySelectorAll(".slider-dot")

    if (sliderTrack && slides.length > 0) {
        let currentSlide = 0
        const slideWidth = 100 // Porcentaje

        // Función para actualizar el slider
        const updateSlider = () => {
            // Actualizar posición del track
            sliderTrack.style.transform = `translateX(-${currentSlide * slideWidth}%)`

            // Actualizar dots
            dots.forEach((dot, index) => {
                dot.classList.toggle("active", index === currentSlide)
            })
        }

        // Event listeners para los botones
        if (prevButton) {
            prevButton.addEventListener("click", () => {
                currentSlide = currentSlide > 0 ? currentSlide - 1 : slides.length - 1
                updateSlider()
            })
        }

        if (nextButton) {
            nextButton.addEventListener("click", () => {
                currentSlide = currentSlide < slides.length - 1 ? currentSlide + 1 : 0
                updateSlider()
            })
        }

        // Event listeners para los dots
        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                currentSlide = index
                updateSlider()
            })
        })

        // Autoplay del slider
        let autoplayInterval

        const startAutoplay = () => {
            autoplayInterval = setInterval(() => {
                currentSlide = currentSlide < slides.length - 1 ? currentSlide + 1 : 0
                updateSlider()
            }, 5000)
        }

        const stopAutoplay = () => {
            clearInterval(autoplayInterval)
        }

        // Iniciar autoplay
        startAutoplay()

        // Detener autoplay al interactuar
        sliderTrack.addEventListener("mouseenter", stopAutoplay)
        sliderTrack.addEventListener("mouseleave", startAutoplay)

        // Responsive slider
        const updateSlideWidth = () => {
            const windowWidth = window.innerWidth
            let slidesPerView = 1

            if (windowWidth >= 1440) {
                slidesPerView = 3
            } else if (windowWidth >= 1024) {
                slidesPerView = 2
            }

            slides.forEach((slide) => {
                slide.style.minWidth = `${100 / slidesPerView}%`
            })
        }

        // Actualizar al cargar y al cambiar tamaño
        updateSlideWidth()
        window.addEventListener("resize", throttle(updateSlideWidth, 200))
    }

    // Navegación de secciones
    const sectionLinks = document.querySelectorAll(".section-link")
    const sections = document.querySelectorAll(".seminario-section")

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

