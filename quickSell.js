// ==UserScript==
// @name         Krunker Market Quick Sell
// @namespace    http://tampermonkey.net/
// @version      v1.1
// @description  Script for faster quick selling!
// @author       Phoenixi7
// @match        https://krunker.io/social.html?p=market
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /* <--------------------- Excluded Items ---------------------> */
    let excludedRarity = ['contraband', 'relic', 'legendary']; /* Possible Rarities, ['contraband', 'relic', 'legendary', 'epic', 'rare', "uncommon"] */
    let excludedNames = ['Fabrica', 'Lumus', 'Sugarbear', 'Suede Blade', 'Phase Blases', 'Urban Soldier']; /* Capitalize First Letter, Ex. ['Sugarbear', 'Suede Blade'] */

    document.addEventListener('keydown', (event) => {
        if (event.key == "1") {
            let itemsString = document.getElementById('invTrack').innerHTML.split('<')[0];
            let itemsInt = parseInt(itemsString);
            promptOptions(itemsInt + 10); //add 10 bc sometimes krunker item numbers are more than invTrack
        }
    });

    function promptOptions(items) {
        let input = prompt('To sell all type "ALL"...\nTo go one at a time type "ONE"...\nTo exit type "EXIT"...');
        if (input == "ALL") {
            const check = confirm('Are you sure you want to quick sell everything?');
            if (check == "YES") {
                quickSellAll(items);
            } else { promptOptions(items); }
        } else if (input == "ONE") {
            quickSell(items);
        } else if (input == "EXIT") {
            alert("!Script Aborted!");
        } else {
            promptOptions(items);
        }
    }

    function timer(ms) {
        return new Promise(res => setTimeout(res, ms));
    }

    function excluded(array) {
        if (excludedRarity.includes(array[1]) || excludedNames.includes(array[0])) {
            return true;
        } else {
            return false;
        }
    }

    async function sellItem(itemNumber) {
        document.getElementById('itemCardinventory_' + itemNumber).querySelector('.cardActions').getElementsByClassName('cardAction')[1].click();
        document.getElementById('confirmBtn').click();
        await timer(200);
    }

    async function quickSellAll(items) {
        for (let i = items; i > 0; i--) {
            if (document.getElementById('itemCardinventory_' + i)) {
                const itemInfo = getItemInfo(i);
                if (!excluded(itemInfo)) { await sellItem(i); }
            }
        } alert("DONE!");
    }

    async function quickSell(items) {
        for (let i = items; i > 0; i--) {
            if (document.getElementById('itemCardinventory_' + i)) {
                const itemInfo = getItemInfo(i);
                if (!excluded(itemInfo)) {
                    let confirmSell = confirm("Sell " + itemInfo[0] + ", it is " + itemInfo[1]);
                    if (confirmSell) { await sellItem(i); }
                }
            }
        } alert("DONE!");
    }

    function getItemInfo(itemNumber) {
        let itemName = document.getElementById('itemCardinventory_' + itemNumber).innerHTML.split('<')[0]
        const rarity = howRare(itemNumber)
        const info = [itemName, rarity[0], rarity[1], rarity[2]]; // Ex. ["Sugarbear", "relic", "rgb(237, 66, 66)", 6]
        return info;
    }

    function howRare(itemNumber) {
        let colors = ["rgb(41, 41, 41)", "rgb(237, 66, 66)", "rgb(251, 192, 45)", "rgb(224, 64, 251)", "rgb(33, 150, 243)", "rgb(178, 242, 82)"];
        let rarities = ['contraband', 'relic', 'legendary', 'epic', 'rare', "uncommon"];
        for (let i = 0; i < rarities.length; i++) {
            let itemColor = document.getElementById('itemCardinventory_' + itemNumber).style.color;
            const rarityInfo = [rarities[i], itemColor, itemNumber]; // Ex. ["relic", "rgb(237, 66, 66)", 6]
            if (itemColor == colors[i]) {
                return rarityInfo;
            }
        }
    }
})();
