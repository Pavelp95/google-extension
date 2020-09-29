var a =[];
var items = (['♠','♣','♦','♥']);
var stat = {};
function generateRandom(){
	return items[Math.floor(Math.random()*items.length)];
}

function generatorArryay() {
	for (var i = 0; i < 10; i++){
		a.push(generateRandom());
	}
	console.log(a);
}

function calcStar(){
	for (var i = 0; i < a.length; i++){
		if(stat[a[i]]) stat[a[i]]++;
		else stat[a[i]] = 1;
	}
	console.log(stat);
}
calcStat()

#u50. 20(9♦️8♣️Q♦️)-19(A♠️8♦️) 
♥️ - 6
♦️ - 6
♣️ - 6
♠️ - 4