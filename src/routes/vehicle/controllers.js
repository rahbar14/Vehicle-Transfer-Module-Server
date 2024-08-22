const { ENTITY_TYPES } = require("../../config/config");
const { mysqlPromise } = require("../../connection/db");

exports.createVehicle = async (req) => {
    try {
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
    } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
        return {
            statusCode: 400,
            message: "Vehicle already registered",
            data: []
        }
    }
    throw error;
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


exports.transferVehicle = async ({body}) => {
    const { vehicle_number, driver_id } = body;
    const [[vehicle]] = await mysqlPromise.query(`SELECT vehicle_number FROM vehicles WHERE vehicle_number = ?`, [vehicle_number]);
    if (!vehicle) {
        return {
            statusCode: 404,
            message: "Vehicle not found",
            data: []
        }
    }
    const [[driver]] = await mysqlPromise.query(`SELECT entity_id FROM drivers WHERE id = ?`, [driver_id]);
    if (!driver) {
        return {
            statusCode: 404,
            message: "Driver not found",
            data: []
        }
    }
    const [[currentDriver]] = await mysqlPromise.query(`SELECT to_entity_id FROM transfers WHERE vehicle_number = ? ORDER BY transfer_date DESC LIMIT 1`, [vehicle_number]);

    if (currentDriver && currentDriver.to_entity_id === driver.entity_id) {
        return {
            statusCode: 400,
            message: "Vehicle is already owned by the same driver",
            data: []
        }
    }

    const [transfer] = await mysqlPromise.query(`INSERT INTO transfers (vehicle_number, to_entity_id) VALUES ?`, [[[vehicle_number, driver.entity_id]]])

    return {
        status: true,
        message: "Transfer successful",
        data: transfer.insertId
    }



}


exports.transferHistory = async ({ query }) => {
    const { vehicle_number } = query

    let sqlQuery = `SELECT vehicle_number, entities.name, entities.image, entities.entity_type, transfer_date FROM transfers JOIN entities ON entities.id = transfers.to_entity_id WHERE vehicle_number = ? ORDER BY transfer_date DESC`
    const sqlParams = [vehicle_number]

    const [history] = await mysqlPromise.query(sqlQuery, sqlParams);

    return {
        status: true,
        message: "Transfer history",
        data: history
    }
}