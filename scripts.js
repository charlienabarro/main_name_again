//show the profile form
document.getElementById('profile-link').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('profile-form').style.display = 'block'; // Show the profile form
    document.getElementById('profile-form').scrollIntoView({ behavior: 'smooth' });

});

//checks to see if you have a profile
document.getElementById('profile_checker').addEventListener('click', function(event) {
    event.preventDefault();
    console.log('Profile button clicked');

    const profile = localStorage.getItem('profile')
    const formTitle = document.getElementById('profile-form-title');
    if (profile){
        console.log('found profile')
        formTitle.innerText = 'Edit Your Profile';
        const profileData = JSON.parse(profile);
        document.getElementById('username').value = profileData.username;
        document.getElementById('bio').value = profileData.bio;
        document.getElementById('username1').value = profileData.socialMedia.facebook;
        document.getElementById('username2').value = profileData.socialMedia.twitter;
        document.getElementById('username3').value = profileData.socialMedia.instagram;
        document.getElementById('username4').value = profileData.socialMedia.snapchat;
        document.getElementById('username5').value = profileData.socialMedia.linkedin;

        document.getElementById('profile-form').style.display = 'block'; // Show the profile form
         document.getElementById('profile-form').scrollIntoView({ behavior: 'smooth' });
    }
    else {
        formTitle.innerText = 'Create Your Profile';
        alert("You have not created a profile yet. Please press on the 'create your profile' button")
    }

});



//when the "Home" link is clicked
document.getElementById('home-link').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('profile-form').style.display = 'none'; // Hide the profile form
    document.getElementById('search-bar-div').style.display = 'none'; // Hide the profile form
    var other_people_div = document.getElementById('other-people-label')
    other_people_div.innerHTML='People you might be interested in'
    populateRows()
});

//Hide profile form when back is pressed
document.getElementById('hide-profile').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('profile-form').style.display = 'none'; // Hide the profile form
});



//toggles the inputs for the accounts selected and saves them
function toggleUsernameInput(checkbox, usernameInput) {
        if (checkbox.checked) {
            usernameInput.style.display = 'block'; // Show input when checkbox is checked
        } else {
            usernameInput.style.display = 'none'; // Hide input when checkbox is unchecked
        }
    }

    // Get checkboxes and username input fields
    const account1Checkbox = document.getElementById('account1');
    const account2Checkbox = document.getElementById('account2');
    const account3Checkbox = document.getElementById('account3');
    const account4Checkbox = document.getElementById('account4');
    const account5Checkbox = document.getElementById('account5');

    const username1Input = document.getElementById('username1');
    const username2Input = document.getElementById('username2');
    const username3Input = document.getElementById('username3');
    const username4Input = document.getElementById('username4');
    const username5Input = document.getElementById('username5');

    // Listen for changes to checkboxes
    account1Checkbox.addEventListener('change', function() {
        toggleUsernameInput(account1Checkbox, username1Input);
    });
    account2Checkbox.addEventListener('change', function() {
        toggleUsernameInput(account2Checkbox, username2Input);
    });
    account3Checkbox.addEventListener('change', function() {
        toggleUsernameInput(account3Checkbox, username3Input);
    });
    account4Checkbox.addEventListener('change', function() {
        toggleUsernameInput(account4Checkbox, username4Input);
    });
    account5Checkbox.addEventListener('change', function() {
        toggleUsernameInput(account5Checkbox, username5Input);
    });



    //saving data for your profile
    document.getElementById('profile-details-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent form submission

    // Collect form data
    const username = document.getElementById('username').value;
    const bio = document.getElementById('bio').value;

    // Collect username data for each selected social media platform
    const facebookUsername = document.getElementById('username1').value;
    const twitterUsername = document.getElementById('username2').value;
    const instagramUsername = document.getElementById('username3').value;
    const snapchatUsername = document.getElementById('username4').value;
    const linkedinUsername = document.getElementById('username5').value;

    // Create an object with the collected data
    const profileData = {
        username: username,
        bio: bio,
        socialMedia: {
            facebook: facebookUsername,
            twitter: twitterUsername,
            instagram: instagramUsername,
            snapchat: snapchatUsername,
            linkedin: linkedinUsername
        }
    };
    // Save to localStorage
    localStorage.setItem('profile', JSON.stringify(profileData));

    document.getElementById('profile-form').style.display = 'none'; // Hide the profile form
    document.getElementById('profile-link').style.display = 'none';

    // Send the data to the server
    fetch('http://localhost:3001/api/save-profile', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
})
    .then(response => {
        if (!response.ok) {
            // If the response isn't OK, throw an error
            console.error('Response not ok:', response.statusText);
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
})
    .then(data => {
        console.log(data);
        if (data.success) {
            alert('Profile saved successfully!');
        } else {
            alert('Error saving profile!');
        }
})
    .catch(error => {
        console.error('Error:', error);
        alert('Network error: ' + error.message);
    });

});

populateRows()

    //retrieves profile data and populate content row
function populateRows(searchedItem = '') {
        // Fetch profiles from the backend
        fetch('http://localhost:3001/api/profiles')
            .then(response => response.json())
            .then(profiles => {
                const profileContentRow = document.getElementById('profile-content-row');
                profileContentRow.innerHTML = '';  // Clear the row before adding new profiles

                // Loop through each profile and create a card for each
                profiles.forEach(profile => {
                    const profileCard = document.createElement('div');
                    profileCard.classList.add('col-md-4', 'mb-5');  // Bootstrap grid for 3 profiles per row
                    profileCard.setAttribute('data-profile-id', profile.username);  // Store the username in the card

                    profileCard.innerHTML = `
                    <div class="card h-100">
                        <div class="card-body">
                            <h2 class="card-title">${profile.username}</h2>
                            <p class="card-text">${profile.bio}</p>
                        </div>
                        <div class="card-footer">
                            <a class="btn btn-primary btn-sm" href="javascript:void(0);" data-username="${profile.username}">Find ${profile.username}'s Links</a>
                        </div>
                    </div>
                `;

                    // Append the card to the content row
                    profileContentRow.appendChild(profileCard);
                });

                // Add event listeners to all "Find X's Links" buttons
                const profileButtons = document.querySelectorAll('.card-footer .btn');
                profileButtons.forEach(button => {
                    button.addEventListener('click', function () {
                        const username = this.getAttribute('data-username');  // Get the username from the button's data-attribute
                        const profile = profiles.find(p => p.username === username);  // Find the profile by username

                        // Get the profile card element
                        const profileCard = this.closest('.col-md-4');

                        // Modify the profile card content to display detailed information
                        profileCard.innerHTML = `
                    <div class="card h-100" id="individual-profile">
                        <div class="card-body">
                            <h2 class="card-title">${profile.username}</h2>
                            <p class="card-text">${profile.bio}</p>
                            <p>Facebook: <a href="https://facebook.com/${profile.socialMedia.facebook}" target="_blank">${profile.socialMedia.facebook}</a></p>
                            <p>Twitter: <a href="https://twitter.com/${profile.socialMedia.twitter}" target="_blank">${profile.socialMedia.twitter}</a></p>
                            <p>Instagram: <a href="https://instagram.com/${profile.socialMedia.instagram}" target="_blank">${profile.socialMedia.instagram}</a></p>
                            <p>Snapchat: <a href="https://snapchat.com/add/${profile.socialMedia.snapchat}" target="_blank">${profile.socialMedia.snapchat}</a></p>
                            <p>LinkedIn: <a href="https://linkedin.com/in/${profile.socialMedia.linkedin}" target="_blank">${profile.socialMedia.linkedin}</a></p>
                        </div>
                        <div class="card-footer">
                            <a class="btn btn-secondary btn-sm" href="javascript:void(0);" id="back-to-all-profiles">Back</a>
                        </div>
                    </div>
                `;

                        // Hide all other profiles when one is selected
                        const allProfiles = document.querySelectorAll('.col-md-4');
                        allProfiles.forEach(profile => {
                            profile.style.display = 'none';  // Hide all profiles
                        });

                        // Show the selected profile
                        profileCard.style.display = 'block';  // Show the selected profile
                    });
                });



                // Add event listener for "Back to All Profiles" button
                document.getElementById('profile-content-row').addEventListener('click', function (event) {
                    if (event.target && event.target.id === 'back-to-all-profiles') {
                        event.preventDefault();

                        // Find the individual profile container
                        const profileCard = event.target.closest('.col-md-4');

                        // Reset the content of the profile to just username and bio
                        const profileData = profiles.find(p => p.username === profileCard.getAttribute('data-profile-id'));

                        profileCard.innerHTML = `
                    <div class="card h-100">
                        <div class="card-body">
                            <h2 class="card-title">${profileData.username}</h2>
                            <p class="card-text">${profileData.bio}</p>
                        </div>
                        <div class="card-footer">
                            <a class="btn btn-primary btn-sm" href="javascript:void(0);" id="" data-username="${profileData.username}">Find ${profileData.username}'s Links</a>
                        </div>
                    </div>
                `;

                        // Show all profiles again by changing their display to block
                        const allProfileCards = document.querySelectorAll('.col-md-4');
                        allProfileCards.forEach(card => {
                            card.style.display = 'block';  // Make sure all profile cards are visible again
                        });
                    }
                });

            })
            .catch(error => {
                console.error('Error fetching profiles:', error);
            });
}

//toggles search bar
document.getElementById('search-bar').addEventListener('click', function(event) {
    event.preventDefault();

    const searchBar = document.getElementById('search-bar-div');

    // Toggle visibility of the search bar
    if (searchBar.style.display === 'none' || searchBar.style.display === '') {
        searchBar.style.display = 'block'; // Show search bar
    } else {
        searchBar.style.display = 'none'; // Hide search bar
    }
});


// Search function
document.getElementById('search-profile').addEventListener('click', function(event) {
    event.preventDefault();
    const searchedItem = document.getElementById('search-input').value.toLowerCase();
    console.log("Searched for: " + searchedItem);

    // Fetch profiles from the server
    fetch('http://localhost:3001/api/profiles')
        .then(response => response.json())
        .then(profiles => {
            const all_profiles = document.getElementById('profile-content-row');
            all_profiles.innerHTML = ''; // Clear previous search results

            // Loop through each profile and check if any field contains the search term
            profiles.forEach(profile => {
                const usernameMatch = profile.username.toLowerCase().includes(searchedItem);
                const bioMatch = profile.bio.toLowerCase().includes(searchedItem);

                // If any match is found, display the profile
                if (usernameMatch || bioMatch) {
                    const profileCard = document.createElement('div');
                    profileCard.classList.add('col-md-4', 'mb-5');
                    profileCard.setAttribute('data-profile-id', profile.username); // Store the username in the card

                    profileCard.innerHTML = `
                        <div class="card h-100">
                            <div class="card-body">
                                <h2 class="card-title">${profile.username}</h2>
                                <p class="card-text">${profile.bio}</p>
                            </div>
                            <div class="card-footer">
                                <a class="btn btn-primary btn-sm" href="javascript:void(0);" data-username="${profile.username}" id="">Find ${profile.username}'s Links</a>
                            </div>
                        </div>
                    `;
                    // Append the card to the content row
                    all_profiles.appendChild(profileCard);

                    // Reattach event listener to the new "Find Links" button
                    const profileButton = profileCard.querySelector('.card-footer .btn');
                    profileButton.addEventListener('click', function() {
                        const username = this.getAttribute('data-username');
                        const selectedProfile = profiles.find(p => p.username === username);

                        // Update profile card with detailed information
                        profileCard.innerHTML = `
                            <div class="card h-100">
                                <div class="card-body">
                                    <h2 class="card-title">${selectedProfile.username}</h2>
                                    <p class="card-text">${selectedProfile.bio}</p>
                                    <p>Facebook: <a href="https://facebook.com/${selectedProfile.socialMedia.facebook}" target="_blank">${selectedProfile.socialMedia.facebook}</a></p>
                                    <p>Twitter: <a href="https://twitter.com/${selectedProfile.socialMedia.twitter}" target="_blank">${selectedProfile.socialMedia.twitter}</a></p>
                                    <p>Instagram: <a href="https://instagram.com/${selectedProfile.socialMedia.instagram}" target="_blank">${selectedProfile.socialMedia.instagram}</a></p>
                                    <p>Snapchat: <a href="https://snapchat.com/add/${selectedProfile.socialMedia.snapchat}" target="_blank">${selectedProfile.socialMedia.snapchat}</a></p>
                                    <p>LinkedIn: <a href="https://linkedin.com/in/${selectedProfile.socialMedia.linkedin}" target="_blank">${selectedProfile.socialMedia.linkedin}</a></p>
                                </div>
                                <div class="card-footer">
                                    <a class="btn btn-secondary btn-sm" href="javascript:void(0);" id="back-to-all-profiles">Back</a>
                                </div>
                            </div>
                        `;
                    });
                }
            });

            // Change "People you might be interested in" to "Results"
            var other_people_div = document.getElementById('other-people-label');
            other_people_div.innerHTML = 'Results:';
            document.getElementById('other-people-label').scrollIntoView({ behavior: 'smooth' });
        })
        .catch(error => {
            console.error('Error fetching profiles:', error);
        });
});

