const {PubSub} = require('@google-cloud/pubsub')

const projectId = 'smartfinance-bills-beta'

const pubSubClient = new PubSub(projectId);

timeout = 60000


exports.getUncategorizedValues = async (req, res, next) => {
    console.log('[DEBUG] retrieving uncategorized elements')
    const subscription = pubSubClient.subscription("sfinbills-category")
    let messageCount = 0;
    const messageHandler = message => {
        console.log(`Received message ${message.id}:`)
        console.log(`\tData: ${message.data}`)
        console.log(`\tAttributes: ${message.attributes}`)
        messageCount += 1
        message.ack()
        res.status(200).send(message.data)
    };
    subscription.on('message', messageHandler)
    setTimeout(() => {
        subscription.removeListener('message', messageHandler)
        console.log(`${messageCount} message(s) received.`)
    }, timeout)
}