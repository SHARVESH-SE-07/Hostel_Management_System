import nodemailer from 'nodemailer';
export const sendEmail=async({to,subject,html})=>{if(!process.env.SMTP_HOST)return;return nodemailer.createTransport({host:process.env.SMTP_HOST,port:+process.env.SMTP_PORT||587,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}}).sendMail({from:process.env.EMAIL_FROM,to,subject,html});};
