$(document).on ('click', '#campfire', function(event){
	updateCampfire();
});
$(document).on ('click', '.nav-link', function(event){
	menuButtonPressed(event.target.id);

});

$(document).on('click', '.buildBuilding', function(event){	
	if (event.target.id == 'createGranary'){
		var foodLimit = fetchFoodLimit();
		var granaryCost = fetchBuildingCost('granary');
		var numOfStone = fetch('Stone');		
		if (numOfStone<granaryCost){
			return;
		}
		update('Stone', numOfStone-granaryCost);
		updateBuildingCost('granary', granaryCost*10);
		updateFoodLimit(foodLimit*10);
		
		
	}
	refreshUI();
});
$(document).on ("click", ".clicker", function(event){
	
	updateClickCounter(fetchClickCounter()+1);
	var chanceToCreateNewPerson = fetchChanceToCreateNewPerson();
	var floorChance = fetchFloorChance();
	var numOfWorkers = fetch('Workers');
	var numOfFarmers = fetch('Farmers');
	var numOfPeople = fetch('People');
	if ($('#' + event.target.id).hasClass('makeStoneTool')){
		var typeOfTool = event.target.id.substring(4) + 's';
		createStoneTool(typeOfTool);
	} else if ($('#' + event.target.id).hasClass('makeStoneWeapon')){
		var typeOfWeapon = event.target.id.substring(4) + 's';
		createWeapon(typeOfWeapon);
	} else if (event.target.id == 'work' || event.target.id=='start'){
		var numOfClicks = fetch('Clicks');
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
		}		
		update(resourceType, numOfResources);
	}
	if (event.target.id=='chop' && $('#campfire').hasClass('hidden')
	&& fetch('Wood')>=fetch('Lumberjacks')){
		reveal('#camfire');
	}
	if (numOfPeople<fetchFoodLimit() && fetchRandomNum(1, chanceToCreateNewPerson-fetchCampfireFloorChance())<=floorChance){
		updateCampfireFloorChance(0);
		numOfWorkers++;
		numOfPeople++;
		updateClickers('Workers', numOfWorkers);
		update('People', numOfPeople);
		updateClickCounter(0);
	}
	updateNewPopProgress();
	refreshUI();
});

$(document).on ("click", ".hire", function(event){
	var numOfWorkers = fetch('Workers');
	if (numOfWorkers==0){
		return;
	}
	numOfWorkers--;
	var typeOfClicker = event.target.id.substring(3) + 's';
	var numOfThisClicker = fetch(typeOfClicker);
	numOfThisClicker++;
	updateClickers(typeOfClicker, numOfThisClicker);
	updateClickers('Workers', numOfWorkers);
	refreshUI();
});
$(document).on ("click", ".overseer", function(event){
	var numOfWorkers = fetch('Workers');
	if (numOfWorkers<2){
		return;
	}
	update('Workers', numOfWorkers-1);
	var typeOfOverseer = event.target.id.substring(7).slice(0, -1) +'Overseers';
	var numOfOverseer = fetch(typeOfOverseer);
	update(typeOfOverseer, numOfOverseer+1);
	refreshUI();
});