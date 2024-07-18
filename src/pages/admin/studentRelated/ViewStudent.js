import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUser,
  getUserDetails,
  updateUser,
} from "../../../redux/userRelated/userHandle";
import { useNavigate, useParams } from "react-router-dom";
import { getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
// import {  Tab, Typography, BottomNavigation, BottomNavigationAction, Paper,
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow
// } from '@mui/material';
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableHead,
  Typography,
  Tab,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Container,
  TableContainer,
  TableRow,
  TableCell,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  removeStuff,
  updateStudentFields,
} from "../../../redux/studentRelated/studentHandle";
import {
  calculateOverallAttendancePercentage,
  calculateSubjectAttendancePercentage,
  groupAttendanceBySubject,
} from "../../../components/attendanceCalculator";
import CustomBarChart from "../../../components/CustomBarChart";
import CustomPieChart from "../../../components/CustomPieChart";
import { StyledTableCell, StyledTableRow } from "../../../components/styles";

import InsertChartIcon from "@mui/icons-material/InsertChart";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import TableChartIcon from "@mui/icons-material/TableChart";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import Popup from "../../../components/Popup";

const ViewStudent = () => {
  const [showTab, setShowTab] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { userDetails, response, loading, error } = useSelector(
    (state) => state.user
  );

  const studentID = params.id;
  const address = "Student";

  useEffect(() => {
    dispatch(getUserDetails(studentID, address));
  }, [dispatch, studentID]);

  useEffect(() => {
    if (
      userDetails &&
      userDetails.sclassName &&
      userDetails.sclassName._id !== undefined
    ) {
      dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
    }
  }, [dispatch, userDetails]);

  if (response) {
    console.log(response);
  } else if (error) {
    console.log(error);
  }

  const [name, setName] = useState("");
  const [rollNum, setRollNum] = useState("");
  const [password, setPassword] = useState("");
  const [sclassName, setSclassName] = useState("");
  const [studentSchool, setStudentSchool] = useState("");
  const [subjectMarks, setSubjectMarks] = useState("");
  const [subjectAttendance, setSubjectAttendance] = useState([]);

  const [openStates, setOpenStates] = useState({});

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const handleOpen = (subId) => {
    setOpenStates((prevState) => ({
      ...prevState,
      [subId]: !prevState[subId],
    }));
  };

  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    event.preventDefault();
    setValue(newValue);
  };

  const [selectedSection, setSelectedSection] = useState("table");
  const handleSectionChange = (event, newSection) => {
    setSelectedSection(newSection);
  };

  const fields =
    password === "" ? { name, rollNum } : { name, rollNum, password };

  useEffect(() => {
    if (userDetails) {
      setName(userDetails.name || "");
      setRollNum(userDetails.rollNum || "");
      setSclassName(userDetails.sclassName || "");
      setStudentSchool(userDetails.school || "");
      setSubjectMarks(userDetails.examResult || "");
      setSubjectAttendance(userDetails.attendance || []);
    }
  }, [userDetails]);

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(updateUser(fields, studentID, address))
      .then(() => {
        dispatch(getUserDetails(studentID, address));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteHandler = () => {
    dispatch(deleteUser(studentID, address)).then(() => {
      navigate(-1);
    });
  };

  const removeHandler = (id, deladdress) => {
    dispatch(removeStuff(id, deladdress)).then(() => {
      dispatch(getUserDetails(studentID, address));
    });
  };

  const removeSubAttendance = (subId) => {
    dispatch(
      updateStudentFields(studentID, { subId }, "RemoveStudentSubAtten")
    ).then(() => {
      dispatch(getUserDetails(studentID, address));
    });
  };

  const overallAttendancePercentage =
    calculateOverallAttendancePercentage(subjectAttendance);
  const overallAbsentPercentage = 100 - overallAttendancePercentage;

  const chartData = [
    { name: "Présent", value: overallAttendancePercentage },
    { name: "Absent", value: overallAbsentPercentage },
  ];
  const [isNameFocus, setIsNameFocus] = useState(false);
  const handleNameChange = (name) => {
    setName(name);
    setIsNameFocus(true);
  };
  const [isRollFocus, setIsRollFocus] = useState(false);
  const handleRollChange = (roll) => {
    setRollNum(roll);
    setIsRollFocus(true);
  };
  const [isPasswordFocus, setIsPasswordFocus] = useState(false);
  const handlePasswordChange = (Password) => {
    setPassword(Password);
    setIsPasswordFocus(true);
  };
  const subjectData = Object.entries(
    groupAttendanceBySubject(subjectAttendance)
  ).map(([subName, { subCode, present, sessions }]) => {
    const subjectAttendancePercentage = calculateSubjectAttendancePercentage(
      present,
      sessions
    );
    return {
      subject: subName,
      attendancePercentage: subjectAttendancePercentage,
      totalClasses: sessions,
      attendedClasses: present,
    };
  });

  const StudentAttendanceSection = () => {
    const renderTableSection = () => {
      return (
        <>
          <h3>Présence :</h3>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Matière</StyledTableCell>
                <StyledTableCell>Présent</StyledTableCell>
                <StyledTableCell>Sessions Totales</StyledTableCell>
                <StyledTableCell>Pourcentage de Présence</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(
              ([subName, { present, allData, subId, sessions }], index) => {
                const subjectAttendancePercentage =
                  calculateSubjectAttendancePercentage(present, sessions);
                return (
                  <TableBody key={index}>
                    <StyledTableRow>
                      <StyledTableCell>{subName}</StyledTableCell>
                      <StyledTableCell>{present}</StyledTableCell>
                      <StyledTableCell>{sessions}</StyledTableCell>
                      <StyledTableCell>
                        {subjectAttendancePercentage}%
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Button
                          variant="contained"
                          onClick={() => handleOpen(subId)}
                        >
                          {openStates[subId] ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                          Détails
                        </Button>
                        <IconButton onClick={() => removeSubAttendance(subId)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                        <Button
                          variant="contained"
                          sx={styles.attendanceButton}
                          onClick={() =>
                            navigate(
                              `/Admin/subject/student/attendance/${studentID}/${subId}`
                            )
                          }
                        >
                          Changer
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={6}
                      >
                        <Collapse
                          in={openStates[subId]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box sx={{ margin: 1 }}>
                            <Typography
                              variant="h6"
                              gutterBottom
                              component="div"
                            >
                              Détails de la Présence
                            </Typography>
                            <Table size="small" aria-label="purchases">
                              <TableHead>
                                <StyledTableRow>
                                  <StyledTableCell>Date</StyledTableCell>
                                  <StyledTableCell align="right">
                                    Statut
                                  </StyledTableCell>
                                </StyledTableRow>
                              </TableHead>
                              <TableBody>
                                {allData.map((data, index) => {
                                  const date = new Date(data.date);
                                  const dateString =
                                    date.toString() !== "Invalid Date"
                                      ? date.toISOString().substring(0, 10)
                                      : "Date Invalide";
                                  return (
                                    <StyledTableRow key={index}>
                                      <StyledTableCell
                                        component="th"
                                        scope="row"
                                      >
                                        {dateString}
                                      </StyledTableCell>
                                      <StyledTableCell align="right">
                                        {data.status}
                                      </StyledTableCell>
                                    </StyledTableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableBody>
                );
              }
            )}
          </Table>
          <div>
            Pourcentage de Présence Total :{" "}
            {overallAttendancePercentage.toFixed(2)}%
          </div>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => removeHandler(studentID, "RemoveStudentAtten")}
          >
            Supprimer Tout
          </Button>
          <Button
            variant="contained"
            sx={styles.styledButton}
            onClick={() =>
              navigate("/Admin/students/student/attendance/" + studentID)
            }
          >
            Ajouter Présence
          </Button>
        </>
      );
    };
    const renderChartSection = () => {
      return (
        <>
          <CustomBarChart
            chartData={subjectData}
            dataKey="attendancePercentage"
          />
        </>
      );
    };
    return (
      <>
        {subjectAttendance &&
        Array.isArray(subjectAttendance) &&
        subjectAttendance.length > 0 ? (
          <>
            {selectedSection === "table" && renderTableSection()}
            {selectedSection === "chart" && renderChartSection()}

            <Paper
              sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
              elevation={3}
            >
              <BottomNavigation
                value={selectedSection}
                onChange={handleSectionChange}
                showLabels
              >
                <BottomNavigationAction
                  label="Tableau"
                  value="table"
                  icon={
                    selectedSection === "table" ? (
                      <TableChartIcon />
                    ) : (
                      <TableChartOutlinedIcon />
                    )
                  }
                />
                <BottomNavigationAction
                  label="Graphique"
                  value="chart"
                  icon={
                    selectedSection === "chart" ? (
                      <InsertChartIcon />
                    ) : (
                      <InsertChartOutlinedIcon />
                    )
                  }
                />
              </BottomNavigation>
            </Paper>
          </>
        ) : (
          <Button
            variant="contained"
            sx={styles.styledButton}
            onClick={() =>
              navigate("/Admin/students/student/attendance/" + studentID)
            }
          >
            Ajouter Présence
          </Button>
        )}
      </>
    );
  };

  const StudentMarksSection = () => {
    const renderTableSection = () => {
      return (
        <>
          <h3>Notes des Matières :</h3>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Matière</StyledTableCell>
                <StyledTableCell>Notes</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {subjectMarks.map((result, index) => {
                if (!result.subName || !result.marksObtained) {
                  return null;
                }
                return (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{result.subName.subName}</StyledTableCell>
                    <StyledTableCell>{result.marksObtained}</StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
          <Button
            variant="contained"
            sx={styles.styledButton}
            onClick={() =>
              navigate("/Admin/students/student/marks/" + studentID)
            }
          >
            Ajouter Notes
          </Button>
        </>
      );
    };
    const renderChartSection = () => {
      return (
        <>
          <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
        </>
      );
    };
    return (
      <>
        {subjectMarks &&
        Array.isArray(subjectMarks) &&
        subjectMarks.length > 0 ? (
          <>
            {selectedSection === "table" && renderTableSection()}
            {selectedSection === "chart" && renderChartSection()}

            <Paper
              sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
              elevation={3}
            >
              <BottomNavigation
                value={selectedSection}
                onChange={handleSectionChange}
                showLabels
              >
                <BottomNavigationAction
                  label="Tableau"
                  value="table"
                  icon={
                    selectedSection === "table" ? (
                      <TableChartIcon />
                    ) : (
                      <TableChartOutlinedIcon />
                    )
                  }
                />
                <BottomNavigationAction
                  label="Graphique"
                  value="chart"
                  icon={
                    selectedSection === "chart" ? (
                      <InsertChartIcon />
                    ) : (
                      <InsertChartOutlinedIcon />
                    )
                  }
                />
              </BottomNavigation>
            </Paper>
          </>
        ) : (
          <Button
            variant="contained"
            sx={styles.styledButton}
            onClick={() =>
              navigate("/Admin/students/student/marks/" + studentID)
            }
          >
            Ajouter Notes
          </Button>
        )}
      </>
    );
  };

  const StudentDetailsSection = () => {
    return (
      <>
        <div>
          <Typography variant="h4" align="center" gutterBottom>
            Détails d'étudiant
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>{userDetails.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Matricule d'étudiants</TableCell>
                  <TableCell>{userDetails.rollNum}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Classe</TableCell>
                  <TableCell>{sclassName.sclassName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>École</TableCell>
                  <TableCell>{studentSchool.schoolName}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          {subjectAttendance &&
            Array.isArray(subjectAttendance) &&
            subjectAttendance.length > 0 && <CustomPieChart data={chartData} />}
          <Button
            variant="contained"
            sx={styles.styledButton}
            onClick={deleteHandler}
          >
            Supprimer
          </Button>
          <br />
          <Button
            variant="contained"
            sx={styles.styledButton}
            className="show-tab"
            onClick={() => {
              setShowTab(!showTab);
            }}
          >
            {showTab ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            Modifier Étudiant
          </Button>
          <Collapse in={showTab} timeout="auto" unmountOnExit>
            <div className="register">
              <form className="registerForm" onSubmit={submitHandler}>
                <span className="registerTitle">Modifier Détails</span>
                <label>Nom</label>
                <input
                  className="registerInput"
                  type="text"
                  placeholder="Entrer le nom de l'utilisateur..."
                  value={name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  onBlur={() => setIsNameFocus(false)}
                  autoComplete="name"
                  required
                  autoFocus={isNameFocus}
                />

                <label>maticule d'étudiants</label>
                <input
                  className="registerInput"
                  type="number"
                  placeholder="Entrer le maticule d'étudiants de l'utilisateur..."
                  value={rollNum}
                  onChange={(event) => handleRollChange(event.target.value)}
                  required
                  autoFocus={isRollFocus}
                />

                <label>Mot de Passe</label>
                <input
                  className="registerInput"
                  type="password"
                  placeholder="Entrer le mot de passe de l'utilisateur..."
                  onBlur={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                />

                <button className="registerButton" type="submit">
                  Mettre à Jour
                </button>
              </form>
            </div>
          </Collapse>
        </div>
      </>
    );
  };

  return (
    <>
      {loading ? (
        <>
          <div>Chargement...</div>
        </>
      ) : (
        <>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  sx={{
                    position: "fixed",
                    width: "100%",
                    bgcolor: "background.paper",
                    zIndex: 1,
                  }}
                >
                  <Tab label="Détails" value="1" />
                  <Tab label="Présence" value="2" />
                  <Tab label="Notes" value="3" />
                </TabList>
              </Box>
              <Container sx={{ marginTop: "3rem", marginBottom: "4rem" }}>
                <TabPanel value="1">
                  <StudentDetailsSection />
                </TabPanel>
                <TabPanel value="2">
                  <StudentAttendanceSection />
                </TabPanel>
                <TabPanel value="3">
                  <StudentMarksSection />
                </TabPanel>
              </Container>
            </TabContext>
          </Box>
        </>
      )}
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default ViewStudent;

const styles = {
  attendanceButton: {
    marginLeft: "20px",
    backgroundColor: "#270843",
    "&:hover": {
      backgroundColor: "#3f1068",
    },
  },
  styledButton: {
    margin: "20px",
    backgroundColor: "#02250b",
    "&:hover": {
      backgroundColor: "#106312",
    },
  },
};
