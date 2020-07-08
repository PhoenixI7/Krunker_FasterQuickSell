// ==UserScript==
// @name         Krunker Market Quick Sell
// @namespace    http://tampermonkey.net/
// @version      v1.1.2
// @description  Script for faster quick selling!
// @author       Phoenixi7
// @iconURL      https://phoenixpwn.com/phoenix.png
// @match        https://krunker.io/social.html?p=market
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /* <--------------------- Excluded Items ---------------------> */
    let excludedRarity = ['contraband', 'relic', 'legendary']; /* Possible Rarities, ['contraband', 'relic', 'legendary', 'epic', 'rare', "uncommon"] */
    let excludedNames = []; /* Capitalize First Letter, Ex. ['Sugarbear', 'Suede Blade'] */

    document.addEventListener('keydown', (event) => {
        if (event.key == "@") {
            let itemsString = document.getElementById('invTrack').innerHTML.split('<')[0];
            let itemsInt = parseInt(itemsString);
            promptOptions(itemsInt + 10); //add 10 bc sometimes krunker item numbers are more than invTrack
        }
    });

    function promptOptions(items) {
        let input = prompt('To sell all type "ALL"...\nTo go one item at a time type "ONE"...\nTo exit type "EXIT"...');
        if (input == "ALL") {
            const check = confirm('Are you sure you want to quick sell everything?');
            if (check) {
                quickSellAll(items);
            } else { promptOptions(items); }
        } else if (input == "ONE") {
            quickSell(items);
        } else if (input == "EXIT") {
            alert("!Script Aborted!");
        } else { promptOptions(items); }
    }

    function timer(ms) {
        return new Promise(res => setTimeout(res, ms));
    }

    function excluded(array) {
        if (excludedRarity.includes(array[1]) || excludedNames.includes(array[0])) {
            return true;
        } else { return false; }
    }

    async function sellItem(itemNumber, ms) {
        document.getElementById('itemCardinventory_' + itemNumber).querySelector('.cardActions').getElementsByClassName('cardAction')[1].click();
        document.getElementById('confirmBtn').click();
        await timer(ms);
    }

    async function quickSellAll(items) {
        var itemsSold = 0;
        for (let i = items; i >= 0; i--) {
            if (document.getElementById('itemCardinventory_' + i)) {
                const itemInfo = getItemInfo(i);
                if (!excluded(itemInfo)) {
                    if (itemsSold >= 1) {
                        await sellItem(i, 20);
                        while (true) {
                            if (document.getElementById('popupContent').querySelector('div').querySelector('div').className != "lds-ring") {
                                timer(20);
                                break;
                            } else { await timer(20); }
                        }
                    } else if (itemsSold == 0) {
                        itemsSold++
                        await sellItem(i, 250);
                    }
                }
            }
        } alert("DONE!");
    }

    async function quickSell(items) {
        var itemsSold = 0;
        for (let i = 0; i <= items; i++) {
            if (document.getElementById('itemCardinventory_' + i)) {
                const itemInfo = getItemInfo(i);
                if (!excluded(itemInfo)) {
                    let confirmSell = confirm("Sell " + itemInfo[0] + ", it is " + itemInfo[1]);
                    if (confirmSell && itemsSold >= 1) {
                        await sellItem(i, 20);
                        while (true) {
                            if (document.getElementById('popupContent').querySelector('div').querySelector('div').className != "lds-ring") {
                                timer(20);
                                break;
                            } else { await timer(20); }
                        }
                    } else if (confirmSell && itemsSold == 0) {
                        itemsSold++
                        await sellItem(i, 250);
                    }
                }
            }
        } alert("DONE!");
    }

    function getItemInfo(itemNumber) {
        let itemName = document.getElementById('itemCardinventory_' + itemNumber).innerHTML.split('<')[0];
        const rarity = howRare(itemNumber);
        const info = [itemName, rarity[0], rarity[1], rarity[2]]; // Ex. ["Sugarbear", "relic", "rgb(237, 66, 66)", 6]
        return info;
    }

    function howRare(itemNumber) {
        let colors = ["rgb(41, 41, 41)", "rgb(237, 66, 66)", "rgb(251, 192, 45)", "rgb(224, 64, 251)", "rgb(33, 150, 243)", "rgb(178, 242, 82)"];
        let rarities = ['contraband', 'relic', 'legendary', 'epic', 'rare', "uncommon"];
        for (let i = 0; i < rarities.length; i++) {
            let itemColor = document.getElementById('itemCardinventory_' + itemNumber).style.color;
            const rarityInfo = [rarities[i], itemColor, itemNumber]; // Ex. ["relic", "rgb(237, 66, 66)", 6]
            if (itemColor == colors[i]) { return rarityInfo; }
        }
    }
})();
