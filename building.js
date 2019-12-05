function fetchBuildingCost(typeOfBuilding){
	switch (typeOfBuilding){
		case 'granary':
			return $('#granaryCost').val();
			break;
	}
}

function updateBuildingCost(typeOfBuilding, cost){
	switch (typeOfBuilding){
		case 'granary':
			$('#granaryCost').val(cost);
			break;
	}
}