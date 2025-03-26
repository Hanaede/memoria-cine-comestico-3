document.addEventListener('DOMContentLoaded', function() {
    // Función de throttling para optimizar eventos frecuentes
    function throttle(callback, delay) {
        let lastCall = 0;
        return function(...args) {
            const now = new Date().getTime();
            if (now - lastCall < delay) {
                return;
            }
            lastCall = now;
            return callback(...args);
        };
    }

    // Custom cursor
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    const header = document.querySelector('header');
    const body = document.body;

    // Verificar si el dispositivo soporta hover
    const supportsHover = window.matchMedia("(hover: hover)").matches;

    // Deshabilitar cursor personalizado en dispositivos táctiles
    if (!supportsHover) {
        if (cursor) cursor.style.display = 'none';
        if (cursorFollower) cursorFollower.style.display = 'none';

        // Restaurar cursor normal en todos los elementos
        document.querySelectorAll('*').forEach(el => {
            el.style.cursor = 'auto';
        });

        // Configuración para dispositivos móviles
        setupMobileNavigation();

        // IMPORTANTE: Mostrar el contenido en dispositivos móviles
        document.body.classList.add('loaded');
        document.documentElement.classList.add('js-loaded');

        // Inicializar observadores y otros elementos necesarios
        initCommonElements();
        return;
    }

    // Función para inicializar elementos comunes a todos los dispositivos
    function initCommonElements() {
        // Optimizar el Intersection Observer para reducir la carga
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target); // Dejar de observar después de la animación
                }
            });
        }, observerOptions);

        // Observar elementos para animación
        const elementsToAnimate = document.querySelectorAll('.main-title, .section-text, .cta-button, .experimental-image');

        // Función para observar elementos por lotes
        function observeElements() {
            elementsToAnimate.forEach(el => {
                const rect = el.getBoundingClientRect();
                const isNearViewport = rect.top < window.innerHeight * 1.5;

                if (isNearViewport) {
                    el.classList.add('animate-on-scroll');
                    observer.observe(el);
                }
            });
        }

        // Observar elementos iniciales
        observeElements();

        // Configurar evento de scroll throttled
        window.addEventListener('scroll', throttle(observeElements, 300));

        // Efecto parallax para la imagen experimental - Optimizado
        const experimentalImage = document.querySelector('.experimental-image');
        if (experimentalImage) {
            window.addEventListener('scroll', throttle(function() {
                const scrollPosition = window.scrollY;
                const mainImg = experimentalImage.querySelector('.main-img');

                if (mainImg) {
                    // Efecto parallax suave
                    mainImg.style.transform = `scale(1.1) translateY(${scrollPosition * 0.05}px)`;

                    // Efecto de opacidad en el overlay
                    const overlay = experimentalImage.querySelector('.image-overlay');
                    if (overlay) {
                        const opacity = 0.7 - (scrollPosition * 0.001);
                        overlay.style.opacity = Math.max(0.3, opacity);
                    }
                }
            }, 20)); // Throttle a 20ms para mejor rendimiento

            // Efecto de movimiento al mover el ratón - Optimizado
            if (supportsHover) {
                experimentalImage.addEventListener('mousemove', throttle(function(e) {
                    const mainImg = experimentalImage.querySelector('.main-img');
                    if (mainImg) {
                        const xPos = (e.clientX / window.innerWidth - 0.5) * 10;
                        const yPos = (e.clientY / window.innerHeight - 0.5) * 10;

                        mainImg.style.transform = `scale(1.1) translate(${xPos}px, ${yPos}px)`;
                    }
                }, 20));

                // Restaurar posición al salir
                experimentalImage.addEventListener('mouseleave', function() {
                    const mainImg = experimentalImage.querySelector('.main-img');
                    if (mainImg) {
                        mainImg.style.transform = 'scale(1.1)';
                    }
                });
            }
        }

        // Smooth scroll for anchor links - Optimizado
        document.addEventListener('click', function(e) {
            const anchor = e.target.closest('a[href^="#"]');
            if (anchor) {
                e.preventDefault();

                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });

        // Pagination dots functionality - Optimizado con delegación de eventos
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('dot')) {
                const dots = document.querySelectorAll('.dot');
                dots.forEach(d => d.classList.remove('active'));
                e.target.classList.add('active');

                // Here you would add slide functionality if needed
                const index = Array.from(dots).indexOf(e.target);
                console.log('Slide to:', index + 1);
            }
        });
    }

    // Función para configurar la navegación común
    function setupCommonNavigation() {
        // Navigation menu toggle
        const menuButton = document.querySelector('.menu-button');
        const closeButton = document.querySelector('.close-button');
        const mainNav = document.querySelector('.main-nav');

        // Variable para guardar la posición de scroll antes de abrir el menú
        let scrollPosition = 0;

        if (menuButton) {
            menuButton.addEventListener('click', function() {
                // Guardar la posición actual de scroll
                scrollPosition = window.pageYOffset;

                // Añadir clases para abrir el menú y deshabilitar scroll
                mainNav.classList.add('active');
                header.classList.add('menu-open');
                body.classList.add('menu-open');

                // Fijar la posición del body para evitar el scroll
                body.style.top = `-${scrollPosition}px`;
            });
        }

        if (closeButton) {
            closeButton.addEventListener('click', function() {
                // Cerrar el menú
                mainNav.classList.remove('active');
                header.classList.remove('menu-open');
                body.classList.remove('menu-open');

                // Restaurar la posición de scroll
                window.scrollTo(0, scrollPosition);
                body.style.top = '';
            });
        }

        // Make sure social links work
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Para links externos, permitir el comportamiento normal
                console.log('Social link clicked:', this.textContent);
            });
        });

        // Close menu when clicking on a link - Optimizado
        const navLinks = document.querySelectorAll('.main-nav a:not(.social-link)');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Cerrar el menú
                mainNav.classList.remove('active');
                header.classList.remove('menu-open');
                body.classList.remove('menu-open');

                // Restaurar la posición de scroll
                window.scrollTo(0, scrollPosition);
                body.style.top = '';
            });
        });

        // Handle keyboard navigation
        document.addEventListener('keydown', function(e) {
            // Close menu with Escape key
            if (e.key === 'Escape' && mainNav.classList.contains('active')) {
                // Cerrar el menú
                mainNav.classList.remove('active');
                header.classList.remove('menu-open');
                body.classList.remove('menu-open');

                // Restaurar la posición de scroll
                window.scrollTo(0, scrollPosition);
                body.style.top = '';
            }
        });
    }

    // Función específica para dispositivos móviles
    function setupMobileNavigation() {
        // Configuración común
        setupCommonNavigation();
    }

    // Configuración del cursor personalizado (solo para dispositivos con hover)
    if (cursor && cursorFollower) {
        // Set initial position to center of screen to avoid cursor jumping
        cursor.style.left = window.innerWidth / 2 + 'px';
        cursor.style.top = window.innerHeight / 2 + 'px';
        cursorFollower.style.left = window.innerWidth / 2 + 'px';
        cursorFollower.style.top = window.innerHeight / 2 + 'px';

        // Optimizar la función de detección de texto
        function isElementOrParentText(element) {
            // Crear un conjunto de etiquetas de texto para búsqueda más rápida
            const textTags = new Set(['P', 'H1', 'H2', 'H3', 'SPAN', 'A', 'BUTTON']);

            // Check if element is text-containing or interactive
            if (textTags.has(element.tagName) ||
                element.classList.contains('logo') ||
                element.classList.contains('partner-logo')) {
                return true;
            }

            // Check if element has text content
            if (element.textContent && element.textContent.trim() !== '') {
                // Check if this element directly contains text (not just in children)
                for (let node of element.childNodes) {
                    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
                        return true;
                    }
                }
            }

            // Check parent if exists
            if (element.parentElement && element.parentElement !== document.body) {
                return isElementOrParentText(element.parentElement);
            }

            return false;
        }

        // Aplicar throttling a los eventos de mousemove
        document.addEventListener('mousemove', throttle(function(e) {
            // Update cursor position
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';

            // Update follower with slight delay for smooth effect
            setTimeout(function() {
                cursorFollower.style.left = e.clientX + 'px';
                cursorFollower.style.top = e.clientY + 'px';
            }, 50);

            // Check if cursor is over text or interactive elements
            const elementMouseIsOver = document.elementFromPoint(e.clientX, e.clientY);

            if (elementMouseIsOver) {
                // Check if the element or its parent contains text or is interactive
                const isOverText = isElementOrParentText(elementMouseIsOver);

                if (isOverText) {
                    cursor.classList.add('reveal-effect');
                    cursorFollower.classList.add('reveal-effect');
                } else {
                    cursor.classList.remove('reveal-effect');
                    cursorFollower.classList.remove('reveal-effect');
                }
            }
        }, 16)); // 16ms ~ 60fps

        // Variables para el efecto de velocidad del cursor
        let mouseX = 0;
        let mouseY = 0;
        let prevMouseX = 0;
        let prevMouseY = 0;
        let cursorSpeed = 0;

        // Aplicar throttling al segundo evento de mousemove
        document.addEventListener('mousemove', throttle(function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Calculate cursor speed for dynamic effects
            const deltaX = Math.abs(mouseX - prevMouseX);
            const deltaY = Math.abs(mouseY - prevMouseY);
            cursorSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // Apply dynamic scale based on cursor speed
            if (cursorSpeed > 10) {
                cursor.style.transform = `translate(-50%, -50%) scale(${1 + cursorSpeed * 0.01})`;
                setTimeout(() => {
                    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                }, 100);
            }

            prevMouseX = mouseX;
            prevMouseY = mouseY;
        }, 16)); // 16ms ~ 60fps

        // Ensure cursor is visible when menu is open
        const mainNav = document.querySelector('.main-nav');
        if (mainNav) {
            mainNav.addEventListener('mouseenter', function() {
                // Make sure cursor is visible on dark background
                cursor.style.borderColor = '#d13c30';
            });

            mainNav.addEventListener('mouseleave', function() {
                // Reset cursor colors
                cursor.style.borderColor = '';
            });
        }

        // Change cursor on interactive elements - Optimizado con delegación de eventos
        const interactiveSelector = 'a, button, .menu-button, .logo, .partner-logo';
        document.addEventListener('mouseover', function(e) {
            if (e.target.matches(interactiveSelector) || e.target.closest(interactiveSelector)) {
                cursor.classList.add('active');
                cursorFollower.classList.add('active');
            }
        });

        document.addEventListener('mouseout', function(e) {
            if (e.target.matches(interactiveSelector) || e.target.closest(interactiveSelector)) {
                cursor.classList.remove('active');
                cursorFollower.classList.remove('active');
            }
        });
    }

    // Configuración común para todos los dispositivos
    setupCommonNavigation();

    // Inicializar elementos comunes
    initCommonElements();

    // Add page transition effects
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // Prevent flash of unstyled content
    document.documentElement.classList.add('js-loaded');
});