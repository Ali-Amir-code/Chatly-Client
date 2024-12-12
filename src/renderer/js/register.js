const registerForm = document.getElementById('registerForm');

const nameInputField = document.getElementById('name');
const usernameInputField = document.getElementById('username');
const passwordInputField = document.getElementById('password');
const confirmPasswordInputField = document.getElementById('confirmPassword');

const usernameInfo = document.querySelector('#usernameInfo p');
const passwordInfo = document.querySelector('#passwordInfo p');
const loader = document.getElementById('loader');

const formSubmitButton = document.getElementById('submitButton');

// const serverURL = 'https://chatly-server.glitch.me';
const serverURL = 'http://localhost:3000';

let controller = null;
let isUsernameAvailable = false;

const submitForm = async (e) => {
    e.preventDefault();
    if (!isUsernameAvailable) {
        return;
    }

    const name = nameInputField.value.trim();
    const username = usernameInputField.value.trim();
    const password = passwordInputField.value;

    electronAPI.register(name, username, password);
};

registerForm.addEventListener('submit', submitForm);

const getSignal = () => {
    if (controller) {
        controller.abort();
    }
    controller = new AbortController();
    return controller.signal;
};

const checkUsernameAvailability = async (username) => {
    const signal = getSignal();
    try {
        const response = await fetch(
            `${serverURL}/checkUsernameAvailability?username=${encodeURIComponent(username)}`,
            { signal }
        );

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        return result.available;
    } catch (err) {
        if (err.name === 'AbortError') {
            console.log('Request aborted');
        } else {
            console.error('Error checking username:', err);
        }
        return undefined;
    }
};

const showLoader = () => {
    loader.style.display = 'inline';
};

const hideLoader = () => {
    loader.style.display = 'none';
};

const showInfo = (text, color, target) => {
    if (target === 'username') {
        usernameInfo.innerText = text;
        usernameInfo.style.color = color;
    }
    if (target === 'password') {
        passwordInfo.innerText = text;
        passwordInfo.style.color = color;
    }
};

const hideInfo = (target) => {
    if (target === 'username') {
        usernameInfo.innerText = '';
        usernameInfo.style.color = '';
    }
    if (target === 'password') {
        passwordInfo.innerText = '';
        passwordInfo.style.color = '';
    }
};

// Function to validate the username
const isValidUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]+$/; // Only alphabets, numbers, and underscores
    return usernameRegex.test(username);
};

passwordInputField.addEventListener('input', () => {
    if (passwordInputField.value === confirmPasswordInputField.value) {
        hideInfo('password');
    }
});

confirmPasswordInputField.addEventListener('input', () => {
    if(passwordInputField.value === ''){
        hideInfo('password');
        return;
    }
    if (passwordInputField.value !== confirmPasswordInputField.value) {
        showInfo('Passwords do not match', 'red', 'password');
        formSubmitButton.disabled = true;
    } else {
        hideInfo('password');
        formSubmitButton.disabled = false;
    }
})

usernameInputField.addEventListener('input', async (e) => {
    const username = e.target.value.trim();
    if (!username) {
        hideLoader();
        hideInfo('username');
        return;
    }

    // Validate username
    if (!isValidUsername(username)) {
        hideLoader();
        showInfo('Username can only contain letters, numbers, and underscores', 'red', 'username');
        return;
    }

    showLoader();
    showInfo('Checking Username Availability', 'white', 'username');

    const result = await checkUsernameAvailability(username);

    hideLoader();

    // Ensure the input hasn't changed while waiting for the result
    if (username !== e.target.value.trim()) {
        return;
    }

    if (result) {
        isUsernameAvailable = true;
        showInfo('Username is available', 'lightgreen', 'username');
        formSubmitButton.disabled = false;
    } else if (result === false) {
        isUsernameAvailable = false;
        showInfo('Username is not available', 'red', 'username');
        formSubmitButton.disabled = true;
    } else {
        isUsernameAvailable = false;
        showInfo('Something went wrong', 'orange', 'username');
        formSubmitButton.disabled = true;
    }
});