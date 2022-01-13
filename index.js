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
	    let topic, buffer = '', match, object = {}
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
		    if(match && match[1] && match[1]) {
			serialNumber = match[1]
			topic = `teleinfo/linky_${serialNumber.slice(-6)}`
			object.serialNumber = serialNumber

		        match = /OPTARIF ([A-Z]+)/g.exec(buffer)    
		        if(match && match[1] && match[1] !== tariffOption) {
			    tariffOption = match[1]
			    object.tariffOption = tariffOption
		        }
			
	                match = /ISOUSC ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== subscribedIntensity) {
			    subscribedIntensity = match[1]
			    object.subscribedIntensity = { value: subscribedIntensity, unit: 'A' }
		        }
			
		        match = /BASE ([0-9]+) /g.exec(buffer)
		        if(match && match[1] && match[1] !== index) {
			    index = match[1]
			    object.index = { value: index, unit: 'Wh' }
		        }
			
		        match = /PTEC ([A-Z]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== currentPeriodTariff) {
			    currentPeriodTariff = match[1]
			    object.currentPeriodTariff = currentPeriodTariff
		        }
			
		        match = /IINST ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== instantaneousIntensity) {
			    instantaneousIntensity = match[1]
			    object.instantaneousIntensity = { value: instantaneousIntensity, unit: 'A' }
		        }
			
		        match = /IINST1 ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== instantaneousIntensity01) {
			    instantaneousIntensity01 = match[1]
			    object.instantaneousIntensity01 = { value: instantaneousIntensity01, unit: 'A' }
		        }
			
		        match = /IINST2 ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== instantaneousIntensity02) {
			    instantaneousIntensity02 = match[1]
			    object.instantaneousIntensity02 = { value: instantaneousIntensity02, unit: 'A' }
		        }
			
		        match = /IINST3 ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== instantaneousIntensity03) {
			    instantaneousIntensity03 = match[1]
			    object.instantaneousIntensity03 = { value: instantaneousIntensity03, unit: 'A' }
		        }
			
		        match = /ADPS ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== subscribedPowerExceeded) {
			    subscribedPowerExceeded = match[1]
			    object.subscribedPowerExceeded = { value: subscribedPowerExceeded, unit: 'A' }
		        }
			
		        match = /ADIR1 ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== currentExceededPhase01) {
			    currentExceededPhase01 = match[1]
			    object.currentExceededPhase01 = { value: currentExceededPhase01, unit: 'A' }
		        }
			
		        match = /ADIR2 ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== currentExceededPhase02) {
			    currentExceededPhase02 = match[1]
			    object.currentExceededPhase02 = { value: currentExceededPhase02, unit: 'A' }
		        }
			
		        match = /ADIR3 ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== currentExceededPhase03) {
			    currentExceededPhase03 = match[1]
			    object.currentExceededPhase03 = { value: currentExceededPhase03, unit: 'A' }
		        }
			
		        match = /IMAX ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== maximumIntensity) {
			    maximumIntensity = match[1]
			    object.maximumIntensity = { value: maximumIntensity, unit: 'A' }
		        }
			
		        match = /IMAX1 ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== maximumIntensity01) {
			    maximumIntensity01 = match[1]
			    object.maximumIntensity01 = { value: maximumIntensity01, unit: 'A' }
		        }
			
		        match = /IMAX2 ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== maximumIntensity02) {
			    maximumIntensity02 = match[1]
			    object.maximumIntensity02 = { value: maximumIntensity02, unit: 'A' }
		       }
			
		        match = /IMAX3 ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== maximumIntensity03) {
			    maximumIntensity03 = match[1]
			    object.maximumIntensity03 = { value: maximumIntensity03, unit: 'A' }
		        }
			
		        match = /PMAX ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== maximumPower) {
			    maximumPower = match[1]
			    object.maximumPower = { value: maximumPower, unit: 'W' }
		        }
			
		        match = /PAPP ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== apparentPower) {
			    apparentPower = match[1]
			    object.apparentPower = { value: apparentPower, unit: 'VA' }
		        }	
			
		        match = /HHPHC ([A-Z]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== timeGroup) {
			    timeGroup = match[1]
			    object.timeGroup = timeGroup
		        }	
			
		        match = /MOTDETAT ([0-9]+)/g.exec(buffer)
		        if(match && match[1] && match[1] !== check) {
			    check = match[1]
			    object.check = check
		        }
		    
			console.log(`Publish ${topic}`, object)
			client.publish(`${topic}`, JSON.stringify(object))

		        // Reset buffer
		        buffer = ''
		    }
		}
            })
        })
    })

    client.on('error', err => { console.error(err) })
})
