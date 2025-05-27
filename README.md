# How-to-show-the-data-in-cloud-database-of-Mongodb-Atlas-
How to show the data in cloud database of Mongo DB Atlas ?
Query Platform
Description
The Query Platform is a web-based application designed to manage and track queries and reports related to municipal performance. It provides an interactive interface for users to view, rate, and comment on query uploads and reports, with visual dashboards displaying metrics via circular progress meters. The application features two main tables for uploads and reports, a rating and commenting system, and a navigation link for municipal performance. The frontend is built with HTML, CSS, and JavaScript, and it is assumed to connect to a backend for data storage and retrieval (backend not provided in the code).
Features

Dashboard Metrics: Displays counts for queries, admin actions, and user interactions using animated circular progress meters.
Uploads Table: Lists query uploads with details such as ID, name, description, location, image, status, rating, comments, and action buttons.
Reports Table: Lists reports with details including ID, name, description, location, resolution status, action taken, rating, comments, and action buttons.
Rating and Commenting System: Allows users to rate items (1–5) and post comments, with a display of selected item details.
Responsive Design: Styled with a clean, modern UI using CSS for a user-friendly experience.
Navigation: Includes a navbar with a link to "Municipals Performance" (functionality depends on backend implementation).

Prerequisites
To run the Query Platform, ensure you have the following:

Web Browser: A modern browser like Chrome, Firefox, or Edge.
Web Server: A local or remote server to host the application (e.g., Node.js with http-server, Apache, or Nginx).
Backend Server (if applicable): A backend API (e.g., Node.js, Python Flask/Django, or PHP) to handle data storage, retrieval, and interactions (not provided in the code).
Database (if applicable): A database like MySQL, PostgreSQL, or MongoDB for storing uploads, reports, ratings, and comments (not provided).
Node.js and npm (optional): For local development using a simple HTTP server.
Git: For cloning the repository.

Setup Instructions
Follow these steps to set up and run the application:
1. Clone the Repository
Clone the project to your local machine using Git:
git clone https://github.com/your-username/query-platform.git
cd query-platform

2. Set Up a Web Server
Since this is a frontend-only application (based on the provided HTML), you need a web server to serve the files. You can use one of the following methods:
Option 1: Using Node.js http-server

Install Node.js from nodejs.org if not already installed.
Install the http-server package globally:npm install -g http-server


Navigate to the project directory and start the server:http-server


Open your browser and visit http://localhost:8080 (or the port displayed by http-server).

Option 2: Using Python http.server

Ensure Python 3 is installed.
Navigate to the project directory and run:python -m http.server 8000


Open your browser and visit http://localhost:8000.

Option 3: Using a Local Web Server (e.g., Apache or Nginx)

Copy the project files (index.html, styles.css, script.js) to your web server’s root directory (e.g., /var/www/html for Apache).
Ensure the server is running and accessible.
Visit http://localhost or your server’s address in your browser.

3. Configure Backend and Database (if applicable)
The provided HTML assumes a backend to populate the tables, handle ratings, and store comments. Since the backend code is not provided, you’ll need to:

Set up a backend server (e.g., Node.js with Express, Python Flask, or PHP).
Create a database to store:
Uploads: Fields like ID, name, description, location, image URL, status, rating, and comments.
Reports: Fields like ID, name, description, location, resolved status, action taken, rating, and comments.


Implement API endpoints for:
Fetching uploads and reports data.
Submitting ratings and comments.
Updating counts for queries, admin actions, and user interactions.


Update script.js to make API calls to your backend (e.g., using fetch or XMLHttpRequest).
Ensure styles.css and script.js are in the same directory as index.html or adjust the file paths in the HTML.

4. Verify File Structure
Ensure the following files are in your project directory:

index.html: The main HTML file.
styles.css: Contains styles for the UI, including meters and tables.
script.js: Handles dynamic functionality like table population, meter updates, and rating/comment submissions.

Example structure:
query-platform/
├── index.html
├── styles.css
├── script.js

5. Test the Application

Open the application in your browser (e.g., http://localhost:8080).
Verify that the UI loads correctly, including the navbar, meters, tables, and rating/comment section.
If the backend is not set up, the tables and meters will be empty or static until script.js is configured to fetch data.

Usage

Access the Application:

Open the application in a web browser via the local or hosted server URL (e.g., http://localhost:8080).


View Dashboard:

The main page displays three circular progress meters showing:
Queries: Number of query uploads.
Admin Actions: Number of report actions taken.
User Interaction: Number of user interactions (e.g., ratings/comments).


These meters are updated dynamically via script.js (requires backend integration).


Browse Tables:

Uploads Table: Displays query uploads with columns for ID, Name, Description, Location, Image, Status, Rating, Comments, and Action.
Reports Table: Displays reports with columns for ID, Name, Description, Location, Resolved, Action Taken, Rating, Comments, and Action.
Action buttons (if implemented in script.js) may allow editing or deleting records.
![image](https://github.com/user-attachments/assets/0b833cb9-bd6d-4427-8b00-755120675c3a)

Rate and Comment:

Select an item from either table (requires script.js logic to update the selectedItem span).
Choose a rating (1–5) from the dropdown and click Submit Rating.
Enter a comment in the textarea and click Post Comment.
Comments are displayed in the comment list below (requires backend storage).


Navigate:

Click the Municipals Performance link in the navbar to view related data (requires backend implementation).



Notes

Backend Dependency: The application’s functionality (e.g., table data, meter updates, rating/comment submissions) relies on a backend API, which is not provided. You must implement or integrate a backend to make the application fully functional.
Styling: Ensure styles.css includes styles for .navbar, .containerM, .meter-container, .meter-circle, .upload-fill, .report-fill, .action-fill, .tables-wrapper, and .rating-comments-section to render the UI correctly.
JavaScript: Update script.js to handle API calls, table population, meter animations, and rating/comment submissions. Without a backend, these features will not work.
Image Handling: The Uploads table includes an Image column, which expects image URLs or paths from the backend.

Troubleshooting

Page Loads but No Data:
Check if script.js is correctly linked and contains logic to fetch data from the backend.
Verify that the backend API is running and accessible.


Meters Not Animating:
Ensure styles.css includes animations for .meter-fill classes and that script.js updates the meter values.


Rating/Comment Not Working:
Confirm that script.js handles form submissions and that the backend has endpoints for ratings and comments.


404 Errors for CSS/JS:
Verify that styles.css and script.js are in the correct directory and referenced properly in index.html.


Responsive Issues:
Check the <meta viewport> tag and ensure styles.css includes responsive design rules.



Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Make changes and commit (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Create a Pull Request.

License
This project is licensed under the MIT License. See the LICENSE file for details.
Contact
 www.linkedin.com/in/amit-kumar-9t5m2i3a
