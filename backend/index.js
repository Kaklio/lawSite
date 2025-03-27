import express from 'express'
import nodemailer from 'nodemailer'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

const app = express();
const port = 3000;
const __dirname = path.dirname(__filename)

app.use(express.json())
app.use(cors())

const API_KEY = "957a4e020b844d1381c8199212225e09";

const tranporter = nodemailer.createTransport({

service: "gmail",
auth:{
user: "aounhussainshah@gmail.com", // Sender
pass: "fpcj tmwl grln oohr " // Go to google Account and Search for "App Password", Type in any name to
                             //  generate a password that will allow you to send Emails from the account
},

    })

app.post('/', async (req, res) => {

    const  email  = req.body.email;
    const  ver_code  = req.body.code;


console.log(req.body);
console.log(email);



    // console.log(`Recieved EMAIL:${email}`)
    // // Validate email with Abstract API
    // const response = await fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=${API_KEY}&email=${email}`);
    // const data = await response.json();

    // console.log("Abstract API Response:", data);

    // if (!data.deliverability || data.deliverability !== "DELIVERABLE") {
    //     console.log(`${email} is not a valid email`)
    //     return res.status(400).json({ success: false, message: "Invalid or undeliverable email address." });
    // }
    // else
    // {
    //     console.log(`${email} is a valid email`)
    // }

    tranporter.sendMail({
       from:'"Sentinal Assosiates"<aounhussainshah@gmail.com>', //'"Your Custom Name" <your-email@gmail.com>' [Template] 
       to:email,
       subject: "TESTER EMAIL",  // Subject of the Email
       text:"WOW You got the Mail, I mean I got the mail!",  // Body/Text of the Email

    })
    
    res.status(200).json({ success: true, message: "Email verified successfully" });

})


// app.post('/', (req, res) => {
//     console.log(req.body)
//     // res.status(201).send("got the email")
//     res.status(200).json({ success: true, message: "Email verified successfully" });

// });

app.get('/', (req, res) => {
    res.send('Hello World!ssss');
    // res.sendFile('index.html', {root : __dirname})
});




console.log("->>"+__dirname)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
