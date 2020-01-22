module.exports = {
    "VirusTotal": {
        "apiKey": "",
        "rescanParameters": { //sets age threshold for whether sophos should scan the url again
            "amount": 30,
            "units": "minutes" // years, quarters, months, weeks, days, hours, minutes
        }
    }
}