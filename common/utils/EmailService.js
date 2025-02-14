"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const AppConstants_1 = require("../constants/AppConstants");
const LocationUtils_1 = __importDefault(require("./LocationUtils"));
class EmailService {
    constructor() {
        this.location = { region: "", city: "", country_name: "" };
        // sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
        this.fetchLocation();
    }
    fetchLocation() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const locationData = yield (0, LocationUtils_1.default)();
                if (locationData) {
                    this.location = locationData;
                    return this.location;
                }
                else {
                    // Handle the case where location data is not available
                    console.error("Location data is not available.");
                }
            }
            catch (error) {
                // Handle any errors that may occur during the fetch
                console.error("Error fetching location data:", error);
            }
        });
    }
    sendCode(recipient, subject, full_name, code = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const mailTransporter = nodemailer_1.default.createTransport({
                host: "sm1.cloudoon.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PWD,
                }, tls: {
                    rejectUnauthorized: false
                }
            });
            const emailDetails = {
                to: recipient,
                from: process.env.EMAIL,
                subject: subject,
                html: `<div style="background-color: #071559; color: white; font-size: 2rem; height: auto;">
    <div>
     <div style="background-color: #071559; text-align: center; padding: 20px; ">
       <img  src="https://res.cloudinary.com/dranag91m/image/upload/v1707217811/justin_assets/Copy_of_Assets__200___150_px___3_-removebg-preview_zz5wxk.png" alt="Logo" style="width: 130px; margin-top: 25px">
     </div>
     <h6 style="margin-top: 30px; text-align: center; text-decoration: underline; text-transform: uppercase; text-style: bold;">Account Verification</h6>
   <div style="font-size: 50%">
     <p style="margin-top: 30px; padding-left: 50px; padding-right:50px;">
     Hello <b>${full_name}</b>,
   <br/><br/>
   To complete your account setup, please enter the following confirmation code.
    </p> 
    <div style="display: flex; padding-left: 25px; padding-right:25px; text-align:center; justify-content:center" >
    <h2 style="background-color: #497332;color:#fff; border-radius:5px; text-align: center; padding:5px;"> ${code}</h2>
    </div>
    <p style="padding-left: 50px; padding-right:50px;"> If you didn't initiate this, kindly ignore. 
   <br/><br/>
   Best regards,
   <br/><b style="color:gray">Assets Bit Team.</b></p>
   </div>
    </div>
   <br/><br/>
   <div style="background-color: #0a1342; color: #919191; text-align: center; padding: 1px; font-size: 25%">
         <span><b>THIS EMAIL WAS SENT TO: ${recipient}</b></span>
       </div>
   ${AppConstants_1.EMAIL_FOOTER1}
   </div>`
            };
            const info = yield mailTransporter.sendMail(emailDetails);
            if (info) {
                console.log("Email sent!");
            }
            else {
                console.log('Error sending Email');
            }
        });
    }
    sendWelcomeEmail(recipient, subject, full_name) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailTransporter = nodemailer_1.default.createTransport({
                host: "sm1.cloudoon.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PWD,
                }, tls: {
                    rejectUnauthorized: false
                }
            });
            const emailDetails = {
                to: recipient,
                from: process.env.EMAIL,
                subject: subject,
                html: `<div style="background-color: #071559; color: white; font-size: 2rem; height: auto;">
      <div>
       <div style="background-color: #071559; text-align: center; padding: 20px; ">
         <img  src="https://res.cloudinary.com/dranag91m/image/upload/v1707217811/justin_assets/Copy_of_Assets__200___150_px___3_-removebg-preview_zz5wxk.png" alt="Logo" style="width: 120px; margin-top: 25px">
       </div>
       <h6 style="margin-top: 30px; text-align: center; text-decoration: underline; text-transform: uppercase; text-style: bold;">Welcome to <span style="color: green;">Assets Bit! 🌟</span></h6>
     <div style="font-size: 50%">
       <p style="margin-top: 30px; padding-left: 10px; padding-right:50px;">
       Dear <b>${full_name}</b>,
       <br/>
       <p style="display: flex; padding-right:25px;">Your account have been verified!</p>
     
    <b> Here's what you can look forward to:</b>
       
      <div style="display: flex; padding-right:25px;" >
        <ul>
        <li>
   <b> Exclusive Insights:</b> Gain access to in-depth market analysis, investment strategies, and the latest trends that can help you make confident financial decisions.    
        </li>
        <li><b>Educational Content:</b> Explore a treasure trove of articles, webinars, and courses designed to expand your financial knowledge. </li>
        <li><b>Community Interaction:</b> Join discussions, share your insights, and connect with like-minded individuals in our vibrant community.</li>
        <li><b>Personalized Experience:</b> Tailor your preferences to receive content that aligns with your financial interests and goals.</li>
        <li><b>Expert Guidance:</b> Our team of financial experts is here to assist you on your journey. Feel free to reach out with any questions or concerns. And many more.</li>
        </ul>
      </div>
     <p style="display: flex; padding-left: 5px; padding-right:5px;"> 
     To get started, simply log in to your Assets Bit account using your registered email address and password. 
     If you haven't completed your profile yet, we encourage you to do so to make the most of your experience.</p>
<p style="padding-left: 10px; padding-right:10px;">
  Remember, your financial future is in your hands, and we're here to empower you every step of the way.
<br/>
Thank you for choosing Assets Bit. We can't wait to see how you grow and succeed in 
your financial endeavors.
<br/>
If you have any questions or need assistance, don't hesitate to reach out to 
our friendly support team at ${AppConstants_1.COMPANY_INFO.EMAIL}.
<br/>
Once again, welcome to Assets Bit!

</p>
      <p style="padding-left: 10px; padding-right:10px;"> If you didn't initiate this, kindly ignore. 
     <br/><br/>
     Best regards,<br/>
      
<b style="color:gray">Assets Bit.</b></p>
     </div>
      </div>
     <br/>
     <div style="background-color: #0a1342; color: #919191; text-align: center; padding: 1px; font-size: 25%">
         <span><b>THIS EMAIL WAS SENT TO: ${recipient}</b></span>
       </div>
        ${AppConstants_1.EMAIL_FOOTER1}
     </div>`
            };
            const info = yield mailTransporter.sendMail(emailDetails);
            if (info) {
                console.log("Email sent!");
            }
            else {
                console.log('Error sending Email');
            }
        });
    }
    sendLoginOTP(recipient, subject, full_name, code = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const mailTransporter = nodemailer_1.default.createTransport({
                host: "sm1.cloudoon.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PWD,
                }, tls: {
                    rejectUnauthorized: false
                }
            });
            const emailDetails = {
                to: recipient,
                from: process.env.EMAIL,
                subject: subject,
                html: `<div style="background-color: #071559; color: white; font-size: 2rem; height: auto;">
        <div>
         <div style="background-color: #071559; text-align: center; padding: 20px; ">
           <img  src="https://res.cloudinary.com/dranag91m/image/upload/v1707217811/justin_assets/Copy_of_Assets__200___150_px___3_-removebg-preview_zz5wxk.png" alt="Logo" style="width: 130px; margin-top: 25px">
         </div>
         <h6 style="margin-top: 30px; text-align: center; text-decoration: underline; text-transform: uppercase; text-style: bold;">Login Confirmation OTP</h6>
       <div style="font-size: 50%">
         <p style="margin-top: 30px; padding-left: 50px; padding-right:50px;">
         Hello <b>${full_name}</b>,
       <br/><br/>
       You have requested to log in to your Assets Bit account. To ensure the security of your account, we have generated a one-time password (OTP) for you to use during the login process.
        </p> 
        <div style="display: flex; padding-left: 25px; padding-right:25px; text-align:center; justify-content:center; align-items:center;" >
         
        <h2 style="background-color: #497332;color:#fff; border-radius:5px; text-align: center; padding:5px;"> ${code}</h2>
        </div>
        <p style="padding-left: 50px; padding-right:50px;"> 
        This OTP will expire in <span style="color:red">10 minutes</span>, so please use it promptly. If you did not request this OTP or have any concerns about your account's security, please contact our support team immediately at ${AppConstants_1.COMPANY_INFO.EMAIL}.
        <br/><br/>
        Thank you for choosing Assets Bit.
       <br/><br/>
       Best regards,
       <br/><b style="color:gray">Assets Bit Team.</b></p>
       </div>
        </div>
       <br/><br/>
       <div style="background-color: #0a1342; color: #919191; text-align: center; padding: 1px; font-size: 25%">
         <span><b>THIS EMAIL WAS SENT TO: ${recipient}</b></span>
       </div>
       ${AppConstants_1.EMAIL_FOOTER1}
       </div>`
            };
            const info = yield mailTransporter.sendMail(emailDetails);
            if (info) {
                console.log("Email sent!");
            }
            else {
                console.log('Error sending Email');
            }
        });
    }
    sendTransactionOTP(recipient, subject, full_name, code = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const mailTransporter = nodemailer_1.default.createTransport({
                host: "sm1.cloudoon.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PWD,
                }, tls: {
                    rejectUnauthorized: false
                }
            });
            const emailDetails = {
                to: recipient,
                from: process.env.EMAIL,
                subject: subject,
                html: `<div style="background-color: #071559; color: white; font-size: 2rem; height: auto;">
          <div>
           <div style="background-color: #071559; text-align: center; padding: 20px; ">
             <img  src="https://res.cloudinary.com/dranag91m/image/upload/v1707217811/justin_assets/Copy_of_Assets__200___150_px___3_-removebg-preview_zz5wxk.png" alt="Logo" style="width: 130px; margin-top: 25px">
           </div>
           <h6 style="margin-top: 30px; text-align: center; text-decoration: underline; text-transform: uppercase; text-style: bold;">Transaction Confirmation OTP</h6>
         <div style="font-size: 50%">
           <p style="margin-top: 30px; padding-left: 50px; padding-right:50px;">
           Hello <b>${full_name}</b>,
         <br/><br/>
         You are about to perform a transaction on your Assets Bit account. To verify and authorize this transaction, please use the following one-time password (OTP):
          </p> 
          <div style="display: flex; padding-left: 25px; padding-right:25px; text-align:center; justify-content:center; align-items:center;" >
           
          <h2 style="background-color: #497332;color:#fff; border-radius:5px; text-align: center; padding:5px;"> ${code}</h2>
          </div>
          <p style="padding-left: 50px; padding-right:50px;"> 
          This OTP is valid for a single transaction and will expire in <span style="color:red">10 minutes</span>. If you did not initiate this transaction or have any concerns, please contact our support team immediately at ${AppConstants_1.COMPANY_INFO.EMAIL}.
          <br/><br/>
          Thank you for choosing Assets Bit.
         <br/><br/>
         Best regards,
         <br/><b style="color:gray">Assets Bit Team.</b></p>
         </div>
          </div>
         <br/><br/>
         <div style="background-color: #0a1342; color: #919191; text-align: center; padding: 1px; font-size: 25%">
         <span><b>THIS EMAIL WAS SENT TO: ${recipient}</b></span>
       </div>
         ${AppConstants_1.EMAIL_FOOTER1}
         </div>`
            };
            const info = yield mailTransporter.sendMail(emailDetails);
            if (info) {
                console.log("Email sent!");
            }
            else {
                console.log('Error sending Email');
            }
        });
    }
    sendLoginAlert(recipient, subject, full_name) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailTransporter = nodemailer_1.default.createTransport({
                host: "sm1.cloudoon.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PWD,
                }, tls: {
                    rejectUnauthorized: false
                }
            });
            const now = new Date();
            const formattedDateTime = `${now.toUTCString()}`;
            const emailDetails = {
                to: recipient,
                from: process.env.EMAIL,
                subject: subject,
                html: `<div style="background-color: #071559; color: white; font-size: 2rem; height: auto;">
        <div>
         <div style="background-color: #071559; text-align: center; padding: 20px; ">
           <img  src="https://res.cloudinary.com/dranag91m/image/upload/v1707217811/justin_assets/Copy_of_Assets__200___150_px___3_-removebg-preview_zz5wxk.png" alt="Logo" style="width: 120px; margin-top: 25px">
         </div>
         <h6 style="margin-top: 30px; text-align: center; text-decoration: underline; text-transform: uppercase; text-style: bold;"><span style="color: green;">Account Login Alert 🚨</span></h6>
       <div style="font-size: 50%">
         <p style="margin-top: 30px; padding-left: 10px; padding-right:50px;">
         Hi <b>${full_name}</b>,
       <br/><br/>
      <b>  We wanted to inform you of a recent login to your Assets Bit account.</b>
     
  <br/>
  <p style="font-size:0.rem;">
  <b>DATE & TIME:</b> ${formattedDateTime}
   
</p>
  <br/>
  <span style="color:red"><i>If this login was not authorized by you, please take immediate action by resetting your password and contacting our support team at support@email.com.</i></span>
  <br/><br/>
  
  Your account security is important to us, and we are here to assist you in case of any concerns.
  <br/><br/>
  Thank you for choosing Assets Bit for your financial journey.
  </p>    
  <p style="padding-left: 25px;"> Best regards,<br/>
  <b style="color:gray;">Assets Bit.</b>
  </p>
</div>
</div>
<br/>
<div style="background-color: gray; color: green; text-align: center; padding: 1px; font-size: 30%">
<span><b>THIS EMAIL WAS SENT TO: ${recipient}</b></span>
         </div>
          ${AppConstants_1.EMAIL_FOOTER1}
       </div>`
            };
            const info = yield mailTransporter.sendMail(emailDetails);
            if (info) {
                console.log("Email sent!");
            }
            else {
                console.log('Error sending Email');
            }
        });
    }
    sendTransactionAlertEmail(recipient, full_name, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailTransporter = nodemailer_1.default.createTransport({
                host: "sm1.cloudoon.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PWD,
                }, tls: {
                    rejectUnauthorized: false
                }
            });
            const formatSubject = `${transaction.transaction_type.toUpperCase()} Alert:  ${transaction.transaction_type === 'credit' ? '+' : '-'}${transaction.amount}$ ${transaction.transaction_type}`;
            const emailDetails = {
                to: recipient,
                from: process.env.EMAIL,
                subject: formatSubject,
                html: `<div style="background-color: #071559; color: white; font-size: 2rem; height: auto;">
          <div>
           <div style="background-color: #071559; text-align: center; padding: 20px; ">
             <img  src="https://res.cloudinary.com/dranag91m/image/upload/v1707217811/justin_assets/Copy_of_Assets__200___150_px___3_-removebg-preview_zz5wxk.png" alt="Logo" style="width: 120px; margin-top: 25px">
           </div>
           <h6 style="margin-top: 30px; text-align: center; text-decoration: underline; text-transform: uppercase; text-style: bold;">Transaction Alert</h6>
         <div style="font-size: 50%">
           <p style="margin-top: 30px; padding-left: 10px; padding-right:50px;">
           Dear <b>${full_name}</b>,
         <br/><br/>
         We are writing to inform you about a recent ${transaction.transaction_type} on your Assets Bit account.
        <br/><br/>
        <b><span style="color:green; text-decoration: underline;">Transaction Details:</span></b>
          </p> 
          <div style="display: flex; padding-right:25px;" >
            <ul>
            <li>
            <b> AMOUNT:</b> ${transaction.amount} </li>
            <li><b>TRANSACTION TYPE:</b>  ${transaction.transaction_type}</li>
            <li><b>TRANSACTION DATE & TIME: :</b> ${new Date().toUTCString()} </li>
            <li><b>TRANSACTION REFERENCE:</b> ${transaction._id}</li>
              <li><b>NARRATION:</b> ${transaction.narration}</li>
            </ul>
          </div>
         <p style="display: flex; padding-left: 10px; padding-right:5px;">  
         If you recognize this transaction, you can disregard this email. However, if you did not authorize or recognize this transaction, please contact our support team immediately.
         </p>
    <p style="display: flex; padding-left: 10px; padding-right:10px;">
     Your account security is our top priority, and we are here to assist you with any concerns or questions you may have.
    <br/>
 
    
    </p>
          <p style="padding-left: 10px; padding-right:10px;"> If you didn't initiate this, kindly ignore. 
         <br/><br/>
         Best regards,<br/>
          
    <b style="color:gray">Assets Bit.</b></p>
         </div>
          </div>
         <br/>
         <div style="background-color: #0a1342; color: #919191; text-align: center; padding: 1px; font-size: 25%">
             <span><b>THIS EMAIL WAS SENT TO: ${recipient}</b></span>
           </div>
            ${AppConstants_1.EMAIL_FOOTER1}
         </div>`
            };
            const info = yield mailTransporter.sendMail(emailDetails);
            if (info) {
                console.log("Email sent!");
            }
            else {
                console.log('Error sending Email');
            }
        });
    }
    iraNotification(recipient, subject, full_name) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailTransporter = nodemailer_1.default.createTransport({
                host: "sm1.cloudoon.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PWD,
                }, tls: {
                    rejectUnauthorized: false
                }
            });
            const emailDetails = {
                to: recipient,
                from: process.env.EMAIL,
                subject: subject,
                html: `<div style="background-color: #071559; color: white; font-size: 2rem; height: auto;">
            <div>
             <div style="background-color: #071559; text-align: center; padding: 20px; ">
               <img  src="https://res.cloudinary.com/dranag91m/image/upload/v1707217811/justin_assets/Copy_of_Assets__200___150_px___3_-removebg-preview_zz5wxk.png" alt="Logo" style="width: 120px; margin-top: 25px">
             </div>
             <h6 style="margin-top: 30px; text-align: center; text-decoration: underline; text-transform: uppercase; text-style: bold;">Password Changed</h6>
           <div style="font-size: 50%">
             <p style="margin-top: 30px; padding-left: 10px; padding-right:50px;">
             Dear <b>${full_name}</b>,
             <br/>
             <p style="display: flex;padding-left: 5px; padding-right:25px;">
             We are writing to inform you that your password for your  ${AppConstants_1.COMPANY_INFO.NAME} account has been successfully changed. Your account security is of utmost importance to us, and we want to ensure that your online experience remains safe and secure.
             </p>
             
             
             <p style="display: flex;padding-left: 5px; padding-right:25px; margin-top: 15px;">
If you initiated this password change, you can disregard this email. However, if you did not request this change, please contact our support team immediately at ${AppConstants_1.COMPANY_INFO.EMAIL} to report 
any unauthorized access to your account.
             </p>
           
          <b style="padding-left: 5px;"> Please remember the following security tips:</b>
             
            <div style="display: flex; padding-right:25px;" >
              <ul>
              <li>
         <b> Create a Strong Password:</b> Use a combination of letters (both upper and lower case), numbers, and special characters to create a password that is difficult for others to guess.   
              </li>
              <li><b>Never Share Your Password:</b>  Do not share your password with anyone, including our customer support representatives. We will never ask you for your password. </li>
              <li><b>Regularly Update Your Password: </b> For your security, it's a good practice to change your password periodically. Make sure to use unique passwords for different accounts.</li>
              
              <li><b> Beware of Phishing Attempts:</b> Be cautious of emails or messages asking you to provide your password or other sensitive information. Always verify the sender's identity.</li>
               
              </ul>
            </div>
           <p style="display: flex; padding-left: 5px; padding-right:5px;"> 
            
Thank you for choosing ${AppConstants_1.COMPANY_INFO.NAME} . We can't wait to see how you grow and succeed in 
      your financial endeavors.
      <br/>
      If you have any questions or need assistance, don't hesitate to reach out to 
      our friendly support team at ${AppConstants_1.COMPANY_INFO.EMAIL}.
      <br/>
      Once again, welcome to Assets Bit!
      
      </p>
  <p style="padding-left: 10px; padding-right:10px;"> If you didn't initiate this, kindly ignore. 
           <br/><br/>
           Best regards,<br/>
            
      <b style="color:gray">Assets Bit.</b></p>
           </div>
            </div>
           <br/>
           <div style="background-color: #0a1342; color: #919191; text-align: center; padding: 1px; font-size: 25%">
               <span><b>THIS EMAIL WAS SENT TO: ${recipient}</b></span>
             </div>
              ${AppConstants_1.EMAIL_FOOTER1}
           </div>`
            };
            const info = yield mailTransporter.sendMail(emailDetails);
            if (info) {
                console.log("Email sent!");
            }
            else {
                console.log('Error sending Email');
            }
        });
    }
    sendChangedPasswordNotification(recipient, subject, full_name) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailTransporter = nodemailer_1.default.createTransport({
                host: "sm1.cloudoon.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PWD,
                }, tls: {
                    rejectUnauthorized: false
                }
            });
            const emailDetails = {
                to: recipient,
                from: process.env.EMAIL,
                subject: subject,
                html: `<div style="background-color: #071559; color: white; font-size: 2rem; height: auto;">
              <div>
               <div style="background-color: #071559; text-align: center; padding: 20px; ">
                 <img  src="https://res.cloudinary.com/dranag91m/image/upload/v1707217811/justin_assets/Copy_of_Assets__200___150_px___3_-removebg-preview_zz5wxk.png" alt="Logo" style="width: 120px; margin-top: 25px">
               </div>
               <h6 style="margin-top: 30px; text-align: center; text-decoration: underline; text-transform: uppercase; text-style: bold;">Password Changed</h6>
             <div style="font-size: 50%">
               <p style="margin-top: 30px; padding-left: 10px; padding-right:50px;">
               Dear <b>${full_name}</b>,
               <br/>
               <p style="display: flex; padding-left: 10px; padding-right:25px;">
               Your account password was changed recently.
               
               </p>
              <p style="padding-left: 10px; padding-right:10px;"> If you didn't initiate this, Please contact support. 
             <br/><br/>
             Best regards,<br/>
              
        <b style="color:gray">Assets Bit.</b></p>
             </div>
              </div>
             <br/>
          <div style="background-color: #0a1342; color: #919191; text-align: center; padding: 1px; font-size: 25%">
                 <span><b>THIS EMAIL WAS SENT TO: ${recipient}</b></span>
               </div>
                ${AppConstants_1.EMAIL_FOOTER1}
             </div>`
            };
            const info = yield mailTransporter.sendMail(emailDetails);
            if (info) {
                console.log("Email sent!");
            }
            else {
                console.log('Error sending Email');
            }
        });
    }
    sendCustomEmailToUser(recipients, subject, message, full_name) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailTransporter = nodemailer_1.default.createTransport({
                host: "sm1.cloudoon.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PWD,
                }, tls: {
                    rejectUnauthorized: false
                }
            });
            const emailDetails = {
                to: recipients,
                from: process.env.EMAIL,
                subject: subject,
                html: `<div style="background-color: #071559; color: white; font-size: 2rem; height: auto;">
            <div>
             <div style="background-color: #071559; text-align: center; padding: 20px; ">
               <img  src="https://res.cloudinary.com/dranag91m/image/upload/v1707217811/justin_assets/Copy_of_Assets__200___150_px___3_-removebg-preview_zz5wxk.png" alt="Logo" style="width: 135px; margin-top: 25px">
             </div>
             <h5 style="margin-top: 30px; text-align: center; text-decoration: underline; text-transform: uppercase; text-style: bold;">${subject}</h5>
           <div style="font-size: 50%">
             <p style="margin-top: 30px; padding-left: 10px; padding-right:10px;">
             Dear <b>${full_name}</b>,
           <br/><br/>
           ${message}
           
            </p> 
             
            <p style="padding-left: 10px; padding-right:10px;"> 
            
           <br/> 
           Best regards,
           <br/><b style="color:gray;">Assets Bit Team.</b>
           </p>
           </div>
            </div>
           <br/><br/>
           <div style="padding-left: 5px; padding-right: 5px;">
              ${AppConstants_1.EMAIL_FOOTER1}
           </div>
           </div>`
            };
            const info = yield mailTransporter.sendMail(emailDetails);
            if (info) {
                console.log("Email sent!");
            }
            else {
                console.log('Error sending Email');
            }
        });
    }
}
// curl "ipinfo.io/105.113.10.64?token=6e51c3f1e25d7e"
exports.default = EmailService;
//# sourceMappingURL=EmailService.js.map