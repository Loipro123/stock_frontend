# Front-End Code Structure

## Overview

the purpose of this application is to show the stock analyst and keep track of the trading process
### Architecture

The applicatoin follows a monolithic model

## Folder Structure

Describe the organization of your React application's folders and key files.

### /src

- `/components`: Contains reusable React components.
- `/assets`: Images, fonts, and other static assets
- `/pages`: Top-level components representing different pages or views.
- `/utils`: Utility functions and helper modules.
- `/services`: API calls, utilities, and other services.
- `/redux` : Redux store, actions, and reducers.
|   |-- actions
|   |-- reducers
|   |-- store

## pages

### `Home`

- display the current stock market and information.

## Components

List and describe the major React components, their responsibilities, and interactions.

### `Nav`

- Displays the application header.
- Navigation links and user-related information.

### `Login`

- Allow user to log and sign up

### `Profile`

- Allow user to update there profile

## State Management

Explain how state is managed in your application.

- **Local State:** Used for component-specific state.
- **Context API:** For sharing global state among components.
- **Redux (Optional):** State management library for complex state needs.

## Routing

Document how routing is handled in your React application.

- `react-router-dom` used for declarative routing.
- Routes defined in `/src/routes.js`.

## Styling

Describe the styling approach, including any CSS preprocessors or styling libraries used.

- CSS Modules for local component styling.
- Global styles defined in `/styles`.

## External Libraries

List and briefly describe any external libraries or packages used in your React application.

- `axios`: HTTP client for making API requests.
- `react-query`: For managing asynchronous data fetching.
- `react-redux`: Official React bindings for Redux.

