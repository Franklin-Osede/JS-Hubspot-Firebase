 **JS-Hubspot-Firebase**

This project synchronizes users from **HubSpot** to **Firebase Firestore** using **Node.js**. It implements batch synchronization to transfer contacts from HubSpot to a Firebase collection efficiently and scalably.

---

## **Features**
- Batch synchronization of contacts from HubSpot to Firebase.
- Pagination handling for processing large volumes of contacts.
- Environment configuration using `.env` files for managing sensitive keys and settings.
- Designed to run as a **Cloud Function** in Firebase.

---

## **Prerequisites**
1. **Node.js** (v18 or later).
2. A **Firebase** account with a configured project.
3. A valid **HubSpot API Key**.
4. Firebase CLI installed:
   ```bash
   npm install -g firebase-tools
Installation
Clone this repository:

git clone https://github.com/your-username/JS-Hubspot-Firebase.git
cd JS-Hubspot-Firebase
Install dependencies:

npm install
Initialize Firebase in your project:



Create a .env file in the root directory:

Add the following content to .env:

HUBSPOT_API_KEY=your-hubspot-api-key
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="your-private-key"

Project Structure

JS-Hubspot-Firebase/
├── src/
│   ├── config/
│   │   ├── firebase.js        # Firebase configuration
│   │   ├── hubspot.js         # HubSpot client configuration
│   ├── services/
│   │   ├── firebase.js        # Firebase interaction logic
│   │   ├── hubspot.js         # HubSpot interaction logic
│   ├── sync/
│   │   ├── bulkSync.js        # Batch synchronization
│   │   ├── singleSync.js      # Single user synchronization
│   ├── utils/
│   │   ├── logger.js          # Logging utility
│   └── index.js               # Entry point for Firebase Functions
├── .env                       # Environment variables
├── .gitignore                 # Ignored files and folders
├── firebase.json              # Firebase configuration
├── .firebaserc                # Firebase project associations
├── package.json               # Project dependencies
└── README.md                  # Project documentation
Usage
Run Locally
Start the Firebase emulators:


firebase emulators:start
Open your browser and test the endpoint:


http://localhost:5001/<YOUR_PROJECT_ID>/us-central1/syncUsers
Deploy to Firebase
Deploy the functions to Firebase:


firebase deploy --only functions
After deployment, the endpoint will be available. Check the logs for the deployment URL.

Endpoints
Batch Synchronization
Synchronize contacts from HubSpot to Firebase Firestore:


GET /syncUsers
Environment Variables
The project uses the following environment variables:

Variable	Description
HUBSPOT_API_KEY	API key to authenticate with HubSpot.
FIREBASE_PROJECT_ID	Firebase project ID.
FIREBASE_CLIENT_EMAIL	Firebase client email.
FIREBASE_PRIVATE_KEY	Private key for Firebase authentication.

Dependencies
Node.js
Firebase Admin SDK
Firebase Functions
HubSpot API Client
dotenv

Contribution
Fork the repository.
Create a new branch:

git checkout -b feature-branch
Commit your changes:

git commit -m "Add new feature"
Push to your branch:

git push origin feature-branch
Open a pull request.

License
This project is licensed under the MIT License.
