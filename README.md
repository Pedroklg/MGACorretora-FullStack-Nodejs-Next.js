---

# MGACorretora FullStack Project

Welcome to the MGACorretora FullStack project, a responsive web application built with Node.js, Next.js, PostgreSQL, and Tailwind CSS. This project includes an admin login and dashboard functionalities for managing "Empresas e Imoveis" (Companies and Properties) with image uploads.

## Features

- **Admin Dashboard**: Secure login and dashboard for managing companies and properties.
- **CRUD Operations**: Create, read, update, and delete operations for companies and properties.
- **Image Uploads**: Ability to upload images for properties.
- **Responsive Design**: Mobile-friendly layout ensuring compatibility across devices.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Next.js**: React framework for server-rendered applications.
- **PostgreSQL**: Robust relational database management system.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **React**: JavaScript library for building user interfaces.

## Current Website

Visit the temporarily hosted website at [https://mga-b9a93fb117c5.herokuapp.com/](https://mga-b9a93fb117c5.herokuapp.com/) to see the project in action.

## Getting Started

### Prerequisites

- Node.js (version >= 12.x)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Pedroklg/MGACorretora-FullStack-Nodejs-Next.js.git
   cd MGACorretora-FullStack-Nodejs-Next.js
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

### Configuration

1. Set up your environment variables in a `.env` file in the root directory:

   ```plaintext
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   SESSION_SECRET="your_session_secret"
   ```

   Adjust the values based on your local PostgreSQL setup.

### Database Setup

1. Initialize and migrate the database schema using Sequelize:

   ```bash
   npx sequelize-cli db:migrate
   ```

   This command applies any pending migrations to the database.

### Usage

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) in your web browser to view the application.
