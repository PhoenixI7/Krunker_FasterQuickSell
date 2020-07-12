// ==UserScript==
// @name         Krunker Market Quick Sell
// @namespace    http://tampermonkey.net/
// @version      v2.2.0
// @description  Script for faster quick selling!
// @author       Phoenixi7
// @iconURL      https://phoenixpwn.com/phoenix.png
// @match        https://krunker.io/social.html?p=market
// @grant        none
// ==/UserScript==

(function() {
    'use strict';


    /* <--------------------- Excluded Items ---------------------> */
        // **Always Include "excluded'**, Possible Rarities, ['excluded', 'contraband', 'relic', 'legendary', 'epic', 'rare', "uncommon"]
        let excludedRarity = ['excluded', 'contraband', 'relic'];
        // Copy Exactly, Ex. ['Sugarbear', 'Suede Blade']
        let excludedNames = [];
    /* <--------------------- Excluded Items ---------------------> */

    /* <--------- Always Exclude ---------> */
    const twitchItems = ['TTV', 'tRaDes?', 'Partner Push', 'Zed', 'Kaarson', 'TTV-Cap', 'Twitched', 'TTV Vest', 'TTV Tron', 'Krunk TTV', 'Streamer', 'Stream Suit', 'TTV Cape', "Mic'd Up", 'Cheerful', 'Twitcher', 'Just Vibing', 'USS TTV', 'Bits'];
    const blackMarket = ['1 Year Cape', '2 Year Cape', 'Puppet Master', 'Nuke Tamer', 'Antidote XVI', 'USS Krunk'];
    /* <--------- Always Exclude ---------> */

    const excludedNamesA1 = [];
    const excludedNamesA1ItemColors = [];

    document.addEventListener('keydown', (event) => {
        if (event.key == "@") {
            let itemsString = document.getElementById('invTrack').innerHTML.split('<')[0];
            let itemsInt = parseInt(itemsString);
            let items = itemsInt + 50;

            //Edit Buttons
            document.getElementById('invTrack').style.display = "none"
            document.getElementById('m_stats').remove();
            document.getElementById('m_sales').remove();
            document.getElementById('invSortB').remove();
            document.getElementById('invValue').remove();
            document.getElementById('m_market').innerHTML = "Quick Sell";
            document.getElementById('m_market').onclick = function() { quickSell(items); };
            document.getElementById('m_inventory').innerHTML = "Krunker Faster Quick Sell";
            document.getElementById('m_inventory').onclick = function() { console.log('null') };
            document.getElementById('m_trades').innerHTML = "Quick Sell All";
            document.getElementById('m_trades').onclick = function() { quickSellAll(items); };

            //Create Selection
            for (let i = 0; i < 1000; i++) {
                if (document.getElementById('itemCardinventory_' + i)) {
                    let excludedVal = isExcluded(getItemInfo(i));
                    if (excludedVal == true) {
                        exclude_ui(i, "Excluded", "In", "Code");
                    } else if (excludedVal == 'cannot be sold') {
                        exclude_ui(i, "Can't", "Be", "Sold");
                    } else {
                        document.getElementById('itemCardinventory_' + i).querySelector('.cardActions').getElementsByClassName('cardAction')[2].innerHTML = "Exclude"
                        document.getElementById('itemCardinventory_' + i).querySelector('.cardActions').getElementsByClassName('cardAction')[2].onclick = function() { addToArray(i) };
                    }
                }
            }
        }
    });

    function exclude_ui(i, a, b, c) {
        document.getElementById('itemCardinventory_' + i).querySelector('.cardActions').getElementsByClassName('cardAction')[0].innerHTML = a;
        document.getElementById('itemCardinventory_' + i).querySelector('.cardActions').getElementsByClassName('cardAction')[1].innerHTML = b;
        document.getElementById('itemCardinventory_' + i).querySelector('.cardActions').getElementsByClassName('cardAction')[2].innerHTML = c;
        document.getElementById('itemCardinventory_' + i).querySelector('.cardActions').getElementsByClassName('cardAction')[0].onclick = function() { console.log('Excluded') };
        document.getElementById('itemCardinventory_' + i).querySelector('.cardActions').getElementsByClassName('cardAction')[1].onclick = function() { console.log('Excluded') };
        document.getElementById('itemCardinventory_' + i).querySelector('.cardActions').getElementsByClassName('cardAction')[2].onclick = function() { console.log('Excluded') };
        document.getElementById('itemCardinventory_' + i).style.color = 'green';
        document.getElementById('itemCardinventory_' + i).style.border = "5px solid green";
    }

    function addToArray(id) {
        let itemName = document.getElementById('itemCardinventory_' + id).innerHTML.split('<')[0];
        excludedNamesA1.push(itemName);
        excludedNamesA1ItemColors.push(document.getElementById('itemCardinventory_' + id).style.color);
        console.log(excludedNamesA1);
        console.log(excludedNamesA1ItemColors);
        console.log('sucsess' + id);
        document.getElementById('itemCardinventory_' + id).style.color = 'green';
        document.getElementById('itemCardinventory_' + id).style.border = "5px solid green";
        document.getElementById('itemCardinventory_' + id).querySelector('.cardActions').getElementsByClassName('cardAction')[2].innerHTML = "Include"
        setUncheck(id);
    }

    function removeFromArray(id) {
        let itemName = document.getElementById('itemCardinventory_' + id).innerHTML.split('<')[0];
        const index = excludedNamesA1.indexOf(itemName);
        document.getElementById('itemCardinventory_' + id).style.color = excludedNamesA1ItemColors[index];
        document.getElementById('itemCardinventory_' + id).style.border = "5px solid " + excludedNamesA1ItemColors[index];
        document.getElementById('itemCardinventory_' + id).querySelector('.cardActions').getElementsByClassName('cardAction')[2].innerHTML = "Exclude"
        if (index > -1) {
            excludedNamesA1.splice(index, 1);
            excludedNamesA1ItemColors.splice(index, 1);
        }
        setCheck(id);
    }

    function setCheck(id) {
        document.getElementById('itemCardinventory_' + id).querySelector('.cardActions').getElementsByClassName('cardAction')[2].onclick = function() { addToArray(id) };
    }

    function setUncheck(id) {
        document.getElementById('itemCardinventory_' + id).querySelector('.cardActions').getElementsByClassName('cardAction')[2].onclick = function() { removeFromArray(id) };
    }

    function timer(ms) {
        return new Promise(res => setTimeout(res, ms));
    }

    function isExcluded(array) {
        if (twitchItems.includes(array[0]) || blackMarket.includes(array[0])) {
            return 'cannot be sold'
        } else if (excludedRarity.includes(array[1]) || excludedNames.includes(array[0]) || excludedNamesA1.includes(array[0])) {
            return true;
        } else { return false; }
    }

    function getItemInfo(itemNumber) {
        let itemName = document.getElementById('itemCardinventory_' + itemNumber).innerHTML.split('<')[0];
        const rarity = howRare(itemNumber);
        const info = [itemName, rarity[0], rarity[1], rarity[2]]; // Ex. ["Sugarbear", "relic", "rgb(237, 66, 66)", 6]
        return info;
    }

    function howRare(itemNumber) {
        let colors = ["rgb(41, 41, 41)", "rgb(237, 66, 66)", "rgb(251, 192, 45)", "rgb(224, 64, 251)", "rgb(33, 150, 243)", "rgb(178, 242, 82)", "green"];
        let rarities = ['contraband', 'relic', 'legendary', 'epic', 'rare', "uncommon", "excluded"];
        for (let i = 0; i < rarities.length; i++) {
            let itemColor = document.getElementById('itemCardinventory_' + itemNumber).style.color;
            const rarityInfo = [rarities[i], itemColor, itemNumber]; // Ex. ["relic", "rgb(237, 66, 66)", 6]
            if (itemColor == colors[i]) { return rarityInfo; }
        }
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
                if (isExcluded(getItemInfo(i)) == false && itemsSold >= 1) {
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
        } alert("DONE! Reloading Page");
        await timer(20);
        location.reload();
    }

    async function quickSell(items) {
        var itemsSold = 0;
        for (let i = 0; i <= items; i++) {
            if (document.getElementById('itemCardinventory_' + i)) {
                const itemInfo = getItemInfo(i);
                if (isExcluded(itemInfo) == false) {
                    document.getElementById('itemCardinventory_' + i).style.color = 'crimson';
                    document.getElementById('itemCardinventory_' + i).style.border = "5px solid crimson";
                    await timer(20);
                    let confirmSell = confirm("Sell " + itemInfo[0] + ", it is " + itemInfo[1]);
                    if (confirmSell && itemsSold >= 1) {
                        await sellItem(i, 20);
                        while (true) {
                            if (document.getElementById('popupContent').querySelector('div').querySelector('div').className != "lds-ring") {
                                timer(10);
                                break;
                            } else { await timer(20); }
                        }
                    } else if (confirmSell && itemsSold == 0) {
                        itemsSold++
                        await sellItem(i, 250);
                    } else {
                        document.getElementById('itemCardinventory_' + i).style.color = 'green';
                        document.getElementById('itemCardinventory_' + i).style.border = "5px solid green";
                    }
                }
            }
        } alert("DONE! Reloading Page");
        await timer(20);
        location.reload();
    }
})();
