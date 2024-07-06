import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUser,
  getUserDetails,
  updateUser,
} from "../../../redux/userRelated/userHandle";
import { useNavigate, useParams } from "react-router-dom";
import { getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
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
                                        {data.attendanceStatus}
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
        </>
      );
    };

    const renderGraphSection = () => {
      return (
        <>
          <CustomPieChart data={chartData} />
          <CustomBarChart data={subjectData} />
        </>
      );
    };

    return (
      <Container>
        <Box sx={styles.tabContextContainer}>
          <TabContext value={value}>
            <TabList
              onChange={handleChange}
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              <Tab label="Liste" value="1" />
              <Tab label="Graphiques" value="2" />
            </TabList>
            <TabPanel value="1">{renderTableSection()}</TabPanel>
            <TabPanel value="2">{renderGraphSection()}</TabPanel>
          </TabContext>
        </Box>
      </Container>
    );
  };

  const styles = {
    container: {
      padding: 2,
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      alignItems: "center",
    },
    attendanceButton: {
      marginLeft: 1,
      marginRight: 1,
      backgroundColor: "#007bff",
      color: "#fff",
      "&:hover": {
        backgroundColor: "#0056b3",
      },
    },
    tabContextContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      mt: 2,
    },
  };

  return (
    <Box sx={styles.container}>
      <h2>Détails de l'Étudiant</h2>
      <Paper component="form" onSubmit={submitHandler}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom"
        />
        <input
          type="text"
          value={rollNum}
          onChange={(e) => setRollNum(e.target.value)}
          placeholder="Numéro de matricule"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
        />
        <Button type="submit" variant="contained">
          Mettre à jour
        </Button>
        <Button onClick={deleteHandler} variant="contained" color="error">
          Supprimer
        </Button>
      </Paper>
      <StudentAttendanceSection />
    </Box>
  );
};

export default ViewStudent;
