const request = require("request")
const cheerio = require('cheerio')

class Shodan {
    scanIP(url) {
        return new Promise(function(resolve, reject) {
            request('https://www.shodan.io/host/' + url, (error, response, html) => {
                if(!error && response.statusCode == 200) {
                    const $ = cheerio.load(html)

                    const ports = $('.ports')
                    const table = $('.table')
                    const httpcomponents = $('.http-components')

                    //spit out chosen contents of webpage in text format
                    const tableText = table.find('tr')
                    console.log( '-----BASIC INFO-----\n'+tableText.text().replace('Source: GreyNoise','').trim()+'\n') 
                    
                    const portText = ports.find('li')
                    console.log('-----PORTS-----\n'+portText.text())

                    const httpcomponentsText = httpcomponents.find('li')
                    console.log('-----WEB TECHNOLOGIES-----\n'+ httpcomponentsText.text())
                    resolve();
                } else {
                    reject({error: error, status: response.statusCode})
                }

            })
        })
    }
}

module.exports = Shodan
