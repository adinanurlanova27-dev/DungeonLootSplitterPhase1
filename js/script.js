// Array to store loot objects in memory while the page is open
const lootInventory = [];

// Get HTML elements by their ID
const partySizeInput = document.getElementById("party-size");
const partyMessage = document.getElementById("party-message");
const nameInput = document.getElementById("loot-name");
const valueInput = document.getElementById("loot-value");
const addButton = document.getElementById("add-loot-btn");
const splitButton = document.getElementById("split-loot-btn");
const validationMessage = document.getElementById("validation-message");
const splitMessage = document.getElementById("split-message");
const lootList = document.getElementById("loot-list");
const totalValueDisplay = document.getElementById("total-value");
const splitTotalDisplay = document.getElementById("split-total-value");
const perMemberDisplay = document.getElementById("per-member-value");

// Register event handlers for the Add Loot and Split Loot buttons
addButton.addEventListener("click", addLoot);
splitButton.addEventListener("click", splitLoot);

// Calculates total loot value from the array using a traditional indexed for loop
function calculateTotalLoot() {
    let totalValue = 0;

    for (let i = 0; i < lootInventory.length; i++) {
        totalValue += lootInventory[i].value;
    }

    return totalValue;
}

// Validates and adds a loot item object to the array, then updates the UI
function addLoot() {
    validationMessage.textContent = "";
    validationMessage.className = "status-message";

    const itemName = nameInput.value.trim();
    const itemValueInput = valueInput.value.trim();
    const itemValue = parseFloat(itemValueInput);

    // Reject empty loot name
    if (itemName === "") {
        validationMessage.textContent = "Error: Loot name cannot be empty.";
        return;
    }

    // Check for duplicate item names using a loop
    let isDuplicate = false;
    for (let i = 0; i < lootInventory.length; i++) {
        if (lootInventory[i].name.toLowerCase() === itemName.toLowerCase()) {
            isDuplicate = true;
            break;
        }
    }

    if (isDuplicate) {
        validationMessage.textContent = "Error: '" + itemName + "' is already in the loot list.";
        return;
    }

    // Reject missing, non-numeric, or negative loot values
    if (itemValueInput === "" || Number.isNaN(itemValue) || itemValue < 0) {
        validationMessage.textContent = "Error: Loot value must be a valid number of 0.00 or more.";
        return;
    }

    // Create loot object and add to array
    const lootObject = {
        name: itemName,
        value: itemValue
    };
    lootInventory.push(lootObject);

    // Sort items by value from highest to lowest
    for (let i = 0; i < lootInventory.length - 1; i++) {
        for (let j = 0; j < lootInventory.length - 1 - i; j++) {
            if (lootInventory[j].value < lootInventory[j + 1].value) {
                const temp = lootInventory[j];
                lootInventory[j] = lootInventory[j + 1];
                lootInventory[j + 1] = temp;
            }
        }
    }

    renderLoot();
    updateTotalDisplay();

    validationMessage.textContent = "Added '" + itemName + "' ($" + itemValue.toFixed(2) + ").";
    validationMessage.className = "status-message success";

    nameInput.value = "";
    valueInput.value = "";
    nameInput.focus();
}

// Loops through the loot array to render each item in the DOM
function renderLoot() {
    lootList.innerHTML = "";

    for (let i = 0; i < lootInventory.length; i++) {
        const currentItem = lootInventory[i];
        const listItem = document.createElement("li");

        listItem.textContent = currentItem.name + " - $" + currentItem.value.toFixed(2);
        lootList.appendChild(listItem);
    }
}

// Updates the running Total Loot display from the array total
function updateTotalDisplay() {
    const total = calculateTotalLoot();
    totalValueDisplay.textContent = total.toFixed(2);
}

// Validates party size and loot list, then splits total loot evenly per party member
function splitLoot() {
    splitMessage.textContent = "";
    splitMessage.className = "status-message";
    partyMessage.textContent = "";

    const rawPartySize = partySizeInput.value.trim();
    const partySize = Number(rawPartySize);

    // Party size must be a whole number of 1 or greater
    if (rawPartySize === "" || Number.isNaN(partySize) || !Number.isInteger(partySize) || partySize < 1) {
        splitMessage.textContent = "Error: Enter a whole number of 1 or more party members before splitting.";
        return;
    }

    // Must have loot items to split
    if (lootInventory.length === 0) {
        splitTotalDisplay.textContent = "0.00";
        perMemberDisplay.textContent = "0.00";
        splitMessage.textContent = "Error: Add at least one loot item before splitting.";
        return;
    }

    const total = calculateTotalLoot();
    const perMember = total / partySize;

    totalValueDisplay.textContent = total.toFixed(2);
    splitTotalDisplay.textContent = total.toFixed(2);
    perMemberDisplay.textContent = perMember.toFixed(2);

    splitMessage.textContent = "Split $" + total.toFixed(2) + " among " + partySize + " party member(s).";
    splitMessage.className = "status-message success";
}