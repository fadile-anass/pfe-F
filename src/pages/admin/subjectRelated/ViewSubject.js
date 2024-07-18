import React, { useEffect, useState } from 'react'
import { getClassStudents, getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Tab, Container, Typography, BottomNavigation, BottomNavigationAction, Paper,
   Table, TableBody, TableCell, TableContainer, TableHead, TableRow
 } from '@mui/material';
import { BlueButton, GreenButton, PurpleButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';


import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';

const ViewSubject = () => {
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch();
  const { subloading, subjectDetails, sclassStudents, getresponse, error } = useSelector((state) => state.sclass);

  const { classID, subjectID } = params

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
    dispatch(getClassStudents(classID));
  }, [dispatch, subjectID, classID]);

  if (error) {
    console.log(error)
  }

  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [selectedSection, setSelectedSection] = useState('attendance');
  const handleSectionChange = (event, newSection) => {
    setSelectedSection(newSection);
  };

  const studentColumns = [
    { id: 'rollNum', label: "maticule d'étudiants", minWidth: 100 },
    { id: 'name', label: 'Nom', minWidth: 170 },
  ]

  const studentRows = sclassStudents.map((student) => {
    return {
      rollNum: student.rollNum,
      name: student.name,
      id: student._id,
    };
  })

  const StudentsAttendanceButtonHaver = ({ row }) => {
    return (
      <>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/students/student/" + row.id)}
        >
          Voir
        </BlueButton>
        <PurpleButton
          variant="contained"
          onClick={() =>
            navigate(`/Admin/subject/student/attendance/${row.id}/${subjectID}`)
          }
        >
          Prendre la présence
        </PurpleButton>
      </>
    );
  };

  const StudentsMarksButtonHaver = ({ row }) => {
    return (
      <>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/students/student/" + row.id)}
        >
          Voir
        </BlueButton>
        <PurpleButton variant="contained"
          onClick={() => navigate(`/Admin/subject/student/marks/${row.id}/${subjectID}`)}>
          Donner des notes
        </PurpleButton>
      </>
    );
  };

  const SubjectStudentsSection = () => {
    return (
      <>
        {getresponse ? (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <GreenButton
                variant="contained"
                onClick={() => navigate("/Admin/class/addstudents/" + classID)}
              >
                Ajouter des étudiants
              </GreenButton>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              Liste des étudiants :
            </Typography>

            {selectedSection === 'attendance' &&
              <TableTemplate buttonHaver={StudentsAttendanceButtonHaver} columns={studentColumns} rows={studentRows} />
            }
            {selectedSection === 'marks' &&
              <TableTemplate buttonHaver={StudentsMarksButtonHaver} columns={studentColumns} rows={studentRows} />
            }

            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
              <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                <BottomNavigationAction
                  label="Présence"
                  value="attendance"
                  icon={selectedSection === 'attendance' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                />
                <BottomNavigationAction
                  label="Notes"
                  value="marks"
                  icon={selectedSection === 'marks' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                />
              </BottomNavigation>
            </Paper>

          </>
        )}
      </>
    )
  }

  const SubjectDetailsSection = () => {
    const numberOfStudents = sclassStudents.length;

    return (
      <>
          <Typography variant="h4" align="center" gutterBottom>
              Détails de la matière
          </Typography>
          <TableContainer component={Paper}>
              <Table>
                  <TableHead>
                      <TableRow>
                          <TableCell>Détails</TableCell>
                          <TableCell>Valeur</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      <TableRow>
                          <TableCell>Nom du matière</TableCell>
                          <TableCell>{subjectDetails && subjectDetails.subName}</TableCell>
                      </TableRow>
                      <TableRow>
                          <TableCell>Code du matière</TableCell>
                          <TableCell>{subjectDetails && subjectDetails.subCode}</TableCell>
                      </TableRow>
                      <TableRow>
                          <TableCell>Sessions du matière</TableCell>
                          <TableCell>{subjectDetails && subjectDetails.sessions}</TableCell>
                      </TableRow>
                      <TableRow>
                          <TableCell>Nombre d'étudiants</TableCell>
                          <TableCell>{numberOfStudents}</TableCell>
                      </TableRow>
                      <TableRow>
                          <TableCell>Nom de la classe</TableCell>
                          <TableCell>{subjectDetails && subjectDetails.sclassName && subjectDetails.sclassName.sclassName}</TableCell>
                      </TableRow>
                      <TableRow>
                          <TableCell>Nom du professeur</TableCell>
                          <TableCell>
                              {subjectDetails && subjectDetails.teacher ? 
                                  subjectDetails.teacher.name : 
                                  <GreenButton variant="contained" onClick={() => navigate("/Admin/teachers/addteacher/" + subjectDetails._id)}>
                                      Ajouter un professeur au matière
                                  </GreenButton>
                              }
                          </TableCell>
                      </TableRow>
                  </TableBody>
              </Table>
          </TableContainer>
      </>
  );
  }

  return (
    <>
      {subloading ?
        < div > Chargement...</div >
        :
        <>
          <Box sx={{ width: '100%', typography: 'body1', }} >
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} sx={{ position: 'fixed', width: '100%', bgcolor: 'background.paper', zIndex: 1 }}>
                  <Tab label="Détails" value="1" />
                  <Tab label="Étudiants" value="2" />
                </TabList>
              </Box>
              <Container sx={{ marginTop: "3rem", marginBottom: "4rem" }}>
                <TabPanel value="1">
                  <SubjectDetailsSection />
                </TabPanel>
                <TabPanel value="2">
                  <SubjectStudentsSection />
                </TabPanel>
              </Container>
            </TabContext>
          </Box>
        </>
      }
    </>
  )
}

export default ViewSubject
