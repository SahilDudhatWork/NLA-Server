const { pool } = require("../config/db");

async function createQuestion(req, res) {
  const { data, testId } = req.body;
  const adminId = req.user.id;

  try {
    await new Promise((resolve) => {
      pool.query(
        "DELETE FROM questions WHERE test_id = $1",
        [testId],
        (err) => {
          if (err) {
            console.error(err);
          }
          resolve();
        }
      );
    });

    const questionRows = [];
    async function insertDataSequentially() {
      for (const item of data) {
        for (const [key, value] of Object.entries(item)) {
          if (
            typeof value === "object" &&
            Object.values(value).some((i) => i !== "")
          ) {
            await new Promise((resolve) => {
              pool.query(
                `INSERT INTO questions (question, answer, test_id, heading, admin_id) 
                 VALUES ($1, $2, $3, $4, $5) returning *`,
                [
                  Object.values(value),
                  item["answer"],
                  parseInt(testId),
                  item["heading"],
                  adminId,
                ],
                (err, result) => {
                  if (err) {
                    console.error(err);
                  } else {
                    questionRows.push(result.rows[0]);
                  }
                  resolve();
                }
              );
            });
          }
        }
      }
    }

    await insertDataSequentially();

    res.json({ message: "Questions added successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateQuestionById(req, res) {
  const questionId = parseInt(req.params.questionId);
  const { ...data } = req.body;

  const updateColumns = Object.keys(data)
    .map((column, key) => `${column} = $${key + 1}`)
    .join(", ");
  const updateValues = Object.values(data);

  try {
    const { rows, rowCount } = await pool.query(
      `UPDATE questions SET ${updateColumns} WHERE id = $${
        updateValues.length + 1
      } returning *`,
      [...updateValues, questionId]
    );

    if (rowCount === 0)
      return res.status(404).json({ message: "Question not found!" });

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteQuestionById(req, res) {
  const questionId = parseInt(req.params.questionId);

  try {
    const { rowCount } = await pool.query(
      `DELETE FROM questions WHERE id = $1`,
      [questionId]
    );

    if (rowCount === 0)
      return res.status(404).json({ message: "Question not found!" });

    res.json({ message: "Question deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getQuestionsByTestId(req, res) {
  const testId = parseInt(req.params.testId);
  const { studentId } = req.body;

  try {
    const testDisabled = await pool.query(
      `SELECT * FROM tests WHERE id = $1;`,
      [testId]
    );
    if (!testDisabled.rows[0].is_published) {
      return res.json([]);
    }
    const { rows } = await pool.query(
      `SELECT * FROM questions WHERE test_id = $1 ORDER BY id ASC;`,
      [testId]
    );

    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

async function getAdminQuestionsByTestId(req, res) {
  const testId = parseInt(req.params.testId);

  try {
    const { rows } = await pool.query(
      `SELECT * FROM questions WHERE test_id = $1 ORDER BY id ASC;`,
      [testId]
    );

    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

async function getQuestions(req, res) {
  try {
    const { rows, rowCount } = await pool.query(
      `SELECT * FROM questions WHERE admin_id = $1`,
      [req.user.id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: "Question not found!" });
    }

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createQuestion,
  updateQuestionById,
  deleteQuestionById,
  getQuestionsByTestId,
  getQuestions,
  getAdminQuestionsByTestId,
};
