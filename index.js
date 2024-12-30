const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();

// Configuração do parser de dados
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuração para upload de arquivos
const upload = multer({ dest: "uploads/" });

// Endpoint para enviar o formulário
app.post("/send-email", upload.single("biFile"), async (req, res) => {
    console.log("Dados recebidos do formulário:", req.body);
    console.log("Arquivo recebido:", req.file);

    try {
        // Configuração do Nodemailer para Outlook
        const transporter = nodemailer.createTransport({
            host: "smtp-mail.outlook.com",
            port: 587,
            secure: false,
            auth: {
                user: "okuinvest@outlook.com",
                pass: "OkuBank1",
            },
        });

        // Montando o e-mail
        const mailOptions = {
            from: "okuinvest@outlook.com",
            to: "okuinvest@outlook.com", // E-mail do destinatário
            subject: "Novo Cadastro de Investimento",
            text: `
            Detalhes do Cadastro:
            - Bilhete de Identidade: ${req.body.biNumber}
            - Nome Completo: ${req.body.fullName}
            - Email: ${req.body.email}
            - Endereço: ${req.body.address}
            - Residência: ${req.body.residence}
            - Nacionalidade: ${req.body.nationality}
            - Estado Civil: ${req.body.maritalStatus}
            - Perfil de Investidor: ${req.body.investorProfile}
            - Profissão: ${req.body.profession}
            - Tempo de Trabalho: ${req.body.workTime}
            - Conta Bancária: ${req.body.bankAccount}
            - Renda Mensal: ${req.body.monthlyIncome}
            - Renda Anual: ${req.body.annualIncome}
            `,
            attachments: req.file
                ? [
                      {
                          filename: req.file.originalname,
                          path: req.file.path,
                      },
                  ]
                : [],
        };

        // Enviando o e-mail
        await transporter.sendMail(mailOptions);
        console.log("E-mail enviado com sucesso.");
        res.status(200).send("Formulário enviado com sucesso!");
    } catch (error) {
        console.error("Erro ao enviar o e-mail:", error);
        res.status(500).send("Erro ao enviar o formulário.");
    }
});

// Configuração do servidor para rodar no 127.0.0.1
app.listen(3000, "127.0.0.1", () => {
    console.log("Servidor rodando em http://127.0.0.1:3000");
});
