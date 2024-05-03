const {PubSub} = require('@google-cloud/pubsub')

const projectId = 'smartfinance-bills-beta'

const pubSubClient = new PubSub(projectId);

timeout = 10000


exports.getUncategorizedValues = async (req, res, next) => {
    console.log('[DEBUG] retrieving uncategorized elements')
    const subscription = pubSubClient.subscription("sfinbills-category")
    let messageCount = 0;
    const messages = []
    const messageHandler = message => {
        console.log(`Received message ${message.id}:`)
        console.log(`\tData: ${message.data}`)
        console.log(`\tAttributes: ${JSON.stringify(message.attributes)}`)
        messageCount += 1
        message.ack()
        messages.push(message.data.toString('utf-8'))
    };
    console.log(`messages to be sent: ${messages}`)
    subscription.on('message', messageHandler)
    setTimeout(() => {
        subscription.removeListener('message', messageHandler)
        console.log(`${messageCount} message(s) received.`)
        res.status(200).send(JSON.stringify(messages))
    }, timeout)
}