var flashingUI;
var timer;
$.getScript('events.js');
$.getScript('capital.js');
$.getScript('labor.js');
$.getScript('ui.js');

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
			$('#campfire').addClass('hidden');
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
				revealCampfire();
			} else if (resourceType=='Food'){
				numOfResources=checkFoodLimit(numOfResources, numOfClickers);
			} else if (resourceType=='Stone'){
					var granaryCost = $('#granaryCost').val();
					numOfResources>=granaryCost ? $('#createGranary').removeClass('hidden') : $('#createGranary').addClass('hidden');

			}
			if (numOfResources>0 && ((resourceType=='Stone'  && fetch('Wood')>0)
			|| (resourceType=='Wood' && fetch('Stone')>0))){
				$('.makeStoneTool').removeClass('hidden');
			}

			update(resourceType, numOfResources);
		}
	});
}
function blink(selector, color){
	$(selector).css("color", color);
	setTimeout (function(){
		$(selector).css("color", "black");
	}, 500);
}



function fetch(what){
	return Number($('#numOf' + what).html());	
}
function fetchCampfireFloorChance(){
	return Number($('#campfireFloorChance').val());
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

function revealCampfire(){
	$('#campfire').removeClass('hidden');	
}
function startTimer (){
	var startingSeconds = 30;
	var startingMinutes = 0;
	$("#minutesRemaining").html(startingMinutes);
	$('#secondsRemaining').html(startingSeconds);
	$("#timeCaption").css("display", "inline");
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
		}
		if (seconds<=10 && fetch('Food')<fetch('People')){
			blink ("#timeRemaining", "red");
			blink ("#numOfFood", "red");
		}
		$("#minutesRemaining").html(minutes);
		$("#secondsRemaining").html(seconds);
		
	}, 1000);
}

function stopTimer(){
	$("#timeCaption").css("display", "none");
	clearInterval(timer);
}
function update(what, n){
	if (what=='Food'){
		console.log(n);
	}
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


