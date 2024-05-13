document.addEventListener("DOMContentLoaded", function() {
    const overlay = document.getElementById("overlay");
    const completeProfileBtn = document.getElementById("completeProfileBtn");
    const dashViewArticles = document.querySelectorAll("#dashview article");

    // Open the welcome modal if it's the user's first login
    // You can replace this with your actual logic
    const isFirstLogin = true; // Example
    if (isFirstLogin) {
        overlay.style.display = "flex";
    }

    // Event listener for completing profile
    completeProfileBtn.addEventListener("click", function() {
        // Assume some action to complete profile
        // For now, just close the modal and show profile setup page
        overlay.style.display = "none";
        window.location.href = 'profileCompletion.html';
        
    });

    // Event listener for view more button
    const viewMoreBtns = document.querySelectorAll(".view-more-btn");
    viewMoreBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            const opportunity = this.closest(".opportunity");
            const details = opportunity.querySelector(".opportunity-details");
            details.style.display = "block";
            const applyBtn = document.createElement("button");
            applyBtn.textContent = "Apply";
            applyBtn.classList.add("apply-btn");
            applyBtn.addEventListener("click", function() {
                window.location.href = 'Application.html';
            });
            this.parentNode.appendChild(applyBtn);
            this.style.display = "none";
        });
    });

    // Toggle active class for tabs
    dashViewArticles.forEach(article => {
        article.addEventListener("click", function() {
            dashViewArticles.forEach(a => a.classList.remove("active"));
            this.classList.add("active");
        });
    });

    const notifications = document.querySelector('.notifications');

    notifications.addEventListener('click', function() {
        this.classList.toggle('active');
        const notificationList = this.querySelector('.notification-list');
        notificationList.style.display = notificationList.style.display === 'block' ? 'none' : 'block';
    });

    // Close notification list when clicking outside
    document.addEventListener('click', function(event) {
        if (!notifications.contains(event.target)) {
            notifications.classList.remove('active');
            const notificationList = notifications.querySelector('.notification-list');
            notificationList.style.display = 'none';
        }
    });
});
