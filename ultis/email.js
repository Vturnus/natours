const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text')

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstname = user.name.split(' ')[0];
    this.url = url;
    this.from = `William Anderson <${process.env.EMAIL_FROM_PROD}>`
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //Elassticemail
      return nodemailer.createTransport({
        host: process.env.ELASTIC_SERVER,
        port: process.env.ELASTIC_PORT,
        auth: {
          user: process.env.ELASTIC_USER,
          pass: process.env.ELASTIC_PASS
        }
      })

    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
      //Activate in gmail "the less secure app" option
    });
  }

  //Send the actual email
  async send(template, subject) {
    //1) Render HTML based on a pug tempelate
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstname: this.firstname,
      url: this.url,
      subject
    })

    //2) Define email options 
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };

    //3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('Welcome', 'Welcome to the Natours Family!')
  }

  async sendPasswordReset() {
    await this.send('passwordReset', 'Your password reset token (Valid for only 10 minutes')
  }
}

