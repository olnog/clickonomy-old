function everyoneStarves(){
	var food = fetch('Food');
	var numOfPeople = fetch('People');
	var foodDeficit=numOfPeople-food;
	var listOfOverseenJobs = fetchListOfJobs('overseen');
	var listOfSkilledJobs = fetchListOfJobs('skilled');
	numOfPeople-=foodDeficit;
	$.each(listOfSkilledJobs, function (i, job){
		foodDeficit=jobStarves(job + 's', foodDeficit);
		if (foodDeficit==0){
			return;
		}
	});
	foodDeficit = jobStarves('Overseers', foodDeficit);
	if (foodDeficit==0){
		return;
	}
	$.each(listOfOverseenJobs, function(i, job){
		foodDeficit=jobStarves(job + 'Overseers', foodDeficit);
		if (foodDeficit==0){
			return;
		}
	});
	$.each(listOfOverseenJobs, function(i, job){
		foodDeficit=jobStarves(job + 's', foodDeficit);
		if (foodDeficit==0){
			return;
		}
	});
	jobStarves('Workers', foodDeficit);
	if (numOfPeople==0){
		numOfPeople=1;
		updateClickers('Workers', 1);
	}
	updateCampfireFloorChance(0);
	updateClickCounter(0);
	updateNewPopProgress();
	update('People', numOfPeople);
}
function jobStarves(job, foodDeficit){
	var numOfJobs=fetch(job);
	if (foodDeficit>numOfJobs){
		foodDeficit-=numOfJobs;
		numOfJobs=0;
	} else {
		numOfJobs-=foodDeficit;
		foodDeficit=0;
	}
	updateClickers(job, numOfJobs);
	return foodDeficit;
}
function feedPeople (){
	var food = fetch('Food');
	var numOfPeople = fetch('People');
	if (food < numOfPeople){
		if (numOfPeople>1){
			everyoneStarves();
			food=0;
		} else {
			//destroy their shit
		}
	} else {
		food-=numOfPeople;
	}
	update('Food', food);
	refreshJobs();
	
}
function fetchChanceToCreateNewPerson (){
	return fetch('People')*2;
}

function fetchListOfJobs(typeOfList){
	var overseenJobs = ['StoneCutter', 'Lumberjack', 'Farmer'];
	var skilledJobs = ['Toolmaker'];
	switch (typeOfList){
		case 'overseen':
			return overseenJobs;
			break;
		case 'skilled':
			return skilledJobs;
			break;
		case 'all':
			return skilledJobs.concat(overseenJobs);
			break;
	}
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