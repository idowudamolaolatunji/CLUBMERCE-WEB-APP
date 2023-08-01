const showLoadingOverlay = () => {
    spinOverlay.style.visibility = 'visible';
};
const hideLoadingOverlay = () => {
    spinOverlay.style.visibility = 'hidden';
};

document.addEventListener("DOMContentLoaded", function() {
    showLoadingOverlay();
});
window.addEventListener("load", function() {
    hideLoadingOverlay()
});