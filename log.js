
const username = document.getElementById('username');
const password = document.getElementById('password');
const user = document.getElementById('user')
const submit = document.getElementById('submit');

submit.addEventListener('click', () => {
    localStorage.setItem('username', username.value);
    localStorage.setItem('password', password.value);
    if (localStorage.getItem('password') == "123") {
        window.location.href = 'dashboard.html';
       
    } else {
        console.log('errore')

    }
})