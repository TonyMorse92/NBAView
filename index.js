/**************************************************************************************************************************/
/******************************************** Initialize Variables ********************************************************/
const months = 
[
	"January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December"
];

const table = document.getElementById("table");

const app = document.getElementById("base");


var currentMonth = document.getElementById("current-month");
const backButton = document.getElementById("back");
const forwardButton = document.getElementById("forward");

/**************************************************************************************************************************/
/******************************************** Initialize Calendar *********************************************************/
window.onload = fillPage();
window.onload = makeCalendarInteractive();

function fillPage(year = new Date().getFullYear(), month = new Date().getMonth(), day = new Date().getDate())
{
	//alert("fillPage Date: " + year + month + day);
	//alert("year: " + year);
	//alert("month: " + month);
	//alert("day: " + day);

	createCalendar(year, month, day);
	sendRequest(year, month, day);
}

/**************************************************************************************************************************/
/******************************************* Add user functionality *******************************************************/
function makeCalendarInteractive()
{
	// Dates
	for (var i = 2; i < table.rows.length; i++) 
	{	
		for (var j = 0; j < table.rows[i].cells.length; j++)
		{
			table.rows[i].cells[j].onclick = function ()
			{
				changeDate(this);
			};
		}
	}
	// Month
	backButton.onclick = function()
	{
		changeMonth("prev");
	};

	forwardButton.onclick = function()
	{
		changeMonth("next");	
	};
}

function changeMonth(chosenMonth) 
{
	var newMonth;
	if(chosenMonth == "next")
	{    
		newMonth = months.indexOf(currentMonth.textContent) + 1;
		//alert("Going forward");
		//alert("Current Month: " + months.indexOf(currentMonth.textContent));
		//alert("New Month: " + newMonth);
		resetHighlights();
		resetDates();
		resetGames();
		fillPage(new Date().getFullYear(), newMonth, 1);
		//alert("Month name: " + months[newMonth]);
	}
	else if(chosenMonth == "prev")
	{
		newMonth = months.indexOf(currentMonth.textContent) - 1;
		//alert("Going back");
		//alert("Current Month: " + months.indexOf(currentMonth.textContent));
		//alert("New Month: " + newMonth);
		resetHighlights();
		resetDates();
		resetGames();
		fillPage(new Date().getFullYear(), newMonth, 1);
		//alert("Month name: " + months[newMonth]);
	}
	else
	{
		alert("Error");
	}
}

function changeDate(chosenDate) 
{
	var curMonth = months.indexOf(currentMonth.textContent);
	var newDate = chosenDate.innerHTML;
	if(newDate != "")
	{    
		//alert(newDate);
		resetHighlights();
		resetDates();
		resetGames();
		fillPage(new Date().getFullYear(), curMonth, newDate);
	}
	else
	{
		alert("Pick an actual date.");
	}
}

/**************************************************************************************************************************/
/******************************************** Re-initialize Calendar *********************************************************/
function createCalendar(year, month, day)
{
	//alert("createCalendar Date: " + year + month + day);
	currentMonth.textContent = months[month];
	
	
	var dayMonthStartsOn = new Date(year,month,1).getDay();
	var lastDayOfMonth = new Date(year, (month + 1),0).getDate();
	var dayCounter = 1; // Start the date out at 1

	var maxRows;
	
	// No baseball in February, don't have to worry about that.
	if((lastDayOfMonth > 30) && ((lastDayOfMonth - dayMonthStartsOn) < 28))
	{
		maxRows = 8;
	}
	else if((lastDayOfMonth == 30) && ((lastDayOfMonth - dayMonthStartsOn) < 27))
	{
		maxRows = 8;
	}
	else
	{
		maxRows = 7;
	}


	// This will be the first row actual days
	for(var j = dayMonthStartsOn; j < 7; j++)
	{
		table.rows[2].cells[j].textContent = dayCounter;
		if(dayCounter == day)
		{
			table.rows[2].cells[j].style.backgroundColor = "LightSkyBlue";
		}
		dayCounter++;
	}

	// Just fill the next few rows in
	for(var rowNum = 3; rowNum < (maxRows - 1); rowNum++)
	{
		for(var colNum = 0; colNum < 7; colNum++)
		{
			table.rows[rowNum].cells[colNum].textContent = dayCounter;	
			if(dayCounter == day)
			{
				table.rows[rowNum].cells[colNum].style.backgroundColor = "LightSkyBlue";
			}
			dayCounter++;
		}
	}

	// Fill in the last days
	var colCounter = 0;
	for(var end = dayCounter; end < lastDayOfMonth + 1; end++)
	{
		//alert("Max Rows: " + maxRows);
		table.rows[(maxRows - 1)].cells[colCounter].textContent = dayCounter;
		if(dayCounter == day)
		{
			table.rows[(maxRows - 1)].cells[colCounter].style.backgroundColor = "LightSkyBlue";
		}
		colCounter++;
		dayCounter++;	
	}
}

/**************************************************************************************************************************/
/*************************************** Helper functions for clean UI ****************************************************/
function resetHighlights()
{
	for (var i = 2; i < table.rows.length; i++) 
	{	
		for (var j = 0; j < table.rows[i].cells.length; j++)
		{
			table.rows[i].cells[j].style.backgroundColor = "";
		}
	}
}

function resetDates()
{
	for (var i = 2; i < table.rows.length; i++) 
	{	
		for (var j = 0; j < table.rows[i].cells.length; j++)
		{
			table.rows[i].cells[j].textContent = "";
		}
	}
}


function resetGames()
{
	var container = document.getElementById("container-id");
	//app.removeChild(container);
	container.remove();
}

/**************************************************************************************************************************/
/******************************************** API Request Handling ********************************************************/
function sendRequest(year, month, day) 
{
	//alert("sendRequest Date: " + year + month + day);
	//var baseURL = "https://www.balldontlie.io/api/v1/games?page=1&start_date="; // This doesn't work for some reason. Returns too many games. Need to use array
	var baseURL = "https://www.balldontlie.io/api/v1/games?dates[]="
	var dateURL = year + "-" + (month + 1) + "-" + day; // Need to add 1 to month, since JS months go from 0-11
	//var requestURL = baseURL + dateURL + "&endDate=" + dateURL; // This doesn't work for some reason. Returns too many games. Need to use array
	var requestURL = baseURL + dateURL;

	//alert("Request:     " + requestURL);
	var request = new XMLHttpRequest();
	request.onload = processGames;
	request.open('GET', requestURL, true);
	request.send();
}

function processGames()
{
	const container = document.createElement("div");
	container.setAttribute('class', 'container');
	container.setAttribute('id', 'container-id');
	app.appendChild(container);

	// Begin accessing JSON data here
	var data = JSON.parse(this.response);
	
	//alert(data);

	var games = data.data;
	//var meta = data.meta.total_pages;
	//alert(games);
	//alert(meta);
	if (this.status >= 200 && this.status < 400) 
	{
		games.forEach(game => 
		{
			//alert(game.id);
			const card = document.createElement('div');
			card.setAttribute('class', 'card');
		
			const h1 = document.createElement('h1');
			h1.textContent = game.visitor_team.name + " @ " + game.home_team.name;
			

			const p = document.createElement('p');
			utcDate = game.status;
			//var localDate = new Date(utcDate);
			//var twelveHourDateFormat = localDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
			//p.textContent =  twelveHourDateFormat;
			p.textContent = utcDate;

			container.appendChild(card);
			card.appendChild(h1);
			card.appendChild(p);
			
		});
	} 
	else 
	{
		const errorMessage = document.createElement('marquee');
		errorMessage.textContent = "Request error.";
		app.appendChild(errorMessage);
	}
}

/**************************************************************************************************************************/
/******************************** Make background colors based on Team Colors ********************************************/
// Get team colors from https://teamcolorcodes.com/mlb-color-codes/
function getHomeColor(homeTeam)
{
}



