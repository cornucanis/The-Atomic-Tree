function resetElementCounts() {
	for (i = 0; i < elementCounts.length; i++) {
		elementCounts[i] = new Decimal(0);
	}
}

function setElementWeights() {
	if (!player) return
	//0 is weight 1. 1 is weight x. 2 is weight x^2. 3 is weight x^3.
	let scale = player.a.elementalRarityScaling;
	let currentWeight = new Decimal(1);
	let total = 0;
	for (i = 0; i < elementWeights.length; i++) {
		elementWeights[i] = currentWeight;
		total += currentWeight.toNumber();
		currentWeight = currentWeight.div(scale);
	}
	player.a.totalElementalWeight = total;
}

function getElementWeight(id) {
	let base = new Decimal(1);
	let scale = player.a.elementalRarityScaling;
	return base.div(new Decimal(scale).pow(id))
}

function chooseElement() {
	
}

function classifyAtoms() {
	let amt = getClassifyAmount();
	console.log("classified");
}

function isNumber(n){
    return !isNaN(n) && ((typeof n == 'number' && isFinite(n))|| Decimal.prototype.isPrototypeOf(n)); //&& isFinite(n);
 }

/*function getClassifyAmount() {
	//make sure is number, check mode, calculate amount, clamp between 0 and current atoms
	player.a.classifyAmount = parseInt(player.a.classifyAmount);
	if (!isNumber(player.a.classifyAmount)) player.a.classifyAmount = 1;
	let atoms = player.a.points.floor();
	let amt = player.a.classifyMode ? player.a.classifyAmount : atoms * player.a.classifyAmount * 0.01;
	amt = Math.min(Math.max(amt,0),atoms);
	return amt;
}*/

function getClassifyAmount() {
	if (!isNumber(player.a.classifyAmount)) player.a.classifyAmount = new Decimal(1);
	let atoms = player.a.points.floor();
	let amt = player.a.classifyMode ? player.a.classifyAmount : player.a.classifyAmount.mul(0.01).mul(atoms);
	return amt.floor().clamp(0,atoms);
}

var elementColors = [
	"#592e2d",
	"#312d59",
	"#2d5948",
	"#4e592d"
]

var elementData = {
	101: {
		position:0,
		name: "Hydrogen",
		symbol: "H",
		group: 0
	},
	118: {
		position:1,
		name: "Helium",
		symbol: "He",
		group: 0
	},
	201: {
		position:2,
		name: "Lithium",
		symbol: "Li",
		group: 0
	},
	202: {
		position:3,
		name: "Beryllium",
		symbol: "Be",
		group: 0
	},
	213: {
		position:4,
		name: "Boron",
		symbol: "B",
		group: 1
	},
	214: {
		position:5,
		name: "Carbon",
		symbol: "C",
		group: 1
	},
	215: {
		position:6,
		name: "Nitrogen",
		symbol: "N",
		group: 1
	},
	216: {
		position:7,
		name: "Oxygen",
		symbol: "O",
		group: 1
	},
	217: {
		position:8,
		name: "Fluorine",
		symbol: "F",
		group: 1
	},
	218: {
		position:9,
		name: "Neon",
		symbol: "Ne",
		group: 1
	},
	301: {
		position:10,
		name: "Sodium",
		symbol: "Na",
		group: 0
	},
	302: {
		position:11,
		name: "Magnesium",
		symbol: "Mg",
		group: 0
	},
	313: {
		position:12,
		name: "Aluminium",
		symbol: "Al",
		group: 1
	},
	314: {
		position:13,
		name: "Silicon",
		symbol: "Si",
		group: 1
	},
	315: {
		position:14,
		name: "Phosphorous",
		symbol: "P",
		group: 1
	},
	316: {
		position:15,
		name: "Sulfur",
		symbol: "S",
		group: 1
	},
	317: {
		position:16,
		name: "Chlorine",
		symbol: "Cl",
		group: 1
	},
	318: {
		position:17,
		name: "Argon",
		symbol: "Ar",
		group: 1
	},
	401: {
		position:18,
		name: "Potassium",
		symbol: "K",
		group: 0
	},
	402: {
		position:19,
		name: "Calcium",
		symbol: "Ca",
		group: 0
	},
	403: {
		position:20,
		name: "Scandium",
		symbol: "Sc",
		group: 2
	},
	404: {
		position:21,
		name: "Titanium",
		symbol: "Ti",
		group: 2
	},
	405: {
		position:22,
		name: "Vanadium",
		symbol: "V",
		group: 2
	},
	406: {
		position:23,
		name: "Chromium",
		symbol: "Cr",
		group: 2
	},
	407: {
		position:24,
		name: "Manganese",
		symbol: "Mn",
		group: 2
	},
	408: {
		position:25,
		name: "Iron",
		symbol: "Fe",
		group: 2
	},
	409: {
		position:26,
		name: "Cobalt",
		symbol: "Co",
		group: 2
	},
	410: {
		position:27,
		name: "Nickel",
		symbol: "Ni",
		group: 2
	},
	411: {
		position:28,
		name: "Copper",
		symbol: "Cu",
		group: 2
	},
	412: {
		position:29,
		name: "Zinc",
		symbol: "Zn",
		group: 2
	},
	413: {
		position:30,
		name: "Gallium",
		symbol: "Ga",
		group: 1
	},
	414: {
		position:31,
		name: "Germanium",
		symbol: "Ge",
		group: 1
	},
	415: {
		position:32,
		name: "Arsenic",
		symbol: "As",
		group: 1
	},
	416: {
		position:33,
		name: "Selenium",
		symbol: "Se",
		group: 1
	},
	417: {
		position:34,
		name: "Bromine",
		symbol: "Br",
		group: 1
	},
	418: {
		position:35,
		name: "Krypton",
		symbol: "Kr",
		group: 1
	},
	501: {
		position:36,
		name: "Rubidium",
		symbol: "Rb",
		group: 0
	},
	502: {
		position:37,
		name: "Strontium",
		symbol: "Sr",
		group: 0
	},
	503: {
		position:38,
		name: "Yttrium",
		symbol: "Y",
		group: 2
	},
	504: {
		position:39,
		name: "Zirconium",
		symbol: "Zr",
		group: 2
	},
	505: {
		position:40,
		name: "Niobium",
		symbol: "Nb",
		group: 2
	},
	506: {
		position:41,
		name: "Molybdenum",
		symbol: "Mo",
		group: 2
	},
	507: {
		position:42,
		name: "Technetium",
		symbol: "Tc",
		group: 2
	},
	508: {
		position:43,
		name: "Ruthenium",
		symbol: "Ru",
		group: 2
	},
	509: {
		position:44,
		name: "Rhodium",
		symbol: "Rh",
		group: 2
	},
	510: {
		position:45,
		name: "Palladium",
		symbol: "Pd",
		group: 2
	},
	511: {
		position:46,
		name: "Silver",
		symbol: "Ag",
		group: 2
	},
	512: {
		position:47,
		name: "Cadmium",
		symbol: "Cd",
		group: 2
	},
	513: {
		position:48,
		name: "Indium",
		symbol: "In",
		group: 1
	},
	514: {
		position:49,
		name: "Tin",
		symbol: "Sn",
		group: 1
	},
	515: {
		position:50,
		name: "Antimony",
		symbol: "Sb",
		group: 1
	},
	516: {
		position:51,
		name: "Tellurium",
		symbol: "Te",
		group: 1
	},
	517: {
		position:52,
		name: "Iodine",
		symbol: "I",
		group: 1
	},
	518: {
		position:53,
		name: "Xenon",
		symbol: "Xe",
		group: 1
	}	
}

var elementCounts = new Array(Object.keys(elementData).length)
var elementWeights = new Array(Object.keys(elementData).length)
resetElementCounts();
setElementWeights();