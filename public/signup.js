document.addEventListener("DOMContentLoaded", () => {
    // References to frequently accessed elements
    let form = document.getElementById('login-form');
    let firstnameInput = document.querySelector('#first_name');
    let lastnameInput = document.querySelector('#last_name');
    let emailInput = document.querySelector('#e-mail');
    let pidInput = document.querySelector('#student_id');
    let usernameInput = document.querySelector('#uname');
    let passwordInput = document.querySelector('#pswd');
    let confirmPasswordInput = document.querySelector('#pswd2');

    //''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    //helper functions
    function usernameExists(username, db_records) {
        for (let i = 0; i < db_records['users'].length; i++) {
            if (db_records['users'][i].username === username) {
                return true;
            }
        }
        return false;
    }

    function emailExists(email, db_records) {
        for (let i = 0; i < db_records['users'].length; i++) {
            if (db_records['users'][i].email.toString() === email) {
                return true;
                }
            }
        return false;
    }

    function pidExists(pid, db_records) {
        for (let i = 0; i < db_records['users'].length; i++) {
            if (db_records['users'][i].pid.toString() === pid) {
                return true;
            }
        }
        return false;
    }
    //''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    // Handle POST Requests
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        //grab all field values
        let firstname = firstnameInput.value;
        let lastname = lastnameInput.value;
        let email = emailInput.value;
        let pid = pidInput.value;
        let username = usernameInput.value;
        let password = passwordInput.value;
        let confirmPassword = confirmPasswordInput.value;

        let db_records;
        fetch('/users')
            .then(response => response.json())
            .then(data => {
                db_records = data;

                //check to see if username already exists in db_records
                if (usernameExists(username, db_records)) {
                    alert("Username already exists. Please choose a different username.");
                    return;
                }

                //check to see if email already exists in db_records
                if (emailExists(email, db_records)) {
                    alert("Email already exists. Please use a different email.");
                    return;
                }

                //check to see if pid already exists in db_records
                if (pidExists(pid, db_records)) {
                    alert("PID already exists. Please enter a different PID.");
                    return;
                }

                //        Validate all the fields
                let isValid = true;

                 if (!/^[a-zA-Z ]+$/.test(firstname)) {
                    alert('First name cannot contain special characters or numbers.');
                    isValid = false;
                    return;
                }

                if (!/^[a-zA-Z]+$/.test(lastname)) {
                    isValid = false;
                    alert('Last name cannot contain special characters or numbers.');
                    return;
                }

                if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
                    alert('Email should be in this format: username@domain.extension');
                    isValid = false;
                    return;
                }

                if (!/^\d{9}$/.test(pid)) {
                    alert('PID has to be 9 characters long and contains only numbers.');
                    isValid = false;
                    return;
                }

                if (password.length < 8 || !/[!@#$%^&*(),.?:{}|<>]/.test(password) || !/\d/.test(password) || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
                    alert('Password has to be at least 8 characters long and should contain at least 1 special character, at least 1 capital letter, at least 1 small letter and at least 1 number.');
                    isValid = false;
                    return;
                }

                if (password !== confirmPassword) {
                    alert('Confirm password has to match password.');
                    isValid = false;
                    return;
                }

                // Submit POST request to create user entry
                let formData = new FormData(form);
                let form_data = JSON.stringify(Object.fromEntries(formData.entries()));

                if(isValid !== false){
                    fetch('/create_user', {
                        method: 'POST',
                        body: form_data,
                        headers: { 'Content-Type': 'application/json' }
                    })
                    .then(response => {
                        console.log(response);
                        if (response.status === 200){
                            window.location.href = '/login'
                        }else{
                            alert('Something went wrong.')
                        }
                    })
                    .catch(error => console.error('Error:', error));
                }
            })
            .catch(error => console.error('Error:', error));
    });//end of form event listener
});//end of DOMContent