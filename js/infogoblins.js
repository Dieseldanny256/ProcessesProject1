const urlBase = 'http://infogoblins.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let loginMode = "login";

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
    let packet = {"search":"", "lastName":newLastName}; //Generate a packet to send (search for empty string)
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

function doLogout()
{
    //Clears the cookie information and jumps to the login page
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}