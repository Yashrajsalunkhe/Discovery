# Discovery 2K25 - Event Registration Website

Official website for Discovery 2K25 - Central Technical Event of Annasaheb Dange College of Engineering and Technology (ADCET) with integrated Razorpay payment gateway.

## Features

- 🎯 Event registration with team support
- 💳 Secure payment processing with Razorpay
- 📧 Automatic email confirmation
- 📱 Responsive design with dark mode
- ⚡ Built with React + Vite
- 🎨 Styled with Tailwind CSS

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your Razorpay credentials:
```env
# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Email Configuration (Optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Server Configuration
PORT=5000
```

### 3. Get Razorpay Credentials

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to Settings → API Keys
3. Generate Test API Keys for development
4. Copy the Key ID and Key Secret to your `.env` file

### 4. Email Configuration (Optional)

If you want to send confirmation emails:

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Use the app password in the `EMAIL_PASSWORD` field

## Running the Application

### Development Mode

Run both frontend and backend together:
```bash
npm run dev:full
```

Or run them separately:

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
Discovery/
├── src/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── pages/
│   │   └── Registration.jsx    # Main registration form
│   └── utils/
├── api/                        # Backend API endpoints (legacy)
├── server.js                   # Express server with API routes
├── public/
└── ...
```

## API Endpoints

- `POST /api/order` - Create Razorpay order
- `POST /api/register` - Verify payment and complete registration
- `GET /api/health` - Health check

## Payment Flow

1. User fills registration form
2. Clicks "Pay & Register"
3. Razorpay order is created
4. Razorpay checkout modal opens
5. User completes payment
6. Payment is verified with signature
7. Registration is saved
8. Confirmation email is sent
9. Success page is displayed

## Testing

### Test Payments

Use these Razorpay test credentials for development:

**Test Cards:**
- **Visa:** 4111 1111 1111 1111
- **Mastercard:** 5555 5555 5555 4444
- **Rupay:** 6523 5555 5555 5554

**Test UPI:** success@razorpay
**CVV:** Any 3 digits
**Expiry:** Any future date

### Test API

```bash
# Test order creation
curl -X POST http://localhost:5000/api/order \
  -H "Content-Type: application/json" \
  -d '{"amount": 50000, "currency": "INR"}'

# Health check
curl http://localhost:5000/api/health
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_RAZORPAY_KEY_ID` | Razorpay Key ID (Frontend) | Yes |
| `RAZORPAY_KEY_ID` | Razorpay Key ID (Backend) | Yes |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret | Yes |
| `EMAIL_USER` | Gmail address for notifications | No |
| `EMAIL_PASSWORD` | Gmail app password | No |
| `PORT` | Server port | No (default: 5000) |

## Troubleshooting

### Common Issues

1. **Payment gateway not opening:**
   - Check if Razorpay script is loaded in `index.html`
   - Verify `VITE_RAZORPAY_KEY_ID` in `.env`

2. **API calls failing:**
   - Ensure backend server is running on port 5000
   - Check Vite proxy configuration in `vite.config.js`

3. **Email not sending:**
   - Verify Gmail app password is correct
   - Check Gmail security settings

### Debug Mode

Add this to your `.env` for detailed logging:
```env
NODE_ENV=development
```

## Security Notes

- Never commit `.env` file to version control
- Use test credentials for development
- Switch to live credentials only for production
- Validate all payment signatures on the backend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test payment flow thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For technical support, contact:
- Email: discovery2k25@adcet.in
- Phone: +91 9657028810

---

**Discovery 2K25** | Annasaheb Dange College of Engineering and Technology