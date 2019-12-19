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
    document.getElementById("profile_card").setAttribute('name', rowObj.id);
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
                if (cell_name != "position") {
                    document.getElementById(cell_name).value = child.innerText;
                } else {
                    let coords = child.innerText.split(":");
                    document.getElementById("lng").value = coords[0];
                    document.getElementById("lat").value = coords[1];
                }
            }
        }
    }
    document.getElementById("id").value = ident;
    document.getElementById("wired_user_form").action = '/user/update';
    document.getElementById("cancel_link").style.visibility = 'visible';
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
    let data = JSON.stringify({"id": userId});
    let url = "/user/remove";
    let callback = () => {
        location.reload(true);
    };
}

/**
 *  Send a post request to delete the user and reload the page.
 *
 **/
findPeopleInRange  = () => {
  let message = "Enter a range in meters to see who is near ";
  message += document.getElementById("pname").innerText;
  var distance = prompt(message, "100");
  if (distance != null) {
     let personId = document.getElementById("profile_card").getAttribute("name");
     let data = JSON.stringify({"id": personId, "distance": parseInt(distance)});
     let url = "/user/rangeid";
     let callback = filterListing;

     goHunting(data, url, callback);
  }
}

/**
 * A generalize function to do some fetching ala 
 * the AJAX calls from days of old.
 *
 * @param: {data} JSON formatted string
 * @param: {url} string if the request url
 * @param  {function} callback function
 *
 **/
goHunting = (data, url, callback) => {

    fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: data
    })
    .then( (response) => {
        return response.json()
    })
    .then((finale) => {
        if (callback) {
            callback(finale);
        }
    })
    .catch((err) => {
        console.log(err);
    });
}

filterListing = (dataArray) => {
    let name = document.getElementById('pname').innerText;

    let visible = [];
    for (var datum of dataArray) {
        visible.push(datum._id);
    }   

    let rows = document.getElementsByTagName('tr');
    for (var row of rows) {
        if (row.id !== '') {
            if (!visible.includes(row.id)) {
                row.style.display = "none";
            }
        } else {
            row.addEventListener('click', fullListing, false);
        }
    }

    let message;
    let count = visible.length;
    if (count == 0) {
         message = "Apparently there is no one within that distance to " + name + "<br/>";
    } else {
        var phrase = (count == 1) ? `is ${count} person` : `are ${count} people`;
        message = "There " + phrase + " within that distance to " + name + ".<br/>";
    }
    message += "Click header to return to full listing.";
    document.getElementById("listmessage").innerHTML = message;
}

fullListing = () => {
    let rows = document.getElementsByTagName('tr');
    for (var row of rows) {
        if (row.id !== '') {
            row.style.display = "table-row";
        } else {
            row.removeEventListener('click', fullListing);
        }
    }

    document.getElementById("listmessage").innerHTML = '';
}

