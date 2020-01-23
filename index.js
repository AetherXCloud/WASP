const whois = require("whois");
const inquirer = require('inquirer');
const request = require("request")
const cheerio = require('cheerio')
const nslookup = require('nslookup')
const geoip = require('geoip-lite');

const VirusTotal = require("./modules/virusTotal.js")
const Shodan = require("./modules/shodan.js")


const config = require("./config.js")


let VirusTotalClient = new VirusTotal(config.VirusTotal.apiKey, config.VirusTotal.rescanParameters);
let ShodanClient = new Shodan();


function mainLoop(){
    console.log("")
    console.log("██╗    ██╗ █████╗ ███████╗██████╗ ");
    console.log("██║    ██║██╔══██╗██╔════╝██╔══██╗");
    console.log("██║ █╗ ██║███████║███████╗██████╔╝");
    console.log("██║███╗██║██╔══██║╚════██║██╔═══╝ ");
    console.log("╚███╔███╔╝██║  ██║███████║██║     ");
    console.log(" ╚══╝╚══╝ ╚═╝  ╚═╝╚══════╝╚═╝     ");
    console.log("")
    //ascii stuff ^^^^
   
     inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'What do you want to do?',
        choices: ['Scan with Virus Total', 'Get Whois Info', 'nslookup', 'Shodan Ports And Services', 'Geolocation', 'Hyperlink Extractor']
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
            case 'Geolocation':
                    inquirer.prompt({type: 'input',name: 'ip', message: 'What is the IP Address you need to check?'}).then(ipAddress => {
                        var geo = geoip.lookup(ipAddress.ip)
                        //regex to simulate clear console
                        process.stdout.write('\033c')
                        console.log('')
                        console.log('GEOLOCATION INFORMATION')
                        console.log(geo);
                        mainLoop();
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
                case 'Hyperlink Extractor':
                    inquirer.prompt({type: 'input',name: 'url', message: 'What webpage are you trying to extract from? Please include http:// or https://\n'}).then(url => {
                        request(url.url, function(err, resp, body){
                            $ = cheerio.load(body);
                            links = $('a'); //jquery get all hyperlinks
                            $(links).each(function(i, link){
                                console.log($(link).text() + ':\n  ' + $(link).attr('href'));
                            });
                        });
                            
                    });
                break;
                default:
                break;
        }
    });
    
}

mainLoop()

