const jwt = require("jsonwebtoken");
const { mysqlPromise } = require("../../connection/db");
const bcrypt = require("bcrypt")

exports.register = async ({body}) => {
    try {
        const { email, gender, username, password, phone } = body;
        const hashedPassword = bcrypt.hashSync(password, 10);
        const [user] = await mysqlPromise.query(`
          INSERT INTO users (email, gender, username, password, phone) VALUES ?
        `, [[[email, gender, username, hashedPassword, phone]]])
        return {
            status: true,
            message: "User registered successfully",
            cookies: [{ 
                name: "accessToken", 
                value: jwt.sign({ id: user.insertId }, process.env.JWT_SECRET),
                options: { httpOnly: true, secure: false }
            }],
            data:[]
        }
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY")
        {
            return {
                statusCode: 400,
                message: "Username or Email already registered",
                data: []
            }
        }
        throw error;
    }
}

exports.login = async ({body}) => {
    const { username, password } = body;
    const [[user]] = await mysqlPromise.query(`
      SELECT id, password FROM users WHERE username = ?  
    `, [username])
    if (!user) {
        return {
            statusCode: 404,
            status: false,
            message: "User not found",
            data: []
        }
    }
    const match = bcrypt.compareSync(password, user.password);
    if (match) {
        return {
            status: true,
            message: "User login successfully",
            cookies: [{
                name: "accessToken",
                value: jwt.sign({ id: user.id }, process.env.JWT_SECRET),
                options: { httpOnly: true, secure: false }
            }],
            data: []
        }
    }
    else {
        return {
            statusCode: 400,
            status: false,
            message: "Username or password is incorrect",
            data: []
        }
    }

}