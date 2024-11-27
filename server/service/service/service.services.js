const { v4: uuidv4 } = require("uuid");

const pool = require("../../config/conn.js");

class Service {
  static getService = async (serviceId) => {
    const client = await pool.connect();

    try {
      const queryGetService = `
      SELECT 
        s.service_id "serviceId",
        s.title,
        s.description,
        s.order_no "orderNo",
        s.visible,
        s.created_at "createdAt",
        s.created_by "createBy",
        s.updated_at "updatedAt",
        s.updated_by "updatedBy"
      FROM tbl_service s 
      WHERE s.service_id = $1 AND s.deleted = false
      `;
      const result = await client.query(queryGetService, [serviceId]);
      return result.rows;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  };
  static getServices = async () => {
    const client = await pool.connect();

    try {
      const queryGetServices = `
      SELECT 
        s.service_id "serviceId",
        s.title,
        s.description,
        s.order_no "orderNo",
        s.visible,
        s.created_at "createdAt",
        s.created_by "createBy",
        s.updated_at "updatedAt",
        s.updated_by "updatedBy"
      FROM tbl_service s 
      WHERE s.deleted = false
      `;
      const result = await client.query(queryGetServices);

      return result.rows;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  };

  static createService = async (values) => {
    if (!values.dentistId | !values.title) {
      throw new Error("Title and order number are required");
    }

    const client = await pool.connect();
    const serviceId = uuidv4();

    try {
      await client.query("BEGIN");

      const queryServiceTitleAlreadyExist = `
      SELECT * FROM "tbl_service" WHERE title = $1
      `;

      const resultServiceTitleAlreadyExisted = await client.query(
        queryServiceTitleAlreadyExist,
        [values.title]
      );

      if (resultServiceTitleAlreadyExisted.rows.length > 0) {
        await client.query("ROLLBACK");
        return {
          status: 409,
          message: "Service title already existed.",
        };
      }

      const queryInsertService = `
      INSERT INTO tbl_service (
      service_id,
      title,
      description,
      order_no,
      visible,
      created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      `;

      const newServiceResult = await client.query(queryInsertService, [
        serviceId,
        values.title,
        values.description,
        values.orderNo,
        values.visible,
        values.createdBy,
      ]);

      await client.query("COMMIT");

      if (newServiceResult.rowCount > 0) {
        return {
          status: 201,
          message: `New service ${values.title} is created.`,
        };
      } else {
        throw new Error("Invalid service data received!");
      }
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(
        `Internal Server Error (Creating user): ${error.message}`
      );
    } finally {
      client.release();
    }
  };

  static updateService = async (values) => {
    const client = await pool.connect();
    const updatedAt = new Date();
    const serviceId = values.serviceId;

    try {
      const updateServiceQuery = `
      UPDATE tbl_service
      SET title = $1, description = $2, order_no = $3, visible = $4, updated_at = $5, updated_by = $6
      WHERE service_id = $7
      `;

      await client.query(updateServiceQuery, [
        values.title,
        values.description,
        values.orderNo,
        values.visible,
        updatedAt,
        values.updatedBy,
        serviceId,
      ]);

      await client.query("COMMIT");
      return {
        status: 200,
        message: `Successfully updated ${values.title} service.`,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(
        `Internal Server Error (Updating service): ${error.message}`
      );
    } finally {
      client.release();
    }
  };

  static deleteService = async (serviceId) => {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const deleteServiceQuery = `
        UPDATE tbl_service
        SET deleted = true, updated_at = $1
        WHERE service_id = $2
      `;

      const updatedAt = new Date();

      const result = await client.query(deleteServiceQuery, [
        updatedAt,
        serviceId,
      ]);

      await client.query("COMMIT");

      if (result.rowCount === 0) {
        return {
          status: 404,
          message: "Service not found or already deleted.",
        };
      }

      return {
        status: 200,
        message: `Service with ID ${serviceId} has been move to trash.`,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(
        `Internal Server Error (Deleting service): ${error.message}`
      );
    } finally {
      client.release();
    }
  };

  static deleteAllService = async (serviceIds) => {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const deleteAllServiceQuery = `
        UPDATE tbl_service
        SET deleted = true, updated_at = $1
        WHERE service_id = ANY($2)
      `;

      const updatedAt = new Date();

      const result = await client.query(deleteAllServiceQuery, [
        updatedAt,
        serviceIds,
      ]);

      await client.query("COMMIT");

      if (result.rowCount === 0) {
        return {
          status: 404,
          message: "No services found or already deleted.",
        };
      }

      return {
        status: 200,
        message: `Successfully moved ${result.rowCount} services to trash.`,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(
        `Internal Server Error (Deleting multiple services): ${error.message}`
      );
    } finally {
      client.release();
    }
  };
}

module.exports = Service;
