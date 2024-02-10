const fs = require('fs');
const path = require('path');

// Function to dynamically import router files
const importRoutes = (app) => {
    const routesPath = path.join(__dirname, '..', 'routes');

    // Read all files in the routes folder
    fs.readdirSync(routesPath).forEach(file => {
        // Check if it's a JavaScript file
        if (file.endsWith('.js')) {
            // Import the router file
            const route = require(path.join(routesPath, file));
            // Mount the router on the app
            app.use(route);
        }
    });
};

module.exports = importRoutes;