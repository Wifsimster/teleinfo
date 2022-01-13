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
	    let buffer = '', match
	    let serialNumber, option, subscribedIntensity, index, 
		instantaneousIntensity01, instantaneousIntensity02, instantaneousIntensity03,
		subscribedPowerExceeded, maximumIntensity
	    
            serial.on('data', data => {
		//console.log(data, data.toString())
		// console.log('------------------')

		data = data.toString()
		buffer += data

		// Start of the buffer
	        if(data.startsWith('\u0002\nADCO')) {
		    buffer = buffer.replace('\u0002\n', '')
		}

		// End of the buffer
		if(data.startsWith('\u0003')) {
		    buffer = buffer.replace('\u0003', '')
			
		    console.log('Parsing buffer')

		    match = /ADCO ([0-9 \w]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== serialNumber) {
			serialNumber = match[1]
			client.publish(`${topic}/serialNumber`, serialNumber)
		    }

		    match = /OPTARIF ([A-Z 0-9]+)/g.exec(buffer)    
		    if(match && match[1] && match[1] !== option) {
			option = match[1]
			client.publish(`${topic}/option`, option)
		    }
			
	            match = /ISOUSC ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== subscribedIntensity) {
			subscribedIntensity = match[1]
			client.publish(`${topic}/subscribedIntensity`, subscribedIntensity)
		    }
			
		    match = /BASE ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== index) {
			index = match[1]
			client.publish(`${topic}/index`, index)
		    }
			
		    match = /IINST1 ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== instantaneousIntensity01) {
			instantaneousIntensity01 = match[1]
			client.publish(`${topic}/instantaneousIntensity01`, instantaneousIntensity01)
		    }
			
		    match = /IINST1 ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== instantaneousIntensity02) {
			instantaneousIntensity02 = match[1]
			client.publish(`${topic}/instantaneousIntensity02`, instantaneousIntensity02)
		    }
			
		    match = /IINST1 ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== instantaneousIntensity03) {
			instantaneousIntensity03 = match[1]
			client.publish(`${topic}/instantaneousIntensity03`, instantaneousIntensity03)
		    }
			
		    match = /ADPS  ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== subscribedPowerExceeded) {
			subscribedPowerExceeded = match[1]
			client.publish(`${topic}/subscribedPowerExceeded`, subscribedPowerExceeded)
		    }
			
		    match = /IMAX  ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== maximumIntensity) {
			maximumIntensity = match[1]
			client.publish(`${topic}/maximumIntensity`, maximumIntensity)
		    }			

		    // Reset buffer
		    buffer = ''
		}
            })
        })
    })

    client.on('error', err => { console.error(err) })
})
