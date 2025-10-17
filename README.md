# Productive Pomodoro

Productive Pomodoro is a simple Pomodoro timer app to help structure focused work sessions with structured breaks that provide other personal value. It provides configurable session lengths, short/long breaks, and a session history.

## Features

- Start/pause/reset Pomodoro sessions
- Configurable work/break durations
- Light/Dark theme
- Drag and Drop lists

## Prerequisites

- Node.js 16+ and npm (or yarn)

## Quick start (local)

```bash
# clone
git clone https://github.com/your-org/productive_pomodoro.git
cd productive_pomodoro

# copy environment example
cp .env.example .env

# install dependencies
npm install

# run in development mode (hot reload)
npm run dev
# app available at http://localhost:3000 by default
```

## Build and run (production)

```bash
npm run build
npm start
# or set PORT before start: PORT=4000 npm start
```

## Docker

```bash
docker build -t productive-pomodoro .
docker run --rm -p 3000:3000 --env-file .env productive-pomodoro
```

## Tests

```bash
npm test
```

## Configuration

Copy and edit `.env` (see `.env.example`) to configure PORT, API keys, database URL, etc.

## Contributing

Fork, create a branch, add tests, and open a pull request.

## License

See LICENSE in the repository.
