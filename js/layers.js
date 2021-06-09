// softcaps a decimal value based on a softcap data array. First item in the array is the threshold, second item is the dampening effect
function softcapValue(value, sc) {
	for (i = 0; i < sc.length; i++) {
		let cap = sc[i];
		if (value.gte(cap[0])) value = value.div(cap[0]).pow(cap[1]).mul(cap[0]);
	}
	return value;
}

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

function effectText(text, color) {
		let ret = "<h2 style='color:" + color + "; text-shadow:" + color + " 0px 0px 10px'>" + text + "</h2>";
		return ret;
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
        let mult = new Decimal(1)
		let elecEff = tmp.l.effect[0];
		
		//currency effects
		if (elecEff && elecEff.gte(1)) mult = mult.mul(elecEff);
		
		//upgrade effects
		if (hasEUpg(14)) mult=mult.mul(getEEff(14));
		if (hasEUpg(22)) mult=mult.mul(getEEff(22));
		if (hasEUpg(24)) mult=mult.mul(getEEff(24));
		if (hasPUpg(11)) mult=mult.mul(getPEff(11));
		if (hasEUpg(34)) mult=mult.mul(getEEff(34));
		if (hasPUpg(22)) mult=mult.mul(getPEff(22));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "e", description: "E: Reset for energy", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	passiveGeneration() {
		let gen = 0;
		if (hasMilestone("p",1)) gen += 0.1;
		if (hasMilestone("l",2)) gen += 1;
		return gen;
	},
	doReset(resettingLayer) {
		let keep = [];
        if (hasMilestone("p", 0) && resettingLayer=="p") keep.push("upgrades")
        if (hasMilestone("l", 0) && resettingLayer=="l") keep.push("upgrades")
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
			title: "Energized Gains",
			description: "Multiply aether gain based on current energy",
			cost: new Decimal(2),
			softcaps: [
				[1e15, 0.25]
			],
			effect() {
				let eff = player.e.points.add(2);
				eff = eff.pow(1/3);
				eff = softcapValue(eff, this.softcaps);
				return eff;
			},
			effectDisplay() {
				let eff = getEEff(this.id);
				let dis = format(eff) + "x";
				if (this.softcaps && eff.gte(this.softcaps[0][0])) dis += "\n\
				(softcapped)"
				return dis;
			},
			unlocked() {
				return hasEUpg(11);
			}
		},
		13: {
			title: "Morether",
			description: "Doubles base gain of aether",
			cost: new Decimal(10),
			effect() {
				let eff = 2;
				return eff;
			},
			effectDisplay() {
				let dis = format(getEEff(this.id)) + "x";
				return dis;
			},
			unlocked() {
				return hasEUpg(12);
			}
		},
		14: {
			title: "Energy Breeder",
			description: "Multiply energy gain based on current energy",
			cost: new Decimal(20),
			softcaps: [
				[1e11, 0.2]
			],
			effect() {
				let eff = player.e.points.add(2);
				eff = eff.pow(1/5);
				eff = softcapValue(eff, this.softcaps);
				return eff;
			},
			effectDisplay() {
				let eff = getEEff(this.id);
				let dis = format(eff) + "x";
				if (this.softcaps && eff.gte(this.softcaps[0][0])) dis += "\n\
				(softcapped)"
				return dis;
			},
			unlocked() {
				return hasEUpg(13);
			}
		},
		21: {
			title: "Self Synergizing",
			description: "Multiply aether gain based on current aether",
			cost: new Decimal(75),
			effect() {
				let eff = player.points.add(2);
				let e31boost = hasEUpg(31) ? getEEff(31) : new Decimal(1);
				e31boost = e31boost.mul(1.5);
				eff = eff.log10().add(1).pow(e31boost);
				return eff;
			},
			effectDisplay() {
				let dis = format(getEEff(this.id)) + "x";
				return dis;
			},
			unlocked() {
				return hasEUpg(14);
			}
		},
		22: {
			title: "Superconductor",
			description: "Double base gain of energy",
			cost: new Decimal(150),
			effect() {
				let eff = 2;
				return eff;
			},
			effectDisplay() {
				let dis = format(getEEff(this.id)) + "x";
				return dis;
			},
			unlocked() {
				return hasEUpg(21);
			}
		},
		23: {
			title: "Batteries",
			description: "Double aether gain for each purchased energy upgrade",
			cost: new Decimal(500),
			effect() {
				let eff = player.e.upgrades.length;
				let base = hasEUpg(34) ? new Decimal(4) : new Decimal(2);
				eff = base.pow(eff);
				return eff;
			},
			effectDisplay() {
				let dis = format(getEEff(this.id)) + "x";
				return dis;
			},
			unlocked() {
				return hasEUpg(22);
			}
		},
		24: {
			title: "Waiting Game",
			description: "Multiply energy gain based on current aether",
			cost: new Decimal(75000),
			effect() {
				let eff = player.points.add(2);
				eff = eff.log10().add(1).pow(1.15);
				return eff;
			},
			effectDisplay() {
				let dis = format(getEEff(this.id)) + "x";
				return dis;
			},
			unlocked() {
				return hasEUpg(23);
			}
		},
		31: {
			title: "Electrical Boost",
			description: "Increase exponent of <b>'Self Synergizing'</b> effect based on current electrons",
			cost: new Decimal(5e36),
			effect() {
				let eff = player.l.points.add(1);
				eff = eff.log10().add(1).pow(0.45);
				return eff;
			},
			effectDisplay() {
				let dis = format(getEEff(this.id)) + "x";
				return dis;
			},
			unlocked() {
				return getBuyableAmount("l", 12).gte(2);
			}			
		},
		32: {
			title: "Increased Latency",
			description: "Multiplies the exponent of the <b>'Latent Energy'</b> effect.",
			cost: new Decimal(1e44),
			effect() {
				let eff = new Decimal(1.5);
				return eff;
			},
			effectDisplay() {
				let dis = format(getEEff(this.id)) + "x";
				return dis;
			},
			unlocked() {
				return getBuyableAmount("l", 12).gte(2);
			}			
		},
		33: {
			title: "Electrifaether",
			description: "Multiplies aether gain based on current electrons",
			cost: new Decimal(1e50),
			effect() {
				let eff = player.l.points.add(2);
				eff = eff.log10().add(1).pow(3).mul(2000);
				return eff;
			},
			effectDisplay() {
				let dis = format(getEEff(this.id)) + "x";
				return dis;
			},
			unlocked() {
				return getBuyableAmount("l", 12).gte(2);
			}			
		},
		34: {
			title: "Electron Buffer",
			description: "Doubles the <b>'Batteries'</b> base and applies the effect to energy gain at a reduced rate.",
			cost: new Decimal(5e52),
			effect() {
				let eff = getEEff(23);
				eff = eff.pow(1/5).mul(500);
				return eff;
			},
			effectDisplay() {
				let dis = format(getEEff(this.id)) + "x";
				return dis;
			},
			unlocked() {
				return getBuyableAmount("l", 12).gte(2);
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
    requires: new Decimal(1e7), // Can be a function that takes requirement increases into account
    resource: "protons", // Name of prestige currency
    baseResource: "energy", // Name of resource prestige is based on
    baseAmount() {return player.e.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	branches: ["e"],
	canBuyMax() {
			let can = false;
			if (hasMilestone("p",2)) can = true;
			return can;
	},
    exponent() {
		let exp = new Decimal(1.65);
		//if (hasPUpg(14)) exp = exp.minus(getPEff(14)).max(1);
		return exp;
	},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
		let l21boost = buyableEffect("l", 21);
		if (hasPUpg(14)) mult = mult.div(getPEff(14));
		if (l21boost.gt(1)) mult = mult.div(l21boost);
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
	effect() {
		let eff = player.p.points.add(1);
		let exp = new Decimal(2);
		if (hasPUpg(12)) exp = exp.add(getPEff(12));
		eff = eff.pow(exp);
		return eff;
	},
	effectDescription() {
		let desc = "which are boosting aether gain by " + effectText(format(this.effect()), this.color) + "x";
		/*
		let desc = "which are boosting aether gain by <h2 style='color:" + this.color + "; text-shadow:" + this.color + " 0px 0px 10px'>" + format(this.effect()) + "x</h2>";
		*/
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
			title: "Latent Energy",
			description: "Muliply energy gain based on highest number of protons reached",
			cost: new Decimal(2),
			effect() {
				let eff = player.p.best;
				let exp = hasEUpg(32) ? getEEff(32) : new Decimal(1);
				exp = exp.mul(1.8);
				eff = eff.add(1).pow(exp).add(1);
				return eff;
			},
			effectDisplay() {
				let dis = format(getPEff(this.id)) + "x";
				return dis;
			},
			unlocked() {
				return player.p.best.gt(0);
			}
		},
		12: {
			title: "Proton Power",
			description: "Increase proton effect exponent based on current energy",
			cost: new Decimal(4),
			effect() {
				let eff = player.e.points;
				let p21boost = hasPUpg(21) ? getPEff(21) : 1;
				eff = eff.add(1).log10().add(1).pow(0.5).div(3).mul(p21boost);
				return eff;
			},
			effectDisplay() {
				let dis = "+" + format(getPEff(this.id));
				return dis;
			},
			unlocked() {
				return hasPUpg(11);
			}
		},
		13: {
			title: "Back to Basics",
			description: "Multiply aether gain based on highest number of protons reached",
			cost: new Decimal(6),
			effect() {
				let eff = player.p.best;
				eff=eff.add(1).mul(10).pow(3);
				return eff;
			},
			effectDisplay() {
				let dis = format(getPEff(this.id)) + "x";
				return dis;
			},
			unlocked() {
				return hasPUpg(12);
			}
		},
		14: {
			title: "The Cheapening",
			description: "Proton cost scales better based on current aether",
			cost: new Decimal(8),
			effect() {
				let eff = player.points;
				eff = eff.add(1).log10().add(1).pow(2.8);
				return eff;
			},
			unlocked() {
				return hasPUpg(13);
			}
		},
		21: {
			title: "Upgrade Power",
			description: "The effect of <b>'Proton Power'</b> is boosted based on <b>Upgrayedd</b>'s level.",
			cost: new Decimal(54),
			effect() {
				let eff = getBuyableAmount("l", 12);
				eff = eff.add(1).pow(0.3).mul(1.5);
				return eff;
			},
			effectDisplay() {
				let dis = format(getPEff(this.id)) + "x";
				return dis;
			},
			unlocked() {
				return getBuyableAmount("l", 12).gte(3);
			}
		},
		22: {
			title: "Protenergy",
			description: "Proton effect boosts energy gain at a reduced rate",
			cost: new Decimal(57),
			effect() {
				let eff = tmp.p.effect;
				eff = eff.pow(0.3)
				return eff;
			},
			effectDisplay() {
				let dis = format(getPEff(this.id)) + "x";
				return dis;
			},
			unlocked() {
				return getBuyableAmount("l", 12).gte(3);
			}
		},
		23: {
			title: "Protonicallback",
			description: "Boosts the base of <b>Protonical</b> based on power of first electron effect.",
			cost: new Decimal(61),
			effect() {
				let eff = player.l.points;
				eff = eff.add(1).log10().add(1).pow(0.9).mul(20);
				return eff;
			},
			effectDisplay() {
				let dis = format(getPEff(this.id)) + "x";
				return dis;
			},
			unlocked() {
				return getBuyableAmount("l", 12).gte(3);
			}
		},
		24: {
			title: "Proton Infusion",
			description: "First electron effect is boosted based on <b>Upgrayedd</b>'s level.",
			cost: new Decimal(68),
			effect() {
				let eff = getBuyableAmount("l", 12);
				eff = eff.add(1).pow(1.5).mul(300);
				return eff;
			},
			effectDisplay() {
				let dis = format(getPEff(this.id)) + "x";
				return dis;
			},
			unlocked() {
				return getBuyableAmount("l", 12).gte(3);
			}
		}
	},
	milestones: {
        0: {
            requirementDescription: "3 protons",
            effectDescription: "Keep energy upgrades on proton reset.",
            done() { return player.p.points.gte(3) }
        },
		1: {
			requirementDescription: "5 protons",
            effectDescription: "Generate 10% of your pending energy gain per second.",
            done() { return player.p.points.gte(5) }
		},
		2: {
			requirementDescription: "8 protons",
            effectDescription: "You can buy max protons.",
            done() { return player.p.points.gte(8) }
		}
    },
    layerShown(){return player.e.unlocked}
})

addLayer("l", {
    name: "electrons", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "L", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#c70e0e",
    requires: new Decimal(1e16), // Can be a function that takes requirement increases into account
    resource: "electrons", // Name of prestige currency
    baseResource: "energy", // Name of resource prestige is based on
    baseAmount() {return player.e.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	branches: ["e"],
    exponent: 0.2, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
	effect() {
		//effect 0: boost energy gain
		//effect 1: greatly boost aether gain
		let eff = [new Decimal(1), new Decimal(1)]
		if (getBuyableAmount("l", 12).gte(1)) {
			eff[0] = eff[0].add(player.l.points);
			let p24boost = hasPUpg(24) ? getPEff(24) : 1;
			eff[0] = eff[0].pow(0.6).mul(p24boost).add(1);
		}
		if (getBuyableAmount("l", 12).gte(4)) {
			eff[1] = eff[1].add(player.l.points);
			eff[1] = eff[1].pow(1.1).add(1);
		}
		return eff;
	},
	effectDescription() {
		let desc = "";
		let eff = this.effect();
		if (getBuyableAmount("l", 12).gte(1)) {
			desc += "which are boosting energy gain by " + effectText(format(eff[0]), this.color) + "x";
		} else {
			desc += "which are not currently providing any passive effect."
		}
		if (getBuyableAmount("l", 12).gte(4)) {
			desc += ", and also boosting aether gain by " + effectText(format(eff[1]), this.color) + "x";
		}
		return desc;
	},
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "l", description: "L: Reset for electrons", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	update(diff) {
		//if (!this.effectDescription && getBuyableAmount("l", 12).gte(1)) 
			//this.effectDescription = this.effectDescriptionContents;
	},
	upgrades: {
		
		
	},
	buyables: {
		rows: 2,
        cols: 2,
        11: {
			title: "Aetherize",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                let cost = Decimal.pow(6, x.pow(1.2))
                return cost.floor()
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = getBuyableAmount("l", 11);
				let exp = 0.95;
                let base = new Decimal(100);
                return Decimal.pow(base, x.pow(exp));
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (player.tab != this.layer) return 
                return "Multiply aether gain.\n\
				Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" electrons\n\
				Amount: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "\n\
                Effect: " + format(tmp[this.layer].buyables[this.id].effect)+"x" + extra
            },
            unlocked() { return true }, 
            canAfford() {
                    return player.l.points.gte(tmp[this.layer].buyables[this.id].cost)
			},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.l.points = player.l.points.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            }
        },
		12: {
			title: "Upgrayedd",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
				let base = new Decimal(100);
				let exp = x.add(1);
				let scale = Decimal.pow(10,x.pow(1.7));
				let cost = Decimal.pow(base,exp).mul(scale);
                return cost.floor();
            },
			levelEffects: [
				"Adds a passive effect to electrons.", 
				"Adds a new row of energy upgrades.", 
				"Adds a new row of proton upgrades.",
				"Adds a second passive effect to electrons."
			],
			effect() { // Effects of owning x of the items, x is a decimal
                
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = "";
				let amt = getBuyableAmount(this.layer, this.id);
				if (amt > 0) {
					var textAmt = Math.min(amt,this.levelEffects.length)
					extra += "\n\n\
					Currently unlocked effects: "
					for(i=0;i<textAmt;i++) {
						extra += "\n\
						" + this.levelEffects[i];
					}
					
				}
				if (amt < this.levelEffects.length) {
					extra += "\n\n\
					Next effect unlocked: \n\
					" + this.levelEffects[amt];
				} else {
					extra += "\n\
					*ALL EFFECTS UNLOCKED*"
				}
                if (player.tab != this.layer) return 
                return "Unlocks various bonuses and upgrades.\n\
				Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" electrons\n\
				Amount: " + formatWhole(amt) + extra;
            },
            unlocked() { return hasMilestone("l",1) }, 
            canAfford() {
                    return player.l.points.gte(tmp[this.layer].buyables[this.id].cost)
			},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.l.points = player.l.points.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            }
        },
		21: {
			title: "Protonical",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
				let base = new Decimal(5000);
				let growth = new Decimal(2.5);
				let scale = new Decimal (1.33);
                let cost = base.mul(Decimal.pow(growth, x.pow(scale)))
                return cost.floor()
            },
			effect() { // Effects of owning x of the items, x is a decimal
				let p23boost = hasPUpg(23) ? getPEff(23) : 1;
                let x = getBuyableAmount(this.layer, this.id);
				let exp = 1.05;
                let base = new Decimal(1e15);
                return Decimal.pow(base.mul(p23boost), x.pow(exp));
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (player.tab != this.layer) return 
                return "Divide proton cost.\n\
				Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" electrons\n\
				Amount: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "\n\
                Effect: /" + format(tmp[this.layer].buyables[this.id].effect) + extra
            },
            unlocked() { return hasMilestone("l",3) }, 
            canAfford() {
                    return player.l.points.gte(tmp[this.layer].buyables[this.id].cost)
			},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.l.points = player.l.points.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            }
        },
		22: {
			title: "Protonical",
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
				let base = new Decimal(10000);
				let growth = new Decimal(3);
				let scale = new Decimal (1.1);
                let cost = base.mul(Decimal.pow(growth, x.pow(scale)))
                return cost.floor()
            },
			effect() { // Effects of owning x of the items, x is a decimal
                let x = getBuyableAmount(this.layer, this.id);
				let exp = 1.05;
                let base = new Decimal(1e15);
                return Decimal.pow(base, x.pow(exp));
            },
			display() { // Everything else displayed in the buyable button after the title
                let extra = ""
                if (player.tab != this.layer) return 
                return "Divide proton cost.\n\
				Cost: " + format(tmp[this.layer].buyables[this.id].cost)+" electrons\n\
				Amount: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "\n\
                Effect: /" + format(tmp[this.layer].buyables[this.id].effect) + extra
            },
            unlocked() { return hasMilestone("l",4) }, 
            canAfford() {
                    return player.l.points.gte(tmp[this.layer].buyables[this.id].cost)
			},
            buy() { 
                cost = tmp[this.layer].buyables[this.id].cost
                if (this.canAfford()) {
                    player.l.points = player.l.points.sub(cost).max(0)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).max(1)
                }
            }
        },
	},
	milestones: {
        0: {
            requirementDescription: "15 total electrons",
            effectDescription: "Keep energy upgrades on electron reset.",
            done() { return player.l.total.gte(15) }
        },
		1: {
			requirementDescription: "100 total electrons",
            effectDescription: "Unlock another electron buyable.",
            done() { return player.l.total.gte(100) }
		},
        2: {
            requirementDescription: "1000 total electrons",
            effectDescription: "Gain 100% of energy gain per second.",
            done() { return player.l.total.gte(1e3) }
        },
		3: {
			requirementDescription: "5000 total electrons",
            effectDescription: "Unlock a third electron buyable.",
            done() { return player.l.total.gte(5000) }
		},
		4: {
			requirementDescription: "1e101 total electrons",
            effectDescription: "Unlock yet another electron buyable.",
            done() { return player.l.total.gte(1e101) }
		},
    },
    layerShown(){return player.p.unlocked}
})

addLayer("n", {
    name: "neutrons", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "N", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#7a8a72",
    requires: new Decimal(5e104), // Can be a function that takes requirement increases into account
    resource: "neutrons", // Name of prestige currency
    baseResource: "energy", // Name of resource prestige is based on
    baseAmount() {return player.e.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	branches: ["e"],
    exponent: 0.75, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
	canBuyMax() {
			let can = false;
			if (hasMilestone("n",1)) can = true;
			return can;
	},
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
	effect() {
		let base = new Decimal(2);
		let eff = player.n.points;
		eff = base.pow(eff);
		return eff;
	},
	effectDescription() {
		let desc = "which are boosting energy gain by " + format(this.effect());
		return desc
	},
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "n", description: "N: Reset for neutrons", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	upgrades: {
		
		
	},
	milestones: {
        0: {
            requirementDescription: "3 total neutrons",
            effectDescription: "Keep energy upgrades on reset.",
            done() { return player.n.total.gte(3) }
        },
		1: {
            requirementDescription: "8 total neutrons",
            effectDescription: "You can buy max neutrons.",
            done() { return player.n.total.gte(8) }
        },
        2: {
            requirementDescription: "12 total neutrons",
            effectDescription: "Gain 5% of electron gain per second.",
            done() { return player.n.total.gte(15) }
        }
    },
    layerShown(){return player.l.unlocked}
})