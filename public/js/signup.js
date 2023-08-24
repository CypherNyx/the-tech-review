console.log("linked");
const signupFormHandler = async (event) => {
    event.preventDefault();

    const username = document.querySelector('#user-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    if (username && email && password) {
        const response = await fetch('/api/user/', {
            method: 'POST',
            body: JSON.stringify({
                username,
                email,
                password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            alert('Account successfully created. You are now logged in.')
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    }
}
document.querySelector('.signup-form')
.addEventListener('submit', signupFormHandler);