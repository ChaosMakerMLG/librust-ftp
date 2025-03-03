let count = 1;
let idcount = 2;

// Initialize the first input wrapper as visible
document.addEventListener('DOMContentLoaded', () => {

    var path = window.location.pathname;
    var page = path.split("/").pop();
    
    if(page == 'final') {
        return;
    }

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
    
    let error = errorCheck(id);

    if(error){
        return;
    }
    

    // Increase the progress of the bar (progress bar beeing the width of the background) by 25%
    if (currentWrapper) {

        if (nextWrapperId === 6) {
            setTimeout(() => {
                document.getElementById('inputs').classList.add('hidden');
                document.getElementById('popup-final').classList.add('visible');
            }, 200);
            setTimeout(() => {
                currentWrapper.classList.remove('visible');
                nextWrapper.classList.add('visible'); // Show the next wrapper
                count++;
                updateListElement(nextWrapperId, data);
            }, 200);
            return;
        }
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
    const hover = document.querySelector('.list-element.hover');

    console.log(compare);
    console.log(select);
    console.log(idcount);
    
    //If there is no selected element (were on an input without a list element assgned) and idcount (currently visible input No.) is sychronized => generate a new list element

    if(!select && compare == idcount) {
            const parent = document.getElementById('list-wrapper');
            const elemt = document.createElement('li');
            
            elemt.innerHTML = `<h3>${data}</h3>`;
            elemt.id = `list-${(idcount - 1)}`;
            elemt.classList.add('list-element');
            elemt.setAttribute('onclick', 'editMe(this.id)');
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
                console.log(fixedId);
                const fixSelect = document.getElementById(`list-${fixedId}`);
                if(data) fixSelect.innerHTML = `<h3>${data}</h3>`;
            }
            else{

                //same functionality but without the edge case accounted for
                const fixId = select.id;
                const fixedId = (parseInt(fixId.split('list-')[1]) - 1);
                const fixSelect = document.getElementById(`list-${fixedId}`);
                if(select && data) fixSelect.innerHTML = `<h3>${data}</h3>`;
            }

            //Switch to another list element
            if(hover){
                hover.classList.remove('hover');
            }
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
    return;
}

document.addEventListener('input', () => {
    updateButtonVisibility(); // Re-check button visibility whenever an input is typed
});

function loadingDisplay() {
    setTimeout(() => {
        document.getElementById('loading').classList.toggle('hidden');
    }, 200);
    return;
}

function errorCheck(id) {

    const index = (parseInt(id.split('child-')[1]) - 1); 
    const currentWrapper = document.getElementById(index);
    const currentInput = currentWrapper.querySelector(`.input`);

    if(currentInput.value) {
        switch (index) {
            case 1:
                if(!validateName(currentInput.value)) {
                    if(!document.querySelector('#info.active')){
                        setTimeout(() => {
                            document.getElementById('error-popup').classList.add('active');
                            document.getElementById('wrapper').classList.add('shake');
                        }, 200);
                        document.getElementById('info-button').classList.add('bop');
                        setTimeout(() => {
                            document.getElementById('info-button').classList.remove('bop');
                        }, 1000);
                        document.getElementById('info-button').classList.add('blink');
                        document.getElementById('wrapper').classList.remove('shake');
                    }
                    if(document.querySelector('#info-button.bop')) {
                        return true;
                    }
                    const regex = /^.{3,}$/ 
                    if(document.querySelector('#info.active') && !regex.test(currentInput.value)){
                        document.getElementById('wrapper').classList.add('shake');
                        document.getElementById('rule11').classList.add('highlight');
                        setTimeout(() => {
                            document.getElementById('rule11').classList.remove('highlight');
                            document.getElementById('wrapper').classList.remove('shake');
                        }, 800);
                    }
                    else if(document.querySelector('#info.active') && !validateName(currentInput.value)){
                        document.getElementById('wrapper').classList.add('shake');
                        document.getElementById('rule1').classList.add('highlight');
                        setTimeout(() => {
                            document.getElementById('rule1').classList.remove('highlight');
                            document.getElementById('wrapper').classList.remove('shake');
                        }, 800);
                    }
                    return true;
                }
                break;
            case 2:
                if(!validateName(currentInput.value)) {
                    if(!document.querySelector('#info.active')){
                        setTimeout(() => {
                            document.getElementById('error-popup').classList.add('active');
                            document.getElementById('wrapper').classList.add('shake');
                        }, 200);
                        document.getElementById('info-button').classList.add('bop');
                        setTimeout(() => {
                            document.getElementById('info-button').classList.remove('bop');
                        }, 1000);
                        document.getElementById('info-button').classList.add('blink');
                        document.getElementById('wrapper').classList.remove('shake');
                    }
                    if(document.querySelector('#info-button.bop')) {
                        return true;
                    }
                    const regex = /^.{3,}$/ 
                    if(document.querySelector('#info.active') && !regex.test(currentInput.value)){
                        document.getElementById('wrapper').classList.add('shake');
                        document.getElementById('rule11').classList.add('highlight');
                        setTimeout(() => {
                            document.getElementById('rule11').classList.remove('highlight');
                            document.getElementById('wrapper').classList.remove('shake');
                        }, 800);
                    }
                    else if(document.querySelector('#info.active') && !validateName(currentInput.value)){
                        document.getElementById('wrapper').classList.add('shake');
                        document.getElementById('rule1').classList.add('highlight');
                        setTimeout(() => {
                            document.getElementById('rule1').classList.remove('highlight');
                            document.getElementById('wrapper').classList.remove('shake');
                        }, 800);
                    }
                    return true;
                }
                break;
            case 3:
                if(!validateClass(currentInput.value)) {
                    if(!document.querySelector('#info.active')){
                        setTimeout(() => {
                            document.getElementById('error-popup').classList.add('active');
                            document.getElementById('wrapper').classList.add('shake');
                        }, 200);
                        document.getElementById('info-button').classList.add('bop');
                        setTimeout(() => {
                            document.getElementById('info-button').classList.remove('bop');
                        }, 1000);
                        document.getElementById('info-button').classList.add('blink');
                        document.getElementById('wrapper').classList.remove('shake');
                    }
                    if(document.querySelector('#info-button.bop')) {
                        return true;
                    }
                    if(document.querySelector('#info.active')){
                        document.getElementById('error-popup').classList.add('bop');
                        setTimeout(() => {
                            document.getElementById('error-popup').classList.remove('bop');
                        }, 800);
                    }
                    const regex1 = /^[1-5].*/
                    const regex2 = /^.[a-g]$/
                    if(document.querySelector('#info.active') && !regex1.test(currentInput.value)) {
                        document.getElementById('rule2').classList.add('highlight');
                        setTimeout(() => {
                            document.getElementById('rule2').classList.remove('highlight');
                        }, 800);
                    }
                    else if(document.querySelector('#info.active') && !regex2.test(currentInput.value)) {
                        document.getElementById('rule22').classList.add('highlight');
                        setTimeout(() => {
                            document.getElementById('rule22').classList.remove('highlight');
                        }, 800);
                    }
                    return true;
                }
                break;
            case 4:
                if(!validateNumber(currentInput.value)) {
                    if(!document.querySelector('#info.active')){
                        setTimeout(() => {
                            document.getElementById('error-popup').classList.add('active');
                            document.getElementById('wrapper').classList.add('shake');
                        }, 200);
                        document.getElementById('info-button').classList.add('bop');
                        setTimeout(() => {
                            document.getElementById('info-button').classList.remove('bop');
                        }, 1000);
                        document.getElementById('info-button').classList.add('blink');
                        document.getElementById('wrapper').classList.remove('shake');
                    }
                    if(document.querySelector('#info-button.bop')) {
                        return true;
                    }
                    if(document.querySelector('#info.active')){
                        document.getElementById('error-popup').classList.add('bop');
                        document.getElementById('rule3').classList.add('highlight');
                        setTimeout(() => {
                            document.getElementById('error-popup').classList.remove('bop');
                            document.getElementById('rule3').classList.remove('highlight');
                        }, 800);
                    }
                    return true;
                }
                break;
            case 5:
                if(!validateEmail(currentInput.value)) {
                    if(!document.querySelector('#info.active')){
                        setTimeout(() => {
                            document.getElementById('error-popup').classList.add('active');
                            document.getElementById('wrapper').classList.add('shake');
                        }, 200);
                        document.getElementById('info-button').classList.add('bop');
                        setTimeout(() => {
                            document.getElementById('info-button').classList.remove('bop');
                        }, 1000);
                        document.getElementById('info-button').classList.add('blink');
                        document.getElementById('wrapper').classList.remove('shake');
                    }
                    if(document.querySelector('#info-button.bop')) {
                        return true;
                    }
                    if(document.querySelector('#info.active')){
                        document.getElementById('error-popup').classList.add('bop');
                        setTimeout(() => {
                            document.getElementById('error-popup').classList.remove('bop');
                        }, 600);
                    }
                    return true;
                }
                break;
            default:
                console.log('XDDD');
        }
        errorDismiss();
    }
}

function goToAbout() {
    setTimeout(() => {
        window.location.assign('/about.php');
    }, 200);
}

function editMe(id) {
    const element = document.getElementById(id);
    const input = document.getElementById(id.split('list-')[1]);
    const active = document.querySelector('.list-element.active');

    updateListElement(id.split('list-')[1], null);

    setTimeout(() => {
        document.getElementById('inputs').classList.remove('hidden');
    }, 200);
    setTimeout(() => {
        document.querySelector('.visible').classList.remove('visible');
    }, 200);
    setTimeout(() => {
        input.classList.add('visible');
    }, 200);

    count = (id.split('list-')[1])
}

function displayError() {
    setTimeout(() => {
        document.getElementById('error-box').classList.toggle('active');
    }, 200);
}

function formatInfo() {
    setTimeout(() => {
        document.getElementById('info-button-wrapper').classList.toggle('hidden');
        document.getElementById('info-button').classList.remove('blink');
        document.getElementById('info').classList.toggle('active');
        errorDismiss();
    }, 200);
}

function errorDismiss() {
    setTimeout(() => {
        document.getElementById('error-popup').classList.remove('active');
        document.getElementById('error-popup').classList.remove('bop');
        document.getElementById('wrapper').classList.remove('shake');
    }, 200);
}

function validateName(input) {
    const regex = /^[A-Z][a-z]{2,}$/
    return regex.test(input);
}

function validateEmail(input) {
    const regex = /^[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-A-Za-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?/;
    return regex.test(input); 
}
    
function validateClass(input) {
    let regex = /^[1-5][a-g]$/;
    return regex.test(input);
}

function validateNumber(input) {
    let regex = /^(?!00)[0-3][0-9]$/;
    return regex.test(input);
}
