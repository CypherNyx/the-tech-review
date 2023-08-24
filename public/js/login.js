console.log("linked");
const loginFormHandler = async (event) => {
    event.preventDefault();

    // Collect values from the login form
    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    if (email && password) {
        // Send a POST request to the API endpoint
        const response = await fetch('/api/user/login', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(response);
        if (response.ok) {
            // If successful, redirect the browser to the profile page
            document.location.replace('/dashboard');
            console.log("logged in");
        } else {
            alert(response.statusText);
        }
    }
};
document.querySelector('.login-form')
.addEventListener('submit', loginFormHandler);