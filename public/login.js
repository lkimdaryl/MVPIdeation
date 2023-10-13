document.addEventListener("DOMContentLoaded", () => {

//    console.log('running');
    // References to frequently accessed elements
    let form = document.getElementById('login-form');

    let usernameInput = document.querySelector('#uname');
    let passwordInput = document.querySelector('#pswd');

    usernameInput.value = "Sample";
    passwordInput.value = "Password1!";
    //''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    // Handle POST Requests
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        //grab all field values
        let username = usernameInput.value;
        let password = passwordInput.value;

        // Submit POST request to validate password entry
        let formData = new FormData(form);
        let form_data = JSON.stringify(Object.fromEntries(formData.entries()));
        fetch('/validate', {
            method: 'POST',
            body: form_data,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(response => {
//                console.log(response);
//                console.log(response.status.status_code);
//                console.log(response.status._headers['set-cookie']);
//                token = response.status._headers['set-cookie'].split(';')[0].split('=')[1];
                document.cookie = response.status._headers['set-cookie'];
                document.cookie = "username=" + username;
                console.log(document.cookie);

                if (response.status.status_code === 307){
                    window.location.href = "/mvp";
                }else if (response.status === 'fail') {
                    alert('Invalid username or password');
                }else{
                    console.error(response.error);
                    alert('Something went wrong');
                }
            })
        .catch(error => console.error('Error:', error));

    });//end of form event listener

});//end of DOMContent

//function getToken(cookieName) {
//    const cookies = document.cookie.split(';');
//
//    for (const cookie of cookies) {
//        const [name, value] = cookie.trim().split('=');
//        if (name === cookieName) {
//            return decodeURIComponent(value);
//        }
//    }
//    return null; // Cookie not found
//}