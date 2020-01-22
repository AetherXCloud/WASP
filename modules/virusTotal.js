const request = require("request");
const moment = require('moment-timezone');
const colors = require('colors');

moment.tz.setDefault("Australia/Brisbane");

class VirusTotal {

    constructor(apiKey, rescanParameters) {
        this.apiKey = apiKey
        this.rescanParameters = rescanParameters
    }

    getReport(resource) {
        let vt = this
        return new Promise(function(resolve, reject) {
            request(`https://www.virustotal.com/vtapi/v2/url/report?apikey=${vt.apiKey}&resource=${resource}&allinfo=1&scan=1`, { json: true }, (err, res, body) => {
                if (err) { reject(err) }
                console.log(body.verbose_msg.green)
                resolve(body)
            });
        });
    }

    scanURL(url) {
        let vt = this
        return new Promise(function(resolve, reject) {
            request.post({url:'https://www.virustotal.com/vtapi/v2/url/scan', form: {apikey: vt.apiKey, url: url}, json: true}, function(err,httpResponse,body){
                if (err) { reject(err) }
                resolve(body);
            });
        });
    }

    getRecentOrScan(url) {
        let vt = this
        return new Promise(function(resolve, reject) {
            vt.getReport(url).then(function(data){
                let scanDT = moment.utc(data.scan_date).toDate()
                let tzScanDT = moment(scanDT).format('YYYY-MM-DD h:mm:ss a')
                let oneDayOffset = moment(scanDT).add(vt.rescanParameters.amount, vt.rescanParameters.units).valueOf()
                let now = moment().valueOf()
                let isOutOfDate = oneDayOffset < now
                
                if (isOutOfDate) {
                    console.log(`rescanning (older than ${vt.rescanParameters.amount} ${vt.rescanParameters.units}): ${tzScanDT}`.yellow)
                    vt.scanURL(url).then(function(data){
                        if(data.scan_id) {
                            console.log("scan run succesfully will pull report shortly".green)
                            setTimeout(()=> {
                                vt.getReport(data.scan_id).then(function(data){
                                    resolve(data);
                                }).catch(function(err){
                                    reject({msg: "error running final report", error: err})
                                });
                            }, 5000)
                        } else {
                            reject({msg: "no scan ID present"})
                        }
                    }).catch(function(err){
                        reject({msg: "error running scan", error: err})
                    })
                }
                
            }).catch(function(err){
                reject({msg: "error getting initial report", error: err})
            })
        });        
    }

    virusTotalScan(url) {
        let vt = this;
        return new Promise(function(resolve, reject) {
            vt.getRecentOrScan(url).then(function(result){
                console.log(`Positives: ${result.positives} of ${result.total}`)
                Object.keys(result.scans).forEach((key) => {
                    let scan = result.scans[key]
                    if(scan.detected){
                        console.log(`${key}: ${scan.result}`.red)
                    }
                });
                console.log(`Scan URL: `, result.permalink.underline.blue)
                resolve();
            }).catch(function(err){
                reject(err);
            })
        });
    }
}

module.exports = VirusTotal
