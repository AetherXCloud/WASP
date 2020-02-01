module.exports = {
    "General": {
        "textEditor": "code", // set to VS Code by Default (use whatever the CMD is for your normal text editor)
        "openScrapedFiles": true
    },
    "VirusTotal": {
        "apiKey": "",
        "rescanParameters": { //sets age threshold for whether sophos should scan the url again
            "amount": 30,
            "units": "minutes" // years, quarters, months, weeks, days, hours, minutes
        }
    }
}