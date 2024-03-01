const express = require('express');
const { createConnection } = require('typeorm');
const { LotteryTicket } = require('./models');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://tkcompany.vercel.app'); // Update the allowed origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});


// Database connection
createConnection({
  type: 'sqlite',
  database: 'data/db.sqlite3',
  synchronize: true,
  entities: [LotteryTicket],
}).then(() => {
  console.log('Database connected');
}).catch(error => console.log('Error connecting to database:', error));

// Check if phone number exists
async function phoneNumberExists(phoneNumber) {
  // Implementation to check phone number existence in data.csv
}

// Save phone number
app.post('/savePhoneNumber', async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ detail: 'Phone number is required' });
  }

  const exists = await phoneNumberExists(phoneNumber);
  if (exists) {
    return res.status(400).json({ detail: 'Phone number already exists' });
  }

  try {
    // Implementation to save phone number to data.csv
  } catch (error) {
    console.log('Error saving phone number:', error);
    return res.status(500).json({ detail: 'Failed to save phone number' });
  }

  return res.json({ message: 'Phone number saved successfully' });
});

// Get tickets
app.get('/tickets', async (req, res) => {
  try {
    const tickets = await LotteryTicket.find();
    return res.json(tickets);
  } catch (error) {
    return res.status(500).json({ detail: 'Internal server error' });
  }
});

// Generate ticket
app.post('/generateTicket', async (req, res) => {
  try {
    // Implementation to generate ticket code
    const ticket = await LotteryTicket.create({ ticketCode: ticket_code });
    await ticket.save();
    return res.json({ ticketCode: ticket.ticketCode });
  } catch (error) {
    return res.status(500).json({ detail: 'Internal server error' });
  }
});

// Submit ticket
app.post('/submitTicket/:ticket_code', async (req, res) => {
  const { ticket_code } = req.params;
  try {
    // Implementation to submit ticket
  } catch (error) {
    return res.status(500).json({ detail: 'Internal server error' });
  }
});

// Spin
app.get('/spin/:ticket_code', async (req, res) => {
  const { ticket_code } = req.params;
  try {
    // Implementation to spin
  } catch (error) {
    return res.status(500).json({ detail: 'Internal server error' });
  }
});

// Get ticket prize
app.get('/ticketPrize/:ticket_code', async (req, res) => {
  const { ticket_code } = req.params;
  try {
    // Implementation to get ticket prize
  } catch (error) {
    return res.status(500).json({ detail: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
