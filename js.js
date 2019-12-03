var timer;
var flashingUI;
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
	var numOfWorkers = fetch('Workers');
	var numOfFarmers = fetch('Farmers');
	var numOfPeople = fetch('People');
	var chanceToCreateNewPerson = numOfPeople*4;
	var clickCounter = Number($('#clickCounter').val());
	clickCounter++;
	if (clickCounter>=numOfPeople){
		var floorChance = clickCounter-numOfPeople;
	}

	if (event.target.id == 'work' || event.target.id=='start'){
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
				clickesr ='Lumberjacks';
				break;
			case 'cutStone':
				clickers ='StoneCutters';
				break;
		}		
		var resourceType = fetchRelevantResources(clickers);
		resourceType = resourceType.charAt(0).toUpperCase() + resourceType.slice(1);
		var numOfResources = fetch(resourceType);
		var numOfClickers = fetch(clickers);
		numOfResources+=numOfClickers;
		console.log(numOfResources + ' ' +  resourceType);
		update(resourceType, numOfResources);
	}
	if (fetchRandomNum(1, chanceToCreateNewPerson)<=floorChance){
		numOfWorkers++;
		numOfPeople++;
		updateClickers('Workers', numOfWorkers);
		update('People', numOfPeople);
		$('.hire').removeClass('hidden');
		clickCounter=0;
	}
	refreshJobs();
	$('#clickCounter').val(clickCounter);
	var newPopCent =  (clickCounter+1) / chanceToCreateNewPerson;
	if (newPopCent<1){
		newPopCent = String(newPopCent).substr(2, 2);	
	} else {
		newPopCent = 99;	
	}
	if (String(newPopCent).length==1){
		newPopCent = newPopCent + "0";
	}
	$('#newPopProgress').val(newPopCent);
	$('#newPopCent').html(newPopCent);
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
			var capital = fetchRelevantResources(typeOfClicker);
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
		var numOfFarmOverseers = fetch('FarmOverseers');
		numOfFarmOverseers++;	
		update('FarmOverseers', numOfFarmOverseers);
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
function blink(selector, color){
	$(selector).css("color", color);
	setTimeout (function(){
		$(selector).css("color", "black");
	}, 500);
}
function blinkButton(selector){
	$(selector).addClass('blinking');
}
function stopBlinkingButton(selector){
	$(selector).css('font-weight', 'normal');
	$(selector).removeClass('blinking');

}
function clearBlinkingButtons(){
	$('.blinking').each (function (i, button){
		stopBlinkingButton('#' + button.id);
	});
}
function fetchRandomNum (floor, ceiling){
	return Math.floor(Math.random() * ceiling) + floor;
}
function fetch(what){
	return Number($('#numOf' + what).html());	
}
function fetchRelevantResources(clicker){
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
		case 'Workers':
			capital='clicks';
			break;
	
	}
	return capital;
}
function feedWorkers (){
	var food = fetch('Food');
	var numOfWorkers = fetch('Workers');
	var numOfFarmers = fetch('Farmers');
	var numOfOverseers = fetch('Overseers');
	var numOfPeople = fetch('People');
	if (food < numOfPeople){
		var foodDeficit=numOfPeople-food;
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
		food=0;
	} else {
		food-=numOfPeople;
	}
	updateClickers('Farmers', numOfFarmers);
	update('Food', food);
	update('Overseers', numOfOverseers);
	update('People', numOfPeople);
	updateClickers('Workers', numOfWorkers);
	refreshJobs();
	
}
function flashUI(selector){
	$(selector).removeClass('hidden');
	clearTimeout(flashingUI);
	flashingUI = setTimeout(function(){
		$(selector).addClass('hidden');
	}, 500);
}
function overseeWork(){
	var numOfFarmOverseers = fetch('FarmOverseers');
	var numOfLumberjackOverseers = fetch('LumberjackOverseers');
	var numOfStoneCutterOverseers = fetch('StoneCutterOverseers');
	if (numOfFarmOverseers>0){
		var numOfFarmers = fetch('Farmers');
		var food = fetch('Food');
		var foodProduction = numOfFarmers * (1- (.1/numOfFarmOverseers));
		var foodDelta = Math.trunc (foodProduction);
		food+=foodDelta;
		foodDelta=foodProduction-foodDelta;
		if (foodDelta<1){
			if(Math.random() * 1 <= foodDelta){
				food++;
			}
		}
		update('Food', food);
	}
	if (numOfLumberjackOverseers>0){
		var numOfLumberjacks = fetch('Lumberjacks');
		var wood = fetch('Wood');
		var woodProduction = numOfLumberjacks * (1- (.1/numOfLumberjackOverseers));
		var woodDelta = Math.trunc (woodProduction);
		wood+=woodDelta;
		woodDelta=woodProduction-woodDelta;
		if (woodDelta<1){
			if(Math.random() * 1 <= woodDelta){
				wood++;
			}
		}
		update('Wood', wood);
	}
	if (numOfStoneCutterOverseers>0){
		var numOfStoneCutters = fetch('StoneCutters');
		var stone = fetch('Stone');
		var stoneProduction = numOfStoneCutters * (1- (.1/numOfStoneCutterOverseers));
		var stoneDelta = Math.trunc (stoneProduction);
		stone+=stoneDelta;
		stoneDelta=stoneProduction-stoneDelta;
		if (stoneDelta<1){
			if(Math.random() * 1 <= stoneDelta){
				stone++;
			}
		}
		update('Stone', stone);
	}
}
function refreshJobs(){
	var numOfWorkers = fetch('Workers');
	var food = fetch('Food');
	var numOfClicks = fetch('Clicks');
	var numOfFarmers = fetch('Farmers');
	var numOfLumberjacks = fetch('Lumberjacks');
	var numOfOverseers = fetch('Overseers');
	var numOfFarmOverseers = fetch('FarmOverseers');
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
			clearBlinkingButtons();
			blinkButton('#addFarmer');
		}
		
	}
	console.log('farmers!');
	if (numOfFarmers==0 && !$('#farm').hasClass('hidden')){
		$("#farm").addClass('hidden');
	} else {
		if (food<numOfPeople){
			blinkButton("#farm");
		} else {
			stopBlinkingButton('#farm');
		}
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
	if (numOfFarmOverseers>0){
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
function startTimer (){
	var startingSeconds = 30;
	var startingMinutes = 0;
	$("#minutesRemaining").html(startingMinutes);
	$('#secondsRemaining').html(startingSeconds);
	$("#timeCaption").css("display", "inline");
	return setInterval(function(){
		overseeWork();
		var minutes = Number($("#minutesRemaining").html());
		var seconds = Number($("#secondsRemaining").html());
		seconds--;
		if (seconds<0){
			seconds=59;
			minutes--;
			if (minutes<0){
				feedWorkers();	
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
	$('#numOf' + what).html(n);
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
	$('#' + clickerButtonID).val("+" + n);
}

setInterval(function(){
	$(".blinking").css('font-weight', 'bold');
	setTimeout(function(){
		$('.blinking').css('font-weight', 'normal');
	}, 850);
}, 1700);
