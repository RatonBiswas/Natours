const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

// new Email(user, url).sendWelcome();

module.exports = class Email{ 
    constructor(user, url){
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.form =  `Raton Biswas <${process.env.EMAIL_FROM}>`;

    }
    newTransport(){
        if(process.env.NODE_ENV==='production'){
            //sendGrid 
            return 1;

        }
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            }
        });
    }
    //Send the actual email
    async send(template,subject){
        //1) Render HTML based on a pug templete
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`,{
            firstName : this.firstName,
            url: this.url,
            subject
        });        

        //2) Define Email Options
        const mailOptions = {
            from: this.form,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html)
        };

        //3) Create a transport and send email
        // this.newTransport();
        await this.newTransport().sendMail(mailOptions);

    }

    async sendWelcome(){
        await this.send('welcome','Welcome To The Natuours Family!');
    }


    async sendPasswordReset(){
        await this.send('passwordReset','Your password reset token (valid for only 10 minutes)');
    }
};
// const sendEmail = async (options) => {
    //1)create a transport
    // const transporter = nodemailer.createTransport({
    //     host: process.env.EMAIL_HOST,
    //     port: process.env.EMAIL_PORT,
    //     auth: {
    //         user: process.env.EMAIL_USERNAME,
    //         pass: process.env.EMAIL_PASSWORD,
    //     }
    // });
    //2)define the email option
    // const mailOptions = {
    //     from: 'Raton Biswas <raton@gmail.com>',
    //     to: options.email,
    //     subject: options.subject,
    //     text: options.message
    // };
    //3)actually send the email
    // await transporter.sendMail(mailOptions);
// };
// module.exports = sendEmail;