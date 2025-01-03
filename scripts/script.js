let count = 1;
let idcount = 2;

// Initialize the first input wrapper as visible
document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('wrapper').classList.add('active');

    const firstWrapper = document.getElementById(count.toString());
    if (firstWrapper) {
        setTimeout(() => {
            firstWrapper.style.setProperty('--background-size', '20% auto');
            
        }, 100);
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
                else if(event.key === 'ArrowRight') {
                    event.preventDefault(); // Prevent form submission
                const currentWrapper = input.closest('.input-wrapper');
                const nextButton = currentWrapper.querySelector('button.next');
                /* errorCheck(); */
                if (nextButton) {
                    nextButton.click(); // Simulate button click
                }
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
    const data = currentWrapper.firstElementChild.value;
    
    //errorCheck(id);
    

    // Increase the progress of the bar (progress bar beeing the width of the background) by 25%
    if (currentWrapper) {

        currentWrapper.classList.remove('visible');
        const currentBackgroundSize = parseFloat(
            getComputedStyle(currentWrapper).getPropertyValue('--background-size').split('%')[0]
        );
        if (nextWrapper) {
            setTimeout(() => {
                nextWrapper.style.setProperty('--background-size', `${currentBackgroundSize + 20}% auto`);
                
            }, 100);
        }
    }

    if (nextWrapperId === 6) {
        document.getElementById('inputs').classList.add('hidden');
        document.getElementById('popup-final').classList.add('visible');
    }

    if (nextWrapper) {
        nextWrapper.classList.add('visible'); // Show the next wrapper
        count = nextWrapperId; // Update count
    }

    updateListElement(nextWrapperId, data);

    updateButtonVisibility(); // Update button visibility after navigation

    }

function prevInput() {
    event.preventDefault();
    


    // Get the current and previous wrappers
    const currentWrapper = document.getElementById(count.toString());
    const prevWrapperId = count - 1; // Calculate previous ID
    if (prevWrapperId === 0) {console.error("Cannot go back. That’s why it’s hard to choose. You have to make the right choice. As long as you don’t choose, everything remains possible."); return;}
    const prevWrapper = document.getElementById(prevWrapperId);
    
    // Decrease the progress of the bar (progress bar beeing the width of the background) by 25%
    if (currentWrapper) {
        const currentBackgroundSize = parseFloat(
            getComputedStyle(currentWrapper).getPropertyValue('--background-size').split('%')[0]
        );
        if (prevWrapper) {

                currentWrapper.style.setProperty('--background-size', `${currentBackgroundSize - 20}% auto`);
        }
        setTimeout(() => {
                
            currentWrapper.classList.remove('visible');
        }, 200);
    }
    
    if (prevWrapper) {
        prevWrapper.classList.add('visible'); // Show the previous wrapper
        count = prevWrapperId; // Update count

    } else {
        console.error("Cannot go back. That’s why it’s hard to choose. You have to make the right choice. As long as you don’t choose, everything remains possible."); // Cytat z filmu Mr. Nobody - 2009
    }
    
    updateListElement(prevWrapperId, null);

    updateButtonVisibility(); // Update button visibility after navigation
}

function updateListElement(id, data) {

    //Setup constants select - next list element to be generated, compare currently visible inputs id, active - currently active list element

    const select = document.getElementById(`list-${id}`);
    const compare = document.querySelector('.input-wrapper.visible').id;
    const active = document.querySelector('.list-element.active');
    
    //If there is no selected element (were on an input without a list element assgned) and idcount (currently visible input No.) is sychronized => generate a new list element

    if(!select && compare == idcount) {
            const parent = document.getElementById('list-wrapper');
            const elemt = document.createElement('li');
            
            elemt.innerHTML = `<h2>${data}</h2>`;
            elemt.id = `list-${(idcount - 1)}`;
            elemt.classList.add('list-element');
            idcount++;
            
            
            parent.appendChild(elemt);
            setTimeout(()=> {
                elemt.classList.add('anim');
            }, '100');

        }
        else {
            if(!select) {
              
                //Edge case - some elements generated - you'd go back to the newest list element it wouldnt move to the unassigned input but generate a new one from current input instead
                
                //update list element contents accordingly
                const fixedId = document.getElementById('list-wrapper').childElementCount; 
                const fixSelect = document.getElementById(`list-${fixedId}`);
                if(data) fixSelect.innerHTML = `<h2>${data}</h2>`;
            }
            else{

                //same functionality but without the edge case accounted for
                const fixId = select.id;
                const fixedId = (parseInt(fixId.split('list-')[1]) - 1);
                const fixSelect = document.getElementById(`list-${fixedId}`);
                if(select && data) fixSelect.innerHTML = `<h2>${data}</h2>`;
            }

            //Switch to another list element

            if(active) {
                active.classList.remove('active');
            }
            if(!select) return;
            select.classList.add('active');
        }
}

function updateButtonVisibility() {

    // Get the current wrapper

    const currentWrapper = document.getElementById(count.toString());
    
    if (!currentWrapper) return;
    
    const input = currentWrapper.querySelector('input.input');
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

/* function errorCheck(id) {
    
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
} */
function goToAbout() {

    window.location.assign('/about.php');
}