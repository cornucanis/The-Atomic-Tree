addLayer("a", {
    name: "atoms", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
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
	upgrades: {

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