import { VFAASNet } from '../../app/src/VFAASNet.ts'

const wait = (ms) => new Promise((cb) => setTimeout(cb, ms))

class ToTestRunner {
    async i(testDescription){
        const equal = (val1, val2) => {
            if(val1 === val2){
                console.log('✓ ' + `i ${testDescription}`)
                return val1 === val2
            } else {
                console.log('❌' + `i ${testDescription}`)
            }
        }
        return equal
    }
}

class TestRunner {
    async describe(testSuiteDescription, func){
        try {
            const tr = new ToTestRunner()
            func(tr)
        }catch(err){
            console.log('❌')
        }
    }
}

const tr = new TestRunner()

tr.describe('vfaas', async (runner: ToTestRunner) => {
    const vfaasNet1 = new VFAASNet({host: 'localhost', port: 8079})
    const vfaasNet2 = new VFAASNet({host: 'localhost', port: 8079})

    let socketId1 = null
    let socketId2 = null
    let userEmail1 = 'morgan.moskalyk@protonmail.ch'
    let userEmail2 = 'versus.energy@protonmail.com'
    let color1 = 'orange'
    let color2 = 'blue'

    let equal1 = await runner.i('will test vfaas ack 1')
    let equal2 = await runner.i('will test vfaas ack 2')

    let equalSharing1 = await runner.i('will test vfaas sharing 1')
    let equalSharing2 = await runner.i('will test vfaas sharing 2')

    const ack = (ack: any) => {
        if(!socketId1){
            socketId1 = ack.datum
            equal1((typeof ack.datum), 'string')
        } else {
            socketId2 = ack.datum
            equal2((typeof ack.datum), 'string')
        }
    }

    const sharing = (data: any) => {

        if(JSON.parse(data).isInitiator) {
            equalSharing1(JSON.parse(data).color,'orange')
            vfaasNet2.webSocket.send('sharing', {color: color2, isInitiator: false, initiator: userEmail2, email: JSON.parse(data).initiator, geometry: [1,2,3,4,5,6,7,8,9,10,11,12].map(el =>[el])})
        }else {
            equalSharing2(JSON.parse(data).color,'blue')
        }
    }

    vfaasNet1.aPath(ack)
    vfaasNet1.aPath(sharing)

    vfaasNet1.aBoot(async (msg: any) => {
        let equal = await runner.i('will test vfaas connection 1')
        await vfaasNet1.webSocket.send('init', {id: socketId1, email: userEmail1})
        equal(msg.msg, 'connection created')

        await vfaasNet1.webSocket.send('sharing', {isInitiator: true, color: color1, initiator: userEmail1, email: userEmail2, geometry: [7]})
    })

    vfaasNet2.aPath(ack)
    vfaasNet2.aPath(sharing)

    vfaasNet2.aBoot(async (msg: any) => {
        let equal = await runner.i('will test vfaas connection 2')

        equal(msg.msg, 'connection created')
        await vfaasNet2.webSocket.send('init', {id: socketId2, email: userEmail2})
    })
})