// Main document ready function
document.addEventListener('DOMContentLoaded', function () {
    // Initialize step thumbnails functionality
    initStepThumbnails();

    // Initialize game item tabs and selection
    initGameItems();

    // Initialize floating food animations
    initFloatingFoods();
});

// Step thumbnails functionality
function initStepThumbnails() {
    const stepThumbs = document.querySelectorAll('.step-thumb');

    stepThumbs.forEach(thumb => {
        thumb.addEventListener('click', function () {
            // Remove active class from all thumbnails
            stepThumbs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked thumbnail
            thumb.classList.add('active');

            // Get step data
            const stepTitle = thumb.dataset.title;
            const stepDesc = thumb.dataset.desc;
            const stepImg = thumb.dataset.img;

            // Get elements to update
            const titleElement = document.getElementById('stepTitle');
            const descElement = document.getElementById('stepDescription');
            const imgElement = document.getElementById('stepImage');

            // Add fade-out class
            titleElement.classList.add('fade-out');
            descElement.classList.add('fade-out');
            imgElement.classList.add('fade-out');

            // Wait for fade out to complete
            setTimeout(function () {
                // Update content
                titleElement.textContent = stepTitle;
                descElement.textContent = stepDesc;

                if (stepImg) {
                    imgElement.src = stepImg;
                }

                // Remove fade-out class and add fade-in
                titleElement.classList.remove('fade-out');
                descElement.classList.remove('fade-out');
                imgElement.classList.remove('fade-out');

                titleElement.classList.add('fade-in');
                descElement.classList.add('fade-in');
                imgElement.classList.add('fade-in');
            }, 300);
        });
    });

    // Set first step as active by default if it exists
    if (stepThumbs.length > 0) {
        stepThumbs[0].classList.add('active');
    }
}

// Game items functionality
function initGameItems() {
    // Initialize tabs
    const tabs = document.querySelectorAll('.game-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            document.querySelectorAll('.game-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.game-tab-content').forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // Item selection functionality
    const items = document.querySelectorAll('.item-tile');
    items.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            document.querySelectorAll('.item-tile').forEach(t => t.classList.remove('active'));

            // Add active class to clicked item
            item.classList.add('active');

            // Get item data
            const name = item.dataset.name || 'Item Name';
            const desc = item.dataset.desc || 'No description available';
            const img = item.dataset.img || '/api/placeholder/128/128';

            // Update details panel with animation
            fadeOut(document.getElementById('selected-item-img'));
            fadeOut(document.getElementById('selected-item-name'));
            fadeOut(document.getElementById('selected-item-desc'));

            setTimeout(() => {
                // Update content
                document.getElementById('selected-item-img').src = img;
                document.getElementById('selected-item-name').textContent = name;
                document.getElementById('selected-item-desc').textContent = desc;

                // Fade in new content
                fadeIn(document.getElementById('selected-item-img'));
                fadeIn(document.getElementById('selected-item-name'));
                fadeIn(document.getElementById('selected-item-desc'));
            }, 300);
        });
    });

    // Select first item by default
    if (items.length > 0) {
        items[0].click();
    }
}

// Initialize floating food animations with more dynamic behavior
function initFloatingFoods() {
    const floatingFoods = document.querySelectorAll('.floating-food');

    floatingFoods.forEach(food => {
        // Apply initial random position adjustments
        const posX = Math.random() * 10 - 5; // -5px to 5px
        const posY = Math.random() * 10 - 5; // -5px to 5px
        food.style.transform = `translate(${posX}px, ${posY}px)`;

        // Set random animation duration between 8-15 seconds
        const duration = Math.random() * (15 - 8) + 8;

        // Set random delay for each item
        const delay = Math.random() * 5;

        // Apply the animation
        food.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;

        // Make the animations more dynamic by adding mouse interaction
        document.addEventListener('mousemove', function (e) {
            // Get cursor position
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;

            // Gentle parallax effect based on mouse position
            // Only apply this to visible items (those in viewport)
            const rect = food.getBoundingClientRect();
            if (
                rect.top >= -100 &&
                rect.left >= -100 &&
                rect.bottom <= window.innerHeight + 100 &&
                rect.right <= window.innerWidth + 100
            ) {
                // Apply subtle transform based on mouse position
                const moveX = (mouseX - 0.5) * 10; // -5px to 5px
                const moveY = (mouseY - 0.5) * 10; // -5px to 5px

                // Combine with existing animation using CSS variables
                food.style.setProperty('--mouse-x', `${moveX}px`);
                food.style.setProperty('--mouse-y', `${moveY}px`);
            }
        });
    });
}

// Simple fade functions
function fadeOut(element) {
    if (element) {
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.3s ease';
    }
}

function fadeIn(element) {
    if (element) {
        element.style.opacity = '1';
        element.style.transition = 'opacity 0.3s ease';
    }
}