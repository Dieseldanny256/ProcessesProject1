const urlBase = 'http://infogoblins.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let loginMode = "login";
let numContacts = 0;
let goblinized = false;

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
}

function switchToLogin()
{
    if (loginMode === "login") {
        return;
    }
    document.getElementById("Login").classList.remove("hidden");
    document.getElementById("Register").classList.add("hidden");
    loginMode = "login";
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
					return;
                } 
                
                //Contacts were loaded sucessfully
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
                        <button type="button" id="editRow${jsonObject.results[i].ID}" onClick="switchToEditContact(${jsonObject.results[i].ID});">Edit</button>
                        <button type="button" id="deleteRow${jsonObject.results[i].ID}" onClick="deleteContact(${jsonObject.results[i].ID});">Delete</button>
                    </td></tr>`
                }
                
                document.getElementById("contactTable").innerHTML = tableData;
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
    document.getElementById("phoneNumber").style.borderColor = null;
    document.getElementById("email").style.borderColor = null;
}

function switchToContactsMenu() 
{
    document.getElementById("contactsMenu").classList.remove("hidden");
    document.getElementById("editContactsMenu").classList.add("hidden");
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
                    switchToContactsMenu();
					return;
                }
                //Contact was added successfully
				document.getElementById("editResult").innerHTML = jsonObject.message;
                loadContactData(); //Reload the contact data
                switchToContactsMenu();
            }
        };
        xhr.send(jsonPayload); //Send the packet
    }
    catch(err)
    {
        document.getElementById("editResult").innerHTML = err.message; //Displays the error
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
					return;
                }
                //Contact was added successfully
				document.getElementById("editResult").innerHTML = jsonObject.message;
                loadContactData(); //Reload the contacts menu
                switchToContactsMenu();
            }
        };
        xhr.send(jsonPayload); //Send the packet
    }
    catch(err)
    {
        document.getElementById("editResult").innerHTML = err.message; //Displays the error
        switchToContactsMenu();
    }
}

function validatePhoneNumber()
{
    var errorColor = window.getComputedStyle(document.body).getPropertyValue("--accent-color-2");

    //Validation of phone number
    let phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(document.getElementById("phoneNumber").value))
    {
        document.getElementById("phoneNumber").style.borderColor = errorColor;
        document.getElementById("submitButton").disabled = true;
    }
    else
    {
        document.getElementById("submitButton").disabled = false;
        document.getElementById("phoneNumber").style.borderColor = null;
    }
}

function validateEmail()
{
    var errorColor = window.getComputedStyle(document.body).getPropertyValue("--accent-color-2");

    //Validation of email
    let emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    if (!emailRegex.test(document.getElementById("email").value))
    {
        document.getElementById("email").style.borderColor = errorColor;
        document.getElementById("submitButton").disabled = true;
    }
    else
    {
        document.getElementById("submitButton").disabled = false;
        document.getElementById("email").style.borderColor = null;
    }
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
					return;
                }
                //Contact was added successfully
				document.getElementById("editResult").innerHTML = jsonObject.message;
                loadContactData(); //Reload the contacts menu
                removeGoblin(id);
            }
        };
        xhr.send(jsonPayload); //Send the packet
    }
    catch(err)
    {
        document.getElementById("editResult").innerHTML = err.message; //Displays the error
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
        return;
    }
    Array.from(document.getElementById("contactTable").rows).forEach((row) =>
    {
        let row_data = Array.from(row.cells);
        let id = parseInt(row.id.substring(3));
        console.log(row.id.substring(3));
        let contactFirstName = row_data[0].innerHTML;
        let contactLastName = row_data[1].innerHTML;
        CreateGoblin(5, id, contactFirstName + " " + contactLastName);
    });
    goblinized = true;
}