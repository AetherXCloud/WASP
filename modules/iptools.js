const inquirer = require('inquirer')
const geoip = require('geoip-lite')
const Shodan = require("./shodan.js")

let ShodanClient = new Shodan();

class IPTools {

    menu() {
        let iptools = this;
        return new Promise(function(resolve, reject) {
            inquirer.prompt([{
                type: 'list',
                name: 'action',
                message: 'What do you want to do?',
                choices: ['Shodan Ports And Services', 'Geolocation']
            }]).then(answers => {
                switch (answers.action) {
                    case 'Shodan Ports And Services':
                        inquirer.prompt({type: 'input',name: 'ip', message: 'What is the IP Address you need to check?'}).then(ipAddress => {
                            ShodanClient.scanIP(ipAddress.ip).then(function(){
                                resolve();
                            }).catch(function(err) {
                                console.log(err.red)
                                resolve()
                            }) 
                        });
                        break
                    case 'Geolocation':
                            inquirer.prompt({type: 'input',name: 'ip', message: 'What is the IP Address you need to check?'}).then(ipAddress => {
                                iptools.geoipLookup(ipAddress.ip).then(function(){
                                    resolve()
                                }).catch(function(err) {
                                    console.log(err.red)
                                    resolve()
                                }) 
                            });
                            break
                    default:
                        break
                }
            })
        })
    }

    geoipLookup(ip) {
        return new Promise(function(resolve, reject) {
            if(ip) {
                var geo = geoip.lookup(ip)
                console.log('GEOLOCATION INFORMATION')
                if(geo.country) console.log(`Country: ${geo.country}`)
                if(geo.region) console.log(`Region: ${geo.region}`)
                if(geo.city) console.log(`City: ${geo.city}`)
                if(geo.timezone) console.log(`Timezone: ${geo.timezone}`)
                resolve()
            } else {
                reject("Please enter a valid IP Address")
            }
        })
    }
}

module.exports = IPTools
