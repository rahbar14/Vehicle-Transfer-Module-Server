module.exports = (joiSchema, validateOver = "body") => (req, res, next) => {
    const check = joiSchema.validate(req[validateOver])
    if (check.error) {
        const message = check.error.message;
        req.logger.validationError(message)
        res.status(400).json({
            status: false,
            message,
            data: []
        })
    } else {
        next()
    }
}