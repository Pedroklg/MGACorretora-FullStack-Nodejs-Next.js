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

- Node.js 22.x
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

1. Copy `.env.example` to `.env` (it is git-ignored) and fill in the values:

   | Variable | Required | Description |
   | --- | --- | --- |
   | `DATABASE_URL` | yes | PostgreSQL connection string |
   | `DATABASE_SSL` | no | `false` to disable TLS (local database). Default: TLS on |
   | `DATABASE_CA_CERT` | no | CA certificate (PEM) to verify the database TLS certificate |
   | `SESSION_PASSWORD` | yes | Secret with **at least 32 characters** used to encrypt the admin session cookie |
   | `NEXT_PUBLIC_SITE_URL` | yes in production | Public site URL, e.g. `https://www.mgacorretora.com.br`. Used in canonical URLs, sitemap, robots.txt, llms.txt and Open Graph. Set it before `npm run build` |
   | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | yes | Image storage |
   | `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `RECIPIENT_EMAIL` | yes | Contact form e-mails |
   | `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY` | recommended | reCAPTCHA v3 keys. When set, the public forms require a valid token |
   | `RECAPTCHA_MIN_SCORE` | no | Minimum reCAPTCHA score (default `0.5`) |

   Generate a session secret with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

### Database Setup

The schema is described in [`database_schema.md`](database_schema.md). Admin passwords are stored as bcrypt hashes.

### Security and SEO notes

- Production builds use webpack (`next build --webpack`) so the strict Content-Security-Policy in `next.config.mjs` works without `'unsafe-inline'` scripts.
- Public listing pages (`/`, `/empresas`, `/imoveis`, `/anuncio/<id>-<slug>`) are server-rendered with title, description, canonical, Open Graph and JSON-LD.
- `/robots.txt`, `/sitemap.xml` and `/llms.txt` are generated from the database.
- Rate limiting is in memory, per instance. If the app runs on more than one dyno, move it to a shared store (e.g. Redis).

### Usage

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) in your web browser to view the application.
