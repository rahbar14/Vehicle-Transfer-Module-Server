const { ENTITY_TYPES } = require("../../config/config");
const { mysqlPromise } = require("../../connection/db");

exports.createDriver = async (req) => {
    const {name, phone} = req.body;
    const path = `/uploads/${req.file.folder}/${req.file.filename}`

    const conn = await mysqlPromise.getConnection();
    req.conn = conn;
    await conn.beginTransaction();

    const [entity] = await conn.query(
        `INSERT INTO entities (name, image, entity_type, additional_info
) VALUES ?`,
        [[[name, path, ENTITY_TYPES.DRIVER, null]]]
    )

    const [driver] = await conn.query(
        `INSERT INTO drivers (name, phone_number, profile_photo, entity_id) VALUES ?`,
        [[[name, phone, path, entity.insertId]]]
    )

    await conn.commit()
    conn.release();

    return {
        status: true,
        message: "Driver created successfully",
        data: driver.insertId
    }

}


exports.drivers = async () => {
    const [drivers] = await mysqlPromise.query(`
        SELECT * FROM drivers
    `)

    return {
        status: true,
        message: "Drivers list",
        data: drivers
    }
}