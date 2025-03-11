const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const Razorpay = require('razorpay');
const crypto = require('crypto');

dotenv.config();

app.use(express.json());
app.use(cors());

app.get('/',(request, response) => {
    response.status(200).send('App is Running...');
});

app.post('/api/payment/orders', (request, response) => {
    try {
        const razorpayInstance = new Razorpay({
            key_id: '',
            key_secret: ''
        });

        const options = {
            amount: request.body.amount * 100,
            currency: 'INR',
            receipt: crypto.randomBytes(10).toString('hex')
        };

        razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                response.status(500).send('Order creation failed..')
            };
            response.status(200).json({data: order});
        })
    } catch (error) {
        console.log(error);
        response.status(500).send('Internal Server Error.')
    }
});

app.post('/api/payment/verify', (request, response) => {
    try {
        const {razorpay_payment_id, razorpay_order_id, razorpay_signature} = request.body;

		const sign = razorpay_order_id + "|" + razorpay_payment_id;

		const expectedSign = crypto
			.createHmac("sha256", 'fK1EMadZud4SPRYvavHcqsmx') //secret key
			.update(sign.toString())
			.digest("hex");
    
        if (expectedSign === razorpay_signature) {
            return response.status(200).send("Success..");
        } else {
            return response.status(400).send("Failure..");
        }
    } catch (error) {
        console.log(error);
        return response.status(500).send("Server Error..");
    }

});


const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));