

# Medication Tracker App

A React-based web application to help users track their medication schedules and receive timely reminders.

## Features

- **Add Medications**: Input name, dose, time, and frequency.
- **Track Doses**: Mark medications as taken, with real-time updates.
- **Reminders**: Browser notifications alert users when it's time to take medications.
- **Persistent Data**: All medication info is stored using `db.json` via JSON Server.

## Tech Stack

- **React**: Frontend framework for building the UI.
- **JSON Server**: Simulated backend using `db.json`.
- **Local Storage & API Fetch**: For syncing medication status.

## How It Works

1. Add medication details via the form.
2. The app tracks each medication's schedule and sends reminders.
3. Users can check off medications as taken, and the data is saved automatically.

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/medication-tracker.git
   ```
2. Navigate to the project folder:
   ```bash
   cd medication-tracker
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start JSON Server:
   ```bash
   json-server --watch db.json --port 3001
   ```
5. Start the React app:
   ```bash
   npm start
   ```

## Notes

- JSON Server must be running for the app to fetch and store data.
- Notifications require user permission and are supported in most modern browsers.

