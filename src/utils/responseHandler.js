module.exports = controllerFunction => async (request, response, next) => {
    try {
        const { statusCode=200, cookies, ...resObj } = await controllerFunction(request, response, next);
        if(cookies) {
            for(let cookie of cookies) {
                if (cookie.value === null) response.clearCookie(cookie.name, cookie.options);
                else response.cookie(cookie.name, cookie.value, cookie.options);
                console.log(cookie)
            }
        }
        response.status(+statusCode).json(resObj);
        request.logger.success(resObj);
    } catch (error) {
        response.status(500).json({
            status: false,
            message: "Internal server error!",
            data: []
        })
        request.logger.error(error);
    }
}