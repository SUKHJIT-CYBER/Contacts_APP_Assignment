# Contacts_APP_Assignment

This is a React Native application  developed by SUKHJIT SINGH that allows users to View  their contacts and Can also import contacts from google . It displays the user's Google profile information, such as name, email, and profile picture. It also fetches the user's Google contacts and phone contacts, and provides a search functionality to filter and display the contacts. Ihave some development experience in Flutter but I was begineer to React-native . In the alloted time , I go through online tutorials and documentations available on the internet to learn react-native and implement this .
Due to Some dependecy errors , I was not able to export my expo build to android apk but I am configuring it and will update it here [APK](https://drive.google.com/drive/folders/1n7ugC37-YB11yL-gDwH4FxUbsTdufYUc?usp=sharing)

## Components

The app consists of the following components:

1. **App**: The main component that renders the entire application.

## Libraries and Plugins Used

The following libraries and plugins were used in this application:

- **React**: JavaScript library for building user interfaces.
- **React Native**: Framework for building native mobile apps using React.
- **Expo**: Development platform for building React Native apps.
- **expo-web-browser**: Expo module for handling web browser functionality.
- **expo-auth-session**: Expo module for handling authentication sessions.
- **expo-contacts**: Expo module for accessing and managing contacts.
- **react-native**: The core React Native library.
- 
## Instructions to Clone and Run Locally

To clone and run this application locally, follow these steps:

1. Install Node.js: Make sure you have Node.js installed on your machine. You can download it from the official website: [https://nodejs.org](https://nodejs.org)

2. Install Expo CLI: Open your terminal or command prompt and run the following command to install Expo CLI globally:

          npm install -g expo-cli


3. Clone the repository: Use Git to clone the repository to your local machine:

         git clone <repository-url>

4. Navigate to the project directory: Use the `cd` command to navigate to the project directory:

         cd <project-directory>

5. Install dependencies: Run the following command to install the project dependencies:

         npm install

6. Set up Google API credentials: You need to create a Google API project and obtain API credentials to access Google services. Follow these steps:

- Go to the [Google Developers Console](https://console.developers.google.com) and create a new project.
- Enable the "People API" and "Contacts API" for your project.
- Create OAuth 2.0 credentials (Client ID and Client Secret) for your project.
- Configure the authorized JavaScript origins and redirect URIs for your credentials.
- Replace the `expoClientId`, `androidClientId`, and `webClientId` values in the code with your own credentials.

7. Start the app: Run the following command to start the app in development mode:

         expo start
         For web - w
         For android - a
         For ios - 
         
8. Launch the app: Use the Expo Client app on your mobile device or an Android/iOS emulator to scan the QR code displayed in the terminal or command prompt. This will launch the app on your device/emulator.


9. Test the app: Once the app is running, you can test the functionality by signing in with your Google account and importing your contacts.

![image](https://github.com/SUKHJIT-CYBER/Contacts_APP/assets/78156807/d1b90c15-3986-49e3-894a-a64ad835b352)

![image](https://github.com/SUKHJIT-CYBER/Contacts_APP/assets/78156807/006c4050-9e96-4ae3-a1f3-a62886161c57)

![image](https://github.com/SUKHJIT-CYBER/Contacts_APP_Assignment/assets/78156807/c847a15b-88e6-4c30-ac4a-1a7dd1cd1dcc)

![image](https://github.com/SUKHJIT-CYBER/Contacts_APP_Assignment/assets/78156807/37069b6a-5861-4e09-9826-6fbe66fdcd52)

![image](https://github.com/SUKHJIT-CYBER/Contacts_APP_Assignment/assets/78156807/5a47984b-c889-4465-9e44-7e1f36d1d87b)


