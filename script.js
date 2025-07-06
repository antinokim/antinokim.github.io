// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Handle navigation clicks
    const navLinks = document.querySelectorAll('.nav-item');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navHeight = document.getElementById('main-nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active navigation item on scroll
    window.addEventListener('scroll', function() {
        const navHeight = document.getElementById('main-nav').offsetHeight;
        const scrollPosition = window.scrollY + navHeight + 50;
        
        const sections = document.querySelectorAll('section');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Update active nav item
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    });
});

// Toggle publication abstracts
function toggleAbstract(pubId) {
    const abstract = document.getElementById(pubId);
    const publicationItem = abstract.closest('.publication-item');
    
    if (abstract.classList.contains('show')) {
        abstract.classList.remove('show');
        publicationItem.classList.remove('expanded');
    } else {
        // Hide all other abstracts
        document.querySelectorAll('.publication-abstract').forEach(abs => {
            abs.classList.remove('show');
        });
        document.querySelectorAll('.publication-item').forEach(item => {
            item.classList.remove('expanded');
        });
        
        // Show the clicked abstract
        abstract.classList.add('show');
        publicationItem.classList.add('expanded');
    }
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key to close all abstracts
    if (e.key === 'Escape') {
        document.querySelectorAll('.publication-abstract').forEach(abs => {
            abs.classList.remove('show');
        });
        document.querySelectorAll('.publication-item').forEach(item => {
            item.classList.remove('expanded');
        });
    }
});

// Add click outside to close abstracts
document.addEventListener('click', function(e) {
    if (!e.target.closest('.publication-item')) {
        document.querySelectorAll('.publication-abstract').forEach(abs => {
            abs.classList.remove('show');
        });
        document.querySelectorAll('.publication-item').forEach(item => {
            item.classList.remove('expanded');
        });
    }
});

// Prevent closing when clicking inside the abstract
document.querySelectorAll('.publication-abstract').forEach(abstract => {
    abstract.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});

// Add loading animation for external links
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', function() {
        this.style.opacity = '0.6';
        setTimeout(() => {
            this.style.opacity = '1';
        }, 300);
    });
});

// Add entrance animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for entrance animations
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// Add hover effects for publication items
document.querySelectorAll('.publication-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    item.addEventListener('mouseleave', function() {
        if (!this.classList.contains('expanded')) {
            this.style.transform = 'translateY(0)';
        }
    });
});

// Add focus management for accessibility
document.querySelectorAll('.publication-title').forEach(title => {
    title.setAttribute('tabindex', '0');
    title.setAttribute('role', 'button');
    title.setAttribute('aria-expanded', 'false');
    
    title.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const pubId = this.getAttribute('onclick').match(/toggleAbstract\('(.+?)'\)/)[1];
            toggleAbstract(pubId);
            
            // Update aria-expanded
            const isExpanded = document.getElementById(pubId).classList.contains('show');
            this.setAttribute('aria-expanded', isExpanded);
        }
    });
});

// Update aria-expanded when abstracts are toggled
const originalToggleAbstract = window.toggleAbstract;
window.toggleAbstract = function(pubId) {
    originalToggleAbstract(pubId);
    
    // Update aria-expanded for the clicked title
    const title = document.querySelector(`[onclick="toggleAbstract('${pubId}')"]`);
    const isExpanded = document.getElementById(pubId).classList.contains('show');
    title.setAttribute('aria-expanded', isExpanded);
};