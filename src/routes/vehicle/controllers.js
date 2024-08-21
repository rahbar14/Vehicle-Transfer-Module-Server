const { ENTITY_TYPES } = require("../../config/config");
const { mysqlPromise } = require("../../connection/db");

exports.createVehicle = async (req) => {
    const { vehicle_number, vehicle_type } = req.body;
    const puc_certificate = req.files.puc_certificate[0]
    const insurance_cert = req.files.insurance_cert[0]
    const puc_path = `/uploads/${puc_certificate.folder}/${puc_certificate.filename}`
    const inc_path = `/uploads/${insurance_cert.folder}/${insurance_cert.filename}`


    const conn = await mysqlPromise.getConnection();
    req.conn = conn;
    await conn.beginTransaction();

    const [driver] = await conn.query(
        `INSERT INTO vehicles (vehicle_number, vehicle_type, puc_certificate, insurance_cert) VALUES ?`,
        [[[vehicle_number, vehicle_type, puc_path, inc_path]]]
    )

    await conn.commit()
    conn.release();

    return {
        status: true,
        message: "Driver created successfully",
        data: driver.insertId
    }

}


exports.vehicles = async ({query}) => {
    const {search} = query

    let sqlQuery = `SELECT * FROM vehicles`
    const sqlParams = []

    if (search) {
        sqlQuery += " WHERE vehicle_number LIKE ?";
        sqlParams.push(`%${search}%`)
    }

    const [vehicles] = await mysqlPromise.query(sqlQuery, sqlParams);

    return {
        status: true,
        message: "Vehicles list",
        data: vehicles
    }
}