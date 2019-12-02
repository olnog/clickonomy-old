var timer;
var flashingUI;
$(document).on ("click", ".clicker", function(event){
	var numOfWorkers = fetchNumOfWorkers();
	var numOfFarmers = fetchNumOfFarmers();
	var numOfPeople = fetchNumOfPeople();
	var chanceToCreateNewPerson = numOfPeople*4;
	var clickCounter = Number($('#clickCounter').val());
	clickCounter++;
	if (clickCounter>=numOfPeople){
		var floorChance = clickCounter-numOfPeople;
	}

	if ($("#" + event.target.id).hasClass('worker')){
		var numOfClicks = fetchNumOfClicks();
		if (numOfClicks==0){
			timer = startTimer();
			$("#peopleCaption").css("display", "inline");
			$("#peopleContainer").css("display", "inline");
		}
		numOfClicks+=numOfWorkers;
		updateClicks(numOfClicks);
	} else if ($("#" + event.target.id).hasClass('farmer')){
		var food = fetchFood();
		food+=numOfFarmers;
		updateFood(food);
	} else if ($('#' + event.target.id).hasClass('lumberjack')){
		var wood = fetchWood();
		wood+=fetchNumOfLumberjacks();
		updateWood(wood);
	}
	if (fetch_random_num(1, chanceToCreateNewPerson)<=floorChance){
		numOfWorkers++;
		numOfPeople++;
		updateWorkers(numOfWorkers);
		updatePeople(numOfPeople);
		$(".hire").css("display", "inline");	
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
	var numOfWorkers = fetchNumOfWorkers();
	if (numOfWorkers==0){
		return;
	}
	numOfWorkers--;
	if (event.target.id == "addFarmer"){
		var numOfFarmers = fetchNumOfFarmers();
		numOfFarmers++;
		updateFarmers(numOfFarmers);
		$("#farm").css("display", "inline");
		clearBlinkingButtons();
		blinkButton("#farm");
	} else if (event.target.id=='addLumberjack'){
		var numOfLumberjacks = fetchNumOfLumberjacks();		
		numOfLumberjacks++;
		if (numOfLumberjacks=>1){
			$('#woodCaption').css('display', 'inline');
		}
		updateLumberjacks(numOfLumberjacks);
		$('#chop').css('display', 'inline');
		clearBlinkingButtons();
		blinkButton("#chop");

	} else if (event.target.id == 'addOverseer'){
		var numOfOverseers = fetchNumOfOverseers();
		numOfOverseers++;
		updateOverseers(numOfOverseers);
		
	}
	updateWorkers(numOfWorkers);
	refreshJobs();
});
$(document).on ("click", ".overseer", function(event){
	var numOfOverseers = fetchNumOfOverseers();
	if (numOfOverseers<1){
		return;
	}
	numOfOverseers--;
	updateOverseers(numOfOverseers);
	if (event.target.id=='overseeFarm'){
		var numOfFarmOverseers = fetchNumOfFarmOverseers();
		numOfFarmOverseers++;	
		updateFarmOverseers(numOfFarmOverseers);
	} else if (event.target.id=='overseeForest'){
		var numOfLumberjackOverseers = fetchNumOfLumberjackOverseers();
		numOfLumberjackOverseers++;
		updateLumberjackOverseers(numOfLumberjackOverseers);	
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
function fetch_random_num (floor, ceiling){
	return Math.floor(Math.random() * ceiling) + floor;
}
function fetchFood(){
	return Number($("#numOfFood").html());	
}
function fetchNumOfClicks(){
	return Number($("#numOfClicks").html());	
}
function fetchNumOfFarmers(){
	return Number($("#numOfFarmers").html());
}
function fetchNumOfOverseers(){
	return Number($("#numOfOverseers").html());
}
function fetchNumOfFarmOverseers(){
	return Number($("#numOfFarmOverseers").html());
}
function fetchNumOfLumberjackOverseers(){
	return Number($('#numOfLumberjackOverseers').html());
}
function fetchNumOfLumberjacks(){
	return Number($("#numOfLumberjacks").html());
}
function fetchNumOfPeople(){
	return Number($("#numOfPeople").html());
}
function fetchNumOfWorkers (){
	return Number($("#numOfWorkers").html());
}
function fetchWood (){
	return Number($("#numOfWood").html());
}
function feedWorkers (){
	var food = fetchFood();
	var numOfWorkers = fetchNumOfWorkers();
	var numOfFarmers = fetchNumOfFarmers();
	var numOfOverseers = fetchNumOfOverseers();
	var numOfPeople = fetchNumOfPeople();
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
			var numOfClicks=fetchNumOfClicks(); 
			updateClicks(Math.floor(numOfClicks/2));
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
	updateFarmers(numOfFarmers);
	updateFood(food);
	updateOverseers(numOfOverseers);
	updatePeople(numOfPeople);
	updateWorkers(numOfWorkers);
	refreshJobs();
	
}
function flashUI(selector){
	$(selector).css('display', 'inline');
	clearTimeout(flashingUI);
	flashingUI = setTimeout(function(){
		$(selector).css('display', 'none');
	}, 500);
}
function overseeWork(){
	var numOfFarmOverseers = fetchNumOfFarmOverseers();
	var numOfLumberjackOverseers = fetchNumOfLumberjackOverseers();
	if (numOfFarmOverseers>0){
		var numOfFarmers = fetchNumOfFarmers();
		var food = fetchFood();
		var foodProduction = numOfFarmers * (1- (.1/numOfFarmOverseers));
		var foodDelta = Math.trunc (foodProduction);
		food+=foodDelta;
		foodDelta=foodProduction-foodDelta;
		if (foodDelta<1){
			if(Math.random() * 1 <= foodDelta){
				food++;
			}
		}
		updateFood(food);
	}
	if (numOfLumberjackOverseers>0){
		var numOfLumberjacks = fetchNumOfLumberjacks();
		var wood = fetchWood();
		var woodProduction = numOfLumberjacks * (1- (.1/numOfLumberjackOverseers));
		var woodDelta = Math.trunc (woodProduction);
		wood+=woodDelta;
		woodDelta=woodProduction-woodDelta;
		if (woodDelta<1){
			if(Math.random() * 1 <= woodDelta){
				wood++;
			}
		}
		updateWood(wood);
	}
}
function refreshJobs(){
	var numOfWorkers = fetchNumOfWorkers();
	var food = fetchFood();
	var numOfClicks = fetchNumOfClicks();
	var numOfFarmers = fetchNumOfFarmers();
	var numOfLumberjacks = fetchNumOfLumberjacks();
	var numOfOverseers = fetchNumOfOverseers();
	var numOfFarmOverseers = fetchNumOfFarmOverseers();
	var numOfLumberjackOverseers = fetchNumOfLumberjackOverseers();
	var numOfPeople = fetchNumOfPeople();
	if (numOfWorkers<2){
		$(".hire").css("display", "none");
		if (numOfOverseers==0){
			$("#overseerCaption").css('display', 'none');
		}
		if (numOfClicks==0 && food==0 && numOfFarmers==0){
			$("#farmerCaption").css('display', 'none');
			$("#foodCaption").css("display", 'none');
			stopTimer();
		}
		
	} else if (numOfWorkers>1){
		$("#farmerCaption").css("display", "inline");
		$("#lumberjackCaption").css('display', 'inline');
		$("#foodCaption").css("display", "inline");
		if (food>0 || numOfFarmers>0){
			$("#overseerCaption").css("display", "inline");
		}else {
			clearBlinkingButtons();
			blinkButton('#addFarmer');
		}
		
	}
	if (numOfFarmers==0){
		$("#farm").css('display', 'none');
	} else {
		if (food<numOfPeople){
			blinkButton("#farm");
		} else {
			stopBlinkingButton('#farm');
		}
		$("#farm").css('display', 'inline');
	}
	if (numOfOverseers<1){
		$(".overseer").css('display', 'none');
	} else if (numOfOverseers>0){
		if (numOfFarmers>0){
			$('#overseeFarm').css('display', 'inline');
		} 
		console.log(numOfLumberjacks);
		if (numOfLumberjacks>0){
			$('#overseeForest').css('display', 'inline');
		}
	}
	if (numOfFarmOverseers>0){
		$("#farmOverseerCaption").css('display', 'inline');	
	} else {
		$("#farmOverseerCaption").css('display', 'none');	
	}
	if (numOfLumberjackOverseers>0){
		$("#lumberjackOverseerCaption").css('display', 'inline');	
	} else {
		$("#lumberjackOverseerCaption").css('display', 'none');	
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
		if (seconds<=10 && fetchFood()<=fetchNumOfPeople()){
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
function updateClicks(n){
	$("#numOfClicks").html(n);	
}
function updateFarmers(n){
	$("#numOfFarmers").html(n);
	$("#farm").val("+" + n);
}
function updateFood(n){
	$("#numOfFood").html(n);
}
function updateLumberjacks(n){
	$('#numOfLumberjacks').html(n);
	$('#chop').val('+' + n);
}
function updateOverseers(n){
	$("#numOfOverseers").html(n);
}
function updateFarmOverseers(n){
	$("#numOfFarmOverseers").html(n);
}
function updateLumberjackOverseers(n){
	$('#numOfLumberjackOverseers').html(n);
}
function updatePeople(n){
	$("#numOfPeople").html(n);
}
function updateWood(n){
	$("#numOfWood").html(n);
}
function updateWorkers(n){
	$("#numOfWorkers").html(n);
	$("#work").val("+" + n);
}

setInterval(function(){
	$(".blinking").css('font-weight', 'bold');
	setTimeout(function(){
		$('.blinking').css('font-weight', 'normal');
	}, 850);
}, 1700);
