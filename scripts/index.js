count = 1;

document.addEventListener('DOMContentLoaded', () => {

    setTimeout(() => {
        document.getElementById('wrapper').classList.add('active');

    }, 500);

    setTimeout(()=>{
        document.getElementById('about-wrapper').classList.add('active');

    }, 1000);

    function updateButtonVisibility() {        
        // Get the current wrapper
        const nextButton = document.getElementById('next');
        const input = document.getElementById('token');
    
        // Enable/disable the next button based on input content
        if (nextButton && input.value.trim()) {
            nextButton.classList.add('active');
        }
        else {
            nextButton.classList.remove('active');
        }
    }
    
    document.addEventListener('input', () => {
        updateButtonVisibility(); // Re-check button visibility whenever an input is typed
    });
    
    updateButtonVisibility();
});

