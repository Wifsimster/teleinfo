module.exports = {
    serial: {
        portId: '/dev/ttyAMA0',
        baudRate: 1200,
	dataBits: 7,
	stopBits: 1,
	parity: 'even'
    },
    mqtt: {
        host: '192.168.0.195',
        port: '1883'
    }
}
