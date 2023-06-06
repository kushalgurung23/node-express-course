const nodemailer = require('nodemailer')
const CustomError = require('../errors')
const sgMail = require('@sendgrid/mail')

const sendEmailEtherial = async (req, res) => {
    // const testAccount = await nodemailer.createTestAccount();
    // Create a SMTP transporter object
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'ari.auer51@ethereal.email',
            pass: 'Bw2cXEGU5NGyT2UqSG'
        }
    });

    // Message object
    const message = {
        from: 'Chelsea FC <chelseafc@gmail.com>',
        to: 'adishgandu@gmail.com',
        subject: 'Cleaner Role Offer',
        html: '<p><b>Hello</b> Adish Gandu, We are pleased to welcome you to Chelsea FC as first team laundry and pitch cleaner.</p>'
    };

    transporter.sendMail(message, (err, info) => {
        if (err) {
          throw CustomError.BadRequestError('Message not delivered.');
        }

        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.json(info);
    });

}

const sendEmailSendGrid = async (req, res) => {

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    // Message object
    const msg = {
        from: 'kushal@apex.hk',
        to: 'qoosal23.kg@gmail.com',
        subject: 'Cleaner Role Offer',
        html: '<p><b>Hello</b> Adish Gandu, We are pleased to welcome you to Chelsea FC as first team laundry and pitch cleaner.</p>'
    };

    const info = await sgMail.send(msg)
    res.json(info);

}

module.exports = sendEmailSendGrid;