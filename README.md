# This is a React Native implementation of a WhatsApp clone with the following features:

- Offline chat: Users can still send and receive messages even when they are offline. The messages will be queued and sent when the user comes back online.
- QR code web signin: Users can scan a QR code to sign in to the app on their web browser. This is a convenient way to sign in on a larger screen.
- Call: Users can make voice calls to each other.
- Video call: Users can make video calls to each other.
- Transfer money: Users can send and receive money from each other.
## Installation
```bash
npm install
```
Use code with caution.
content_copy
Running the app
```bash
npx react-native run-ios
```

## Features
### Offline chat
The app uses a local database to store messages. When a user is offline, messages are saved to the database and then sent to the server when the user comes back online.

### QR code web signin
The app uses a QR code to generate a unique identifier for each user. Users can scan this QR code with their phone to sign in to the app on their web browser.

### Call
The app uses WebRTC to make voice calls. WebRTC is a real-time communications protocol that allows for peer-to-peer communication over the web.

### Video call
The app uses WebRTC to make video calls. WebRTC is a real-time communications protocol that allows for peer-to-peer communication over the web.

### Transfer money
The app uses a payment gateway to transfer money between users. The payment gateway is responsible for processing the payments and ensuring that the funds are transferred securely.

### Development
The app is written in React Native and uses the following libraries:

- React Navigation for navigation
- Redux for state management
- WebRTC for voice and video calls
- A payment gateway for transferring money
## Contributing
We welcome contributions to this project. Please read the contributing guidelines before submitting a pull request.

