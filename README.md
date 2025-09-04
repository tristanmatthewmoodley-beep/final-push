# MseriesAutoOnlineSpares

A modern, responsive e-commerce website for selling car parts and spares, built with React, Vite, and Tailwind CSS.

## Features

- **Modern Design**: Clean black and white theme optimized for automotive industry
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Product Catalog**: Browse and search through car parts with filtering options
- **Shopping Cart**: Add products to cart (frontend implementation ready)
- **Contact Forms**: Customer inquiry and support forms
- **Fast Performance**: Built with Vite for lightning-fast development and builds

## Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Fonts**: Inter (Google Fonts)

## Getting Started

### Prerequisites

Make sure you have Node.js installed on your system. You can download it from [nodejs.org](https://nodejs.org/).

### Installation

1. Navigate to the project directory:
   ```bash
   cd MseriesAutoOnlineSpares
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
MseriesAutoOnlineSpares/
├── public/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── ProductCard.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── About.jsx
│   │   └── Contact.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Customization

### Adding Your Logo

Replace the placeholder logo in the Header component:

1. Add your logo image to the `public` folder
2. Update the logo section in `src/components/Header.jsx`:

```jsx
<div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
  <img src="/your-logo.png" alt="MseriesAutoOnlineSpares" className="w-8 h-8" />
</div>
```

### Color Scheme

The website uses a custom color palette defined in `tailwind.config.js`:

- `car-black`: #0a0a0a (Primary background)
- `car-gray`: #1a1a1a (Secondary background)
- `car-light-gray`: #2a2a2a (Borders and accents)
- `car-accent`: #f5f5f5 (Light accents)

### Adding Products

Products are currently stored as static data in the components. To add more products:

1. Update the `products` array in `src/pages/Products.jsx`
2. Update the `featuredProducts` array in `src/pages/Home.jsx`

### Adding Product Images

Replace the placeholder product images:

1. Add product images to the `public` folder
2. Update the `image` property in the product objects
3. Replace the placeholder div in `ProductCard.jsx` with actual images

## Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder, ready for deployment to any static hosting service.

### Deployment Options

- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder or connect via Git
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **Traditional Hosting**: Upload the `dist` folder contents to your web server

## Future Enhancements

- Shopping cart functionality with state management
- User authentication and accounts
- Payment integration (Stripe, PayPal)
- Product reviews and ratings
- Inventory management
- Order tracking
- Admin dashboard
- Search with autocomplete
- Product comparison feature
- Wishlist functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact us at info@mseriesauto.com or visit our contact page.
