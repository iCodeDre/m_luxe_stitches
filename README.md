# M.luxe Stitches – Fullstack E-commerce Store
A modern e-commerce web app for browsing, ordering, and managing clothing samples specifically built for online tailors. Built with Next.js, PostgreSQL, featuring a clean UI, responsive design, secure checkout, account management and admin operations.

# Core Principle
This project was built for a friend's brand(M.luxe Stitches) whom is a tailor and has built her business online, specifically on whatsapp. This project solves the issue of unlimited posting of her design samples on her whatsapp status which results in endless status which limits the number of patient viewers(it is not everyone that will be patient enough to sit through endless photos on your whatsapp status). This issue resulted in fewer views on her design samples. This project is a fullstack E-commerce store, where she can upload all her catalogues with estimated prices all in one place. Users can easily access this web app, browse through her catalogues and place an order. The order flow was built with no payment systems; when a user places an order, the admin will recieve this order which comes with the users details like email and whatsapp phone number. The admin can then confrim this order by approving or denying the order items, and then easily contact the user through their provided whatsapp phone number or email for further discussions like the clothing fabric, her measurements etc. 

## Features
- 🔑 Basic auth
- 🛍️ Browse products by category
- 🔍 Search and filter items
- 🛒 Shopping cart with quantity updates
- 💳 Checkout flow with order confirmation
- 🖼️ Image upload via Cloudinary
- 🔑 Admin dashboard for adding/editing products
- 📱 Fully responsive design

## Tech Stack
**Frontend:** Next.js, React, CSS Modules, Motion  
**Backend:** Next.js, PostgreSQL 
**Other:** Cloudinary, Lucia Auth, Vercel Deployment

## Installation
1. Clone the repo
2: Install dependencies 'npm install'
3: Create a .env.local file
     DATABASE_URL=your_database_url
     NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
     NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=...

## Run Development Server
npm run dev

## Future Improvements
- Integrate email confirmation or google OAuth
- Improve SEO and page speed


