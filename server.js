
                            /* Abhay Tiwari */
                    /*Intern at The Sparks Foundation*/

const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',  
    database: 'banking_system'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database.');
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/customers', (req, res) => {
    db.query('SELECT * FROM customers', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.get('/customer/:id', (req, res) => {
    const customerId = req.params.id;
    db.query('SELECT * FROM customers WHERE id = ?', [customerId], (err, result) => {
        if (err) throw err;
        res.json(result[0]);
    });
});

app.post('/transfer', (req, res) => {
    const { senderId, receiverId, amount } = req.body;

    db.beginTransaction((err) => {
        if (err) throw err;

        db.query('SELECT balance FROM customers WHERE id = ?', [senderId], (err, results) => {
            if (err) return db.rollback(() => { throw err; });

            const senderBalance = results[0].balance;
            if (senderBalance < amount) {
                return db.rollback(() => {
                    res.status(400).send('Insufficient balance.');
                });
            }

            db.query('UPDATE customers SET balance = balance - ? WHERE id = ?', [amount, senderId], (err) => {
                if (err) return db.rollback(() => { throw err; });

                db.query('UPDATE customers SET balance = balance + ? WHERE id = ?', [amount, receiverId], (err) => {
                    if (err) return db.rollback(() => { throw err; });

                    db.query('INSERT INTO transfers (sender_id, receiver_id, amount) VALUES (?, ?, ?)', [senderId, receiverId, amount], (err) => {
                        if (err) return db.rollback(() => { throw err; });

                        db.commit((err) => {
                            if (err) return db.rollback(() => { throw err; });

                            res.send('Transfer successful.');
                        });
                    });
                });
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
