const raspi = require('raspi')
const Serial = require('raspi-serial').Serial
const config = require('./config')
const mqtt = require('mqtt')

raspi.init(() => {
    const client = mqtt.connect(`mqtt://${config.mqtt.host}:${config.mqtt.port}`)
    const topic = '/linky'

    client.on('connect', () => {
        console.log('MQTT connected')
        const serial = new Serial(config.serial)
        serial.open(() => {
	    let trame = ''
            serial.on('data', data => {
//              console.log(data, data.toString())
//		console.log('------------------')

		data = data.toString()
		trame += data

	        if(data.startsWith('\u0002\nADCO')) {
		    trame = trame.replace('\u0002\n', '')
		    console.log('Start reading buffer')
		}

		if(data.startsWith('\u0003')) {
		    trame = trame.replace('\u0003', '')

		    let serialNumber = /ADCO ([0-9 \w]+)/g.exec(trame)[1]
		    if(serialNumber) {
			client.publish(`${topic}/serialNumber`, serialNumber)
		    }

		    let option = /OPTARIF ([A-Z 0-9]+)/g.exec(trame)[1]
	            let subscribedIntensity = /ISOUSC ([0-9]+)/g.exec(trame)[1]
		    let index = /BASE ([0-9]+)/g.exec(trame)[1]

		    let result = { serialNumber, option, subscribedIntensity, index }
		    client.publish(topic, JSON.stringify(result))

		    trame = ''
		}
            })
        })
    })

    client.on('error', err => { console.error(err) })
})
