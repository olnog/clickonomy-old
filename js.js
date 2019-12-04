var flashingUI;
var timer;

$(document).on ('click', '#campfire', function(event){
	updateCampfire();
});
$(document).on ('click', '#capitalMenuButton', function(event){
	$('#capital').removeClass('hidden');
	$('#labor').addClass('hidden');
	$('#laborMenuButton').removeClass('active');
	$('#capitalMenuButton').addClass('active');
});
$(document).on ('click', '#laborMenuButton', function(event){
	$('#labor').removeClass('hidden');
	$('#capital').addClass('hidden');
	$('#capitalMenuButton').removeClass('active');
	$('#laborMenuButton').addClass('active');
});
$(document).on ("click", ".clicker", function(event){
	
	updateClickCounter(fetchClickCounter()+1);
	var chanceToCreateNewPerson = fetchChanceToCreateNewPerson();
	var floorChance = fetchFloorChance();
	var numOfWorkers = fetch('Workers');
	var numOfFarmers = fetch('Farmers');
	var numOfPeople = fetch('People');
	if ($('#' + event.target.id).hasClass('makeStoneTool')){
		var typeOfTool = event.target.id.substr(4) + 's';
		createStoneTool(typeOfTool);
	} else if (event.target.id == 'work' || event.target.id=='start'){
		var numOfClicks = fetch('Clicks');
		if (numOfClicks==0){
			timer = startTimer();
			$('#startMenu').addClass('hidden');
			$('#menu').removeClass('hidden');
			$('#capital').removeClass('hidden');
			
		}
		numOfClicks+=numOfWorkers;
		update('Clicks', numOfClicks);
	} else {
		var clickers;
		switch (event.target.id){
			case 'farm':
				clickers = 'Farmers';
				break;
			case 'chop':
				clickers ='Lumberjacks';
				break;
			case 'cutStone':
				clickers ='StoneCutters';
				break;
		}		
		var resourceType = fetchRelevantResources(clickers, 1);
		var numOfResources = fetch(resourceType);
		var numOfClickers = fetch(clickers);
		var numOfTools = fetchNumOfRelevantTools(clickers);
		useTools(clickers);
		numOfResources+=numOfClickers+numOfTools;
		if (resourceType=='Food'){
			checkFoodLimit(numOfResources, numOfClickers);
		} else if (numOfResources>0 && ((resourceType=='Stone'  && fetch('Wood')>0)
		|| (resourceType=='Wood' && fetch('Stone')>0))){
			$('.makeStoneTool').removeClass('hidden');
		}
		update(resourceType, numOfResources);
	}
	if (event.target.id=='chop' && $('#campfire').hasClass('hidden')
	&& fetch('Wood')>=fetch('Lumberjacks')){
		revealCampfire();
	}
	if (fetchRandomNum(1, chanceToCreateNewPerson-fetchCampfireFloorChance())<=floorChance){
		updateCampfireFloorChance(0);
		numOfWorkers++;
		numOfPeople++;
		updateClickers('Workers', numOfWorkers);
		update('People', numOfPeople);
		$('.hire').removeClass('hidden');
		updateClickCounter(0);
	}
	updateNewPopProgress();
	refreshJobs();
});

$(document).on ("click", ".hire", function(event){
	var numOfWorkers = fetch('Workers');
	if (numOfWorkers==0){
		return;
	}
	numOfWorkers--;
	if (event.target.id == 'addOverseer'){
		var numOfOverseers = fetch('Overseers');
		numOfOverseers++;
		update('Overseers', numOfOverseers);
		
	} else {
		var typeOfClicker = event.target.id.substr(3) + 's';
		var numOfThisClicker = fetch(typeOfClicker);
		numOfThisClicker++;
		updateClickers(typeOfClicker, numOfThisClicker);
		if (numOfThisClicker>0){
			var capital = fetchRelevantResources(typeOfClicker, 0);
			$('#' + capital + 'Caption').removeClass('hidden');
		}
	}
	updateClickers('Workers', numOfWorkers);
	refreshJobs();
});
$(document).on ("click", ".overseer", function(event){
	var numOfOverseers = fetch('Overseers');
	if (numOfOverseers<1){
		return;
	}
	numOfOverseers--;
	update('Overseers', numOfOverseers);
	if (event.target.id=='overseeFarm'){
		var numOfFarmerOverseers = fetch('FarmerOverseers');
		numOfFarmerOverseers++;	
		update('FarmerOverseers', numOfFarmerOverseers);
	} else if (event.target.id=='overseeForest'){
		var numOfLumberjackOverseers = fetch('LumberjackOverseers');
		numOfLumberjackOverseers++;
		update('LumberjackOverseers', numOfLumberjackOverseers);	
	} else if (event.target.id=='overseeQuarry'){
		var numOfStoneCutterOverseers = fetch('StoneCutterOverseers');
		numOfStoneCutterOverseers++;
		update('StoneCutterOverseers', numOfStoneCutterOverseers);	
	}
	refreshJobs();
	
});
function automate(){
	var campfireBurning = isCampfireBurning();
	var listOfJobs = ['Farmer', 'StoneCutter', 'Lumberjack'];
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
			} else if (numOfResources>0 && ((resourceType=='Stone'  && fetch('Wood')>0)
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
/*
function blinkButton(selector){
	//$(selector).addClass('blinking');
}
function clearBlinkingButtons(){
	$('.blinking').each (function (i, button){
		stopBlinkingButton('#' + button.id);
	});
}
*/
function checkFoodLimit(numOfResources, numOfClickers){
	var foodLimit = fetchFoodLimit();
	if (numOfResources==foodLimit){
		$('#farm').addClass('hidden');
		return;
	} else if (numOfResources + numOfClickers>=foodLimit){
		$('#farm').addClass('hidden');
		return foodLimit;
	}
	return numOfResources;
}
function createStoneTool(toolType){
	var numOfTools = fetch(toolType)
	var numOfToolmakers = fetch('Toolmakers');
	var stone = fetch ('Stone');
	var wood = fetch('Wood');
	var toolDelta=numOfToolmakers;
	if (wood<numOfToolmakers && stone<numOfToolmakers){
		if (wood==0 || stone==0){
			$('.makeStoneTool').addClass('hidden');
			return;
		}
		toolDelta = wood>stone ? stone : wood;
	} 
	if (wood-toolDelta<=0 || stone-toolDelta<=0){
			$('.makeStoneTool').addClass('hidden');
	}
	update('Wood', wood - toolDelta);
	update('Stone', stone - toolDelta);
	update(toolType, numOfTools+toolDelta);
}
function everyoneStarves(){
	var foodDeficit=numOfPeople-food;
	var numOfPeople = fetch('People');
	numOfPeople-=foodDeficit;
	if (numOfOverseers>0){
		while (foodDeficit>0 && numOfOverseers>0){
			numOfOverseers--;
			foodDeficit--;
		}
	}
	if (numOfFarmers>0){
		while (foodDeficit>0 && numOfFarmers>0){
			numOfFarmers--;
			foodDeficit--;
		}
	}
	if (numOfWorkers>1){
		while (foodDeficit>0 && numOfWorkers>1){
			numOfWorkers--;
			foodDeficit--;
		}

	}
	if (numOfPeople<1){
		var numOfClicks=fetch('Clicks'); 
		update('Clicks', Math.floor(numOfClicks/2));
		if (numOfClicks==0){
			stopTimer();
		}
		numOfPeople=1;
	}
	if (numOfWorkers==1 && $("#addFarmer").css("display")!="none"){
		$("#addFarmer").css("display", "none");
	}
	updateClickers ('People', numOfPeople);
}
function feedPeople (){
	var food = fetch('Food');
	var numOfPeople = fetch('People');
	if (food < numOfPeople){
		//everyoneStarves();
		food=0;
	} else {
		food-=numOfPeople;
	}
	update('Food', food);
	refreshJobs();
	
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
function fetchFoodLimit(){
	return Number($('#foodLimit').html());
}
function fetchNumOfRelevantTools(clickers){
	var toolType = fetchRelevantToolType(clickers );
	var numOfTools = fetch(toolType);
	var numOfClickers = fetch(clickers);
	return numOfTools>=numOfClickers ? numOfClickers : numOfTools;
}
function fetchRandomNum (floor, ceiling){
	return Math.floor(Math.random() * ceiling) + floor;
}
function fetchRelevantResources(clicker, firstUC){
	switch(clicker){
		case 'Farmers':
			capital = 'food';
			break;
		case 'Lumberjacks':
			capital='wood';
			break;
		case 'StoneCutters':
			capital='stone';
			break;
		case 'Toolmakers':
			capital='tools';
			break;
		case 'Workers':
			capital='clicks';
			break;
	
	}
	return firstUC ? capital.charAt(0).toUpperCase() + capital.slice(1) : capital;
}
function fetchRelevantToolType(clickers){
	var toolType;
	switch(clickers){
		case 'Farmers':
			toolType='StoneHoes';
			break;
		case 'Lumberjacks':
			toolType='StoneAxes';
			break;
		case 'StoneCutters':
			toolType='StonePickAxes';
			break;
	}
	return toolType;
}
/*
function flashUI(selector){
	$(selector).removeClass('hidden');
	clearTimeout(flashingUI);
	flashingUI = setTimeout(function(){
		$(selector).addClass('hidden');
	}, 500);
}
*/
function isCampfireBurning(){
	return $('#campfire').hasClass('on');
}
function refreshJobs(){
	var numOfWorkers = fetch('Workers');
	var food = fetch('Food');
	var numOfClicks = fetch('Clicks');
	var numOfFarmers = fetch('Farmers');
	var numOfLumberjacks = fetch('Lumberjacks');
	var numOfOverseers = fetch('Overseers');
	var numOfFarmerOverseers = fetch('FarmerOverseers');
	var numOfLumberjackOverseers = fetch('LumberjackOverseers');
	var numOfStoneCutterOverseers = fetch('StoneCutterOverseers');
	var numOfPeople = fetch('People');
	var numOfStoneCutters = fetch('StoneCutters');
	if (numOfWorkers<2){
		$('.hire').addClass('hidden');
		if (numOfOverseers==0){
			$("#overseerCaption").addClass('hidden');
		}
		if (numOfClicks==0 && food==0 && numOfFarmers==0){
			$("#farmerCaption").addClass('hidden');
			$("#foodCaption").addClass('hidden');
			stopTimer();
		}
	} else if (numOfWorkers>1){
		$('.otherWorkers').removeClass('hidden');
		$(".hire").removeClass('hidden');
		if (food>0 || numOfFarmers>0){
			$("#overseerCaption").removeClass('hidden');
		}else {
			$("#overseerCaption").addClass('hidden');
			//clearBlinkingButtons();
			//blinkButton('#addFarmer');
		}
		
	}
	if (numOfFarmers==0 || (numOfFarmers>0 && food==fetchFoodLimit())){
		$("#farm").addClass('hidden');
	} else {
		$("#farm").removeClass('hidden');
	}
	if (numOfOverseers<1){
		$(".overseer").addClass('hidden');
	} else if (numOfOverseers>0){
		if (numOfFarmers>0){
			$('#overseeFarm').removeClass('hidden');
		} 
		if (numOfLumberjacks>0){
			$('#overseeForest').removeClass('hidden');
		}
		if (numOfStoneCutters>0){
			$('#overseeQuarry').removeClass('hidden');
		}
	}
	if (numOfFarmerOverseers>0){
		$("#farmOverseerCaption").removeClass('hidden');	
	} else {
		$("#farmOverseerCaption").addClass('hidden');	
	}
	if (numOfLumberjackOverseers>0){
		$("#lumberjackOverseerCaption").removeClass('hidden');	
	} else {
		$("#lumberjackOverseerCaption").addClass('hidden');	
	}
	if (numOfStoneCutterOverseers>0){
		$("#stoneCutterOverseerCaption").removeClass('hidden');	
	} else {
		$("#stoneCutterOverseerCaption").addClass('hidden');	
	}
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
/*
function stopBlinkingButton(selector){
	$(selector).css('font-weight', 'normal');
	$(selector).removeClass('blinking');

}
*/
function stopTimer(){
	$("#timeCaption").css("display", "none");
	clearInterval(timer);
}
function update(what, n){
	$('#numOf' + what).html(n);
}
function updateCampfire(){
	isCampfireBurning() ? $('#campfire').removeClass('on') : $('#campfire').addClass('on');
}
function updateClickers(clickers, n){
	var clickerButtonID;
	switch (clickers){
		case 'Farmers':
			clickerButtonID = 'farm';
			break;
		case 'Lumberjacks':
			clickerButtonID='chop';
			break;
		case 'StoneCutters':
			clickerButtonID='cutStone';
			break;
		case 'Workers':
			clickerButtonID='work';
			break;
	}
	$('#numOf' + clickers).html(n);
	if (clickers=='Toolmakers'){
		$('.makeStoneTool').val('+' + n);
		return;
	}
	$('#' + clickerButtonID).val("+" + n);
}

function updateCampfireFloorChance(n){
	$('#campfireFloorChance').val(n);
}
function updateClickCounter(n){
	$('#clickCounter').val(n);
}
function updateFoodLimit(n){
	$('#foodLimit').html(n);
	
}
function updateNewPopProgress(){
	var chanceToCreateNewPerson = fetchChanceToCreateNewPerson();
	var campfireFloorChance = fetchCampfireFloorChance()*.01;
	var clickCounter = fetchClickCounter();
	var floorChance = fetchFloorChance()*.01;
	var newPopCent =  (clickCounter / chanceToCreateNewPerson)+floorChance+campfireFloorChance;
	if (newPopCent<1 && newPopCent>0){
		newPopCent = String(newPopCent).substr(2, 2);	
	} else if (newPopCent>=1){
		newPopCent = 99;	
	}
	if (String(newPopCent).substr(0, 1)=='0' && String(newPopCent).length>1){
		newPopCent = String(newPopCent).substr(1);
	}
	$('#newPopProgress').val(newPopCent);
	$('#newPopCent').html(newPopCent);

}
function useTools(clickers){
	var toolType = fetchRelevantToolType(clickers);
	var numOfTools = fetch(toolType);
	var numOfRelevantTools = numOfTools;
	var numOfClickers = fetch(clickers);
	if (numOfClickers<numOfTools){
		numOfRelevantTools=numOfClickers;
	}
	if (numOfTools==0){
		return;
	}
	var numOfDestroyedTools=0;
	for (var i=0; i<numOfRelevantTools; i++){
		var randNum = fetchRandomNum(1, 10);
		if (randNum==1){
			numOfDestroyedTools++;
		}
	}
	update(toolType, numOfTools-numOfDestroyedTools);
}
setInterval(function(){
	/*
	$(".blinking").css('font-weight', 'bold');
	setTimeout(function(){
		$('.blinking').css('font-weight', 'normal');
	}, 850);
	*/
}, 1700);
