# Discovery 2K25 - National Level Technical Festival

A modern, responsive website for Discovery 2K25, the National Level Technical Festival at ADCET, Ashta.

## About

Discovery 2K25 is a premier technical festival featuring 24+ competitions across various engineering departments. The event is scheduled for October 11, 2025, at ADCET, Ashta.

## Features

- Responsive design optimized for all devices
- Event registration system
- Department-wise competition listings
- Schedule and event details
- Contact information and venue details

## Technologies Used

This project is built with:

- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React** - Component-based UI library
- **shadcn/ui** - Modern UI components
- **Tailwind CSS** - Utility-first CSS framework

## Getting Started

To run this project locally:

```sh
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd discovery-2k25

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Payment and Registration Setup

The registration flow uses MongoDB Atlas for persistence and Razorpay in Test Mode for payments. Keep Razorpay secrets in the backend only. The frontend receives only the public `VITE_RAZORPAY_KEY_ID`.

### 1. Create the MongoDB Atlas database

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. In **Database Access**, create a database user and save its username and password.
3. In **Network Access**, add your current development IP address. For a temporary local test, `0.0.0.0/0` works but should not be used for production.
4. Select **Connect > Drivers**, choose Node.js, and copy the connection string.
5. Replace `<username>`, `<password>`, and `<cluster>` in the string. The application uses the `discovery_adcet` database automatically.

Create `backend/.env` from `backend/.env.example`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/?retryWrites=true&w=majority
MONGOOSE_DEBUG=false
```

URL-encode special characters in the database username or password. For example, `@` becomes `%40`.

### 2. Create Razorpay Test Mode credentials

1. Create or sign in to a [Razorpay](https://dashboard.razorpay.com/) account.
2. Switch the dashboard to **Test Mode**.
3. Open **Account & Settings > API Keys**, generate a key, and copy the **Key ID** and **Key Secret**.
4. In **Settings > Webhooks**, create a webhook pointing to:
	- Local testing: a public HTTPS tunnel URL, for example `https://<tunnel-host>/api/razorpay/webhook`
	- Deployment: `https://<your-backend-domain>/api/razorpay/webhook`
5. Set a webhook secret of your own, save it, and enable `payment.captured`, `payment.failed`, `payment.authorized`, and `order.paid`.

Create `frontend/.env`:

```env
VITE_RAZORPAY_KEY_ID=rzp_test_...
```

Add the matching private values to `backend/.env`:

```env
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=<test-mode-key-secret>
RAZORPAY_WEBHOOK_SECRET=<the-webhook-secret-you-created>
```

Do not put `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, or `MONGO_URI` in the frontend environment or commit either `.env` file.

### 3. Run the application locally

Use three terminals from the repository root:

```sh
# Terminal 1: backend
cd backend
npm install
npm run dev

# Terminal 2: frontend
cd frontend
npm install
npm run dev

# Optional Terminal 3: expose the backend webhook for Razorpay
ngrok http 3000
```

Open `http://localhost:8080`. The Vite proxy forwards `/api` requests to `http://localhost:3000`.

### 4. Verify the test flow

1. Open a registration form and submit the details.
2. Confirm that `/api/order` returns a Razorpay test order.
3. Complete Checkout with Razorpay's test payment details shown in the Test Mode documentation. Never use real card details in Test Mode.
4. Confirm the browser calls `/api/register` and receives a registration ID.
5. Check the `registrations` and `payments` collections in Atlas.
6. In the Razorpay dashboard, check **Webhooks > Recent Deliveries** and confirm the webhook returns HTTP 200.

The backend verifies the Checkout signature using `RAZORPAY_KEY_SECRET`. The webhook is verified independently using `RAZORPAY_WEBHOOK_SECRET`, so both values must be configured for payment recovery when the browser closes after payment.

## Project Structure

```
├── docs/                # Documentation files
├── public/              # Static assets
│   ├── event-images/    # Event-related images
│   ├── docs/           # PDF documents
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/         # shadcn/ui components
│   │   ├── HeroSection.tsx
│   │   ├── EventsList.tsx
│   │   └── ...
│   ├── data/           # Static data files
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── pages/          # Page components
│   └── utils/          # Helper utilities
└── backend/            # Backend API server
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Contact

For questions about Discovery 2K25, please contact ADCET, Ashta.

## License

This project is open source and available under the MIT License.
