# Documentation for Chatly Application

## Overview
This documentation explains the functionality of the provided JavaScript code for the Chatly application. Chatly is a real-time chat application built with Electron.js and Node.js, which includes features like contact management, messaging, notifications, and user status checking.

---

## Code Structure and Key Components

### Variables and Constants
- **`modal`, `closeModal`, `addContactModalBtn`, etc.**: References to HTML elements in the DOM for managing UI components like modals, buttons, and containers.
- **`serverURL`**: Base URL for backend API requests (`http://localhost:3000`).
- **`selectedContactId`**: Tracks the currently selected contact for messaging.
- **`myData`**: Stores user information and contacts.
- **`contactMap`**: A `Map` to associate contact IDs with their respective DOM elements.

### Event Listeners
- **`electronAPI.onReceiveData`**: Updates user data (`myData`), displays user information, loads notifications, and contacts when new data is received from the backend.
- **`electronAPI.onRecieveMessage`**: Handles incoming messages, updates the UI, and notifies users of unread messages.
- **`electronAPI.onRecieveNotification`**: Adds incoming notifications to the user interface.
- **`contactIdInput.addEventListener('input')`**: Validates the contact ID entered in the modal input field.
- **`addContactModalBtn.addEventListener('click')`**: Sends a contact request notification.
- **`sendMessageBtn.addEventListener('click')` and `messageInputField.addEventListener('keypress')`**: Sends messages when the "Send" button is clicked or the Enter key is pressed.

### Functions
#### Display Functions
- **`displayInfo(data)`**: Displays user information on the screen.
- **`loadContacts(contacts)`**: Renders the contact list in the UI.
- **`showMessages(messages)`**: Displays chat messages with a specific contact.
- **`addNotification(notification)`**: Adds a notification element to the notifications container.
- **`loadNotifications(notifications)`**: Loads all notifications into the UI.

#### Utility Functions
- **`checkStatus(id, callback)`**: Fetches and updates the online/offline status of a user by ID.
- **`makeContactElement(contact)`**: Creates a DOM element for a contact with details like name, status, and messages.
- **`makeMessageElement(message)`**: Creates a DOM element for an individual message.
- **`addMessage(data, isFromMe, addToMessageScreen)`**: Adds a message to the contact's message list and optionally displays it in the chat screen.
- **`showInfo(text, color, time)`**: Displays temporary informational messages on the screen.
- **`addUserToContacts(user)`**: Adds a user to the contact list and updates the DOM.
- **`removeNotification(notification, notificationElement)`**: Removes a notification from the UI and `myData`.
- **`makeNotificationElement(notification)`**: Creates a DOM element for a notification with associated actions.
- **`areObjectsEqual(obj1, obj2)`**: Compares two objects for equality.

#### API Interaction
- **`sendNotification(type, sender, receiverId, status)`**: Sends a notification to a specific user via the backend API.

### Modal and UI Management
- **`modal.style.display`**: Shows or hides the modal.
- **`window.onclick`**: Closes the modal when clicked outside of it.

### Message and Contact Management
- **`addContactHandler()`**: Placeholder for adding contacts (currently unused).
- **`closeMessageScreen()`**: Closes the chat window and returns to the user info screen.

---

## Workflow
1. **Initialization**: Event listeners are set up, and `electronAPI` starts listening for incoming data, messages, and notifications.
2. **User Data Loading**: On receiving user data, the app displays user info, loads contacts, and initializes notifications.
3. **Messaging**: Users can send and receive messages. New messages are displayed in real time, with unread message indicators for inactive chats.
4. **Contacts Management**: Users can add contacts by entering a valid contact ID and sending a request.
5. **Notifications**: Notifications inform users about incoming friend requests and their responses.
6. **UI Updates**: Dynamic updates to DOM elements ensure real-time responsiveness to user actions and backend events.

---

## Error Handling
- **API Requests**: Handles errors in API requests and JSON parsing by logging them and providing fallback responses.
- **Validation**: Ensures only valid IDs are entered for adding contacts.

---

## Future Considerations
- **Error Messages**: Enhance error messages for better user understanding.
- **Code Modularity**: Break down large functions into smaller, reusable modules for improved readability and maintainability.
- **Testing**: Add unit tests for key functionalities to ensure robustness.

