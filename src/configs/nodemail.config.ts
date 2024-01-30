import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
var hbs = require("nodemailer-express-handlebars");
import path from "path";
import dotenv from "dotenv";
dotenv.config();

// Create a transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_CLOUD_EMAIL,
    pass: process.env.GOOGLE_CLOUD_PASSWORD,
  },
} as unknown as SMTPTransport.Options);

transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extName: ".hbs",
      partialsDir: path.resolve(__dirname, "../assets/mail"),
      layoutsDir: path.resolve(__dirname, "../assets/mail"),
      defaultLayout: "", // specify your default layout here
    },
    viewPath: path.resolve(__dirname, "../assets/mail"),
    extName: ".hbs",
  })
);

export const sendMail = (recipient: string, urls: string[]) => {
  // Specify the email options
  let mailOptions = {
    from: "firebaseshift@gmail.com",
    to: recipient,
    subject: "Login Link",
    template: "result",
    context: {
      urls: [...urls],
    },
  };
  // Send the email
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log("Error occurred", err);
    } else {
      console.log("Email sent successfully");
    }
  });
};
