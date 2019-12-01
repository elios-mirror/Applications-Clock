import Sdk from 'elios-sdk';
import Widget from 'elios-sdk/lib/widget';
const { JSDOM } = require("jsdom");

var html = require('./index.html')

const dom = (new JSDOM(html));
const { document } = dom.window;

export default class Clock {
    sdk: Sdk

    it: any;
    timezone: string;
    clockWidget: Widget;

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
        this.clockWidget = this.sdk.createWidget();
        var date = new Date;
        var seconds = date.getSeconds();
        var minutes = date.getMinutes();
        var hours = date.getHours();

        this.sdk.config().then((config) => {
            console.log('config is ', config);
        });

        var hands = [
            {
                hand: 'hours',
                angle: (hours * 30) + (minutes / 2)
            },
            {
                hand: 'minutes',
                angle: (minutes * 6)
            },
            {
                hand: 'seconds',
                angle: (seconds * 6)
            }
        ];
        for (var j = 0; j < hands.length; j++) {
            var elements = document.querySelectorAll('.' + hands[j].hand);
            for (var k = 0; k < elements.length; k++) {
                elements[k].style.webkitTransform = 'rotateZ(' + hands[j].angle + 'deg)';
                elements[k].style.transform = 'rotateZ(' + hands[j].angle + 'deg)';
                if (hands[j].hand === 'minutes') {
                    elements[k].parentNode.setAttribute('data-second-angle', hands[j + 1].angle);
                }
            }
        }


        this.render();
        setInterval(() => {
            this.render();
        }, 5000);
    }

    render() {
        this.clockWidget.html(document.body.innerHTML);
    }
}

new Clock().start();