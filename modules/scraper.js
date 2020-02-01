const inquirer = require('inquirer')
const request = require("request")
const cheerio = require('cheerio')
const parse = require('url-parse')
const prettifyHtml = require('prettify-html')
const exec = require('child_process').exec;
const fs = require('fs')
const path = require('path')



class Scraper {

    constructor(openScrapedFiles=true, textEditor="") {
        if(openScrapedFiles && textEditor != ""){
            this.openScrapedFiles = true
            this.textEditor = textEditor
        } else {
            this.openScrapedFiles = false
        }
    }

    menu() {
        let scraper = this;
        return new Promise(function(resolve, reject) {
            inquirer.prompt([{
                type: 'list',
                name: 'action',
                message: 'What do you want to do?',
                choices: ['Page Downloader', 'Hyperlink Extractor']
            }]).then(answers => {
                switch (answers.action) {
                    case 'Page Downloader':
                        inquirer.prompt({type: 'input',name: 'url', message: 'What webpage are you trying to download? Please include http:// or https://\n'}).then(url => {
                            scraper.pageDownload(url.url).then(function(){
                                resolve();
                            })
                        })
                        break;
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

    pageDownload(url) {
        let scraper = this;
        return new Promise(function(resolve, reject) {
            let parsedURL = parse(url)
            if(parsedURL.hostname){
                request(url, function(err, resp, body){
                    if(!err) {
                        let date = new Date()
                        let timestamp = `${date.getHours()}-${date.getMinutes()} ${date.getDate()}${date.getMonth()}${date.getFullYear()}`
                        let dir = `${process.cwd()}/output/${parsedURL.hostname}`
                        let filePath = `${dir}/${timestamp}.html`
                        if (!fs.existsSync(dir)){
                            fs.mkdirSync(dir);
                        }
                        fs.writeFile(filePath, `<!-- URL: ${parsedURL.href} -->\n<!-- Scraped by WASP at ${timestamp} -->\n${prettifyHtml(body)}`, function(err) {
                            if(err) {
                                return console.log(err);
                            }
                            console.log(`The file was saved: ${path.normalize(filePath)}`);
                            if(scraper.openScrapedFiles){
                                exec(`${scraper.textEditor} \"${filePath}\"`)
                            }
                            resolve();
                        }); 
                    }
                });
            } else {
                reject("invalid url")
            }
        });
    }

    hyperlinkExtractor(url) {
        return new Promise(function(resolve, reject) {
            request(url, function(err, resp, body){
                let $ = cheerio.load(body);
                let links = $('a');

                $(links).each(function(i, link){
                    console.log($(link).text() + ': ' + $(link).attr('href'));
                });
                resolve();
            });
        });
    }
}

module.exports = Scraper
