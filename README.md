# M.luxe Stitches – Fullstack E-commerce Store
A modern e-commerce web app for browsing, ordering, and managing clothing samples specifically built for online tailors. Built with Next.js, PostgreSQL, featuring a clean UI, responsive design, secure checkout, account management and admin operations.

# Core Principle
This project was developed for M.Luxe Stitches, a tailoring brand that primarily operates through WhatsApp.

Previously, the brand showcased design samples by posting numerous images on WhatsApp status. However, this approach often resulted in excessively long status updates, causing viewer fatigue and ultimately reducing engagement. 
 
To address this, the project delivers a full-stack e-commerce platform where the admin can upload the complete catalogue with estimated prices in one centralized location.
Customers can easily browse the catalogue, select designs, and place orders directly through the site.

The ordering process is intentionally built without integrated online payments. Instead:
When an order is placed, the admin receives the order details, including the customer’s email and WhatsApp phone number.

The admin can approve or decline items in the order.

Once approved, the admin can quickly contact the customer via WhatsApp or email to finalize details such as fabric selection, measurements, and other custom requirements.

This streamlined approach enhances the brand’s online presence, improves accessibility for customers, and creates a smoother, more efficient ordering experience.

## 🚀 Demo
**Live Site:** https://m-luxe-stitches.vercel.app/

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
2. Install dependencies 'npm install'
3. Create a .env.local file
     - DATABASE_URL=your_database_url
     - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
     - NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=...

## Run Development Server
npm run dev

## What I Learned
Working on this project was a defining moment in my web development journey. It was my first real-world capstone project, started immediately after completing my Next.js course on Udemy, and it pushed me far beyond simply following tutorials.

I applied everything I had learned up to that point - HTML, CSS, JavaScript, React, Next.js, PostgreSQL - and quickly realized that building a complete application involves more than just writing code. It’s about integrating multiple technologies and ensuring they work seamlessly together to deliver a smooth experience for the end user.

This project was also my first time:

- Designing a web app with the client’s experience as the core priority.

- Integrating Lucia Auth for authentication and truly understanding how cookies work differently between localhost and secure HTTPS environments.

- Hosting an app of any sort by hosting this Next.js app on Vercel and managing a PostgreSQL database hosted on Neon.

- Deploying a fully functional app for real-world use, which taught me the importance of environment variables, deployment pipelines, and security best practices.

One of my biggest takeaways is that web development is not just about knowing how to code - it’s about solving real problems by combining tools, frameworks, and services in creative ways. Hosting and deployment, in particular, showed me that the ability to connect the dots between technologies is what turns an idea into something people can actually use.

Above all, this project gave me the confidence that I can take an idea from concept to a live, working product - and that’s an empowering feeling I’ll carry into every project I build from here on. I cannotn wait to turn my next idea into reality. ILoveCoding💕


## Future Improvements
- Integrate email confirmation or google OAuth
- Improve SEO and page speed


