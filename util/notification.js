const emailService = require("./emailSetup");
const sendMailQueue  = require("./queue");
const template = require('./template');

/**
 *
 * @param {*} emailTo
 * @param {*} name
 * @param {*} password
 * @returns {*} sends an email to a new user
 */
const registrationEmail = (emailTo, name,password) => {
  const subject = 'login details';
  const body = `<p>Dear ${name},</p>
  <p>We are thrilled to have you.</p>
  <p>your login details: email - ${emailTo} password - ${password} <p>`
  const message = template(subject, body, emailTo);

  const options = {
    attempts: 2,
  };
  const data = { emailTo, subject, message };

  // Producer: adds jobs to que, in this case emails to be sent out upon signup
  sendMailQueue.add(data, options);
};

// Consumer: this gets called each time the producer receives a new email.
sendMailQueue.process(async job => {
  emailService.mailSender(job.data);
});



export default registrationEmail;