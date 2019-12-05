var flashingUI;
var timer;
$.getScript('building.js');
$.getScript('events.js');
$.getScript('capital.js');
$.getScript('labor.js');
$.getScript('ui.js');
createLand(4);

function createLand(size){
	var htmlStr;
	var landArr = ['empty', 'plains', 'forest', 'mountain'];
	var startPointNeeded=true;
	for (var y=0; y<size; y++){
		htmlStr+='<tr>';
		for (var x=0; x<size; x++){
			var landType = landArr[fetchRandomNum(1,4)-1];
			htmlStr+="<td class='land " + landType + "'>"
			if (startPointNeeded && (fetchRandomNum(1, size*size)==1 || (x==size-1 && x==y))){
				htmlStr+="X";
				startPointNeeded=false;
			}
			htmlStr+="</td>";
		}
		htmlStr+='</tr>';
	}
	$('#landContainer').html(htmlStr);
}
function automate(){
	var campfireBurning = isCampfireBurning();
	var listOfJobs = fetchListOfJobs('overseen');
	if (campfireBurning){
		var wood = fetch ('Wood');
		var numOfPeople = fetch('People');
		if (wood>0 && wood>=numOfPeople){
			wood-=numOfPeople;
			update('Wood', wood);
			var campfireFloorChance = fetchCampfireFloorChance();
			updateCampfireFloorChance(campfireFloorChance+1);
		} else {
			updateCampfire();
		}
	} 
	$.each(listOfJobs, function(i, job){
		var numOfJobOverseers = fetch(job + 'Overseers');	
		job = job + 's';
		if (numOfJobOverseers>0){
			var numOfClickers = fetch(job);
			var resourceType = fetchRelevantResources(job, 1);
			var numOfResources = fetch(resourceType);
			var numOfTools = fetchNumOfRelevantTools(job);
			var resourceProduction = numOfClickers * (1- (.1/numOfJobOverseers));
			if (numOfTools>0){
				resourceProduction = resourceProduction>numOfTools 
				? resourceProduction*2 : resourceProduction + numOfTools;
			}
			var resourceDelta = Math.trunc (resourceProduction);
			useTools(job);
			numOfResources+=resourceDelta;
			resourceDelta=resourceProduction-resourceDelta;
			if (resourceDelta<1){
				if(Math.random() * 1 <= resourceDelta){
					numOfResources++;
				}
			}
			if (resourceType=='Wood' && numOfResources>=fetch('People')){
				reveal('#campfire');
			} else if (resourceType=='Food'){
				numOfResources=checkFoodLimit(numOfResources, numOfClickers);
			} 


			update(resourceType, numOfResources);
		}
	});
	refreshUI();
}

function firstCharLC(str){
	return str.charAt(0).toLowerCase() + str.slice(1);
}


function fetch(what){
	return Number($('#numOf' + what).html());	
}
function fetchCampfireFloorChance(){
	return Number($('#campfireFloorChance').val());
}
function fetchChanceToCreateNewPerson (){
	return fetch('People')*2;
}
function fetchClickCounter(){
	return Number($('#clickCounter').val());
}
function fetchFloorChance(){
	var campfireFloorChance = fetchCampfireFloorChance();
	var clickCounter = fetchClickCounter();
	var floorChance = 0;
	var numOfPeople = fetch('People');
	if (clickCounter>=numOfPeople){
		 floorChance= (clickCounter-numOfPeople);
	}
	return floorChance;
}


function fetchRandomNum (floor, ceiling){
	return Math.floor(Math.random() * ceiling) + floor;
}



function isCampfireBurning(){
	return $('#campfire').hasClass('on');
}

function startTimer (){
	var startingSeconds = 30;
	var startingMinutes = 0;
	$("#minutesRemaining").html(startingMinutes);
	$('#secondsRemaining').html(startingSeconds);
	return setInterval(function(){
		automate();
		updateNewPopProgress();
		var minutes = Number($("#minutesRemaining").html());
		var seconds = Number($("#secondsRemaining").html());
		seconds--;
		if (seconds<0){
			seconds=59;
			minutes--;
			if (minutes<0){
				feedPeople();	
				minutes=startingMinutes;
				seconds=startingSeconds;
	
			}
		}
		if (minutes<10){ 
			minutes= "0" + minutes;
		}
		if (seconds<10){
			seconds= "0" + seconds;
			if (fetch('Food')<fetch('People')){
				blink('#secondsRemaining', 'red');
				blink('#numOfFood', 'red');
			}
		}
		$("#minutesRemaining").html(minutes);
		$("#secondsRemaining").html(seconds);

	}, 1000);
}

function stopTimer(){
	hide ("#timeCaption");
	clearInterval(timer);
}
function update(what, n){
	$('#numOf' + what).html(n);
}
function updateCampfire(){
	isCampfireBurning() ? $('#campfire').removeClass('on') : $('#campfire').addClass('on');
}

function updateCampfireFloorChance(n){
	$('#campfireFloorChance').val(n);
}
function updateClickCounter(n){
	$('#clickCounter').val(n);
}


