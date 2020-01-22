const whois = require("whois");
const inquirer = require('inquirer');
const colors = require('colors');
const request = require("request")
const cheerio = require('cheerio')
const nslookup = require('nslookup')


const VirusTotal = require("./modules/virusTotal.js")
const Shodan = require("./modules/shodan.js")


const config = require("./config.js")

let VirusTotalClient = new VirusTotal(config.VirusTotal.apiKey, config.VirusTotal.rescanParameters);
let ShodanClient = new Shodan();

function mainLoop(){
    console.log(" _       _____   _____ ____ ");
    console.log("| |     / /   | / ___// __ \\");
    console.log("| | /| / / /| | \\__ \\/ /_/ /");
    console.log("| |/ |/ / ___ |___/ / ____/ ");
    console.log("|__/|__/_/  |_/____/_/      ");
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'What do you want to do?',
        choices: ['Scan with Virus Total', 'Get Whois Info', 'nslookup', 'Shodan Ports And Services', 'Geolocation Via IP Address']
    }]).then(answers => {
        switch (answers.action) {
            case 'Scan with Virus Total':
                    inquirer.prompt({type: 'input',name: 'url', message: 'What is the URL you need to check?'}).then(url => {
                        VirusTotalClient.virusTotalScan(url.url).then(function(){
                            mainLoop();
                        }).catch(function(err){
                            console.log(err);
                        })
                    });
                break;
            case 'Get Whois Info':
                inquirer.prompt({type: 'input',name: 'domain', message: 'What is the domain you need to check?'}).then(domain => {
                    whois.lookup(domain.domain, function(err, data) {
                        console.log(data)
                        mainLoop()
                    })
                });
                break;
            case 'Shodan Ports And Services':
                    inquirer.prompt({type: 'input',name: 'ip', message: 'What is the IP Address you need to check?'}).then(ipAddress => {
                        ShodanClient.scanIP(ipAddress.ip).then(function(){
                            mainLoop();
                        })
                    });
                    break;
            case 'Geolocation Via IP Address':
                    inquirer.prompt({type: 'input',name: 'ip', message: 'What is the IP Address you need to check?'}).then(ipAddress => {
                        request('https://www.liveipmap.com/?ip=' + ipAddress.ip, (error, response, html) => {
                            if(!error && response.statusCode == 200) {
                               const $ = cheerio.load(html)
                                
                               const table = $('.table')
    
                               const tableText = table.find('td')
                               console.log(tableText.text()) 
                            
                            }
                        })
                    });
                    break;
            case 'nslookup':
                    inquirer.prompt({type: 'input',name: 'domain', message: 'What is the domain you need to check?'}).then(domain => {
                        nslookup(domain.domain)
                        .server('8.8.8.8')
                        .timeout(5000)
                        .end(function (err, addrs) {
                            for (let index = 0; index < addrs.length; index++) {
                                const ipAdress = addrs[index];
                                console.log(`A #${index}: ${ipAdress}`)
                            }
                            mainLoop();
                        });
                    });
                break;
            default:
                break;
        }
    });
    
}

mainLoop()

