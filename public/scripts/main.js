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
    document.getElementById('cancel_link).style.visibility = 'visibility';
    document.getElementById("sub-btn").value = "Update User";
}

cancelEdit = () => {
    document.getElementById("wired_user_form").reset();
    document.getElementById("wired_user_form").action = '/user/enroll';
    document.getElementById('cancel_link).style.visibility = 'hidden';
}

formToJSON = (elements) => [].reduce.call(elements, (data, element) => {
                                    if (element.name) {
                                        data[element.name] = element.value;
                                    }
                                    return data;
                            }, {});

updateUser = (formObj) => {
    document.getElementById("wired_user_form").action = action;
    let inputs = formObj.elements;
    let new_data = formToJSON(inputs);
    let criteria = {"_id": new_data._id};

    console.log(formObj.action)
    delete new_data.id;

    let data = JSON.stringify({"criteria": criteria,
                "update": new_data});
   /* 
    fetch("/user/update", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: data
    })
    .then( (response) => {
        //do something awesome that makes the world a better place
    });
    */
}



