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
const backMonthButton = document.getElementById("back-month");
const forwardMonthButton = document.getElementById("forward-month");

var currentYear = document.getElementById("current-year");
const backYearButton = document.getElementById("back-year");
const forwardYearButton = document.getElementById("forward-year");

/**************************************************************************************************************************/
/******************************************** Initialize Calendar *********************************************************/
window.onload = fillPage();
window.onload = makeCalendarInteractive();

function fillPage(year = new Date().getFullYear(), month = new Date().getMonth(), day = new Date().getDate())
{
	createCalendar(year, month, day);
	sendRequest(year, month, day);
}

/**************************************************************************************************************************/
/******************************************* Add user functionality *******************************************************/
function makeCalendarInteractive()
{
	// Dates
	for (var i = 3; i < table.rows.length; i++) 
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
	backMonthButton.onclick = function()
	{
		changeMonth("prev");
	};

	forwardMonthButton.onclick = function()
	{
		changeMonth("next");	
	};
	// Year
	backYearButton.onclick = function()
	{
		changeYear("prev");
	};

	forwardYearButton.onclick = function()
	{
		changeYear("next");	
	};
}

function changeYear(chosenYear) 
{
	var newYear;
	var curMonth = months.indexOf(currentMonth.textContent);

	if(chosenYear == "next")
	{    
		newYear = parseInt(currentYear.textContent) + 1;
		resetHighlights();
		resetDates();
		resetGames();
		fillPage(newYear, curMonth, 1);
	}
	else if(chosenYear == "prev")
	{
		newYear = parseInt(currentYear.textContent) - 1;
		resetHighlights();
		resetDates();
		resetGames();
		fillPage(newYear, curMonth, 1);
	}
	else
	{
		alert("Error");
	}
}

function changeMonth(chosenMonth) 
{
	var newMonth;
	var curYear = currentYear.textContent;
	var nextYear = parseInt(curYear) + 1;
	var prevYear = parseInt(curYear) - 1;
	

	if(chosenMonth == "next")
	{
		// Going from December to January
		if(months.indexOf(currentMonth.textContent) == 11)
		{
			newMonth = 0;
			resetHighlights();
			resetDates();
			resetGames();
			fillPage(nextYear, newMonth, 1);
		}
		else
		{
			newMonth = months.indexOf(currentMonth.textContent) + 1;
			resetHighlights();
			resetDates();
			resetGames();
			fillPage(curYear, newMonth, 1);
		}
	}
	else if(chosenMonth == "prev")
	{
		// Going from January to December
		if(months.indexOf(currentMonth.textContent) == 0)
		{
			newMonth = 11;
			resetHighlights();
			resetDates();
			resetGames();
			fillPage(prevYear, newMonth, 1);
		}
		else
		{
			newMonth = months.indexOf(currentMonth.textContent) - 1;
			resetHighlights();
			resetDates();
			resetGames();
			fillPage(curYear, newMonth, 1);
		}
	}
	else
	{
		alert("Error");
	}
}

function changeDate(chosenDate) 
{
	var curMonth = months.indexOf(currentMonth.textContent);
	var curYear = currentYear.textContent;
	var newDate = chosenDate.innerHTML;
	if(newDate != "")
	{    
		resetHighlights();
		resetDates();
		resetGames();
		fillPage(curYear, curMonth, newDate);
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
	currentYear.textContent = year;
	
	
	var dayMonthStartsOn = new Date(year,month,1).getDay();
	var lastDayOfMonth = new Date(year, (month + 1),0).getDate();
	var dayCounter = 1; // Start the date out at 1

	var maxRows;
	
	// Won't be a leap year for a while
	if((lastDayOfMonth > 30) && ((lastDayOfMonth - dayMonthStartsOn) < 28))
	{
		maxRows = 9;
	}
	else if((lastDayOfMonth == 30) && ((lastDayOfMonth - dayMonthStartsOn) < 27))
	{
		maxRows = 9;
	}
	else
	{
		maxRows = 8;
	}


	// This will be the first row with actual days
	for(var j = dayMonthStartsOn; j < 7; j++)
	{
		table.rows[3].cells[j].textContent = dayCounter;
		if(dayCounter == day)
		{
			table.rows[3].cells[j].style.backgroundColor = "LightSkyBlue";
		}
		dayCounter++;
	}

	// Just fill the next few rows in
	for(var rowNum = 4; rowNum < (maxRows - 1); rowNum++)
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
	for (var i = 3; i < table.rows.length; i++) 
	{	
		for (var j = 0; j < table.rows[i].cells.length; j++)
		{
			table.rows[i].cells[j].style.backgroundColor = "";
		}
	}
}

function resetDates()
{
	for (var i = 3; i < table.rows.length; i++) 
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
	container.remove();
}

/**************************************************************************************************************************/
/******************************************** API Request Handling ********************************************************/
function sendRequest(year, month, day) 
{
	var baseURL = "https://www.balldontlie.io/api/v1/games?dates[]="
	var dateURL = year + "-" + (month + 1) + "-" + day; // Need to add 1 to month, since JS months go from 0-11
	var requestURL = baseURL + dateURL;

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
	

	var games = data.data;
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



