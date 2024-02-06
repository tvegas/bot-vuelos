var UserAgent = require('user-agents');
const puppeteer = require('puppeteer-extra');
const cron = require('node-cron');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const axios = require('axios');
const notifier = require('node-notifier');
const config = require('./config.json');

const SendWhatsApp = (message) => {
	axios.post(whatsAppUrl, {
			message: message
		})
		.then(function() {

		})
		.catch(function(error) {
			console.log(error)
		});
}

const NotifyFlightFounded = (flightData, price) => {

	const message = "Vuelo encontrado a " + flightData.destination + " precio: " + price + "  url: " + flightData.url;
	
	notifier.notify({
		title: 'Vuelo encontrado!!',
		message
	  });

	if (config.useWhatsAppApi) {
		SendWhatsApp(message);
	}

}
const CheckAlmundoCheapestFlights = async (data) => {
	puppeteer.use(StealthPlugin());

	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.goto(data.url, {
		waitUntil: 'networkidle2'
	});
	await page.waitForTimeout(2000);
	try {

		const pricesBox = await page.$$("[class='x_axis_container ng-star-inserted']");
		var cheapestPrice = 0;
		var cheapestMonth = "";
		for (const priceBoxIndex in pricesBox) {
			let priceBox = pricesBox[priceBoxIndex];
			let monthElement = await priceBox;
			let priceElement = await priceBox.$("[class=content_bottom]");
			let month = await monthElement.evaluate(el => el.innerText);
			if (priceElement) {
				let price = await priceElement.evaluate(el => el.innerText);
				let intprice = parseInt(price.replaceAll(".", "").replaceAll("$", "").trim());
				if (!cheapestPrice || cheapestPrice > intprice) {
					cheapestPrice = intprice;
					cheapestMonth = month;
				}
			}
		}

		if (cheapestPrice <= data.maxPrice) {
			NotifyFlightFounded(data, cheapestPrice);
		}
	} catch (e) {
		console.log(e);
	}
	await browser.close();
};


cron.schedule(config.cronTabConfig, async () => {
	console.log(`Running on: ${new Date().toLocaleString('es-AR', { timeZone: 'America/Buenos_Aires' })}`)

	for (const flightIndex in config.flightsToSearch) {
		try {

			let flight = config.flightsToSearch[flightIndex];

			if (flight.url.includes("almundo")) {
				await CheckAlmundoCheapestFlights(flight);
			} else {
				console.log("URL " + flight.url + " Not valid!!");
			}
		} catch (ex) {
			console.log("ups!!", ex);
		}

	}


});