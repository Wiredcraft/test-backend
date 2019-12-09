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

loadEditor = (someObj) => {
    let rowObj =  someObj.parentElement.parentElement;
   
    for (const child of rowObj.children) {
        let cell_name = child.getAttribute("name");
        if (document.getElementById(cell_name)) {
            if (cell_name !== null || cell_name !== "age") {
                document.getElementById(cell_name).value = child.innerText;
            }
        }
    }
    
    document.getElementById("sub-btn").value = "Update User";
}



