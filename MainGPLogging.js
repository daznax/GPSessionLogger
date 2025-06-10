/**
 * Main.js
 * This file is part of the GPSessionLogger project.
 * @file /d:/Directory/Development/GPSessionLogger/MainGPLogging.js
 * MDG 3/25 - Created
*/


//Variables for the GP Tracking Session
const sessionInfo = {
    sessionId: null, // set by startSession()
    handsPlayed: 0, // updated by incrementHandsAndVPIP()
    volPutInPot: 0, // updated by incrementHandsAndVPIP()
    preFlopRaise: 0, // updated by btnClick()
    threeBet: 0, // updated by btnClick()
    didNotThreeBet: 0, // updated by btnClick()
    callThreeBet: 0, // updated by btnClick()
    foldToThreeBet: 0, // updated by btnClick()
    fourBet: 0, // updated by btnClick()
    fiveBet: 0, // updated by btnClick()
    defBlinds: 0, // updated by btnClick()
    foldBlinds: 0, // NOT IN USE YET
    cBet: 0, // updated by btnClick()
    wentToSD: 0, // updated by btnClick()
};

// update Live Stats every 3 minutes
setInterval(updateLiveStats, 180000);

/**
 * Begins the GP Tracking Session
*/
function startSession() {
    const d = new Date()
    // Set the sessionId to a unique value based on the current date and time
    sessionInfo.sessionId = "mdg" + d.getMonth() + d.getDate() + d.getFullYear() + d.getHours() + d.getMinutes()
    alert("Starting session with session id: " + sessionInfo.sessionId);
}

/**
 * Checks to determine if the session has already started via the session array
 * Returns: True if the session has already started, false otherwise.
 */
function isSessionActive() {
    if (sessionInfo.sessionId == null) {
        return false;
    } else {
        return true;
    }
}

function endSession(exitType) {
    if (exitType == "0") {
        //make sure the user wants to end the session
        let result = confirm("Are you sure you want to end the session? This will clear all data.");
        if (result) {
            sessionInfo.sessionId = null;
            sessionInfo.handsPlayed = 0;
            sessionInfo.volPutInPot = 0;
            sessionInfo.preFlopRaise = 0;
            sessionInfo.threeBet = 0;
            sessionInfo.didNotThreeBet = 0;
            sessionInfo.callThreeBet = 0;
            sessionInfo.foldToThreeBet = 0;
            sessionInfo.fourBet = 0;
            sessionInfo.fiveBet = 0;
            sessionInfo.defBlinds = 0;
            sessionInfo.cBet = 0;
            sessionInfo.wentToSD = 0;
        }
    } else if (exitType == "1") {
        //if user wants to save, display data
        alert("Session ended. Data will be displayed for saving!");
        displayInfo("all");
    }
}

/** 
 * Main function that handles button clicks. Calls out to sub-functions for specific actions
 * Parameters:
 * - btnId: The button that was clicked
 * - btnGroup: The group that the button belongs to (e.g. "incrHand")
*/
function btnClick(btnId, btnGroup) {
    //increment hands/VPIP first
    if (btnGroup == "incrHand") {
        incrementHandsAndVPIP(btnId);
    }

    //increment the appropriate action
    // can't use || here..so need to change this
    switch (btnId) {
        case "RFI":
        case "RVL":
            sessionInfo.preFlopRaise++;
            break;
        case "3B":
        case "3BS":
            sessionInfo.preFlopRaise++;
            sessionInfo.threeBet++;
            break;
        case "C3B":
            sessionInfo.callThreeBet++;
            break;
        case "F3B":
            sessionInfo.foldToThreeBet++;
            break;
        case "DBB":
        case "DSB":
            sessionInfo.defBlinds++;
            break;
        case "foldBlind": //NOT IN USE YET
            sessionInfo.foldBlinds++;
            break;
        case "F2RFI":
            sessionInfo.didNotThreeBet++;
            break;
        case "Cold4B":
            sessionInfo.fourBet++;
            sessionInfo.preFlopRaise++;
            break;
        case "Warm4B":
            sessionInfo.fourBet++;
            break;
        case "Cold5B":
            sessionInfo.fiveBet++;
            sessionInfo.preFlopRaise++;
            break;
        case "Warm5B":
            sessionInfo.fiveBet++;
            break;
        case "CBET":
            sessionInfo.cBet++;
            break
        case "WTSD":
            sessionInfo.wentToSD++;
            break;
    }
    return console.log(sessionInfo.threeBet);
}

/**
 * Displays the session information either in the live stats or in delimited list format
 * Parameters:
 * - info: The session information to display
*/
function displayInfo(info) {
    if (info == null) return console.log("Invalid info error");

    let stats = calculateStats(info);
    let delimiter = ",";
    let d = new Date();
    let day = d.getDate();
    let month = d.getMonth() + 1; // Months are zero-based in JavaScript
    let year = d.getFullYear();
    let date = month + "/" + day + "/" + year;
    
    let output = date + delimiter;
    for (let x = 0; x < stats.length; x++) {
        output += stats[x]+delimiter;
    }
    
    if (info == "all") return alert(output);
}

/**
 * Calculates the session statistics based on the sessionInfo object
 * Parameters:
 * - info: The session information to calculate
 * Returns an array of statistics
*/
function calculateStats(info) {
    if (info == null) return console.log("Invalid info error");

    // Always pull the liveStats first and then return if that's all we needed
    let hands = sessionInfo.handsPlayed;
    let vpip = ((sessionInfo.volPutInPot / hands) * 100).toFixed(2);
    let pfr = ((sessionInfo.preFlopRaise / hands) * 100).toFixed(2);
    let threeBet = ((sessionInfo.threeBet / (sessionInfo.threeBet + sessionInfo.didNotThreeBet)) * 100).toFixed(2);
    if (info == "liveStats") return [hands, vpip, pfr, threeBet];

    // If we make it here, we calculate the rest of the stats
    let fourBet = ((sessionInfo.fourBet / hands) * 100).toFixed(2);
    let fiveBet = ((sessionInfo.fiveBet / hands) * 100).toFixed(2);
    let blinds = sessionInfo.defBlinds;
    let cbet = (((sessionInfo.cBet / (sessionInfo.preFlopRaise + sessionInfo.threeBet)) * 100)).toFixed(2);
    let wtsd = ((sessionInfo.wentToSD / hands) * 100).toFixed(2);
    return [hands, vpip, pfr, threeBet, fourBet, fiveBet, blinds, cbet, wtsd];
}

function updateLiveStats() {
    //let liveStats = ["hands", "vpip", "pfr", "threeBet"];
    let stats = calculateStats("liveStats");

    let [hands, vpip, pfr, threeBet] = stats;
    
    document.getElementById("hands").innerHTML = "Hands: "+hands;
    document.getElementById("VPIP").innerHTML = "VPIP: "+vpip+"%";
    document.getElementById("PFR").innerHTML = "PFR: "+pfr+"%";
    document.getElementById("threeBet").innerHTML = "3bet: "+threeBet+"%";
}

/**
 * Increments Hands/VPIP counts
 * Parameters:
 * - id: The button that was clicked
*/
function incrementHandsAndVPIP(id) {
    sessionInfo.handsPlayed++;
    switch (id) {
        case "openFold":
            break;
        case "F2RFI":
            break;
        case "walk":
            break;
        default:
            sessionInfo.volPutInPot++;
    }
    //console.log("Hands Played: " + sessionInfo.handsPlayed);
    //console.log("Vol Put In Pot: " + sessionInfo.volPutInPot);
}