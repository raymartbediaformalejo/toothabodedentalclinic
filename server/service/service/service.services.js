const { v4: uuidv4 } = require("uuid");

const pool = require("../../config/conn.js");

class Service {
  static getService = async (serviceId) => {
    const client = await pool.connect();

    try {
      const queryGetService = `
      SELECT 
        s.id,
        s.title,
        s.description,
        s.order_no "orderNo",
        s.visible,
        s.created_at "createdAt",
        s.created_by "createBy",
        s.updated_at "updatedAt",
        s.updated_by "updatedBy"
      FROM tbl_service s 
      WHERE s.id = $1 AND s.deleted = false
      ORDER BY s.order_no ASC
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
        s.id,
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

  static getServicesById = async (serviceIds) => {
    const client = await pool.connect();

    try {
      const queryGetServicesById = `
      SELECT 
        s.id,
        s.title,
        s.description,
        s.order_no "orderNo",
        s.visible,
        s.created_at "createdAt",
        s.created_by "createBy",
        s.updated_at "updatedAt",
        s.updated_by "updatedBy"
      FROM tbl_service s 
      WHERE s.id = ANY($1) AND s.deleted = false
      ORDER BY s.order_no ASC
      `;
      const result = await client.query(queryGetServicesById, [serviceIds]);
      return result.rows;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  };

  static createService = async (values) => {
    if (!values.title) {
      throw new Error("Title is required");
    }

    const client = await pool.connect();
    const serviceId = uuidv4();

    try {
      await client.query("BEGIN");

      const queryServiceTitleAlreadyExist = `
      SELECT * FROM "tbl_service" WHERE title = $1 AND deleted = false
      `;

      const resultServiceTitleAlreadyExisted = await client.query(
        queryServiceTitleAlreadyExist,
        [values.title]
      );

      if (resultServiceTitleAlreadyExisted.rows.length > 0) {
        await client.query("ROLLBACK");
        throw new Error(`Service "${values.title}" title already existed.`);
      }

      const queryGetMaxOrderNo = `
      SELECT COALESCE(MAX(order_no), 0) AS maxOrderNo 
      FROM tbl_service 
      WHERE deleted = false
      `;

      const resultMaxOrderNo = await client.query(queryGetMaxOrderNo);
      const newOrderNo = resultMaxOrderNo.rows[0].maxorderno + 1;

      const queryInsertService = `
      INSERT INTO tbl_service (
      id,
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
        newOrderNo,
        values.visible,
        values.createdBy,
      ]);

      await client.query("COMMIT");

      if (newServiceResult.rowCount > 0) {
        return {
          status: 201,
          message: `New service "${values.title}" is created.`,
        };
      } else {
        throw new Error("Invalid service data received!");
      }
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`${error.message}`);
    } finally {
      client.release();
    }
  };

  static updateService = async (values) => {
    const client = await pool.connect();
    const updatedAt = new Date();
    const serviceId = values.serviceId;

    try {
      if (!values.title) {
        await client.query("ROLLBACK");
        throw new Error(`Service title is required`);
      }

      const updateServiceQuery = `
      UPDATE tbl_service
      SET title = $1, description = $2, visible = $3, updated_at = $4, updated_by = $5
      WHERE id = $6
      `;

      await client.query(updateServiceQuery, [
        values.title,
        values.description,
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
      throw new Error(`${error.message}`);
    } finally {
      client.release();
    }
  };

  static deleteService = async (serviceId) => {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const queryGetTitle = `
      SELECT s.title 
      FROM tbl_service s
      WHERE s.id = $1
      `;

      const serviceName = (await client.query(queryGetTitle, [serviceId]))
        .rows[0].title;

      const deleteServiceQuery = `
        UPDATE tbl_service
        SET deleted = true, updated_at = $1
        WHERE id = $2
      `;

      const updatedAt = new Date();

      const result = await client.query(deleteServiceQuery, [
        updatedAt,
        serviceId,
      ]);

      await client.query("COMMIT");

      if (result.rowCount === 0) {
        throw new Error("Service not found or already move to trash.");
      }

      return {
        status: 200,
        message: `Service "${serviceName}" has been move to trash.`,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`${error.message}`);
    } finally {
      client.release();
    }
  };

  static deleteAllService = async (ids) => {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const deleteAllServiceQuery = `
        UPDATE tbl_service
        SET deleted = true, updated_at = $1
        WHERE id = ANY($2)
      `;

      const updatedAt = new Date();

      const result = await client.query(deleteAllServiceQuery, [
        updatedAt,
        ids,
      ]);

      await client.query("COMMIT");

      if (result.rowCount === 0) {
        throw new Error("No services found or already deleted.");
      }

      return {
        status: 200,
        message: `Successfully moved ${result.rowCount} services to trash.`,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`${error.message}`);
    } finally {
      client.release();
    }
  };

  static saveSortedService = async (values) => {
    const client = await pool.connect();

    try {
      const querySaveSortedService = `
      UPDATE tbl_service 
      SET order_no = $1
      WHERE id = $2
      `;

      for (let i = 0; i < values.length; i++) {
        const { id } = values[i];
        if (!id) {
          throw new Error("Invalid service ID in services");
        }
        await client.query(querySaveSortedService, [i + 1, id]);
      }

      await client.query("COMMIT");

      return {
        status: 200,
        message: `Successfully sorted services`,
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`${error.message}`);
    } finally {
      client.release();
    }
  };
}

module.exports = Service;
