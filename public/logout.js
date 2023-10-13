document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.getElementById('logout-link');

    logoutLink.addEventListener('click', function(event) {
        event.preventDefault();
        // Clear the token by setting its expiration date to a past date
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/"
    });
})