function blink(selector, color){
	$(selector).css("color", color);
	setTimeout (function(){
		$(selector).css("color", "black");
	}, 500);
}
function hide(selector){
	if (selector.substring(0, 1) == '.'){
		var allElements = $(selector);
		$.each(allElements, function(i, element){
			if (!$('#' + element.id).hasClass('hidden')){
				$('#' + element.id).addClass('hidden');
			}
		});
		return;
	}
	if (!$(selector).hasClass('hidden')){
		$(selector).addClass('hidden');
	}
}
function menuButtonPressed(id){
	hide('.bottomBar');
	reveal('#' + id.slice(0, -10));
	$('.nav-link').removeClass('active');
	$('#' + id).addClass('active');
}
function refreshUI(){
	var numOfWorkers = fetch('Workers');
	var food = fetch('Food');
	var stone = fetch('Stone');
	var wood = fetch('Wood');
	var foodLimit = fetchFoodLimit();
	var numOfClicks = fetch('Clicks');
	var numOfPeople = fetch('People');

	
	if (numOfClicks>0 && !$('#startMenu').hasClass('hidden')){
		hide('#startMenu');
		reveal('#menu');
		reveal('#capital');
		if (!timer){
			timer = startTimer();
		}
	}
	numOfPeople>1 ? reveal('#laborOption') : hide('#laborOption');
	
	numOfPeople>=foodLimit ? $('#numOfPeople').css('color', 'red') : $('#numOfPeople').css('color', 'black');

	wood>=numOfPeople ? reveal('#campfire') : hide('#campfire');
	stone>=fetchBuildingCost('granary') ? reveal('#createGranary') : hide('#createGranary');

	wood>0 && stone>0 ? reveal('.stoneAge') : hide('.stoneAge');
	
	var overseenJobs = fetchListOfJobs('overseen');
	$.each(overseenJobs, function (i, job){
		var numOfJobs = fetch(job + 's');
		var typeOfResource = fetchRelevantResources(job + 's', 0);
		var numOfResources = fetch(fetchRelevantResources(job + 's', 1));
		var work = fetchAppropriateWork(job + 's');
		numOfJobs>0 ? reveal('#' + work) : hide('#' + work);
		numOfResources>0 || numOfJobs>0 ? reveal('#' + typeOfResource + 'Caption') : hide ('#' + typeOfResource + 'Caption');
		if (numOfWorkers>1){
			reveal('#' + job.charAt(0).toLowerCase() + job.slice(1) + 'Caption');	
			reveal('#add' + job);
			if (numOfJobs>0){
				reveal('#oversee' + job + 's');
			}

		}
		var numOfOverseersForThisJob = fetch(job + 'Overseers');
		var relevantID = '#' + job.charAt(0).toLowerCase() + job.slice(1) + 'OverseerCaption';
		numOfOverseersForThisJob>0 ? reveal(relevantID) : hide(relevantID);
		
	});
	food<foodLimit ? reveal('#farm') : hide('#farm');
	
	var skilledJobs = fetchListOfJobs('skilled');
	$.each(skilledJobs, function(i, job){
		stone>0 && wood>0 ? reveal('#' + firstCharLC(job) + 'Caption') : hide('#' + firstCharLC(job) + 'Caption')
		if (numOfWorkers>0){
			reveal('#add' + job);
		}
		var numOfJobs = fetch(job + 's');
		if (numOfJobs>0){
			var typeOfResource = fetchRelevantResources(job+'s', 0);
			reveal('#' + typeOfResource + 'Caption');
		}

	});
	numOfWorkers>1 ? reveal('#readyToHire') : hide('#readyToHire');
	if (numOfWorkers<2){
		hide('.hire');	
		hide('.overseer');
		var allJobs = fetchListOfJobs('all');
		$.each(allJobs, function(i, job){			
			var numOfJobs = fetch(job + 's');
			if (numOfJobs==0){
				hide('#' + job + 'Caption');
			}			
		});
		
		if($('#laborMenuButton').hasClass('active') && $('#autoFocusAway').val()=='false'){
			menuButtonPressed('capitalMenuButton');
			$('#autoFocusAway').val(true);
		}
		return;
	}
	$('#autoFocusAway').val(false);

}

function reveal(selector){
	if (selector.substring(0, 1) == '.'){
		var allElements = $(selector);
		$.each(allElements, function(i, element){
			if ($('#' + element.id).hasClass('hidden')){
				$('#' + element.id).removeClass('hidden');
			}
		});
		return;
	}
	if ($(selector).hasClass('hidden')){
		$(selector).removeClass('hidden');
	}
}

function updateNewPopProgress(){
	var chanceToCreateNewPerson = fetchChanceToCreateNewPerson();
	var campfireFloorChance = fetchCampfireFloorChance()*.01;
	var clickCounter = fetchClickCounter();
	var floorChance = fetchFloorChance()*.01;
	var newPopCent =  (clickCounter / chanceToCreateNewPerson)+floorChance+campfireFloorChance;


	if (newPopCent<1 && newPopCent>0){
		newPopCent = String(newPopCent).substring(2).substring(0,2);

	} else if (newPopCent>=1){
		newPopCent = 99;	
	}
	if (String(newPopCent).length==1 && newPopCent!=0){
		newPopCent += '0';
	}

	$('#newPopProgress').val(newPopCent);
	$('#newPopCent').html(newPopCent);

}
