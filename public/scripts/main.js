/**
 *  Attach confirmation function to the delete button to confirm
 *  the deletion of a user.
 **/
window.onload = () => {
    var elems = document.getElementsByClassName('confirmation');
    var confirmIt = function (e) {
        let rowElem = e.currentTarget.parentElement.parentElement;
        let message = "Are you sure you want to delete\n";
        message += rowElem.children[0].innerText + "?";
        if (!confirm(message)){
            e.preventDefault();
        } else {
            deleteUser(rowElem.id);
        }
    };
    for (var i = 0, l = elems.length; i < l; i++) {
        elems[i].addEventListener('click', confirmIt, false);
    }
}

/**
 * Load profile data into div element for viewing
 *
 **/
loadProfile = (rowObj) => {

    for (const child of rowObj.children) {
        let cell_name = child.getAttribute("name");
        if (cell_name !== null) {
            let profile_name = 'p' + cell_name;
            document.getElementById(profile_name).innerText = child.innerText;
        }
    }
    document.getElementById("profile_card").style.visibility = "visible";
}

/**
 *  Load user information for updating, change the form action, make
 *  the canel link visible, and change the button text.
 **/
loadEditor = (someObj, ident) => {
    let rowObj =  someObj.parentElement.parentElement;
   
    for (const child of rowObj.children) {
        let cell_name = child.getAttribute("name");
        if (document.getElementById(cell_name)) {
            if (cell_name !== null || cell_name !== "age") {
                document.getElementById(cell_name).value = child.innerText;
            }
        }
    }
    document.getElementById("_id").value = ident;
    document.getElementById("wired_user_form").action = '/user/update';
    console.log(document.getElementById("cancel_link").style.visibility);
    document.getElementById("cancel_link").style.visibility = 'visible';
    console.log(document.getElementById("cancel_link").style.visibility);
    document.getElementById("sub-btn").value = "Update User";
}

/**
 *  Clear out user information from form, change the form action, make
 *  the canel link hidden, and change the button text.
 **/
cancelEdit = () => {
    document.getElementById("wired_user_form").reset();
    document.getElementById("wired_user_form").action = '/user/enroll';
    document.getElementById("sub-btn").value = "Add User";
    document.getElementById("cancel_link").style.visibility = 'hidden';
}

/**
 *  Send a post request to delete the user and reload the page.
 *
 **/
deleteUser = (userId) => {
    let data = JSON.stringify({"_id": userId});
  
    fetch("/user/remove", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: data
    })
    .then( (response) => {
        location.reload(true);
    });
}
