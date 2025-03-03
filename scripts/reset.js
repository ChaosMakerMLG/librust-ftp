let count = 1;
let lastUsed = 0;

// Initialize the first input wrapper as visible
document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('wrapper').classList.add('active');

    const firstWrapper = document.getElementById(count.toString());
    if (firstWrapper) {

        firstWrapper.classList.add('visible');
    }

    // Add keydown listener for all inputs
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent form submission
                const currentWrapper = input.closest('.input-wrapper');
                const nextButton = currentWrapper.querySelector('button.next');
                /* errorCheck(); */
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

    let error = errorCheck(id);

    if (error) {
        return;
    }
    else if (id === 'child-3') {
        document.getElementById('child-4').click();
    }

    sendMail(id);
    updateButtonVisibility(); // Update button visibility after navigation

}

function updateButtonVisibility() {

    // Get the current wrapper

    const currentWrapper = document.getElementById(count.toString());

    if (!currentWrapper) return;

    const input = currentWrapper.querySelector('input.input');
    const nextButton = currentWrapper.querySelector('button.next');

    // Enable/disable the next button based on input content
    if (nextButton && input.value.trim()) {
        nextButton.classList.add('active');
    }
    else {
        nextButton.classList.remove('active');
    }
    return;
}

document.addEventListener('input', () => {
    updateButtonVisibility(); // Re-check button visibility whenever an input is typed
});

function errorCheck(id) {

    const index = (parseInt(id.split('child-')[1]) - 1);
    const currentWrapper = document.getElementById(index);
    const currentInput = currentWrapper.querySelector(`.input`);

    if (currentInput.value) {
        switch (index) {
            case 1:
                if (!validateEmail(currentInput.value)) {
                    setTimeout(() => {
                        document.getElementById('wrapper').classList.add('shake');
                    }, 100);
                    document.getElementById('wrapper').classList.remove('shake');
                    return true;
                }
                break;
            case 2:
                if (!validateCode(currentInput.value)) {
                    setTimeout(() => {
                        document.getElementById('wrapper').classList.add('shake');
                    }, 100);
                    document.getElementById('wrapper').classList.remove('shake');
                    return true;
                }
                break;
            default:
                console.log('REGEX SWITCH ERROR');
        }
    }
}

function validateCode(input) {
    const regex = /^\d{6}$/
    return regex.test(input);
}

function validateEmail(input) {
    const regex = /^[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?/;
    return regex.test(input);
}

function codeCorrect() {
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('info-inner').classList.remove('active');
        document.getElementById('wrapper').classList.remove('active');
        setTimeout(() => {
            document.getElementById('credentials-inner').classList.add('active');
        }, 200);
    });
}

function codeIncorrect() {
    document.getElementById('info-inner').classList.remove('active');
    setTimeout(() => {
        document.getElementById('error-inner').classList.add('active');
    }, 200);
}

function inputFix() {
    document.getElementById('1').classList.remove('visible');
    document.getElementById('2').classList.add('visible');
}

function attemptMail(id) {

    const cooldown = 10000;
    const now = Date.now();
    const element = document.getElementById('resend');

    if (now - lastUsed >= cooldown) {
        element.classList.add('click');
        setTimeout(() => {
            element.classList.remove('click');
        }, 50);
        lastUsed = now;
        document.getElementById('error-inner').classList.remove('active');
        sendMail(id);
        setCooldown();
    } else {
        setTimeout(() => {
            document.getElementById('resend').classList.add('shake');
        }, 100);
        document.getElementById('resend').classList.remove('shake');
        console.log(`Please wait ${cooldown - (now - lastUsed)}ms before using this again.`);
    }
}

function sendMail(id) {


    const currentWrapper = document.getElementById(count.toString());
    const nextWrapperId = parseInt(id.split('child-')[1]); // Extract numeric part of the ID
    const nextWrapper = document.getElementById(nextWrapperId);
    const key = document.getElementById('expected').value;
    const mail = document.getElementById('mail').value;

    $.ajax({
        url: 'verification.php',
        type: 'GET',
        async: true,
        data: { encrypt: `${key}`, mail: `${mail}` },
        success: function (response) {
            if (response === 'nomail') {
                console.log(response);
                if (document.querySelector('#mail-error-inner.active')) {
                    document.getElementById('mail-error-inner').classList.add('shake');
                    setTimeout(() => {
                        document.getElementById('mail-error-inner').classList.remove('shake');
                    }, 800);
                }
                document.getElementById('info-inner').classList.remove('active');
                document.getElementById('error-inner').classList.remove('active');
                document.getElementById('mail-error-inner').classList.add('active');
                document.getElementById('2').classList.remove('visible');
                document.getElementById('1').classList.add('visible');
            }
            else {
                document.getElementById('mail-error-inner').classList.remove('active');
                if (currentWrapper) {
                    currentWrapper.classList.remove('visible');
                    document.getElementById('info-inner').classList.add('active');
                }
                if (nextWrapper) {
                    nextWrapper.classList.add('visible'); // Show the next wrapper
                    count = nextWrapperId; // Update count
                }
            }
        },
        error: function (xhr, status, error) {
            console.error('Error:', error);
        }
    });
}

function setCooldown() {
    document.getElementById('resend').classList.add('cooldown');
    setTimeout(() => {
        document.getElementById('resend').classList.remove('cooldown');
    }, 10000);
}