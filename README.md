# Virtual Club

[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D%2018-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13%2B-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![EJS](https://img.shields.io/badge/EJS-Templates-90a93a)](https://ejs.co/)
[![Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?logo=render&logoColor=white)](https://virtual-club.onrender.com)

A role-based messaging web app built with **Node.js**, **Express**, **EJS**, and **PostgreSQL**.  
Users can **sign up**, **log in**, and **browse messages**. Depending on role permissions, users can **create messages**, and **admins** can **delete messages**. Spectators can also use **Join The Club** to upgrade access. The secret code is needed.

---

## Live Demo

- https://virtual-club.onrender.com

---

## Features

- Authentication with **Passport (Local Strategy)**
- Role-based access (**spectator / user / admin**)
- Create and view messages
- Admin-only message deletion
- EJS server-rendered pages + shared/global styling

---

## Getting Started

### Prerequisites

- **Node.js** (LTS recommended)
- **npm**
- **PostgreSQL** (required for local development)

### Installation

```bash
npm install
```

### Running the App

```bash
npm start
```

Then visit:

- http://localhost:3000

---

## Tech Stack

- **Backend:** Node.js, Express
- **Templating:** EJS
- **Database:** PostgreSQL
- **Auth:** Passport (Local Strategy)
- **Deployment:** Render

---

## Scripts

- `npm start` — starts the server
