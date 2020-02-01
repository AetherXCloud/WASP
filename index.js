const VirusTotal = require("./modules/virusTotal.js")
const IPTools = require("./modules/iptools.js")
const Scraper = require("./modules/scraper.js")
const whois = require("whois")
const inquirer = require('inquirer')
const nslookup = require('nslookup')

const config = require("./config.js")

let VirusTotalClient = new VirusTotal(config.VirusTotal.apiKey, config.VirusTotal.rescanParameters)
let ScraperClient = new Scraper(config.General.openScrapedFiles, config.General.textEditor)
let IPToolsClient = new IPTools()



function mainLoop(){
    console.log("")
    console.log("██╗    ██╗".black, " █████╗ ".yellow, "███████╗".black, "██████╗ ".yellow)
    console.log("██║    ██║".black, "██╔══██╗".yellow, "██╔════╝".black, "██╔══██╗".yellow)
    console.log("██║ █╗ ██║".black, "███████║".yellow, "███████╗".black, "██████╔╝".yellow)
    console.log("██║███╗██║".black, "██╔══██║".yellow, "╚════██║".black, "██╔═══╝ ".yellow)
    console.log("╚███╔███╔╝".black, "██║  ██║".yellow, "███████║".black, "██║     ".yellow)
    console.log(" ╚══╝╚══╝ ".black, "╚═╝  ╚═╝".yellow, "╚══════╝".black, "╚═╝     ".yellow)
    console.log("")
    //ascii stuff ^^^^

   
     inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'What do you want to do?',
        choices: ['Scan with Virus Total', 'Get Whois Info', 'nslookup', 'IP Tools', 'Scraper Menu', 'Exit']
    }]).then(answers => {
        switch (answers.action) {
            case 'Scan with Virus Total':
                inquirer.prompt({type: 'input',name: 'url', message: 'What is the URL you need to check?'}).then(url => {
                    VirusTotalClient.virusTotalScan(url.url).then(function(){
                        mainLoop();
                    }).catch(function(err){
                        console.log(err)
                    })
                })
                break
            case 'Get Whois Info':
                inquirer.prompt({type: 'input',name: 'domain', message: 'What is the domain you need to check?'}).then(domain => {
                    whois.lookup(domain.domain, function(err, data) {
                        console.log(data)
                        mainLoop()
                    })
                });
                break;
            case 'IP Tools':
                IPToolsClient.menu().then(function(){
                    mainLoop()
                })
                break
            case 'nslookup':
                inquirer.prompt({type: 'input',name: 'domain', message: 'What is the domain you need to check?'}).then(domain => {
                    nslookup(domain.domain)
                    .server('8.8.8.8')
                    .timeout(5000)
                    .end(function (err, addrs) {
                        for (let index = 0; index < addrs.length; index++) {
                            const ipAdress = addrs[index]
                            console.log(`A #${index}: ${ipAdress}`)
                        }
                        mainLoop()
                    })
                })
                break
            case 'Scraper Menu':
                ScraperClient.menu().then(function() {
                    mainLoop()
                })
                break

            default:
                break
        }
    });
    
}

mainLoop()

