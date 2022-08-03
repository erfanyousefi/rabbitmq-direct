const amqp = require("amqplib");
const exchangeName = "directMessage"
const logTypes = process.argv.slice(2);// error, info, warning
console.log(logTypes);
const receiveData = async () => {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, "direct");
    const assertedQueue = await channel.assertQueue('', {exclusive: true});
    for (const pattern of logTypes) {
        channel.bindQueue(assertedQueue.queue, exchangeName, pattern);
    }
    channel.consume(assertedQueue.queue, msg => {
        console.log(msg.content.toString());
    })
}
receiveData();