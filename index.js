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
	    let serialNumber, option, subscribedIntensity, index, currentPeriodTariff,
		instantaneousIntensity, instantaneousIntensity01, instantaneousIntensity02, instantaneousIntensity03,
		maximumIntensity, maximumIntensity01, maximumIntensity02, maximumIntensity03,
		subscribedPowerExceeded, maximumPower, apparentPower, timeGroup, check
	    
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

		    match = /ADCO ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== serialNumber) {
			serialNumber = match[1]
			client.publish(`${topic}/serialNumber`, serialNumber)
		    }

		    match = /OPTARIF ([A-Z]+)/g.exec(buffer)    
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
			
		    match = /PTEC ([A-Z]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== currentPeriodTariff) {
			currentPeriodTariff = match[1]
			client.publish(`${topic}/currentPeriodTariff`, currentPeriodTariff)
		    }
			
		    match = /IINST ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== instantaneousIntensity) {
			instantaneousIntensity = match[1]
			client.publish(`${topic}/instantaneousIntensity`, instantaneousIntensity)
		    }
			
		    match = /IINST1 ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== instantaneousIntensity01) {
			instantaneousIntensity01 = match[1]
			client.publish(`${topic}/instantaneousIntensity01`, instantaneousIntensity01)
		    }
			
		    match = /IINST2 ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== instantaneousIntensity02) {
			instantaneousIntensity02 = match[1]
			client.publish(`${topic}/instantaneousIntensity02`, instantaneousIntensity02)
		    }
			
		    match = /IINST3 ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== instantaneousIntensity03) {
			instantaneousIntensity03 = match[1]
			client.publish(`${topic}/instantaneousIntensity03`, instantaneousIntensity03)
		    }
			
		    match = /ADPS ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== subscribedPowerExceeded) {
			subscribedPowerExceeded = match[1]
			client.publish(`${topic}/subscribedPowerExceeded`, subscribedPowerExceeded)
		    }
			
		    match = /IMAX ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== maximumIntensity) {
			maximumIntensity = match[1]
			client.publish(`${topic}/maximumIntensity`, maximumIntensity)
		    }
			
		    match = /IMAX1 ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== maximumIntensity01) {
			maximumIntensity01 = match[1]
			client.publish(`${topic}/maximumIntensity01`, maximumIntensity01)
		    }
			
		    match = /IMAX2 ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== maximumIntensity02) {
			maximumIntensity02 = match[1]
			client.publish(`${topic}/maximumIntensity02`, maximumIntensity02)
		    }
			
		    match = /IMAX3 ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== maximumIntensity03) {
			maximumIntensity03 = match[1]
			client.publish(`${topic}/maximumIntensity03`, maximumIntensity03)
		    }
			
		    match = /PMAX ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== maximumPower) {
			maximumPower = match[1]
			client.publish(`${topic}/maximumPower`, maximumPower)
		    }
			
		    match = /PAPP ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== apparentPower) {
			apparentPower = match[1]
			client.publish(`${topic}/apparentPower`, apparentPower)
		    }	
			
		    match = /HHPHC ([A-Z]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== timeGroup) {
			timeGroup = match[1]
			client.publish(`${topic}/timeGroup`, timeGroup)
		    }	
			
		    match = /MOTDETAT ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== check) {
			check = match[1]
			client.publish(`${topic}/check`, check)
		    }			

		    // Reset buffer
		    buffer = ''
		}
            })
        })
    })

    client.on('error', err => { console.error(err) })
})
