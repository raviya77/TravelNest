//Travel nest Shared things
//This loads on every single page.

//Runs all setup functions once the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initScrollReveal();
    initNewsletter();
});

// Navigation hamburger toggle
// opens on mobile when clicked and also closes
//hamburger button
function initNav() {
    const hamburger = document.getElementById('hamburger');
    const navlinks = document.getElementById('navLinks');
    if (!hamburger || !navlinks) {
        return;
    }
    hamburger.addEventListener('click', () => {
        const isOpen = navlinks.classList.toggle("open");
        hamburger.classList.toggle('open', isOpen);
        //aria-expanded is gonna tells screen reader whether the menu is open
        hamburger.setAttribute('aria-expanded', isOpen);
    });
    //Closes the nav when the link is clicked
    navlinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navlinks.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', false);
        });
    });

}

//scroll reveal
//triggers a CSS fade in animation

function initScrollReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                //stop watching once visible - animation only plays once
                observer.unobserve(entry.target);

            }
        });
    }, { threshold: 0.1 });//fires when 10% of the elements is in view
    els.forEach(el => observer.observe(el));
}
//call after dynamically adding. reveal elements after rendering cards
function refreshReveal() {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // 1. Changed 'remove' to 'add'
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 }); // Added the threshold to match your init function

    // 2. Added this line so the observer actually starts watching the elements
    els.forEach(el => observer.observe(el));
}
// the newsletter form
// saves the email to local storage so the user only has to subscribe once
function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    // If already subscribed, replace the form with a confirmation
    const savedEmail = localStorage.getItem('tn_newsletter');
    if (savedEmail) {
        form.innerHTML = `<p style="color:var(--primary);font-size:0.85rem;">✓ You're subscribed!</p>`;
        return;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        const email = input.value.trim();
        if (!email) return;
        localStorage.setItem('tn_newsletter', email);
        form.innerHTML = `<p style="color:var(--primary);font-size:0.85rem;">✓ Subscribed! Thanks 🎉</p>`;
    });
}

// Used in budget.html and generator.html currency format
function formatCurrency(amount) {
    return '$' + amount.toLocaleString('en-US');
}


// Used in budget.html and generator.htmlGet, save, add and remove from the wishlist
function getWishlist() {
    const raw = localStorage.getItem('tn_wishlist');
    return raw ? JSON.parse(raw) : [];
}

function saveWishlist(list) {
    localStorage.setItem('tn_wishlist', JSON.stringify(list));
}

function addToWishlist(destId) {
    const list = getWishlist();
    if (!list.includes(destId)) {
        list.push(destId);
        saveWishlist(list);
        return true;   // was added
    }
    return false;      // already existed
}

function removeFromWishlist(destId) {
    const list = getWishlist().filter(id => id !== destId);
    saveWishlist(list);
}
function getTripStatuses() {
    const raw = localStorage.getItem('tn_trip_status');
    return raw ? JSON.parse(raw) : {};
}

// clicking the same status again removes it (toggle).
function setTripStatus(destId, status) {
    const statuses = getTripStatuses();
    // Toggle off if same status is clicked again
    if (statuses[destId] === status) {
        delete statuses[destId];
    } else {
        statuses[destId] = status;
    }
    localStorage.setItem('tn_trip_status', JSON.stringify(statuses));
    return statuses[destId] || null;
}