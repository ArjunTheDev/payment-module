import "./App.css";
import axios from 'axios';


function App() {
	const book = {
		name: "The Fault In Our Stars",
		author: "John Green",
		img: "https://images-na.ssl-images-amazon.com/images/I/817tHNcyAgL.jpg",
		price: 150,
	};
	const localBackendUrl = 'http://localhost:8080/api/payment';

	const handleBuyNow = async () => {
		const {data} = await axios.post(`${localBackendUrl}/orders`, {amount: book.price });
		initPayment(data);
	};

	const initPayment = (orderData) => {
		console.log(orderData);
		const options = {
			key: '',
			amount: orderData.data.amount,
			currency: orderData.data.currency,
			description: 'Test Payment method',
			order_id: orderData.data.id,
			handler: async (response) => {
				await axios.post(`${localBackendUrl}/verify`, response).then((response) => {
					if (response.status === 200) {
						alert('Payment Verified...');
					} else {
						alert('Payment Failed..');
					}
				})
			},
			theme: {
				color: '#3399cc'
			}
		};

		const razorpay_popup = new window.Razorpay(options);
		razorpay_popup.open();
	}

	return (
		<div className="App">
			<h3>Payment Integration in MERN Application</h3>
			<div className="book_container">
				<img src={book.img} alt="book_img" className="book_img" />
				<p className="book_name">{book.name}</p>
				<p className="book_author">By {book.author}</p>
				<p className="book_price">
					Price : <span>&#x20B9; {book.price}</span>
				</p>
				<button onClick={handleBuyNow} className="buy_btn">
					buy now
				</button>
			</div>
		</div>
	);
}

export default App;