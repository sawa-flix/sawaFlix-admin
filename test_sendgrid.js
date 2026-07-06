const sgMail = require('@sendgrid/mail');
require('dotenv').config({ path: '.env.local' });

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
    to: process.env.SENDGRID_FROM_EMAIL, // Send to yourself as a test
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: 'SendGrid Test',
    text: 'Testing SendGrid integration',
    html: '<strong>Testing SendGrid integration</strong>',
};

async function test() {
    try {
        console.log('Using API Key:', process.env.SENDGRID_API_KEY ? 'Present' : 'Missing');
        console.log('From Email:', process.env.SENDGRID_FROM_EMAIL);
        const response = await sgMail.send(msg);
        console.log('Success! Status code:', response[0].statusCode);
    } catch (error) {
        console.error('SendGrid Error:');
        if (error.response) {
            console.error(JSON.stringify(error.response.body, null, 2));
        } else {
            console.error(error);
        }
    }
}

test();
