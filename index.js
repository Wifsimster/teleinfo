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
	    let serialNumber = '', trame = ''
            serial.on('data', data => {
//                console.log(data, data.toString())
//		console.log('------------------')

		data = data.toString()
		trame += data

	        if(data.startsWith('\u0002\nADCO')) {
		    trame = trame.replace('\u0002\n', '')
		    console.log('Start reading buffer')
		}

		if(data.startsWith('\u0003')) {
		    trame = trame.replace('\u0003', '')
		    console.log('buffer', trame)
		    client.publish(topic, trame)
		    trame = ''
		}
            })
        })
    })

    client.on('error', err => { console.error(err) })
})
