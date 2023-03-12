const authorize = (req, res, next) => {
    console.log(req.query);
    const {user} = req.query;
    if(user === 'kushal') {
        req.user = {name: 'kushal', id: 3};
        next();
    }
    else {
        res.status(401).send('unauthorized');
    }
}

module.exports = authorize;