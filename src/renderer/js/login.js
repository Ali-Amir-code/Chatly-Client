const loginForm = document.getElementById('loginForm');
const usernameInputField = document.getElementById('username');
const passwordInputField = document.getElementById('password');
const infoElement = document.querySelector('#info p');

loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    infoElement.innerText = '';
    const username = usernameInputField.value.trim();
    const password = passwordInputField.value;

    try{
        const isAvailable = await window.electronAPI.login(username, password);
        console.log(isAvailable);
        if (!isAvailable) {
            infoElement.style.color = 'orange';
            infoElement.innerText = 'Invalid Username or Password';
        }else{
            infoElement.innerText = '';
        }
    }catch(err){

    }
});