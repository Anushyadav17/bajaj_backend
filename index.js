const express = require('express');
const bodyParser = require('body-parser');
const mime = require('mime-types');
const app = express();
const port = 4000;

app.use(bodyParser.json());

const cookiePaser = require("cookie-parser");
const cors = require("cors");

app.use(express.json());
app.use(cookiePaser());
app.use(
    cors({
        origin : "*",
        credentials : true,
    })
)

const isPrime = (num) => {
  if (num < 2) return false;
  for (let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const decodeBase64File = (base64Str) => {
  try {
    const buffer = Buffer.from(base64Str, 'base64');
    return { valid: true, buffer };
  } catch {
    return { valid: false };
  }
};

app.post('/bfhl', (req, res) => {
  const { data, file_b64 } = req.body;

  const userId = 'anush_yadav_17091999';
  const email = 'anushyadav210215@acropolis.in';
  const rollNumber = '0827CS211028';


  if (!Array.isArray(data)) {
    return res.status(400).json({ is_success: false, message: 'Invalid data' });
  }


  const numbers = data.filter((item) => !isNaN(item)).map(String); 
  const alphabets = data.filter((item) => isNaN(item));
  const highestLowercase = alphabets
    .filter((ch) => ch === ch.toLowerCase())
    .sort()
    .pop() || null;

  const primeFound = numbers.some((num) => isPrime(Number(num)));

  
  const fileDetails = file_b64
    ? (() => {
        const { valid, buffer } = decodeBase64File(file_b64);
        return valid
          ? {
              file_valid: true,
              file_mime_type: mime.lookup(buffer) || 'unknown',
              file_size_kb: (buffer.length / 1024).toFixed(2),
            }
          : { file_valid: false };
      })()
    : { file_valid: false };

  const response = {
    is_success: true,
    user_id: userId,
    email,
    roll_number: rollNumber,
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
    is_prime_found: primeFound,
    ...fileDetails,
  };

  res.json(response);
});

app.use("/", (req,res) => {
  res.send("<h1>Server is Running</h1>")
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
