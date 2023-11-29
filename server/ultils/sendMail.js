import nodemailer from "nodemailer";
import asyncHandler from "express-async-handler";

//get google app password and store in env

const sendMail = asyncHandler(async (receiverEmail, html) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.APP_EMAIL, // sender address
    to: receiverEmail, // list of receivers
    subject: "Forgot Password", // Subject line
    html: html, // html body
  });
  //console.log(info);
  return info;
});

export { sendMail };
