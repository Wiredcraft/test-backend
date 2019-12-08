loadProfile = (rowObj) => {
    let fields = ["pname", "page", "pdob", "paddress", "pdescription", "pdate"];
    const it = fields[Symbol.iterator]();

    for (const child of rowObj.children) {
        let domObjName = it.next().value;
        console.log(domObjName);
        document.getElementById(domObjName).innerText = child.innerText;
        //alert("Cell Value is " + child.innerText);
    }
        document.getElementById("profile_card").style.visibility = "visible";
}
