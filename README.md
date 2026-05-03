# Strategy Map Web

A powerful tool for building and visualizing Business Model Canvases and Strategy Maps.

## Deployment on Vercel

1.  Push this code to your GitHub repository: `https://github.com/davidyoungrs/strategymapweb.git`
2.  Connect your repository to Vercel.
3.  Add the following Environment Variables in the Vercel project settings:

| Variable | Description |
| :--- | :--- |
| `VITE_FIREBASE_API_KEY` | Your Firebase API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Your Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | Your Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Your Firebase Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your Firebase Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | Your Firebase App ID |
| `VITE_FIREBASE_DATABASE_ID` | Your Firestore Database ID (e.g., `(default)`) |

## Local Development

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`
4.  Open `http://localhost:3000` in your browser.

## Features

- **Business Model Canvas**: Interactive grid for mapping your business model.
- **Strategy Map**: Visualize strategic objectives across Financial, Customer, Internal, and Learning perspectives.
- **Real-time Sync**: Powered by Firebase Firestore.
- **Export to PDF**: Save your canvases as PDF documents.
- **Dark Mode**: Toggle between light and dark themes.
