function checkFoodLimit(numOfResources, numOfClickers){
	var foodLimit = fetchFoodLimit();
	if (numOfResources==foodLimit){
		return numOfResources;
	} else if (numOfResources + numOfClickers>foodLimit){
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
			return;
		}
		toolDelta = wood>stone ? stone : wood;
	} 
	update('Wood', wood - toolDelta);
	update('Stone', stone - toolDelta);
	update(toolType, numOfTools+toolDelta);
}
function createWeapon(weaponType){
	var numOfWeapons = fetch(weaponType);
	var numOfWeaponmakers = fetch('Weaponmakers');
	var stone = fetch('Stone');
	var wood = fetch('Wood');
	var weaponDelta=numOfWeaponmakers;
	if (wood<numOfWeaponmakers && stone<numOfWeaponmakers){
		if (wood==0 || stone==0){
			return;
		}
		weaponDelta = wood>stone ? stone : wood;
	} 
	update('Wood', wood - weaponDelta);
	update('Stone', stone - weaponDelta);
	update(weaponType, numOfWeapons+weaponDelta);
}
function destroyResources(){
	var capitalArr = fetchListOfResources();
	$.each(capitalArr, function(i, resourceType){
		var numOfResources = fetch(resourceType);
		if (numOfResources>0){
			numOfResources = Math.floor(numOfResources/2);
			update(resourceType, numOfResources);
		}
	});
}
function fetchFoodLimit(){
	return Number($('#foodLimit').html());
}
function fetchListOfResources(){
	return ['Clicks', 'Wood', 'Food', 'Stone', 'StoneSpears', 'StoneAxes', 'StonePickaxes', 'StoneHoes'];
}
function fetchNumOfRelevantTools(clickers){
	var toolType = fetchRelevantToolType(clickers );
	var numOfTools = fetch(toolType);
	var numOfClickers = fetch(clickers);
	return numOfTools>=numOfClickers ? numOfClickers : numOfTools;
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
		case 'Weaponmakers':
			capital='weapons';
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
			toolType='StonePickaxes';
			break;
	}
	return toolType;
}
function updateFoodLimit(n){
	$('#foodLimit').html(n);
	
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