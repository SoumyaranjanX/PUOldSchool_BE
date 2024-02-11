import fs from 'fs';
import path from 'path';

// Function to dynamically import router files
const importRoutes = (app) => {
    const currentFilePath = import.meta.url;
    const currentDir = path.dirname(new URL(currentFilePath).pathname);
    const routesPath = path.join(currentDir, '..', 'routes');

    // Read all files in the routes folder
    fs.readdirSync(routesPath).forEach(file => {
        // Check if it's a JavaScript file
        if (file.endsWith('.js')) {
            // Import the router file dynamically
            import(path.join(routesPath, file)).then(route => {
                // Mount the router on the app
                app.use(route.default);
            }).catch(error => {
                console.error(`Error importing route from file ${file}: ${error}`);
            });
        }
    });
};

export default importRoutes;
