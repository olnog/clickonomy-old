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
$(document).on('click', '.buildBuilding', function(event){
	
	if (event.target.id == 'createGranary'){
		var foodLimit = fetchFoodLimit();
		var granaryCost = $('#granaryCost').val();
		var numOfStone = fetch('Stone');
		
		if (granaryCost>numOfStone){
			return;
		}
		
		numOfStone-=granaryCost;
		granaryCost*=10;
		foodLimit*=10;
		update('Stone', numOfStone);
		$('#granaryCost').val(granaryCost);
		updateFoodLimit(foodLimit);
		$('#createGranary').addClass('hidden');
		if (numOfStone>=granaryCost){
			$('#createGranary').removeClass('hidden');
		}
		
	}
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
		} else if (resourceType=='Stone'){
			var granaryCost = $('#granaryCost').val();
			$('#createGranary').addClass('hidden');
			if (granaryCost<=numOfResources){
				$('#createGranary').removeClass('hidden');
			}
		}			
		if (numOfResources>0 && ((resourceType=='Stone'  && fetch('Wood')>0)
		|| (resourceType=='Wood' && fetch('Stone')>0))){
			$('.makeStoneTool').removeClass('hidden');
		}
		update(resourceType, numOfResources);
	}
	if (event.target.id=='chop' && $('#campfire').hasClass('hidden')
	&& fetch('Wood')>=fetch('Lumberjacks')){
		revealCampfire();
	}
	if (numOfPeople<fetchFoodLimit() && fetchRandomNum(1, chanceToCreateNewPerson-fetchCampfireFloorChance())<=floorChance){
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