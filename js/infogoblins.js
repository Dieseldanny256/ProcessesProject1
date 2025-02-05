const urlBase = 'http://infogoblins.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let loginMode = "login";
let numContacts = 0;
let goblinized = false;
let disabled_contact = false;
let disabled_login = false;
let errorColor;
let validColor;

function loadColors() {
    errorColor = window.getComputedStyle(document.body).getPropertyValue("--accent-color-2");
    validColor = window.getComputedStyle(document.body).getPropertyValue("--accent-color-1");
}

function doLogin()
{
    //Set initial values for the userId, firstName, and lastName
    userId = 0;
    firstName = "";
    lastName = "";

    let username = document.getElementById("loginName").value; //Get username from username field
    let password = document.getElementById("loginPassword").value; //Get password from password field

    document.getElementById("loginResult").innerHTML = ""; //Set the result message field to nothing

    let packet = {"login":username, "password":password}; //Generate a packet to send
    let jsonPayload = JSON.stringify(packet); //Generates the packet

    let url = urlBase + '/Login.' + extension //generates the login page url

    let xhr = new XMLHttpRequest(); //Generates a new HttpRequest object
    xhr.open("POST", url, true); //Initializes the xhr module for requests
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        //Called when the packet is recieved
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText); //Converts the packet to an object
				userId = jsonObject.id; //sets the userId to this newly obtained userId 
		
				if( userId < 1 ) //userId == 0 indicates invalid login
				{		
					document.getElementById("loginResult").innerHTML = "Username or password incorrect!";
					return;
				}
                
                //Login was valid
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie(); //Saves the cookie (whatever that means)
                
				window.location.href = "contacts.html"; //Redirects to the main page
            }
        };
        xhr.send(jsonPayload); //Send the packet
    }
    catch(err)
    {
        document.getElementById("loginResult").innerHTML = err.message; //Displays the error
    }
}

function doSignUp()
{ 
    //Set initial values for the userId, firstName, and lastName
    userId = 0;
    firstName = "";
    lastName = "";

    //Get values from field
    let newFirstName = document.getElementById("firstName").value;
    let newLastName = document.getElementById("lastName").value;
    let username = document.getElementById("registerName").value;
    let password = document.getElementById("registerPassword").value;

    document.getElementById("registerResult").innerHTML = ""; //Set the result message field to nothing

    let packet = {"firstName":newFirstName, "lastName":newLastName, "login":username, "password":password}; //Generate a packet to send
    let jsonPayload = JSON.stringify(packet); //Generates the packet

    let url = urlBase + '/SignUp.' + extension //generates the signUp url

    let xhr = new XMLHttpRequest(); //Generates a new HttpRequest object
    xhr.open("POST", url, true); //Initializes the xhr module for requests
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        //Called when the packet is recieved
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText); //Converts the packet to an object
                if (jsonObject.error != "") {
                    document.getElementById("registerResult").innerHTML = jsonObject.error;
					return;
                }
				userId = jsonObject.results[0].id; //sets the userId to this newly obtained userId 
                
                //Registration was valid
				firstName = newFirstName;
				lastName = newLastName;

				saveCookie(); //Saves the cookie (whatever that means)
                
				window.location.href = "contacts.html"; //Redirects to the main page
            }
        };
        xhr.send(jsonPayload); //Send the packet
    }
    catch(err)
    {
        document.getElementById("registerResult").innerHTML = err.message; //Displays the error
    }
}

function switchToRegister() 
{
    if (loginMode === "register") {
        return;
    }
    document.getElementById("Login").classList.add("hidden");
    document.getElementById("Register").classList.remove("hidden");
    loginMode = "register";

    document.getElementById("lastName").value = "";
    document.getElementById("firstName").value = "";
    document.getElementById("registerName").value = "";
    document.getElementById("registerPassword").value = "";

    document.getElementById("registerResult").innerHTML = "";
    document.getElementById("lengthError").innerHTML = "";
    document.getElementById("numberError").innerHTML = "";
    document.getElementById("symbolError").innerHTML = "";
    document.getElementById("capitalError").innerHTML = "";
    document.getElementById("passwordRequirementsHeading").innerHTML = "";
    document.getElementById("registerPassword").style.borderColor = null;
    document.getElementById("registerButton").disabled = false;
}

function switchToLogin()
{
    if (loginMode === "login") {
        return;
    }
    document.getElementById("Login").classList.remove("hidden");
    document.getElementById("Register").classList.add("hidden");
    loginMode = "login";

    document.getElementById("loginName").value = "";
    document.getElementById("loginPassword").value = "";

    document.getElementById("loginResult").innerHTML = "";
}

function saveCookie()
{
    //Generates a brand new cookie that saves the user's login information for 20 minutes
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie; //Returns the cookies on the webpage
	let splits = data.split(","); //Splits up the fields
	for(var i = 0; i < splits.length; i++) //Iterates over all fields
	{
		let cookie = splits[i].trim(); //Gets rid of ending whitespace
		let tokens = cookie.split("="); //Splits the key from the value
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt(tokens[1].trim());
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html"; //Jump to login page
	}
	else
	{
		document.getElementById("name").innerHTML = firstName + " " + lastName; //Login to the page
	}
}

function loadContactData()
{
    let search_string = document.getElementById("searchBar").value;
    let packet = {"search":search_string, "userId":userId}; //Generate a packet to send (search for empty string)
    let jsonPayload = JSON.stringify(packet); //Generates the packet

    let url = urlBase + '/SearchContacts.' + extension //generates the signUp url

    let xhr = new XMLHttpRequest(); //Generates a new HttpRequest object
    xhr.open("POST", url, true); //Initializes the xhr module for requests
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        //Called when the packet is recieved
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                let tableData = "";
                let jsonObject = JSON.parse(xhr.responseText); //Converts the packet to an object
                if (jsonObject.error != "") {
                    //Add error text here
                    document.getElementById("contactTable").innerHTML = tableData;
                    if (jsonObject.error === "No Records Found")
                    {
                        document.getElementById("contactTableDiv").classList.add("hidden");
                        document.getElementById("noContactsDiv").classList.remove("hidden");
                    }
                    if (goblinized)
                        {
                            //Hide all goblins
                            for (let goblinID in goblins)
                            {
                                goblins[goblinID].div.classList.add("hidden");
                            }
                        }
					return;
                } 
                
                //Contacts were loaded sucessfully
                document.getElementById("contactTableDiv").classList.remove("hidden");
                document.getElementById("noContactsDiv").classList.add("hidden");

                //For each contact in the results array
                jsonObject.results.sort(function(a, b){return a.FirstName.localeCompare(b.FirstName)});
                numContacts = jsonObject.results.length
				for (let i = 0; i < numContacts; i++) {
                    //Name
                    tableData += `<tr id=row${jsonObject.results[i].ID}><td class="tableCell" style="border-right:none;">${jsonObject.results[i].FirstName}</td>`
                    tableData += `<td class="tableCell" style="border-left:none;">${jsonObject.results[i].LastName}</td>`
                    //Phone
                    let phone_num = jsonObject.results[i].Phone.toString();
                    tableData += `<td class="tableCell">(${phone_num.substring(0, 3)}) ${phone_num.substring(3, 6)}-${phone_num.substring(6)}</td>`
                    //Email
                    tableData += `<td class="tableCell">${jsonObject.results[i].Email}</td>`
                    tableData += 
                    `<td class="tableCell">
                        <button type="button" id="editRow${jsonObject.results[i].ID}" class="editButton" onClick="switchToEditContact(${jsonObject.results[i].ID});">
                            <span class="material-icons">edit</span>
                        </button>
                        <button type="button" id="deleteRow${jsonObject.results[i].ID}" class="deleteButton" onClick="showDeleteConfirm(${jsonObject.results[i].ID});">
                            <span class="material-icons">delete</span>
                        </button>
                    </td></tr>`
                }

                document.getElementById("contactTable").innerHTML = tableData;

                if (goblinized)
                {
                    //Check for changes
                    for (let goblinID in goblins)
                    {
                        let found = false;
                        for (let contact of jsonObject.results)
                        {
                            if (contact.ID == goblinID)
                            {
                                found = true;
                                goblins[goblinID].div.classList.remove("hidden");
                                break;
                            }
                        }
                        if (!found && !goblins[goblinID].removed) goblins[goblinID].div.classList.add("hidden");
                    }
                }
            }
        };
        xhr.send(jsonPayload); //Send the packet
    }
    catch(err)
    {
        //Displays the error
        document.getElementById("contactTable").innerHTML = "";
    }
}

function showDeleteConfirm(id)
{
    document.getElementById("confirmDeleteButton").onclick = function() {deleteContact(id); hideDeleteConfirm();};
    document.getElementById("deleteConfirm").style.display = "block";
    let row = Array.from(document.getElementById(`row${id}`).cells);
    let contactName = row[0].innerHTML + " " + row[1].innerHTML;
    document.getElementById("deleteConfirmMsg").innerHTML = contactName + " will be deleted forever! Are you sure about this?"
}

function hideDeleteConfirm()
{
    document.getElementById("deleteConfirm").style.display = "none";
}

function switchToAddContact()
{
    document.getElementById("contactsMenu").classList.add("hidden");
    document.getElementById("editContactsMenu").classList.remove("hidden");
    document.getElementById("submitButton").innerHTML = "Add";
    document.getElementById("submitButton").onclick = function() {addContact();};
    document.getElementById("editContactTitle").innerHTML = "Add Contact:";
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("phoneNumber").value = "";
    document.getElementById("email").value = "";
}

function switchToEditContact(id)
{
    document.getElementById("contactsMenu").classList.add("hidden");
    document.getElementById("editContactsMenu").classList.remove("hidden");
    document.getElementById("submitButton").innerHTML = "Save Changes";
    document.getElementById("submitButton").onclick = function() {editContact(id);}
    document.getElementById("editContactTitle").innerHTML = "Edit Contact:";
    document.getElementById("phoneNumber").style.borderColor = null;
    document.getElementById("email").style.borderColor = null;

    //Load in the current data:
    let row = Array.from(document.getElementById(`row${id}`).cells); //Gets the data in all the rows
    row = row.slice(0, 4);
    phone_num = row[2].innerHTML.substring(1, 4) + row[2].innerHTML.substring(6, 9) + row[2].innerHTML.substring(10);

    document.getElementById("firstName").value = row[0].innerHTML;
    document.getElementById("lastName").value = row[1].innerHTML;
    document.getElementById("phoneNumber").value = phone_num;
    document.getElementById("email").value = row[3].innerHTML;
}

function switchToContactsMenu() 
{
    document.getElementById("contactsMenu").classList.remove("hidden");
    document.getElementById("editContactsMenu").classList.add("hidden");
    document.getElementById("phoneNumber").style.borderColor = null;
    document.getElementById("email").style.borderColor = null;
    document.getElementById("phoneError").innerHTML = "";
    document.getElementById("emailError").innerHTML = "";
}

function addContact()
{
    //Get values from field
    let contactFirstName = document.getElementById("firstName").value;
    let contactLastName = document.getElementById("lastName").value;
    let phoneNum = document.getElementById("phoneNumber").value;
    let email = document.getElementById("email").value;

    //document.getElementById("registerResult").innerHTML = ""; //Set the result message field to nothing

    let packet = {"firstName":contactFirstName, "lastName":contactLastName, "phone":phoneNum, "email":email, "userId":userId}; //Generate a packet to send
    let jsonPayload = JSON.stringify(packet); //Generates the packet

    let url = urlBase + '/AddContacts.' + extension //generates the signUp url

    let xhr = new XMLHttpRequest(); //Generates a new HttpRequest object
    xhr.open("POST", url, true); //Initializes the xhr module for requests
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        //Called when the packet is recieved
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText); //Converts the packet to an object
                if (jsonObject.error != "") {
                    document.getElementById("editResult").innerHTML = jsonObject.error;
                    document.getElementById("editResult").style.color = errorColor;
                    fadeResult();
                    switchToContactsMenu();
					return;
                }
                //Contact was added successfully
				document.getElementById("editResult").innerHTML = jsonObject.message;
                document.getElementById("editResult").style.color = validColor;
                fadeResult();
                if (goblinized) goblins[jsonObject.contactId] = new Goblin(jsonObject.contactId, 
                    contactFirstName, contactLastName);
                loadContactData(); //Reload the contact data
                switchToContactsMenu();
            }
        };
        xhr.send(jsonPayload); //Send the packet
    }
    catch(err)
    {
        document.getElementById("editResult").innerHTML = err.message; //Displays the error
        fadeResult();
        switchToContactsMenu();
    }
}

function editContact(id)
{
    //Get values from field
    let contactFirstName = document.getElementById("firstName").value;
    let contactLastName = document.getElementById("lastName").value;
    let phoneNum = document.getElementById("phoneNumber").value;
    let email = document.getElementById("email").value;

    //document.getElementById("registerResult").innerHTML = ""; //Set the result message field to nothing

    let packet = {"id":id, "newFirstName":contactFirstName, "newLastName":contactLastName, "phone":phoneNum, "email":email}; //Generate a packet to send
    let jsonPayload = JSON.stringify(packet); //Generates the packet

    let url = urlBase + '/UpdateContacts.' + extension //generates the signUp url

    let xhr = new XMLHttpRequest(); //Generates a new HttpRequest object
    xhr.open("POST", url, true); //Initializes the xhr module for requests
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        //Called when the packet is recieved
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText); //Converts the packet to an object
                if (jsonObject.error != "") {
                    document.getElementById("editResult").innerHTML = jsonObject.error;
                    switchToContactsMenu();
                    document.getElementById("editResult").style.color = errorColor;
                    fadeResult();
					return;
                }
                //Contact was added successfully
				document.getElementById("editResult").innerHTML = jsonObject.message;
                loadContactData(); //Reload the contacts menu
                switchToContactsMenu();
                document.getElementById("editResult").style.color = validColor;
                fadeResult();
                if (goblinized)
                {
                    goblins[id].nameBox.textContent = contactFirstName + " " + contactLastName;
                }
            }
        };
        xhr.send(jsonPayload); //Send the packet
    }
    catch(err)
    {
        document.getElementById("editResult").innerHTML = err.message; //Displays the error
        document.getElementById("editResult").style.color = errorColor;
        fadeResult();
        switchToContactsMenu();
    }
}

function validatePassword()
{
    let lengthRegex = /^(\S){8,}$/; //Contains at least 8 chars
    let numberRegex = /^(.*)([0-9]+)(.*)/; //Contains one or more digit
    let capitalRegex = /^(.*)([A-Z]+)(.*)/; //Contains one or more capital letter
    let symbolRegex = /^(.*)(\W|_+)(.*)/; //Containts one or more special characters
    let errors = false;

    let passwordElement = document.getElementById("registerPassword");
    if (!lengthRegex.test(passwordElement.value))
    {
        document.getElementById("lengthError").innerHTML = "8 or more characters";
        errors = true;
    }
    else
    {
        document.getElementById("lengthError").innerHTML = "";
    }

    if (!numberRegex.test(passwordElement.value))
    {
        document.getElementById("numberError").innerHTML = "1 or more digits";
        errors = true;
    }
    else
    {
        document.getElementById("numberError").innerHTML = "";
    }

    if (!capitalRegex.test(passwordElement.value))
    {
        document.getElementById("capitalError").innerHTML = "1 or more capital letters";
        errors = true;
    }
    else
    {
        document.getElementById("capitalError").innerHTML = "";
    }

    if (!symbolRegex.test(passwordElement.value))
    {
        document.getElementById("symbolError").innerHTML = "1 or more special characters";
        errors = true;
    }
    else
    {
        document.getElementById("symbolError").innerHTML = "";
    }

    if (errors)
    {
        document.getElementById("passwordRequirementsHeading").innerHTML = "Password must contain:";
        document.getElementById("registerButton").disabled = true;
        document.getElementById("registerPassword").style.borderColor = errorColor;
    }
    else
    {
        document.getElementById("registerPassword").style.borderColor = null;
        document.getElementById("passwordRequirementsHeading").innerHTML = "";
        document.getElementById("registerButton").disabled = false;
    }
}

function validatePhoneNumber()
{
    //Validation of phone number
    let phoneRegex = /^[0-9]{10}$/;
    let emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    if (!phoneRegex.test(document.getElementById("phoneNumber").value))
    {
        document.getElementById("phoneNumber").style.borderColor = errorColor;
        document.getElementById("submitButton").disabled = true;
        document.getElementById("phoneError").innerHTML = "Phone number should be 10 digits!";
    }
    else
    {
        document.getElementById("phoneNumber").style.borderColor = null;
        document.getElementById("phoneError").innerHTML = "";
    }

    if (phoneRegex.test(document.getElementById("phoneNumber").value) &&
            emailRegex.test(document.getElementById("email").value))
    {
        document.getElementById("submitButton").disabled = false;
    }
}

function validateEmail()
{
    //Validation of email
    let phoneRegex = /^[0-9]{10}$/;
    let emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    if (!emailRegex.test(document.getElementById("email").value))
    {
        document.getElementById("email").style.borderColor = errorColor;
        document.getElementById("submitButton").disabled = true;
        document.getElementById("emailError").innerHTML = "Please enter a valid email!";
    }
    else 
    {
        document.getElementById("email").style.borderColor = null;
        document.getElementById("emailError").innerHTML = "";
    }

    if (phoneRegex.test(document.getElementById("phoneNumber").value) &&
            emailRegex.test(document.getElementById("email").value))
    {
        document.getElementById("submitButton").disabled = false;
    }
}

function fadeResult()
{
    document.getElementById("editResult").classList.remove("fade");
    document.getElementById("editResult").offsetHeight;
    document.getElementById("editResult").classList.add("fade");
}

function deleteContact(id)
{
    //document.getElementById("registerResult").innerHTML = ""; //Set the result message field to nothing

    let packet = {"contactId":id, "userId":userId}; //Generate a packet to send
    let jsonPayload = JSON.stringify(packet); //Generates the packet

    let url = urlBase + '/DeleteContacts.' + extension //generates the signUp url

    let xhr = new XMLHttpRequest(); //Generates a new HttpRequest object
    xhr.open("POST", url, true); //Initializes the xhr module for requests
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        //Called when the packet is recieved
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText); //Converts the packet to an object
                if (jsonObject.error != "") {
                    document.getElementById("editResult").innerHTML = jsonObject.error;
                    document.getElementById("editResult").style.color = errorColor;
                    fadeResult();
					return;
                }
                //Contact was deleted successfully
				document.getElementById("editResult").innerHTML = jsonObject.message;
                document.getElementById("editResult").style.color = validColor;
                fadeResult();
                loadContactData(); //Reload the contacts menu
                if (goblinized) goblins[id].remove();
            }
        };
        xhr.send(jsonPayload); //Send the packet
    }
    catch(err)
    {
        document.getElementById("editResult").innerHTML = err.message; //Displays the error
        fadeResult();
    }
}

function doLogout()
{
    //Clears the cookie information and jumps to the login page
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function goblinize() {
    if (goblinized)
    {
        for (goblinId in goblins)
        {
            goblins[goblinId].remove();
        }
        goblinized = false;
        document.getElementById("InfoGoblinLogo").src = "images/InfoGoblinRecolor.png";
        document.getElementById("goblinButton").innerHTML = "Regoblinize";
        return;
    }

    let packet = {"search":"", "userId":userId}; //Generate a packet to send (search for empty string)
    let jsonPayload = JSON.stringify(packet); //Generates the packet

    let url = urlBase + '/SearchContacts.' + extension //generates the signUp url

    let xhr = new XMLHttpRequest(); //Generates a new HttpRequest object
    xhr.open("POST", url, true); //Initializes the xhr module for requests
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        //Called when the packet is recieved
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText); //Converts the packet to an object
                if (jsonObject.error != "") return;
                
                //Contacts were loaded sucessfully
                //For each contact in the results array
				for (let i = 0; i < numContacts; i++) {
                    if (jsonObject.results[i].ID in goblins) {goblins[jsonObject.results[i].ID].destroy()}
                    goblins[jsonObject.results[i].ID] = new Goblin(jsonObject.results[i].ID, 
                        jsonObject.results[i].FirstName, jsonObject.results[i].LastName);
                }
                goblinized = true;
                document.getElementById("InfoGoblinLogo").src = "images/InfoGoblinOpen.png";
                document.getElementById("goblinButton").innerHTML = "Degoblinize";
            }
        };
        xhr.send(jsonPayload); //Send the packet
    }
    catch(err)
    {
        //Displays the error
    }
}