function hasEUpg(id) {
	return hasUpgrade("e",id);
}

function getEEff(id) {
	return upgradeEffect("e",id);
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
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "e", description: "E: Reset for energy", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
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
			cost: new Decimal(100),
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
			cost: new Decimal(250),
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
			cost: new Decimal(200000),
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
