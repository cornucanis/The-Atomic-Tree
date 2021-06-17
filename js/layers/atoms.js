addLayer("a", {
    name: "atoms", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		classifyAmount:new Decimal(1),
		classifyMode: true, //true means assign amount, false means assign percentage of current atoms
		elementalRarityScaling:50,
		totalElementalWeight:1
    }},
    color: "#20b347",
    requires: new Decimal(1e175), // Can be a function that takes requirement increases into account
    resource: "unclassified atoms", // Name of prestige currency
    baseResource: "energy", // Name of resource prestige is based on
    baseAmount() {return player.e.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	branches: ["p","n","l"],
    exponent: 0.002, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
	effect() {
		let eff = player.a.points.add(1);
		let exp = new Decimal(4);
		eff = eff.pow(exp);
		return eff;
	},
	effectDescription() {
		let desc = "which are boosting aether gain by " + effectText(format(this.effect()), this.color) + "x";
		return desc
	},
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "a", description: "A: Reset for atoms", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	doReset(resettingLayer) {
		let keep = [];
		resetElementCounts();
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
	},
	upgrades: {

	},
	infoboxes: {
		ptable: {
			title: "Periodic Table",
			body() {
				return "Not yet implemented! Should hopefully be working soon in an upcoming version."
				/*return "Classify your atoms to determine which element they are. Lower atomic weight elements are far more common than high atomic weight elements. Each element provides a different benefit. Hover over an element to see a tooltip outlining the element's bonus. This grid should be laid out like a periodic table, if it displays oddly you may need to switch to single tab layout."*/
			}
		}
	},
	tabFormat: {
		"Main": {
			content: [
				"main-display",
				"prestige-button",
				["display-text",
				function() {
					return "You have " + format(player.e.points) + " energy"
				}],
				"blank",
				"milestones"
			]
		},
		"Classified Atoms": {
			content: [
				"main-display",
				["infobox", "ptable"],
				"blank",
				"blank",
				["display-text", 
				function() {
					return "How many atoms would you like to classify?"
				}],
				"blank",
				["text-input","classifyAmount",{height:"30px",width:"200px",borderRadius:"10px",backgroundColor:"#ffbade",color:"#021700",fontSize:"15px"}],
				["toggle-text-mod", ["a", "classifyMode"],{color:"#4a0027",textShadow:"#4a0027 0px 0px 10px"}],
				"blank",
				"clickables",
				"blank",
				"blank",
				"grid"
			],
			unlocked() {
				return hasMilestone("a",4);
			}
		}
	},
	grid: {
		rows: 5, // If these are dynamic make sure to have a max value as well!
		cols: 18,
		getStartData(id) {
			return 0
		},
		getUnlocked(id) { // Default
			return true
		},
		getCanClick(data, id) {
			return false
		},
		//onClick(data, id) { 
			//player[this.layer].grid[id] = 0
		//},
		getDisplay(data, id) {
			let elem = elementData[id];
			if (!elem) return "";
			let aWeight = elem.position + 1;
			let symColor = "#62b377";
			return "<h3 style='color: " + symColor + "'>" + aWeight + "</h3>\n\
			<h1 style='color:" + symColor + ";text-shadow:" + symColor + " 0px 0px 8px'>" + elem.symbol + "</h1>\n\
			<h3>" + elementCounts[elem.position] + "</h3>";
		},
		getStyle(data, id) {
			let elem = elementData[id];
			let bgColor = elem ? elementColors[elem.group] : "black";
			let vis = elem ? "visible" : "hidden";
			return {"visibility":vis,"width":"65px","height":"65px","backgroundColor":bgColor}
		}
	},
	clickables: {
		11: {
            display() {
                return "<h3>Click to classify " + getClassifyAmount() + " atoms.</h3>"
            },
            canClick() {return getClassifyAmount().gt(0)},
            onClick() {
				classifyAtoms();
            },
            style: {'height':'130px', 'width':'130px'},
        }
	},
	milestones: {
		0: {
            requirementDescription: "1 atom",
            effectDescription: "Gain 10% of electron gain per second.",
            done() { return player.a.total.gte(1) }
        },
		1: {
			requirementDescription: "2 total atoms",
            effectDescription: "Keep energy upgrades on all resets.",
            done() { return player.a.total.gte(2) }
		},
		2: {
			requirementDescription: "4 total atoms",
            effectDescription: "Keep electron milestones on atom reset.",
            done() { return player.a.total.gte(4) }
		},
		3: {
			requirementDescription: "7 total atoms",
            effectDescription: "Keep all previous milestones on atom reset.",
            done() { return player.a.total.gte(7) }
		},
		4: {
			requirementDescription: "15 total atoms",
            effectDescription: "Unlock atom classification.",
            done() { return player.a.total.gte(15) }
		}
		
    },
    layerShown(){return player.n.unlocked}
})