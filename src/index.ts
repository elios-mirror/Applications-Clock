import Sdk from 'elios-sdk';
import * as moment from 'moment-timezone'
import * as cheerio from 'cheerio'

var html = require('./index.html')

const $ = cheerio.load(html);

export default class Clock {
    sdk: Sdk

    it: any;
    timezone: string;

    constructor() {
        this.sdk = new Sdk();
        // TODO Fix the wrong timezone from the browser.
        // this.timezone = moment.tz.guess(true);
        this.timezone = 'Europe/Paris';
        console.log('Construtor');
    }

    // fillTimeZones() {
    //     let timezones = moment.tz.names()

    //     timezones.forEach(element => {
    //         let displayName = element.split('/')
    //         let tmp = $('<option value="' + element + '">' +
    //         displayName[0] + ", " + displayName[1] + '</option>')

    //         if (element == this.timezone) {
    //             $(tmp).attr("selected", 'true')
    //         }
    //         $('.timeZonesSelect').append(tmp);
    //     });
    // }

    // changeTimeZone() {
    //     this.timezone = $('.timeZonesSelect option[selected]').val()
    // }

    start() {
        const clockWidget = this.sdk.createWidget();
        
        // this.fillTimeZones()

        setInterval(() => {

            $('.clock').text(moment().tz(this.timezone).format('HH:mm:ss'))
            $('.date').text(moment().format('ddd Do MMM YYYY'))
            clockWidget.html($.html());

        }, 1000);

    }
}

new Clock().start();