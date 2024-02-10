const isAuthenticated = (req, res, next) => {
    // Authentication logic goes here
    // For demonstration purposes, let's assume user is authenticated
    const isAuthenticated = true;
    if (isAuthenticated) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = { isAuthenticated };
