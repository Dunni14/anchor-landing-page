# Anchor Bible Meditation App - Landing Page

A beautiful, responsive landing page for the Anchor Bible Meditation App waitlist.

## Features

- 📧 Email waitlist signup with Neon PostgreSQL database
- 🔄 Real-time form validation
- 📱 Mobile-responsive design
- ⚡ Netlify Functions for serverless backend
- 🎨 Modern, clean UI with smooth animations

## Setup Instructions

### 1. Database Setup (Neon)

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Copy your connection string
4. Run the SQL schema from `database/schema.sql` in your Neon SQL editor

### 2. Netlify Deployment

1. Connect your GitHub repo to Netlify
2. Set environment variable in Netlify dashboard:
   - `NETLIFY_DATABASE_URL` = your Neon connection string
3. Deploy!

### 3. Local Development

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your Neon database URL

# Start local development server
npm run dev
```

## Project Structure

```
├── index.html              # Main landing page
├── styles.css              # Styling
├── script.js               # Frontend JavaScript
├── netlify/
│   └── functions/
│       └── signup.js       # Serverless function for email signup
├── database/
│   └── schema.sql          # Database schema
├── netlify.toml            # Netlify configuration
└── package.json            # Dependencies
```

## Environment Variables

- `NETLIFY_DATABASE_URL` - Neon PostgreSQL connection string

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Netlify Functions (Node.js)
- **Database**: Neon PostgreSQL
- **Hosting**: Netlify
- **Fonts**: Google Fonts (Inter)
- **Icons**: Font Awesome

## API Endpoints

- `POST /.netlify/functions/signup` - Add email to waitlist

## License

MIT License - see LICENSE file for details