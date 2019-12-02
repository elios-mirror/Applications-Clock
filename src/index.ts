import Sdk from 'elios-sdk';
import Widget from 'elios-sdk/lib/widget';
import moment = require('moment-timezone');
const { JSDOM } = require("jsdom");

var html = require('./index.html')

const dom = (new JSDOM(html));
const { document } = dom.window;

export default class Clock {
    sdk: Sdk

    it: any;
    timezone: string;
    style: any
    clockWidget: Widget;

    constructor() {
        this.sdk = new Sdk();

        this.sdk.config().subscribe((conf: any) => {
            this.configChange(conf)
        });
        console.log('Construtor');
    }

    configChange(conf: any) {
        this.timezone = conf.timezone.value
        this.style = conf.style.value
        if (this.style === 'analog') {
            document.querySelector("analog_clock").style.display = "inline"
            document.querySelector("digital_clock").style.display = "none"
        } else {
            document.querySelector("analog_clock").style.display = "none"
            document.querySelector("digital_clock").style.display = "inline"
        }
    }

    renderDigital() {
        document.querySelector(".clock").textContent = moment().tz('Europe/Paris').format('HH:mm:ss')
        document.querySelector('.clock_date').textContent = moment().format('ddd Do MMM YYYY')
    }

    renderAnalog() {
        var date = moment.tz(this.timezone).toDate();
        var seconds = date.getUTCSeconds();
        var minutes = date.getUTCMinutes();
        var hours = date.getUTCHours();

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
    }

    start() {
        this.clockWidget = this.sdk.createWidget();

        this.render();
        setInterval(() => {
            this.render();
        }, 1000);
    }

    render() {

        if (this.style === 'analog') {
            this.renderAnalog()
        } else {
            this.renderDigital()
        }
        this.clockWidget.html(document.body.innerHTML);
    }
}

new Clock().start();