let clicker = document.getElementById("clicker-btn");
let current_count = document.getElementById("current-count");
let production_count = document.getElementById("production-count");
let generator_wrapper = document.getElementById("generator-wrapper");
let upgrade_wrapper = document.getElementById("upgrade-wrapper");

let click_increment = 1;
let click_count = 0;

let production_increment = 1;

class Upgrade {
  constructor(name, cost, callback) {
    this.name = name;
    this.cost = cost;
    this.callback = callback;

    this.acquired = false;
    this.unlocked = false;
  }
}

let generators = {
  petr: {
    name: "petr",
    cost: 50,
    production: 2,
    level: 0,
    unlocked: false,
  },
  karel: {
    name: "karel",
    cost: 100,
    production: 5,
    level: 0,
    unlocked: false,
  },
  babička: {
    name: "babička",
    cost: 1000,
    production: 10,
    level: 0,
    unlocked: false,
  },
  eva: {
    name: "eva",
    cost: 10000,
    production: 20,
    level: 0,
    unlocked: false,
  },
};

let upgrades = {
  click: {
    bronze_finger: new Upgrade("Bronze Finger", 100, () => {
      click_count += 2;
    }),
    iron_finger: new Upgrade("Iron Finger", 500, () => {
      click_count += 5;
    }),
    silver_finger: new Upgrade("Silver Finger", 1000, () => {
      click_count += 10;
    }),
    gold_finger: new Upgrade("Gold Finger", 2000, () => {
      click_count += 20;
    }),
    platinum_finger: new Upgrade("Platinum Finger", 5000, () => {
      click_count += 50;
    }),
    diamond_finger: new Upgrade("Diamond Finger", 10000, () => {
      click_count += 100;
    }),
    ruby_finger: new Upgrade("Ruby Finger", 20000, () => {
      click_count += 200;
    }),
    emerald_finger: new Upgrade("Emerald Finger", 50000, () => {
      click_count += 500;
    }),
  },

  production: {},
};

function onClick() {
  click_count += click_increment;
  Array.from(Object.keys(upgrades.click)).forEach((upgradeName) => {
    const upgrade = upgrades.click[upgradeName];
    if (upgrade.acquired) {
      upgrade.callback();
    }
  });
  updateCurrentCount();
}

function onProduction() {
  click_count += production_increment;
  updateCurrentCount();
  updateProduction();
  unlockUpgrades();
}

function buyGenerator(generator, generator_element) {
  if (click_count < generator.cost) return;
  click_count -= generator.cost;
  generator.level++;
  generator.cost *= 5;
  production_increment += generator.production;
  generator_element.innerText = `${generator.name}: ${generator.level} (${generator.cost.toFixed(2)})`;
  updateCurrentCount();
  updateProduction();
}

function buyUpgrade(upgrade) {
  if (click_count < upgrade.cost) return;
  click_count -= upgrade.cost;
  upgrade.acquired = true;
  renderUpgrades();
}

function renderGenerators() {
  const keys = Array.from(Object.keys(generators));
  keys.forEach((key) => {
    const generator = generators[key];
    const generator_element = document.createElement("button");
    generator_element.classList.add("generator-button");
    generator_element.innerText = `${generator.name}: ${generator.level} (${generator.cost.toFixed(2)})`;
    generator_element.addEventListener("click", () =>
      buyGenerator(generator, generator_element),
    );

    generator_wrapper.appendChild(generator_element);
  });
}

function renderUpgrades() {
  upgrade_wrapper.innerHTML = "";
  const types = Array.from(Object.keys(upgrades));
  types.forEach((type) => {
    const upgradeNames = Array.from(Object.keys(upgrades[type]));
    upgradeNames.forEach((upgradeName) => {
      const upgrade = upgrades[type][upgradeName];
      if (!upgrade.acquired && upgrade.unlocked) {
        const upgrade_element = document.createElement("button");
        upgrade_element.classList.add("upgrade-button");
        upgrade_element.innerText = `${upgrade.name}: ${upgrade.cost.toFixed(2)}`;
        upgrade_element.addEventListener("click", () =>
          buyUpgrade(upgrade, upgrade_element),
        );
        upgrade_wrapper.appendChild(upgrade_element);
      }
    });
  });
}

function updateProduction() {
  production_count.innerHTML = `${production_increment.toFixed(2)} per second`;
}

function updateCurrentCount() {
  current_count.innerHTML = `${click_count.toFixed(2)} cakes`;
}

function unlockUpgrades() {
  const types = Array.from(Object.keys(upgrades));
  types.forEach((type) => {
    const upgradeNames = Array.from(Object.keys(upgrades[type]));
    upgradeNames.forEach((upgradeName) => {
      const upgrade = upgrades[type][upgradeName];
      console.log(upgrade);
      if (upgrade.cost <= click_count && !upgrade.unlocked) {
        upgrade.unlocked = true;
        renderUpgrades();
      }
    });
  });
}

clicker.addEventListener("click", onClick);

setInterval(onProduction, 1000);
renderGenerators();
renderUpgrades();
