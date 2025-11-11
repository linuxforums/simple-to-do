# To-Do List Application

A modern, full-featured To-Do List application built with Node.js, Express, SQLite, and vanilla JavaScript. Features a beautiful, responsive UI with smooth animations and a complete CRUD interface.

## Features

- ✅ Add new tasks
- ✏️ Edit existing tasks
- 🗑️ Delete tasks
- ✓ Mark tasks as complete/incomplete
- 📊 Real-time statistics (Total, Completed, Pending)
- 🔍 Filter tasks (All, Pending, Completed)
- 💾 Persistent storage with SQLite database
- 🎨 Modern, responsive UI with gradient design
- ⚡ Smooth animations and transitions

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone or download this repository

2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

The application will automatically create a SQLite database file (`todos.db`) in the project root on first run.

## Project Structure

```
repo/
├── server.js              # Express server and API routes
├── package.json           # Dependencies and scripts
├── todos.db              # SQLite database (created automatically)
├── public/
│   ├── index.html        # Main HTML file
│   ├── css/
│   │   └── style.css    # Styling and animations
│   └── js/
│       └── app.js        # Frontend JavaScript logic
└── README.md             # This file
```

## API Endpoints

- `GET /api/todos` - Get all todos
- `GET /api/todos/:id` - Get a single todo
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Custom CSS with gradients and animations
- **Fonts**: Google Fonts (Poppins)

## Features in Detail

### Task Management
- Add tasks with a simple input field
- Edit tasks by clicking the edit button
- Delete tasks with confirmation
- Toggle completion status with checkboxes

### Statistics Dashboard
- View total number of tasks
- Track completed tasks
- Monitor pending tasks

### Filtering
- View all tasks
- Filter by pending tasks only
- Filter by completed tasks only

### User Experience
- Responsive design for mobile and desktop
- Smooth animations and transitions
- Toast notifications for user feedback
- Empty state messages
- Modal dialogs for editing

## Customization

You can customize the application by modifying:

- **Colors**: Edit CSS variables in `public/css/style.css`
- **Port**: Change `PORT` in `server.js` (default: 3000)
- **Database**: The SQLite database file is created automatically as `todos.db`

## License

MIT License - feel free to use this project for learning or as a starting point for your own applications.

