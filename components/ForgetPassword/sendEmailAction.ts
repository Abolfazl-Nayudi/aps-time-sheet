"use server";

import { EmailParams, MailerSend, Recipient, Sender } from "mailersend";

const sendEmailAction = async () => {
  const mailerSend = new MailerSend({
    apiKey: process.env.API_KEY,
  });

  const sentFrom = new Sender("you@yourdomain.com", "Your name");

  const recipients = [new Recipient("your@client.com", "Your Client")];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject("This is a Subject")
    .setHtml("<strong>This is the HTML content</strong>")
    .setText("This is the text content");

  await mailerSend.email.send(emailParams);
};

export { sendEmailAction };
