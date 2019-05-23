import Sdk from 'elios-sdk';
import * as moment from 'moment-timezone'
import * as cheerio from 'cheerio'

var html = require('./index.html')

const $ = cheerio.load(html);

export default class Clock {
    name: string = '';
    installId: string = '';

    requireVersion: string = '0.0.1';
    showOnStart: boolean = true;

    widget: any;
    it: any;
    timezone: string;

    elios: Sdk;

    constructor() {
        this.elios = new Sdk();
        this.timezone = moment.tz.guess();
        console.log('Construtor');
    }

    init() {
        console.log('MODULE DEV LOADED ' + this.name);
    }

    fillTimeZones() {
        let timezones = moment.tz.names()

        timezones.forEach(element => {
            let displayName = element.split('/')
            let tmp = $('<option value="' + element + '">' +
                displayName[0] + ", " + displayName[1] + '</option>')

            if (element == this.timezone) {
                $(tmp).attr("selected", true)
            }
            $('.timeZonesSelect').append(tmp);
        });
    }

    changeTimeZone() {
        this.timezone = $('.timeZonesSelect option[selected]').val()
    }

    start() {
        console.log('MODULE STARTED ' + this.name);
        this.widget = this.elios.createWidget();

        this.fillTimeZones()
        this.changeTimeZone()

        this.it = setInterval(() => {

            $('.clock').text(moment().tz(this.timezone).format('HH:mm:ss'))
            this.widget.html($.html());

        }, 1000);

    }

    stop() {
        clearInterval(this.it);
        console.log('MODULE STOPED ' + this.name);
    }
}
