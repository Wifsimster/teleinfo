const raspi = require('raspi')
const Serial = require('raspi-serial').Serial
const config = require('./config')
const mqtt = require('mqtt')

raspi.init(() => {
    const client = mqtt.connect(`mqtt://${config.mqtt.host}:${config.mqtt.port}`, { clientId: `teleinfo_${Math.random().toString(16).slice(3)}` })

    client.on('connect', () => {
        console.log('MQTT connected')
        const serial = new Serial(config.serial)
        serial.open(() => {
	    let topic, buffer = '', match, object = {},
	    let serialNumber, tariffOption, subscribedIntensity, index, currentPeriodTariff,
		instantaneousIntensity, instantaneousIntensity01, instantaneousIntensity02, instantaneousIntensity03,
		maximumIntensity, maximumIntensity01, maximumIntensity02, maximumIntensity03,
		currentExceededPhase01, currentExceededPhase02, currentExceededPhase03,
		subscribedPowerExceeded, maximumPower, apparentPower, timeGroup, check
	    
            serial.on('data', data => {
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
			topic = `teleinfo/linky_${serialNumber.slice(-6)}`
			//client.publish(`${topic}/serialNumber`, serialNumber)
			object.serialNumber = serialNumber

		        match = /OPTARIF ([A-Z]+)/g.exec(buffer)    
		        if(match && match[1] && match[1] !== tariffOption) {
			    tariffOption = match[1]
			    //client.publish(`${topic}/tariffOption`, tariffOption)
			    object.tariffOption = tariffOption
		        }
			
	                match = /ISOUSC ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== subscribedIntensity) {
			    subscribedIntensity = match[1]
			    //client.publish(`${topic}/subscribedIntensity (A)`, subscribedIntensity)
			    object.subscribedIntensity = subscribedIntensity
		        }
			
		        match = /BASE ([0-9]+) /g.exec(buffer)
		        if(match && match[1] && match[1] !== index) {
			    index = match[1]
			    //client.publish(`${topic}/index (Wh)`, index)
			    object.index = index
		        }
			
		        match = /PTEC ([A-Z]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== currentPeriodTariff) {
			    currentPeriodTariff = match[1]
			    //client.publish(`${topic}/currentPeriodTariff`, currentPeriodTariff)
			    object.currentPeriodTariff = currentPeriodTariff
		        }
			
		        match = /IINST ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== instantaneousIntensity) {
			    instantaneousIntensity = match[1]
			    //client.publish(`${topic}/instantaneousIntensity (A)`, instantaneousIntensity)
			    object.instantaneousIntensity = instantaneousIntensity
		        }
			
		        match = /IINST1 ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== instantaneousIntensity01) {
			    instantaneousIntensity01 = match[1]
			    //client.publish(`${topic}/instantaneousIntensity01 (A)`, instantaneousIntensity01)
			    object.instantaneousIntensity01 = instantaneousIntensity01
		        }
			
		        match = /IINST2 ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== instantaneousIntensity02) {
			    instantaneousIntensity02 = match[1]
		    	    //client.publish(`${topic}/instantaneousIntensity02 (A)`, instantaneousIntensity02)
			    object.instantaneousIntensity02 = instantaneousIntensity02
		        }
			
		        match = /IINST3 ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== instantaneousIntensity03) {
			    instantaneousIntensity03 = match[1]
			    //client.publish(`${topic}/instantaneousIntensity03 (A)`, instantaneousIntensity03)
			    object.instantaneousIntensity03 = instantaneousIntensity03
		        }
			
		        match = /ADPS ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== subscribedPowerExceeded) {
			    subscribedPowerExceeded = match[1]
			    //client.publish(`${topic}/subscribedPowerExceeded (A)`, subscribedPowerExceeded)
			    object.subscribedPowerExceeded = subscribedPowerExceeded
		        }
			
		        match = /ADIR1 ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== currentExceededPhase01) {
			    currentExceededPhase01 = match[1]
			    //client.publish(`${topic}/currentExceededPhase01 (A)`, currentExceededPhase01)
			    object.currentExceededPhase01 = currentExceededPhase01
		        }
			
		        match = /ADIR2 ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== currentExceededPhase02) {
			    currentExceededPhase02 = match[1]
			    //client.publish(`${topic}/currentExceededPhase02 (A)`, currentExceededPhase02)
			    object.currentExceededPhase02 = currentExceededPhase02
		        }
			
		        match = /ADIR3 ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== currentExceededPhase03) {
			    currentExceededPhase03 = match[1]
			    //client.publish(`${topic}/currentExceededPhase03 (A)`, currentExceededPhase03)
			    object.currentExceededPhase03 = currentExceededPhase03
		        }
			
		        match = /IMAX ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== maximumIntensity) {
			    maximumIntensity = match[1]
			    //client.publish(`${topic}/maximumIntensity (A)`, maximumIntensity)
			    object.maximumIntensity = maximumIntensity
		        }
			
		        match = /IMAX1 ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== maximumIntensity01) {
			    maximumIntensity01 = match[1]
			    //client.publish(`${topic}/maximumIntensity01 (A)`, maximumIntensity01)
			    object.maximumIntensity01 = maximumIntensity01
		        }
			
		        match = /IMAX2 ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== maximumIntensity02) {
			    maximumIntensity02 = match[1]
			    //client.publish(`${topic}/maximumIntensity02 (A)`, maximumIntensity02)
			    object.maximumIntensity02 = maximumIntensity02
		       }
			
		        match = /IMAX3 ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== maximumIntensity03) {
			    maximumIntensity03 = match[1]
			    //client.publish(`${topic}/maximumIntensity03 (A)`, maximumIntensity03)
			    object.maximumIntensity03 = maximumIntensity03
		        }
			
		        match = /PMAX ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== maximumPower) {
			    maximumPower = match[1]
			    //client.publish(`${topic}/maximumPower (W)`, maximumPower)
			    object.maximumPower = maximumPower
		        }
			
		        match = /PAPP ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== apparentPower) {
			    apparentPower = match[1]
			    //client.publish(`${topic}/apparentPower (VA)`, apparentPower)
			    object.apparentPower = apparentPower
		        }	
			
		        match = /HHPHC ([A-Z]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== timeGroup) {
			    timeGroup = match[1]
			    //client.publish(`${topic}/timeGroup`, timeGroup)
			    object.timeGroup = timeGroup
		        }	
			
		        match = /MOTDETAT ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== check) {
			    check = match[1]
			    //client.publish(`${topic}/check`, check)
			    object.check = check
		        }
		    
			console.log(`Publish ${topic}`)
			client.publish(`${topic}`, JSON.parse(object))

		        // Reset buffer
		        buffer = ''
		    }
		}
            })
        })
    })

    client.on('error', err => { console.error(err) })
})
