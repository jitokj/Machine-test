const  Queue = require('bull');

const { REDIS_URL } = process.env;

// Initiating the Queue with a redis instance
const sendMailQueue = new Queue('sendMail', REDIS_URL);

export default sendMailQueue;