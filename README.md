# Sweet Symphony - Indian Sweet Shop

A full-stack web application for an Indian sweet shop, built with Node.js, Express, MongoDB, and React.

## Features

- **User Authentication**: Register and login with role-based access (user/admin)
- **Sweet Management**: Browse, search, and filter sweets by category and price
- **Shopping Cart**: Add sweets to cart and manage quantities
- **Wishlist**: Save favorite sweets for later
- **Admin Dashboard**: Manage inventory, add new sweets, restock items
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- CORS, Helmet for security

### Frontend
- React 18
- React Router for navigation
- Bootstrap 5 for styling
- Axios for API calls
- Context API for state management

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/sweet-symphony.git
   cd sweet-symphony
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the `backend` directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/sweetshop
   JWT_SECRET=your_jwt_secret_here
   NODE_ENV=development
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system.

6. **Run the backend**
   ```bash
   cd backend
   npm run dev
   ```

7. **Run the frontend** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```

8. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in the terminal)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Sweets
- `GET /api/sweets` - Get all sweets
- `POST /api/sweets` - Create new sweet (admin only)
- `PUT /api/sweets/:id` - Update sweet (admin only)
- `DELETE /api/sweets/:id` - Delete sweet (admin only)
- `POST /api/sweets/:id/restock` - Restock sweet (admin only)
- `GET /api/sweets/search` - Search sweets with filters

### User
- `POST /api/user/purchase` - Purchase sweets

## Project Structure

```
sweetshop/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── tests/
│   │   └── utils/
│   ├── package.json
│   └── README.md
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Testing

Run backend tests:
```bash
cd backend
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## AI Usage in Development

This project was developed with the assistance of GitHub Copilot to enhance productivity and code quality:

- **Code Generation**: AI-powered code completion and generation for React components, Express routes, and MongoDB models
- **Bug Fixing**: AI-assisted debugging and error resolution across frontend and backend
- **Documentation**: AI-generated comprehensive README and code comments
- **UI/UX Design**: AI suggestions for responsive design patterns and user experience improvements
- **Testing**: AI-assisted test case generation and validation
- **Code Review**: AI-powered code analysis for best practices and potential improvements

GitHub Copilot helped accelerate development while maintaining code quality and following modern web development standards.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons from Lucide React
- UI components styled with Bootstrap
- Emoji images for sweets using custom utility
- AI assistance from GitHub Copilot for development and documentation

## Snippets
<img width="1896" height="908" alt="Screenshot 2025-12-14 213111" src="https://github.com/user-attachments/assets/334a62ec-a141-4700-bce6-a7f888adc807" />
