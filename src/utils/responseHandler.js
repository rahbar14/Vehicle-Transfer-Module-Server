const fs = require("fs")

module.exports = controllerFunction => async (request, response, next) => {
    try {
        const { statusCode=200, cookies, ...resObj } = await controllerFunction(request, response, next);
        if(cookies) {
            for(let cookie of cookies) {
                if (cookie.value === null) response.clearCookie(cookie.name, cookie.options);
                else response.cookie(cookie.name, cookie.value, cookie.options);
            }
        }
        response.status(+statusCode).json(resObj);
        request.logger.success(resObj);
    } catch (error) {
        if (request.file) try { fs.unlinkSync(request.file?.path) } catch (error) { };
        if (request.conn) try { await request.conn.rollback(); request.conn.release() } catch (error) {}
        response.status(500).json({
            status: false,
            message: "Internal server error!",
            data: []
        })
        request.logger.error(error);
    }
}