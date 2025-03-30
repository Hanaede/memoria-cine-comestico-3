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
        const sections = document.querySelectorAll(".content-section")

        sections.forEach((section) => {
            const sectionTop = section.getBoundingClientRect().top
            const windowHeight = window.innerHeight

            if (sectionTop < windowHeight * 0.75) {
                section.classList.add("in-view")
            }
        })
    }

    // Ejecutar animación al cargar la página
    setTimeout(animateOnScroll, 500)

    // Ejecutar animación al hacer scroll
    window.addEventListener("scroll", throttle(animateOnScroll, 200))

    // Navegación del programa - Mejorado con efectos visuales
    const dayItems = document.querySelectorAll(".day-item")
    const dayContents = document.querySelectorAll(".day-content")

    // Función para navegar entre días
    const navigateDay = (direction) => {
        // Encontrar el día activo actual
        let activeIndex = 0
        dayItems.forEach((item, index) => {
            if (item.classList.contains("active")) {
                activeIndex = index
            }
        })

        // Calcular el nuevo índice
        let newIndex
        if (direction === "next") {
            newIndex = (activeIndex + 1) % dayItems.length
        } else {
            newIndex = (activeIndex - 1 + dayItems.length) % dayItems.length
        }

        // Activar el nuevo día
        dayItems.forEach((item) => item.classList.remove("active"))
        dayItems[newIndex].classList.add("active")

        // Actualizar contenido
        dayContents.forEach((day) => day.classList.remove("active"))
        dayContents[newIndex].classList.add("active")
    }

    // Añadir navegación con flechas para móvil
    const createDayNavigation = () => {
        const programDays = document.querySelector(".program-days")

        if (programDays && !document.querySelector(".day-nav-arrows")) {
            const navArrows = document.createElement("div")
            navArrows.className = "day-nav-arrows"

            const prevButton = document.createElement("button")
            prevButton.className = "day-nav-arrow prev"
            prevButton.innerHTML = '<span class="arrow-indicator"></span>'
            prevButton.addEventListener("click", () => navigateDay("prev"))

            const nextButton = document.createElement("button")
            nextButton.className = "day-nav-arrow next"
            nextButton.innerHTML = '<span class="arrow-indicator"></span>'
            nextButton.addEventListener("click", () => navigateDay("next"))

            navArrows.appendChild(prevButton)
            navArrows.appendChild(nextButton)

            programDays.appendChild(navArrows)
        }
    }

    // Crear navegación de días al cargar
    createDayNavigation()

    dayItems.forEach((item) => {
        item.addEventListener("click", function () {
            const dayId = this.getAttribute("data-day")

            // Añadir efecto de pulsación al hacer clic
            this.style.transform = "scale(0.95)"
            setTimeout(() => {
                this.style.transform = ""
            }, 150)

            // Actualizar navegación
            dayItems.forEach((navItem) => navItem.classList.remove("active"))
            this.classList.add("active")

            // Actualizar contenido con animación
            dayContents.forEach((day) => {
                if (day.classList.contains("active")) {
                    day.style.opacity = "0"
                    setTimeout(() => {
                        day.classList.remove("active")
                        if (day.id === dayId) {
                            day.classList.add("active")
                            setTimeout(() => {
                                day.style.opacity = "1"
                            }, 50)
                        }
                    }, 300)
                } else if (day.id === dayId) {
                    day.classList.add("active")
                    day.style.opacity = "0"
                    setTimeout(() => {
                        day.style.opacity = "1"
                    }, 50)
                }
            })
        })
    })

    // Tabs para comités
    const tabButtons = document.querySelectorAll(".tab-button")
    const tabPanels = document.querySelectorAll(".tab-panel")

    tabButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const tabId = this.getAttribute("data-tab")

            // Actualizar botones
            tabButtons.forEach((btn) => btn.classList.remove("active"))
            this.classList.add("active")

            // Actualizar paneles
            tabPanels.forEach((panel) => {
                panel.classList.remove("active")
                if (panel.id === tabId) {
                    panel.classList.add("active")
                }
            })
        })
    })

    // Navegación de ponentes
    const speakerSlides = document.querySelectorAll(".speaker-slide")
    const prevButton = document.querySelector(".nav-arrow.prev")
    const nextButton = document.querySelector(".nav-arrow.next")
    const speakerDots = document.querySelectorAll(".speaker-dot")
    const currentSlideElement = document.querySelector(".current-slide")

    let currentSlideIndex = 0
    const totalSlides = speakerSlides.length

    // Función para actualizar el slide activo
    const updateActiveSlide = (index) => {
        // Ocultar todos los slides
        speakerSlides.forEach((slide) => {
            slide.classList.remove("active")
        })

        // Mostrar el slide actual
        speakerSlides[index].classList.add("active")

        // Actualizar dots
        speakerDots.forEach((dot) => {
            dot.classList.remove("active")
        })
        speakerDots[index].classList.add("active")

        // Actualizar contador
        currentSlideElement.textContent = index < 9 ? `0${index + 1}` : `${index + 1}`
    }

    // Event listeners para los botones de navegación
    prevButton.addEventListener("click", () => {
        currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides
        updateActiveSlide(currentSlideIndex)
    })

    nextButton.addEventListener("click", () => {
        currentSlideIndex = (currentSlideIndex + 1) % totalSlides
        updateActiveSlide(currentSlideIndex)
    })

    // Event listeners para los dots
    speakerDots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            currentSlideIndex = index
            updateActiveSlide(currentSlideIndex)
        })
    })

    // Añadir después del código de navegación de ponentes

    // Navegación de comités (similar a la de ponentes)
    function setupCommitteeNavigation(tabId) {
        const committeeSlides = document.querySelectorAll(`#${tabId} .committee-slide`)
        const prevButton = document.querySelector(`#${tabId} .committee-prev`)
        const nextButton = document.querySelector(`#${tabId} .committee-next`)
        const committeeDots = document.querySelectorAll(`#${tabId} .committee-dot`)
        const currentSlideElement = document.querySelector(`#${tabId} .current-committee`)
        const totalSlidesElement = document.querySelector(`#${tabId} .total-committees`)
        const slidesContainer = document.querySelector(`#${tabId} .committee-slides`)

        if (!committeeSlides.length) return

        let currentSlideIndex = 0
        const totalSlides = committeeSlides.length

        // Actualizar el contador total
        if (totalSlidesElement) {
            totalSlidesElement.textContent = `/ ${totalSlides < 10 ? "0" + totalSlides : totalSlides}`
        }

        // Encontrar la altura máxima de los slides para fijarla
        let maxHeight = 0
        committeeSlides.forEach((slide) => {
            const slideHeight = slide.offsetHeight
            if (slideHeight > maxHeight) {
                maxHeight = slideHeight
            }
        })

        // Aplicar la altura máxima al contenedor de slides
        if (slidesContainer && maxHeight > 0) {
            slidesContainer.style.minHeight = `${maxHeight}px`
        }

        // Función para actualizar el slide activo
        const updateActiveSlide = (index) => {
            // Ocultar todos los slides
            committeeSlides.forEach((slide) => {
                slide.classList.remove("active")
                slide.style.opacity = "0"
                slide.style.position = "absolute"
                slide.style.top = "0"
                slide.style.left = "0"
                slide.style.width = "100%"
            })

            // Mostrar el slide actual
            committeeSlides[index].classList.add("active")
            committeeSlides[index].style.position = "relative"
            setTimeout(() => {
                committeeSlides[index].style.opacity = "1"
            }, 50)

            // Actualizar dots
            committeeDots.forEach((dot) => {
                dot.classList.remove("active")
            })
            committeeDots[index].classList.add("active")

            // Actualizar contador
            if (currentSlideElement) {
                currentSlideElement.textContent = index < 9 ? `0${index + 1}` : `${index + 1}`
            }
        }

        // Inicializar el primer slide
        updateActiveSlide(currentSlideIndex)

        // Event listeners para los botones de navegación
        if (prevButton) {
            prevButton.addEventListener("click", () => {
                currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides
                updateActiveSlide(currentSlideIndex)
            })
        }

        if (nextButton) {
            nextButton.addEventListener("click", () => {
                currentSlideIndex = (currentSlideIndex + 1) % totalSlides
                updateActiveSlide(currentSlideIndex)
            })
        }

        // Event listeners para los dots
        committeeDots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                currentSlideIndex = index
                updateActiveSlide(currentSlideIndex)
            })
        })
    }

    // Inicializar la navegación para cada panel de comité cuando se cambia de tab
    tabButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const tabId = this.getAttribute("data-tab")

            // Inicializar la navegación del comité después de cambiar de tab
            setTimeout(() => {
                setupCommitteeNavigation(tabId)
            }, 100)
        })
    })

    // Inicializar la navegación para el panel activo al cargar la página
    document.addEventListener("DOMContentLoaded", () => {
        const activeTab = document.querySelector(".tab-button.active")
        if (activeTab) {
            const tabId = activeTab.getAttribute("data-tab")
            setupCommitteeNavigation(tabId)
        }
    })

    // Inicializar todos los comités al cargar
    setupCommitteeNavigation("cientifico")
    setupCommitteeNavigation("organizador")
    setupCommitteeNavigation("tecnico")

    // Scroll suave para enlaces internos
    const scrollLinks = document.querySelectorAll('a[href^="#"]')

    scrollLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault()

            const targetId = this.getAttribute("href")
            if (targetId === "#") return

            const targetElement = document.querySelector(targetId)
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: "smooth",
                })
            }
        })
    })

    // Scroll indicator en hero
    const scrollIndicator = document.querySelector(".scroll-indicator")
    if (scrollIndicator) {
        scrollIndicator.addEventListener("click", () => {
            const firstSection = document.querySelector(".intro-section")
            if (firstSection) {
                window.scrollTo({
                    top: firstSection.offsetTop,
                    behavior: "smooth",
                })
            }
        })
    }

    // Efecto hover para botones
    const buttons = document.querySelectorAll(".primary-button, .cta-button")

    buttons.forEach((button) => {
        button.addEventListener("mouseenter", function () {
            this.style.transform = "translateY(-3px)"
            this.style.transition = "transform 0.3s ease"
        })

        button.addEventListener("mouseleave", function () {
            this.style.transform = "translateY(0)"
        })
    })

    // Efecto hover para miembros del comité
    const committeeMembers = document.querySelectorAll(".committee-creative-member")

    committeeMembers.forEach((member) => {
        member.addEventListener("mouseenter", function () {
            this.style.transform = "translateY(-10px)"
            this.style.transition = "transform 0.3s ease"
        })

        member.addEventListener("mouseleave", function () {
            this.style.transform = "translateY(0)"
        })
    })

    // Efecto hover para los selectores de días
    const daySelectors = document.querySelectorAll(".day-selector")

    daySelectors.forEach((selector) => {
        selector.addEventListener("mouseenter", function () {
            if (!this.parentElement.classList.contains("active")) {
                this.style.transform = "translateY(-3px)"
                this.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)"
            }
        })

        selector.addEventListener("mouseleave", function () {
            if (!this.parentElement.classList.contains("active")) {
                this.style.transform = ""
                this.style.boxShadow = ""
            }
        })
    })

    // Función para manejar la navegación de comités en móvil
    const setupMobileCommitteeNavigation = () => {
        if (window.innerWidth <= 829) {
            const committeeGrids = document.querySelectorAll('.committee-creative-grid')

            committeeGrids.forEach(grid => {
                if (!grid.querySelector('.committee-mobile-nav')) {
                    const members = grid.querySelectorAll('.committee-creative-member')
                    if (members.length <= 1) return

                    // Crear navegación móvil
                    const mobileNav = document.createElement('div')
                    mobileNav.className = 'committee-mobile-nav'

                    const prevBtn = document.createElement('button')
                    prevBtn.className = 'committee-mobile-prev'
                    prevBtn.innerHTML = '<span class="arrow-indicator"></span>'

                    const nextBtn = document.createElement('button')
                    nextBtn.className = 'committee-mobile-next'
                    nextBtn.innerHTML = '<span class="arrow-indicator"></span>'

                    mobileNav.appendChild(prevBtn)
                    mobileNav.appendChild(nextBtn)

                    grid.appendChild(mobileNav)

                    // Configurar navegación
                    let currentMemberIndex = 0

                    const updateActiveMember = (index) => {
                        members.forEach(member => {
                            member.style.display = 'none'
                        })
                        members[index].style.display = 'flex'
                    }

                    prevBtn.addEventListener('click', () => {
                        currentMemberIndex = (currentMemberIndex - 1 + members.length) % members.length
                        updateActiveMember(currentMemberIndex)
                    })

                    nextBtn.addEventListener('click', () => {
                        currentMemberIndex = (currentMemberIndex + 1) % members.length
                        updateActiveMember(currentMemberIndex)
                    })

                    // Inicializar
                    updateActiveMember(0)
                }
            })
        }
    }

    // Ejecutar al cargar y al cambiar el tamaño de la ventana
    setupMobileCommitteeNavigation()
    window.addEventListener('resize', setupMobileCommitteeNavigation)

})
