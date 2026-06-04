/* 
   Munem Shahriar Nijhum - Portfolio Interactivity Script
   Features: Interactive Canvas, Persistent Image Upload, Typing Effect, 
             Project Filters, Resource Bot Finder, Navigation & Scroll Effects.
*/

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. Navigation & Mobile Menu
    // -------------------------------------------------------------
    const header = document.querySelector('header');
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Toggle menu
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Toggle hamburger animation style
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Close menu when clicking link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Scroll styling & active section highlight
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        // Back-to-top button
        const backToTopBtn = document.querySelector('.back-to-top');
        if (backToTopBtn) {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    });

    // -------------------------------------------------------------
    // 2. Typing Effect (Home Section)
    // -------------------------------------------------------------
    const typingSpan = document.getElementById('home-typing');
    if (typingSpan) {
        const roles = [
            "CSE Undergrad at KUET",
            "Software Developer",
            "Competitive Programmer",
            "Hardware & IoT Enthusiast"
        ];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function typeEffect() {
            const currentRole = roles[roleIndex];
            if (isDeleting) {
                typingSpan.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50; // Delete faster
            } else {
                typingSpan.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 120; // Natural typing speed
            }

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                typingSpeed = 2000; // Pause at end of word
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingSpeed = 500; // Pause before starting next word
            }

            setTimeout(typeEffect, typingSpeed);
        }
        setTimeout(typeEffect, 1000);
    }

    // -------------------------------------------------------------
    // 3. Canvas Background - Node Connection / Electronic Circuit Style
    // -------------------------------------------------------------
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let points = [];
        const maxPoints = window.innerWidth < 768 ? 40 : 80;
        const connectionDistance = 120;
        let mouse = { x: null, y: null };

        // Resize Canvas
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initPoints();
        }

        class Point {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 210, 255, 0.4)';
                ctx.fill();
            }
        }

        function initPoints() {
            points = [];
            for (let i = 0; i < maxPoints; i++) {
                points.push(new Point());
            }
        }

        function drawConnections() {
            for (let i = 0; i < points.length; i++) {
                for (let j = i + 1; j < points.length; j++) {
                    const distX = points[i].x - points[j].x;
                    const distY = points[i].y - points[j].y;
                    const distance = Math.sqrt(distX * distX + distY * distY);

                    if (distance < connectionDistance) {
                        const alpha = (1 - (distance / connectionDistance)) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(points[i].x, points[i].y);
                        ctx.lineTo(points[j].x, points[j].y);
                        ctx.strokeStyle = `rgba(0, 210, 255, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }

                // Connect to mouse
                if (mouse.x !== null && mouse.y !== null) {
                    const distMouseX = points[i].x - mouse.x;
                    const distMouseY = points[i].y - mouse.y;
                    const distMouse = Math.sqrt(distMouseX * distMouseX + distMouseY * distMouseY);

                    if (distMouse < 180) {
                        const alpha = (1 - (distMouse / 180)) * 0.25;
                        ctx.beginPath();
                        ctx.moveTo(points[i].x, points[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = `rgba(100, 255, 218, ${alpha})`;
                        ctx.lineWidth = 1.2;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            points.forEach(point => {
                point.update();
                point.draw();
            });

            drawConnections();
            requestAnimationFrame(animateCanvas);
        }

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        resizeCanvas();
        animateCanvas();
    }

    // -------------------------------------------------------------
    // 4. Passport Photo Upload & LocalStorage Persistence
    // -------------------------------------------------------------
    const photoFrame = document.getElementById('passport-photo-frame');
    const fileInput = document.getElementById('passport-file-input');
    const imageWrapper = document.getElementById('uploaded-image-wrapper');
    const previewImg = document.getElementById('photo-preview');
    const removeBtn = document.getElementById('remove-photo-btn');

    // Check if photo exists in LocalStorage
    const storedPhoto = localStorage.getItem('passport_photo');
    if (storedPhoto) {
        previewImg.src = storedPhoto;
        imageWrapper.classList.add('active');
    }

    // Trigger file dialog
    if (photoFrame && fileInput) {
        photoFrame.addEventListener('click', (e) => {
            // Prevent click loop if clicking buttons inside the overlay
            if (e.target.closest('#remove-photo-btn') || e.target.closest('.photo-overlay span')) {
                return;
            }
            fileInput.click();
        });
    }

    // Read and save file
    function handlePhoto(file) {
        if (!file.type.startsWith('image/')) {
            showToast('Please upload an image file.', 'error');
            return;
        }
        
        // 5MB Limit
        if (file.size > 5 * 1024 * 1024) {
            showToast('Image size should be less than 5MB.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            previewImg.src = dataUrl;
            imageWrapper.classList.add('active');
            try {
                localStorage.setItem('passport_photo', dataUrl);
                showToast('Passport photo submitted successfully!', 'success');
            } catch (err) {
                console.error("Local storage error:", err);
                showToast('Photo uploaded, but size too large to save locally.', 'warning');
            }
        };
        reader.readAsDataURL(file);
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                handlePhoto(e.target.files[0]);
            }
        });
    }

    // Drag and Drop
    if (photoFrame) {
        ['dragenter', 'dragover'].forEach(eventName => {
            photoFrame.addEventListener(eventName, (e) => {
                e.preventDefault();
                photoFrame.classList.add('dragover');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            photoFrame.addEventListener(eventName, (e) => {
                e.preventDefault();
                photoFrame.classList.remove('dragover');
            }, false);
        });

        photoFrame.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files && files[0]) {
                handlePhoto(files[0]);
            }
        }, false);
    }

    // Remove photo
    if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            localStorage.removeItem('passport_photo');
            imageWrapper.classList.remove('active');
            previewImg.src = '';
            if (fileInput) fileInput.value = '';
            showToast('Passport photo removed.', 'success');
        });
    }

    // -------------------------------------------------------------
    // 5. Skills Grid Tab Switcher & Progress Animation
    // -------------------------------------------------------------
    const skillTabBtns = document.querySelectorAll('.skill-tab-btn');
    const skillPanels = document.querySelectorAll('.skills-panel');

    function animateSkillBars(panel) {
        const bars = panel.querySelectorAll('.skill-bar-inner');
        bars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-percent') + '%';
            bar.style.width = targetWidth;
        });
    }

    // Reset other bars to 0% width so they re-animate when clicked
    function resetSkillBars(panel) {
        const bars = panel.querySelectorAll('.skill-bar-inner');
        bars.forEach(bar => {
            bar.style.width = '0';
        });
    }

    skillTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            skillTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            skillPanels.forEach(panel => {
                if (panel.getAttribute('id') === `skills-${targetTab}`) {
                    panel.classList.add('active');
                    setTimeout(() => animateSkillBars(panel), 100);
                } else {
                    panel.classList.remove('active');
                    resetSkillBars(panel);
                }
            });
        });
    });

    // Initial load: trigger animation for the active tab (first one)
    const initialActivePanel = document.querySelector('.skills-panel.active');
    if (initialActivePanel) {
        setTimeout(() => animateSkillBars(initialActivePanel), 500);
    }

    // -------------------------------------------------------------
    // 6. Projects Filtering System
    // -------------------------------------------------------------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all') {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeIn 0.4s ease forwards';
                } else {
                    if (card.classList.contains(filterValue)) {
                        card.classList.remove('hidden');
                        card.style.animation = 'fadeIn 0.4s ease forwards';
                    } else {
                        card.classList.add('hidden');
                    }
                }
            });
        });
    });

    // -------------------------------------------------------------
    // 7. Interactive Resources Hub (KUET CSE Telegram Bot simulation)
    // -------------------------------------------------------------
    const resourceSearch = document.getElementById('resource-search-input');
    const searchBtn = document.getElementById('resource-search-btn');
    const tgBody = document.getElementById('telegram-chat-body');
    const resourcesList = document.getElementById('resources-list-items');

    const resourceDb = [
        { name: "CSE-22 Term CT Questions (All Terms)", category: "questions", link: "#", isDownloaded: false },
        { name: "Class Routines & Syllabi (Odd/Even Semesters)", category: "routine", link: "#", isDownloaded: false },
        { name: "Microprocessor & Hardware Project Source Files", category: "project", link: "#", isDownloaded: false },
        { name: "Logisim 5-Storey Lift Circuit Designs", category: "project", link: "#", isDownloaded: false },
        { name: "KUET CSE-22 Batchmates Detailed Directory", category: "info", link: "#", isDownloaded: false },
        { name: "Data Structures & Competitive Programming Routines", category: "study", link: "#", isDownloaded: false },
        { name: "20-Bit Mini Computer Architecture Specifications", category: "project", link: "#", isDownloaded: false },
        { name: "Numerical Calculator Algorithms C++ Module Files", category: "project", link: "#", isDownloaded: false }
    ];

    function formatTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function addTelegramMessage(text, isUser = false) {
        const time = formatTime();
        const msgHtml = `
            <div class="tg-msg" style="${isUser ? 'justify-content: flex-end;' : ''}">
                ${!isUser ? '<div class="tg-msg-avatar">Bot</div>' : ''}
                <div class="tg-bubble" style="${isUser ? 'background: rgba(0, 136, 204, 0.4); border-radius: 12px 12px 0px 12px; margin-left: auto;' : ''}">
                    <p>${text}</p>
                    <span>${time}</span>
                </div>
            </div>
        `;
        tgBody.insertAdjacentHTML('beforeend', msgHtml);
        tgBody.scrollTop = tgBody.scrollHeight;
    }

    function renderResources(items) {
        resourcesList.innerHTML = '';
        if (items.length === 0) {
            resourcesList.innerHTML = `
                <div class="resource-item" style="justify-content: center; color: var(--text-muted);">
                    No resources found matching the query.
                </div>
            `;
            return;
        }

        items.forEach(item => {
            const itemHtml = `
                <div class="resource-item">
                    <div class="resource-info">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                        <div>
                            <div class="resource-name">${item.name}</div>
                            <div class="resource-category">${item.category}</div>
                        </div>
                    </div>
                    <a href="${item.link}" class="resource-download-btn" title="Download Resource">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    </a>
                </div>
            `;
            resourcesList.insertAdjacentHTML('beforeend', itemHtml);
        });

        // Add download click event simulation
        const downloadBtns = resourcesList.querySelectorAll('.resource-download-btn');
        downloadBtns.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const matchedItemName = items[index].name;
                addTelegramMessage(`Simulating download request for: <b>${matchedItemName}</b>...`);
                setTimeout(() => {
                    addTelegramMessage(`✅ Successfully prepared download package for ${matchedItemName}. Ready for download.`, false);
                    showToast('Download started (Simulated)', 'success');
                }, 800);
            });
        });
    }

    function searchResources() {
        const query = resourceSearch.value.trim().toLowerCase();
        if (query === '') return;

        addTelegramMessage(`Search: "${query}"`, true);
        
        setTimeout(() => {
            const filtered = resourceDb.filter(item => 
                item.name.toLowerCase().includes(query) || 
                item.category.toLowerCase().includes(query)
            );
            
            renderResources(filtered);
            addTelegramMessage(`Found ${filtered.length} matching resources. Resources updated in the finder module.`, false);
        }, 500);
    }

    if (searchBtn && resourceSearch) {
        searchBtn.addEventListener('click', searchResources);
        resourceSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchResources();
            }
        });
    }

    // Initialize Resource list
    if (resourcesList) {
        renderResources(resourceDb);
    }

    // -------------------------------------------------------------
    // 8. Contact Form Handling
    // -------------------------------------------------------------
    const contactForm = document.getElementById('portfolio-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const subject = document.getElementById('contact-subject').value.trim();
            const message = document.getElementById('contact-message').value.trim();

            if (!name || !email || !subject || !message) {
                showToast('All form fields are required.', 'error');
                return;
            }

            // Simple Email Regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showToast('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate sending message
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Transmission in progress...';
            submitBtn.disabled = true;

            setTimeout(() => {
                showToast(`Transmission complete. Thank you ${name}!`, 'success');
                contactForm.reset();
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // -------------------------------------------------------------
    // 9. Custom Notification Toast System
    // -------------------------------------------------------------
    function showToast(message, type = 'success') {
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let iconSvg = '';
        if (type === 'success') {
            iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        } else if (type === 'error') {
            iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
        } else {
            iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
        }

        toast.innerHTML = `
            ${iconSvg}
            <span>${message}</span>
        `;
        toastContainer.appendChild(toast);

        // Slide out and remove toast
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse forwards';
            setTimeout(() => {
                toast.remove();
                if (toastContainer.children.length === 0) {
                    toastContainer.remove();
                }
            }, 300);
        }, 3500);
    }
});

// Back to top helper execution
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
