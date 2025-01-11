const pool = require("../../config/conn.js");

class MedicalHistory {
  static async getMedicalHistory(id) {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          medical_history_id AS "id",
          physician_name AS "physicianName",
          physician_no AS "physicianNo",
          question_one AS "question1",
          question_two AS "question2",
          question_three AS "question3",
          question_four AS "question4",
          question_five AS "question5",
          question_six AS "question6",
          question_seven AS "question7",
          question_eight AS "question8",
          question_nine AS "question8",
          created_at AS "createdAt",
          created_by AS "createdBy",
          updated_at AS "updatedAt",
          updated_by AS "updatedBy"
        FROM tbl_medical_history
        WHERE medical_history_id = $1
      `;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) return null;

      const data = result.rows[0];
      [
        "questionOne",
        "questionTwo",
        "questionThree",
        "questionFour",
        "questionFive",
        "questionSix",
        "questionSeven",
        "questionEight",
        "questionNine",
      ].forEach((field) => {
        if (typeof data[field] === "string") {
          try {
            data[field] = JSON.parse(data[field]);
          } catch (parseError) {
            console.warn(`Failed to parse ${field}:`, data[field]);
          }
        }
      });
      return data;
    } catch (error) {
      console.error("Error fetching medical history: ", error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getAllMedicalHistory() {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          medical_history_id AS "id",
          physician_name AS "physicianName",
          physician_no AS "physicianNo",
          question_one AS "questionOne",
          question_two AS "questionTwo",
          question_three AS "questionThree",
          question_four AS "questionFour",
          question_five AS "questionFive",
          question_six AS "questionSix",
          question_seven AS "questionSeven",
          question_eight AS "questionEight",
          question_nine AS "questionNine",
          created_at AS "createdAt",
          created_by AS "createdBy",
          updated_at AS "updatedAt",
          updated_by AS "updatedBy"
        FROM tbl_medical_history
        ORDER BY created_at DESC
      `;
      const result = await client.query(query);

      return result.rows.map((row) => {
        [
          "questionOne",
          "questionTwo",
          "questionThree",
          "questionFour",
          "questionFive",
          "questionSix",
          "questionSeven",
          "questionEight",
          "questionNine",
        ].forEach((field) => {
          if (typeof row[field] === "string") {
            try {
              row[field] = JSON.parse(row[field]);
            } catch (parseError) {
              console.warn(`Failed to parse ${field}:`, row[field]);
            }
          }
        });
        return row;
      });
    } catch (error) {
      console.error("Error fetching all medical histories: ", error);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = MedicalHistory;
