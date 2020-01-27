exports.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/login');
};


exports.isNotLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		return next();
	}
	// if the user is not authenticated then redirect him to the login page
	next();
};
