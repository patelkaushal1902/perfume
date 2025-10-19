document.addEventListener('DOMContentLoaded', () => {
    // Cart Functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCartUI() {
        const cartItems = document.querySelector('.cart-items');
        const cartTotal = document.querySelector('.cart-total');
        const cartCount = document.querySelector('.cart-count');
        if (!cartItems) return;
        cartItems.innerHTML = '';

        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>$${item.price} x <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="quantity-input"></p>
                </div>
                <button class="remove-item" data-id="${item.id}">Remove</button>
            `;
            cartItems.appendChild(cartItem);
        });

        cartTotal.textContent = `Total: $${total.toFixed(2)}`;
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Add to Cart
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.product-card');
            const item = {
                id: card.dataset.id,
                name: card.dataset.name,
                price: parseFloat(card.dataset.price),
                image: card.dataset.image,
                quantity: 1
            };

            const existingItem = cart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push(item);
            }

            updateCartUI();
            gsap.to(button, { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 });
        });
    });

    // Cart Icon Click
    document.querySelector('.cart-icon').addEventListener('click', () => {
        document.querySelector('.cart-modal').style.display = 'flex';
        gsap.from('.cart-content', { y: 100, opacity: 0, duration: 0.5, ease: 'power3.out' });
    });

    // Close Cart
    document.querySelector('.close-cart').addEventListener('click', () => {
        gsap.to('.cart-content', {
            y: 100,
            opacity: 0,
            duration: 0.5,
            ease: 'power3.in',
            onComplete: () => {
                document.querySelector('.cart-modal').style.display = 'none';
            }
        });
    });

    // Remove Item
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item')) {
            const id = e.target.dataset.id;
            cart = cart.filter(item => item.id !== id);
            updateCartUI();
        }
    });

    // Quantity Change
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('quantity-input')) {
            const id = e.target.dataset.id;
            const quantity = parseInt(e.target.value);
            const item = cart.find(item => item.id === id);
            if (item && quantity > 0) {
                item.quantity = quantity;
                updateCartUI();
            } else if (item && quantity <= 0) {
                cart = cart.filter(cartItem => cartItem.id !== id);
                updateCartUI();
            }
        }
    });

    // Checkout Button
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        document.querySelector('.cart-modal').style.display = 'none';
        document.querySelector('.checkout-modal').style.display = 'flex';
        gsap.from('.checkout-content', { y: 100, opacity: 0, duration: 0.5, ease: 'power3.out' });
    });

    // Close Checkout
    document.querySelector('.close-checkout').addEventListener('click', () => {
        gsap.to('.checkout-content', {
            y: 100,
            opacity: 0,
            duration: 0.5,
            ease: 'power3.in',
            onComplete: () => {
                document.querySelector('.checkout-modal').style.display = 'none';
            }
        });
    });

    // Checkout Form Submission (Simulated Payment)
    document.getElementById('checkout-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Payment successful! Your fragrances will be delivered soon.');
        cart = [];
        updateCartUI();
        document.querySelector('.checkout-modal').style.display = 'none';
        e.target.reset();
    });

    // Product Filtering
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            document.querySelectorAll('.product-card').forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('hidden');
                    gsap.fromTo(card, 
                        { opacity: 0, y: 50 }, 
                        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
                    );
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // Contact Form Submission
    document.querySelector('#contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = e.target.querySelector('input[type="text"]').value;
        const email = e.target.querySelector('input[type="email"]').value;
        if (name && email) {
            alert('Message sent! Our perfumery team will respond within 24 hours.');
            e.target.reset();
        } else {
            alert('Please fill in all required fields.');
        }
    });

    // Navigation
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            // Close mobile menu
            document.querySelector('.nav-links').classList.remove('active');
        });
    });

    document.querySelector('.hamburger').addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.toggle('active');
        gsap.from('.nav-links.active a', {
            y: 20,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: 'power3.out'
        });
    });

    // GSAP Animations
    gsap.registerPlugin(ScrollTrigger);

    // Navbar Animation
    gsap.from('.navbar', {
        y: -100,
        duration: 1,
        ease: 'power3.out'
    });

    // Hero Animation
    const heroTl = gsap.timeline();
    heroTl
        .from('.hero-content h1', { y: 100, opacity: 0, duration: 1.5, ease: 'power3.out' })
        .from('.hero-content p', { y: 100, opacity: 0, duration: 1.5, ease: 'power3.out' }, '-=1.2')
        .from('.cta-button', { y: 100, opacity: 0, duration: 1.5, ease: 'power3.out' }, '-=1')
        .from('.hero-image img', { scale: 0.5, opacity: 0, rotation: 10, duration: 2, ease: 'back.out(1.7)' }, '-=1.5');

    // Parallax Effect for Hero Image
    gsap.to('.hero-image img', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    // Products Animation
    gsap.utils.toArray('.product-card').forEach((card, i) => {
        gsap.from(card, {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            },
            delay: i * 0.1
        });
    });

    // About Animation
    gsap.from('.about h2', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.about',
            start: 'top 80%'
        }
    });

    gsap.from('.about-content p', {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.about',
            start: 'top 80%'
        }
    });

    gsap.from('.about-image', {
        scale: 0.8,
        opacity: 0,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.about',
            start: 'top 80%'
        }
    });

    // Testimonials Animation
    gsap.utils.toArray('.testimonial-card').forEach((card, i) => {
        gsap.from(card, {
            x: i % 2 === 0 ? -200 : 200,
            opacity: 0,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 90%'
            }
        });
    });

    // Contact Animation
    gsap.from('.contact h2', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 80%'
        }
    });

    gsap.from('.contact form > *', {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 80%'
        }
    });

    // Footer Animation
    gsap.from('footer', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: 'footer',
            start: 'top 90%'
        }
    });

    gsap.utils.toArray('.social-links a').forEach(link => {
        gsap.from(link, {
            scale: 0.8,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: 'footer',
                start: 'top 90%'
            }
        });
    });

    // Initial Cart Update
    updateCartUI();
});