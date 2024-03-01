const express = require('express');
const bodyParser = require('body-parser');
const csv = require('csv-parser');
const fs = require('fs');
const { LotteryTicket } = require('./models'); // Import your LotteryTicket model

const app = express();
const port = 8000;

app.use(bodyParser.json());

// CORS setup
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://tkcompany.vercel.app');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Function to check if phone number exists in CSV
async function phoneNumberExists(phoneNumber) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream('data.csv')
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                const exists = results.some((row) => row.phoneNumber === phoneNumber);
                resolve(exists);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

// Endpoint to save phone number
app.post('/savePhoneNumber', async (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    if (!phoneNumber) {
        return res.status(400).json({ detail: 'Phone number is required' });
    }

    try {
        const exists = await phoneNumberExists(phoneNumber);
        if (exists) {
            return res.status(400).json({ detail: 'Phone number already exists' });
        }

        fs.appendFileSync('data.csv', `${phoneNumber}\n`);
        return res.json({ message: 'Phone number saved successfully' });
    } catch (error) {
        console.error(`Error saving phone number: ${error}`);
        return res.status(500).json({ detail: 'Failed to save phone number' });
    }
});

// Endpoint to generate ticket
app.post('/generate_ticket', async (req, res) => {
    const ticketCode = Array(10)
        .fill()
        .map(() => Math.random().toString(36).charAt(2))
        .join('');
    try {
        const ticket = await LotteryTicket.create({ ticket_code: ticketCode });
        return res.json({ ticket_code: ticket.ticket_code });
    } catch (error) {
        console.error(`Error generating ticket: ${error}`);
        return res.status(500).json({ detail: 'Failed to generate ticket' });
    }
});

// Endpoint to submit ticket
app.post('/submit_ticket/:ticket_code', async (req, res) => {
    const ticketCode = req.params.ticket_code;
    const ticket = await LotteryTicket.findOne({ ticket_code: ticketCode });
    if (!ticket) {
        return res.status(400).json({ detail: 'Invalid ticket code' });
    }
    if (ticket.used) {
        return res.status(400).json({ detail: 'Ticket already used' });
    }
    // Process the submission as needed
});

// Endpoint to spin
app.get('/spin/:ticket_code', async (req, res) => {
    const ticketCode = req.params.ticket_code;
    const ticket = await LotteryTicket.findOne({ ticket_code: ticketCode });
    if (!ticket) {
        return res.status(400).json({ detail: 'Invalid ticket code' });
    }
    if (ticket.used) {
        return res.status(400).json({ detail: 'Ticket already used' });
    }
    const result = get_random_result();
    ticket.result = result;
    ticket.used = true;
    await ticket.save();
    return res.json({ prize: result });
});

// Endpoint to get ticket prize
app.get('/ticket_prize/:ticket_code', async (req, res) => {
    const ticketCode = req.params.ticket_code;
    const ticket = await LotteryTicket.findOne({ ticket_code: ticketCode });
    if (!ticket) {
        return res.status(404).json({ detail: 'Ticket not found' });
    }
    if (!ticket.used) {
        return res.json({ message: 'Ticket code has not been used yet' });
    }
    return res.json({ ticket_code: ticketCode, prize: ticket.result });
});

function get_random_result() {
    const prizes = ['谢谢参与', '300', '600', '900', '1500', '3000', '8800', '再来一次'];
    return prizes[Math.floor(Math.random() * prizes.length)];
}

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
