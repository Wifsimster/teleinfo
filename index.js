const raspi = require('raspi')
const Serial = require('raspi-serial').Serial
const config = require('./config')
const mqtt = require('mqtt')

raspi.init(() => {
    const client = mqtt.connect(`mqtt://${config.mqtt.host}:${config.mqtt.port}`, { clientId: `teleinfo_${Math.random().toString(16).slice(3)}` })
    const topic = '/linky'

    client.on('connect', () => {
        console.log('MQTT connected')
        const serial = new Serial(config.serial)
        serial.open(() => {
	    let buffer = '', match
	    let serialNumber, tariffOption, subscribedIntensity, index, currentPeriodTariff,
		instantaneousIntensity, instantaneousIntensity01, instantaneousIntensity02, instantaneousIntensity03,
		maximumIntensity, maximumIntensity01, maximumIntensity02, maximumIntensity03,
		currentExceededPhase01, currentExceededPhase02, currentExceededPhase03,
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
		    if(match && match[1] && match[1] !== tariffOption) {
			tariffOption = match[1]
			client.publish(`${topic}/tariffOption`, tariffOption)
		    }
			
	            match = /ISOUSC ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== subscribedIntensity) {
			subscribedIntensity = match[1]
			client.publish(`${topic}/subscribedIntensity (A)`, subscribedIntensity)
		    }
			
		    match = /BASE ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== index) {
			index = match[1]
			client.publish(`${topic}/index (Wh)`, index)
		    }
			
		    match = /PTEC ([A-Z]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== currentPeriodTariff) {
			currentPeriodTariff = match[1]
			client.publish(`${topic}/currentPeriodTariff`, currentPeriodTariff)
		    }
			
		    match = /IINST ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== instantaneousIntensity) {
			instantaneousIntensity = match[1]
			client.publish(`${topic}/instantaneousIntensity (A)`, instantaneousIntensity)
		    }
			
		    match = /IINST1 ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== instantaneousIntensity01) {
			instantaneousIntensity01 = match[1]
			client.publish(`${topic}/instantaneousIntensity01 (A)`, instantaneousIntensity01)
		    }
			
		    match = /IINST2 ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== instantaneousIntensity02) {
			instantaneousIntensity02 = match[1]
			client.publish(`${topic}/instantaneousIntensity02 (A)`, instantaneousIntensity02)
		    }
			
		    match = /IINST3 ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== instantaneousIntensity03) {
			instantaneousIntensity03 = match[1]
			client.publish(`${topic}/instantaneousIntensity03 (A)`, instantaneousIntensity03)
		    }
			
		    match = /ADPS ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== subscribedPowerExceeded) {
			subscribedPowerExceeded = match[1]
			client.publish(`${topic}/subscribedPowerExceeded (A)`, subscribedPowerExceeded)
		    }
			
		    match = /ADIR1 ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== currentExceededPhase01) {
			currentExceededPhase01 = match[1]
			client.publish(`${topic}/currentExceededPhase01 (A)`, currentExceededPhase01)
		    }
			
		    match = /ADIR2 ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== currentExceededPhase02) {
			currentExceededPhase02 = match[1]
			client.publish(`${topic}/currentExceededPhase02 (A)`, currentExceededPhase02)
		    }
			
		    match = /ADIR3 ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== currentExceededPhase03) {
			currentExceededPhase03 = match[1]
			client.publish(`${topic}/currentExceededPhase03 (A)`, currentExceededPhase03)
		    }
			
		    match = /IMAX ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== maximumIntensity) {
			maximumIntensity = match[1]
			client.publish(`${topic}/maximumIntensity (A)`, maximumIntensity)
		    }
			
		    match = /IMAX1 ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== maximumIntensity01) {
			maximumIntensity01 = match[1]
			client.publish(`${topic}/maximumIntensity01 (A)`, maximumIntensity01)
		    }
			
		    match = /IMAX2 ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== maximumIntensity02) {
			maximumIntensity02 = match[1]
			client.publish(`${topic}/maximumIntensity02 (A)`, maximumIntensity02)
		    }
			
		    match = /IMAX3 ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== maximumIntensity03) {
			maximumIntensity03 = match[1]
			client.publish(`${topic}/maximumIntensity03 (A)`, maximumIntensity03)
		    }
			
		    match = /PMAX ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== maximumPower) {
			maximumPower = match[1]
			client.publish(`${topic}/maximumPower (W)`, maximumPower)
		    }
			
		    match = /PAPP ([0-9]+)/g.exec(buffer)
		    if(match && match[1] && match[1] !== apparentPower) {
			apparentPower = match[1]
			client.publish(`${topic}/apparentPower (VA)`, apparentPower)
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
