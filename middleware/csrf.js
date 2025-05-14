const csrfProtection = (req, res, next) => {
    // have to put this route as an exempt because
    // otherwise csrfProtection will ask for a token
    const exemptRoutes = ['/api/search'];

    //  if the current request path is in the exempt list
    if (exemptRoutes.some(route => req.path.startsWith(route))) {
        return next();
    }

    // Skip CSRF check for safe HTTP methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }

    // Retrieve the token from the request body or header
    const submittedToken = req.body.csrfToken || req.headers['x-csrf-token'];

    // Compare it to the token stored in the session
    if (!submittedToken || submittedToken !== req.session.csrfToken) {
        return res.status(403).json({ error: 'Invalid CSRF Token' });
    }

    next();
};

export default csrfProtection;
