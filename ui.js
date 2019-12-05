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
