const inquirer = require('inquirer')
const request = require("request")
const cheerio = require('cheerio')

class Scraper {

    menu() {
        let scraper = this;
        return new Promise(function(resolve, reject) {
            inquirer.prompt([{
                type: 'list',
                name: 'action',
                message: 'What do you want to do?',
                choices: ['Hyperlink Extractor', 'Test']
            }]).then(answers => {
                switch (answers.action) {
                    case 'Hyperlink Extractor':
                        inquirer.prompt({type: 'input',name: 'url', message: 'What webpage are you trying to extract from? Please include http:// or https://\n'}).then(url => {
                            scraper.hyperlinkExtractor(url.url).then(function(){
                                resolve();
                            })
                        })
                        break;

                    default:
                        break;
                }
            })
        })
    }

    hyperlinkExtractor(url) {
        return new Promise(function(resolve, reject) {
            request(url, function(err, resp, body){
                let $ = cheerio.load(body);
                let links = $('a'); //jquery get all hyperlinks

                $(links).each(function(i, link){
                    console.log($(link).text() + ':\n  ' + $(link).attr('href'));
                });
                resolve();
            });
        });
        
    }
}

module.exports = Scraper
