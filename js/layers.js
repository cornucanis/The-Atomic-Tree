function hasEUpg(id) {
	return hasUpgrade("e",id);
}

function getEEff(id) {
	return upgradeEffect("e",id);
}

function hasPUpg(id) {
	return hasUpgrade("p",id);
}

function getPEff(id) {
	return upgradeEffect("p",id);
}

addLayer("e", {
    name: "energy", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#d7de04",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "energy", // Name of prestige currency
    baseResource: "aether", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if (hasEUpg(14)) mult=mult.mul(getEEff(14));
		if (hasEUpg(22)) mult=mult.mul(getEEff(22));
		if (hasEUpg(24)) mult=mult.mul(getEEff(24));
		if (hasPUpg(11)) mult=mult.mul(getPEff(11));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "e", description: "E: Reset for energy", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	update(diff) {
		if (hasMilestone("p",1)) generatePoints("e",diff);
	},
	doReset(resettingLayer) {
		let keep = [];
        if (hasMilestone("p", 0) && resettingLayer=="p") keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
	},
	upgrades: {
		11: {
			title: "Violate Thermodynamics",
			description: "Begin producing aether from nothing!",
			cost: new Decimal(1),
			effect() {
				return true
			}
		},
		12: {
			description: "Multiply aether gain based on current energy",
			cost: new Decimal(2),
			effect() {
				let eff = player.e.points.add(2);
				eff = eff.pow(5/12);
				return eff;
			},
			effectDisplay() {
				let dis = format(getEEff(12)) + "x";
				return dis;
			},
			unlocked() {
				return hasEUpg(11);
			}
		},
		13: {
			description: "Doubles base gain of aether",
			cost: new Decimal(10),
			effect() {
				let eff = 2;
				return eff;
			},
			effectDisplay() {
				let dis = format(getEEff(13)) + "x";
				return dis;
			},
			unlocked() {
				return hasEUpg(12);
			}
		},
		14: {
			description: "Multiply energy gain based on current energy",
			cost: new Decimal(20),
			effect() {
				let eff = player.e.points.add(2);
				eff = eff.pow(1/4);
				return eff;
			},
			effectDisplay() {
				let dis = format(getEEff(14)) + "x";
				return dis;
			},
			unlocked() {
				return hasEUpg(13);
			}
		},
		21: {
			description: "Multiply aether gain based on current aether",
			cost: new Decimal(75),
			effect() {
				let eff = player.points.add(2);
				eff = eff.log10().add(1).pow(1.5);
				return eff;
			},
			effectDisplay() {
				let dis = format(getEEff(21)) + "x";
				return dis;
			},
			unlocked() {
				return hasEUpg(14);
			}
		},
		22: {
			description: "Double base gain of energy",
			cost: new Decimal(150),
			effect() {
				let eff = 2;
				return eff;
			},
			effectDisplay() {
				let dis = format(getEEff(22)) + "x";
				return dis;
			},
			unlocked() {
				return hasEUpg(21);
			}
		},
		23: {
			description: "Double aether gain for each purchased energy upgrade",
			cost: new Decimal(1000),
			effect() {
				let eff = player.e.upgrades.length;
				eff = Math.pow(2,eff)
				return eff;
			},
			effectDisplay() {
				let dis = format(getEEff(23)) + "x";
				return dis;
			},
			unlocked() {
				return hasEUpg(22);
			}
		},
		24: {
			description: "Multiply energy gain based on current aether",
			cost: new Decimal(150000),
			effect() {
				let eff = player.points.add(2);
				eff = eff.log10().add(1).pow(1.15);
				return eff;
			},
			effectDisplay() {
				let dis = format(getEEff(24)) + "x";
				return dis;
			},
			unlocked() {
				return hasEUpg(23);
			}
		}
		
	},
    layerShown(){return true}
})

addLayer("p", {
    name: "protons", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#5676f5",
    requires: new Decimal(1e8), // Can be a function that takes requirement increases into account
    resource: "protons", // Name of prestige currency
    baseResource: "energy", // Name of resource prestige is based on
    baseAmount() {return player.e.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	branches: ["e"],
    exponent: 1.25, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
	effect() {
		let eff = player.p.points.add(1);
		let exp = 2;
		eff = eff.pow(exp);
		return eff;
	},
	effectDescription() {
		let desc = "which are boosting aether gain by " + format(this.effect()) + "x";
		return desc
	},
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for protons", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	update(diff) {
		//if (hasMilestone("p",1) generatePoints("p",diff);
	},
	upgrades: {
		11: {
			description: "Muliply energy gain based on highest number of protons reached",
			cost: new Decimal(3),
			effect() {
				let eff = player.p.best;
				eff = eff.add(1).pow(0.35)
				return eff;
			},
			effectDisplay() {
				let dis = format(getPEff(11)) + "x";
				return dis;
			},
			unlocked() {
				return player.p.best.gt(0);
			}
		}
		
	},
	milestones: {
        0: {
            requirementDescription: "5 protons",
            effectDescription: "Keep energy upgrades on proton reset.",
            done() { return player.p.points.gte(5) }
        },
        1: {
            requirementDescription: "12 protons",
            effectDescription: "Gain 100% of energy gain per second.",
            done() { return player.p.points.gte(12) }
        }
    },
    layerShown(){return player.e.unlocked}
})
