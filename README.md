# Travel Blog Platform

A full-stack Node.js web application for sharing and exploring travel experiences, featuring user authentication, blog posts, country exploration, reactions (like/dislike), and search functionality.

## Features

- User registration and login with JWT and CSRF protection
- Create, edit, and delete travel blog posts
- Explore countries and view country details (flag, capital, currency)
- Like/dislike posts (with toggle and switch)
- Search posts by country or author with pagination
- User profile page listing personal posts
- Responsive, modern UI with EJS templates and custom CSS

## Project Structure

```
.
├── index.js                # Main Express server
├── package.json
├── .env
├── database.db             # SQLite database
├── config/                 # JWT and CSRF config
├── middleware/             # CSRF and JWT middleware
├── DAOs/                   # Data Access Objects for DB
├── Databases/              # DB connection/init
├── Services/               # Business logic
├── Utils/                  # Utilities (bcrypt, env, etc)
├── routes/                 # Express route handlers
├── public/                 # Static assets (CSS, JS)
└── views/                  # EJS templates
```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd AdvancedServerSide_Cw2
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env` or run:
     ```sh
     npm run generate-env
     ```
   - Edit `.env` as needed (see [`.env`](.env)).

4. **Start the server:**
   ```sh
   node index.js
   ```
   The server will run at [http://localhost:5005](http://localhost:5005).

### Database

- Uses SQLite (`database.db`).
- Tables are auto-created on first run (see [`Databases/SQLConn.js`](Databases/SQLConn.js)).

## Usage

- Visit `/signup` to register a new account.
- Log in at `/login`.
- Access `/home` to view and interact with posts.
- Create new posts at `/posts/new`.
- Edit/delete your posts from `/profile`.
- Explore countries at `/explore-country`.
- Search posts at `/search`.

## API Endpoints

- `/api/posts` - CRUD operations for posts
- `/api/posts/search` - Search posts by country or username
- `/api/countries` - List all countries (proxy to external API)
- `/api/countries/search` - Get details for a specific country

## Security

- JWT authentication for protected routes ([`middleware/jwtAuth.js`](middleware/jwtAuth.js))
- CSRF protection for all state-changing requests ([`middleware/csrf.js`](middleware/csrf.js))
- Passwords hashed with bcrypt ([`Utils/bcryptUtils.js`](Utils/bcryptUtils.js))

## Customization

- Edit EJS templates in [`views/`](views/)
- Modify styles in [`public/css/`](public/css/)
- Add new features via [`Services/`](Services/) and [`DAOs/`](DAOs/)

## License

MIT

---

**Author:** Joao Breno Baise Zaniboni
Project for Advanced Server Side Module @ University of Westminster
