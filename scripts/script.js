let count = 1;

// Initialize the first input wrapper as visible
document.addEventListener('DOMContentLoaded', () => {

    const firstWrapper = document.getElementById(count.toString());
    if (firstWrapper) {
        firstWrapper.style.setProperty('--background-size', '25% auto');
        firstWrapper.classList.add('visible');
    }

    // Add keydown listener for all inputs
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent form submission
                const currentWrapper = input.closest('.input-wrapper');
                const nextButton = currentWrapper.querySelector('button.next');
                errorCheck();
                if (nextButton) {
                    nextButton.click(); // Simulate button click
                }
            }
        });
    });

    updateButtonVisibility(); // Initial update of button visibility
});

function nextInput(id) {
    event.preventDefault();
    
    // Get the current and next wrappers// Decrease the progress of the bar (progress bar beeing the width of the background) by 25%
    const currentWrapper = document.getElementById(count.toString());
    const nextWrapperId = parseInt(id.split('child-')[1]); // Extract numeric part of the ID
    const nextWrapper = document.getElementById(nextWrapperId);
    
    //errorCheck(id);
    

    // Increase the progress of the bar (progress bar beeing the width of the background) by 25%
    if (currentWrapper) {
        currentWrapper.classList.remove('visible');
        const currentBackgroundSize = parseFloat(
            getComputedStyle(currentWrapper).getPropertyValue('--background-size').split('%')[0]
        );
        if (nextWrapper) {
            nextWrapper.style.setProperty('--background-size', `${currentBackgroundSize + 25}% auto`);
        }
    }

    if (nextWrapper) {
        nextWrapper.classList.add('visible'); // Show the next wrapper
        count = nextWrapperId; // Update count
    } else {
        console.error(`Wrapper with ID ${nextWrapperId} not found`);
    }

    updateButtonVisibility(); // Update button visibility after navigation

    }

function prevInput() {
    event.preventDefault();
    

    // Get the current and previous wrappers
    const currentWrapper = document.getElementById(count.toString());
    const prevWrapperId = count - 1; // Calculate previous ID
    const prevWrapper = document.getElementById(prevWrapperId);
    
    // Decrease the progress of the bar (progress bar beeing the width of the background) by 25%
    if (currentWrapper) {
        currentWrapper.classList.remove('visible');
        const currentBackgroundSize = parseFloat(
            getComputedStyle(currentWrapper).getPropertyValue('--background-size').split('%')[0]
        );
        if (prevWrapper) {
            prevWrapper.style.setProperty('--background-size', `${currentBackgroundSize - 25}% auto`);
        }
    }
    
    if (prevWrapper) {
        prevWrapper.classList.add('visible'); // Show the previous wrapper
        count = prevWrapperId; // Update count
    } else {
        console.error("Cannot go back. That’s why it’s hard to choose. You have to make the right choice. As long as you don’t choose, everything remains possible."); // Cytat z filmu Mr. Nobody - 2009
    }
    
    updateButtonVisibility(); // Update button visibility after navigation
}

function updateButtonVisibility() {
    
    
    // Get the current wrapper
    const currentWrapper = document.getElementById(count.toString());
    if (!currentWrapper) return;
    
    const nextButton = currentWrapper.querySelector('button.next');
    const backButton = currentWrapper.querySelector('button.prev');
    
    // Always show the back button except on the first step
    if (backButton) {
        setTimeout(() => {
            backButton.classList.add('active');
        }, 100);
    }
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

function loadingDisplay() {
    document.getElementById('loading').style.opacity = '1';
    document.getElementById('wrapper').classList.add('loading')
    
}

function isUppercase(word) {
    return /^\p{Lu}/u.test(word);
}

function errorCheck(id) {
    
    let foo = parseInt(id);
    let foo2 = foo - 1;
    const input = document.querySelector('#' + foo2 + '>.input');
    //document.getElementById('#error-popup').classList.toggle('active');
    
    while (input.value === true) {
        const name = document.querySelector('#' + foo2 + '>#name.input');
        const surname = document.querySelector('#' + foo2 + '>#surname.input');
        const input_class = document.querySelector('#' + foo2 + '>#class.input');
        const number = document.querySelector('#' + foo2 + '>#number.input');
        const mail = document.querySelector('#' + foo2 + '>#mail.input');
        
        if (name.value === true && isUppercase(name.value) === true) {
            return;
        } else {
            document.getElementById('#error-popup').classList.toggle('active');
        }
        if (name.value === true && isUppercase(name.value) === true) {
            return;
        } else {
            document.getElementById('#error-popup').classList.toggle('active');
        }
    }
}
function goToAbout() {
    window.location.href = "/about.php";
}