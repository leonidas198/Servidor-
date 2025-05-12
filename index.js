require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/send", async(req, res) => {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.DESTINATION_EMAIL,
        subject: "Mensaje desde formulario de contacto",
        text: `Nombre: ${name}\nEmail: ${email}\nMensaje:\n${message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.send("Mensaje enviado correctamente.");
    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error al enviar el mensaje");
    }
   });

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

