# WASP
Web Analysis &amp; Scanning Program is a node.js based command line tool for analysing and scanning websites and URL's.
It was mainly built for personal use (investigating suspected phishing/virus urls). The tool is work in progress and currently isn't the most reliable.
Note - some of these tools will directly request data from the domains, URLs or IP Addresses you enter

## Features
### General
- Scan URL with VirusTotal (Requires API key to be entered in config.js)
- WHOIS lookup
- nslookup
### IP Tools
- Search IP with Shodan
- IP Geolocation
### Scraping
- Scrape Links from page
- Download Page(as HTML file)

![WASPScreenshot](https://i.imgur.com/rSKWUBQ.png)

## Installation and Configuration
1. Install Node.JS (if not already installed)
2. Clone the repository
3. In the main directory run "npm i" to install the dependencies
4. Open config.js in your favourite text editor and make any changes required to the settings
5. To run the program open the directory and run the following command "npm run wasp"

## VirusTotal
The VirusTotal option will not work without an API key. 
You can get a free API key on the VirusTotal website by creating an account.
