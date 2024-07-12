const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const UserRole = require("./userRole");

const app = express();
const port = process.env.PORT || 8080;
require("dotenv").config();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const dbConfig = {
  host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  port: '4000',
  user: '27TrJcq4ryz5XP5.root',
  password: 'yHZexp0axI14lhYv',
  database: 'crowdsnap_panal',
  ssl: {
    rejectUnauthorized: false,
  },
};

const userRole = new UserRole(dbConfig);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/adduser", async (req, res) => {
  const { user_Roll, note } = req.body;
  try {
    await userRole.addUserRoll(user_Roll, note);
    res.send('Data inserted into user_rolls table');
  } catch (error) {
    console.error("Error adding user roll:", error);
    res.status(500).send(error.message);
  }
});

app.post("/assignmember", async (req, res) => {
  const { user_name, user_roll_id, userid, user_email, user_note } = req.body;
  try {
    await userRole.assignMember(user_roll_id, userid, user_name, user_email, user_note);
    res.send('Data inserted into users table');
  } catch (error) {
    console.error("Error assigning member:", error);
    res.status(500).send(error.message);
  }
});

app.post("/assignrolls", async (req, res) => {
  const { user_roll_id, privileges } = req.body;
  try {
    await userRole.assignPrivileges(user_roll_id, privileges);
    res.send('Privileges assigned successfully');
  } catch (error) {
    console.error("Error assigning rolls:", error);
    res.status(500).send(error.message);
  }
});


app.get("/userrolls", async (req, res) => {
  try {
    const users = await userRole.getUserRolls();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send(error.message);
  }
});

app.get("/getPrivileges", async (req, res) => {
  try {
    const privileges = await userRole.getPrivileges();
    res.json(privileges);
  } catch (error) {
    console.error('Error fetching privileges:', error);
    res.status(500).send(error.message);
  }
});

app.delete('/userrolls/:userRollId', async (req, res) => {
  const userRollId = req.params.userRollId;
  try {
    await userRole.deleteUserRoll(userRollId);
    res.json({ message: 'User roll deleted successfully' });
  } catch (error) {
    console.error('Error deleting user roll:', error);
    res.status(500).json({ error: 'An error occurred while deleting the user roll' });
  }
});

app.get("/getPrivilegesToRole/:userRollId", async (req, res) => {
  const { userRollId } = req.params;
  try {
    const privileges = await userRole.getPrivilegesByRoleId(userRollId);
    res.json(privileges);
  } catch (error) {
    console.error('Error fetching privileges by role ID:', error);
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
