const router = require("express").Router();
const { verifyTokenAndAuthorization } = require("../middleware/verifyToken");
const verifySuperAdmin = require("../middleware/verifySuperAdmin");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const Question = require("../controller/question.controller");
const Student = require("../controller/student.controller");
const Test = require("../controller/test.controller");
const Leads = require("../controller/leads.controller");
const Grades = require("../controller/grade.controller");
const Result = require("../controller/result.controller");
const Admin = require("../controller/admin.controller");
const { getDashboardDetails } = require("../controller/dashboard.controller");

// dashboard
router.get(
  "/dashboard/details",
  verifyTokenAndAuthorization,
  getDashboardDetails
);

// leads
router.delete(
  "/leads/:leadId",
  verifyTokenAndAuthorization,
  Leads.deleteLeadById
);
router.get("/leads/:leadId", verifyTokenAndAuthorization, Leads.getLeadById);
router.get("/leads", verifyTokenAndAuthorization, Leads.getAllLeads);

// credentials
router.post(
  "/credentials/:studentId",
  verifyTokenAndAuthorization,
  Student.generateCredentials
);

// students
router.post("/students", verifyTokenAndAuthorization, Student.createStudent);
router.post(
  "/students/import",
  verifyTokenAndAuthorization,
  upload.single("csvFile"),
  Student.importStudents
);
router.get("/students", verifyTokenAndAuthorization, Student.getStudents);
router.get(
  "/students/:studentId",
  verifyTokenAndAuthorization,
  Student.getStudentByIdForAdmin
);
router.put(
  "/students/:studentId",
  verifyTokenAndAuthorization,
  Student.updateStudentById
);
router.delete(
  "/students/:studentId",
  verifyTokenAndAuthorization,
  Student.deleteStudentById
);

// tests
router.get("/tests", verifyTokenAndAuthorization, Test.getAdminTests);
router.post("/tests", verifyTokenAndAuthorization, Test.createTest);
router.get("/tests/:testId", verifyTokenAndAuthorization, Test.getTestById);
router.put("/tests/:testId", verifyTokenAndAuthorization, Test.updateTestById);
router.delete(
  "/tests/:testId",
  verifyTokenAndAuthorization,
  Test.deleteTestById
);

// questions
router.post(
  "/questions/",
  verifyTokenAndAuthorization,
  Question.createQuestion
);
router.get("/questions", verifyTokenAndAuthorization, Question.getQuestions);
router.get(
  "/questions/:testId",
  verifyTokenAndAuthorization,
  Question.getAdminQuestionsByTestId
);
router.put(
  "/questions/:questionId",
  verifyTokenAndAuthorization,
  Question.updateQuestionById
);
router.delete(
  "/questions/:questionId",
  verifyTokenAndAuthorization,
  Question.deleteQuestionById
);

// Grades
router.post("/grades", verifyTokenAndAuthorization, Grades.createGrade);
router.get("/grades", verifyTokenAndAuthorization, Grades.getGrades);
router.get(
  "/grades/:gradeId",
  verifyTokenAndAuthorization,
  Grades.getGradeById
);
router.delete(
  "/grades/:gradeId",
  verifyTokenAndAuthorization,
  Grades.deleteGradeById
);
router.put(
  "/grades/:gradeId",
  verifyTokenAndAuthorization,
  Grades.updateGradeById
);

// student results
router.get("/results", verifyTokenAndAuthorization, Result.getResults);
router.get(
  "/results/answerSheet/:studentId/:testId",
  verifyTokenAndAuthorization,
  Result.getAnswerSheet
);
router.get(
  "/results/:studentId",
  verifyTokenAndAuthorization,
  Result.getStudentResults
);

// Sub Admin
// Only `superAdmin` can access
router.post(
  "/",
  verifyTokenAndAuthorization,
  verifySuperAdmin,
  Admin.createAdmin
);
router.get("/", verifyTokenAndAuthorization, verifySuperAdmin, Admin.getAdmins);
router.get(
  "/:id",
  verifyTokenAndAuthorization,
  verifySuperAdmin,
  Admin.getAdminById
);
router.put(
  "/:id",
  verifyTokenAndAuthorization,
  verifySuperAdmin,
  Admin.updateAdmin
);
router.delete(
  "/:id",
  verifyTokenAndAuthorization,
  verifySuperAdmin,
  Admin.deleteAdmin
);
router.post(
  "/db/update",
  verifyTokenAndAuthorization,
  Admin.DBUpdate
);

module.exports = router;
