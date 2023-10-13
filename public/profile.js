document.addEventListener("DOMContentLoaded", () => {

    console.log(document.cookie);
    // References to frequently accessed elements
    let form = document.getElementById('change-form');

    let usernameLabel = document.querySelector('#u-name');
    let emailLabel = document.querySelector('#e_mail');

    let usernameInput = document.querySelector('#uname');
    let emailInput = document.querySelector('#e-mail');
    let passwordInput = document.querySelector('#pswd');

    let usernameBttn = document.querySelector('#change_username_button');
    let emailBttn = document.querySelector('#change_email_button');
    let passwordBttn = document.querySelector('#change_pwd_button');

    let cookies = document.cookie.split(';');
    let usernameCookie = cookies.find(cookie => cookie.trim().startsWith('username='));
    let this_username = usernameCookie ? usernameCookie.split('=')[1] : null;
//    console.log(this_username)
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

    //''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    //grab all field values
//    let new_username = usernameInput.value;
//    let new_email = emailInput.value;
//    let new_password = passwordInput.value;

    fetch('/users/' + this_username)
        .then(response => response.json())
        .then(data => {
        //console.log(data);
        let user_username = data['username'];
        let user_email = data['email']

        usernameLabel.innerHTML = 'Username: ' + user_username;
        emailLabel.innerHTML = 'email: ' + user_email;

        usernameBttn.addEventListener('click', (event) => {

            // Submit PUT request to update username entry
            let db_records;
            let new_username = usernameInput.value;
            let formData = new FormData(form);
            let form_data = Object.fromEntries(formData.entries());
            fetch('/users')
                .then(response => response.json())
                .then(data => {
                    db_records = data;
                    //console.log(db_records);
                    //console.log(user_username);
                    //console.log(db_records['users'][0].username);
                    if (usernameExists(new_username, db_records)){
                        alert('That username is already being used.')
                    }else{
                        //console.log('running')
                        fetch('/users/username/'+user_username, {
                            method: 'PUT',
                            body: JSON.stringify(form_data),
                            headers: {
                            'Content-Type': 'application/json'
                            }
                        })
                            .then(response => response.json())
                            .then(data => {
                                user_username = new_username;
                                document.cookie = `username=${new_username}`;
                                usernameLabel.innerHTML = 'Username: ' +new_username ;
                            })
                        .catch(error => console.error(error));
                    }
                })
            .catch(error => console.error('Error:', error)); //end of fetch
        }) //end of username button event

        emailBttn.addEventListener('click', (event) => {

            // Submit PUT request to update email entry
            let db_records;
            let new_email = emailInput.value;
            let formData = new FormData(form);
            let form_data = Object.fromEntries(formData.entries());

            //check if the new email is in the right format
            if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(new_email)) {
                alert('Email should be in this format: username@domain.extension');
                return;
            }

            fetch('/users')
                .then(response => response.json())
                .then(data => {
                    db_records = data;
                    if (emailExists(new_email, db_records)){
                        alert('That email is already being used.')
                    }else{
                        fetch('/users/email/'+user_username, {
                            method: 'PUT',
                            body: JSON.stringify(form_data),
                            headers: {
                            'Content-Type': 'application/json'
                            }
                        })
                            .then(response => response.json())
                            .then(data => {
                                emailLabel.innerHTML = 'Email: ' + new_email;
                            })
                            .catch(error => console.error(error));
                    }
                })
            .catch(error => console.error('Error:', error)); //end of fetch
        }) //end of email button event

        passwordBttn.addEventListener('click', (event) => {

            // Submit PUT request to update password entry
            let db_records;
            let new_password = passwordInput.value;
            let formData = new FormData(form);
            let form_data = Object.fromEntries(formData.entries());

            console.log(new_password);

            fetch('/users')
                .then(response => response.json())
                .then(data => {
                    db_records = data;
                    if (new_password.length < 8
                        || !/[!@#$%^&*(),.?:{}|<>]/.test(new_password)
                        || !/\d/.test(new_password)
                        || !/[A-Z]/.test(new_password)
                        || !/[a-z]/.test(new_password)) {
                        alert('Password has to be at least 8 characters long and should contain at least 1 special character, at least 1 capital letter, at least 1 small letter and at least 1 number.');
                        return;
                    }
                        fetch('/users/password/' + user_username, {
                            method: 'PUT',
                            body: JSON.stringify(form_data),
                            headers: {
                            'Content-Type': 'application/json'
                            }
                        })
                        .then(response => response.json())
                        .then(data => {
                            alert('Password changed successfully')
                        })
                        .catch(error => console.error(error));
                })
            .catch(error => console.error('Error:', error)); //end of fetch
        }) //end of password button event

        }) //end of .then(data...

});//end of DOMContent