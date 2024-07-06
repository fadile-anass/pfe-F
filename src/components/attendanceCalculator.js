export const calculateSubjectAttendancePercentage = (presentCount, totalSessions) => {
    if (totalSessions === 0 || presentCount === 0) {
        return 0;
    }
    const percentage = (presentCount / totalSessions) * 100;
    return percentage.toFixed(2); // Limite à deux décimales
};


export const groupAttendanceBySubject = (subjectAttendance) => {
    const attendanceBySubject = {};

    subjectAttendance.forEach((attendance) => {
        const subName = attendance.subName.subName; // Nom du sous-jacent
        const sessions = attendance.subName.sessions; // Séances
        const subId = attendance.subName._id; // ID du sous-jacent

        if (!attendanceBySubject[subName]) {
            attendanceBySubject[subName] = {
                present: 0, // Présent
                absent: 0, // Absent
                sessions: sessions, // Séances
                allData: [], // Toutes les données
                subId: subId // ID du sous-jacent
            };
        }
        if (attendance.status === "Present") {
            attendanceBySubject[subName].present++; // Présent
        } else if (attendance.status === "Absent") {
            attendanceBySubject[subName].absent++; // Absent
        }
        attendanceBySubject[subName].allData.push({
            date: attendance.date, // Date
            status: attendance.status, // Statut
        });
    });
    return attendanceBySubject;
}

export const calculateOverallAttendancePercentage = (subjectAttendance) => {
    let totalSessionsSum = 0; // Somme totale des séances
    let presentCountSum = 0; // Somme totale des présents
    const uniqueSubIds = []; // ID unique des sous-jacents

    subjectAttendance.forEach((attendance) => {
        const subId = attendance.subName._id; // ID du sous-jacent
        if (!uniqueSubIds.includes(subId)) {
            const sessions = parseInt(attendance.subName.sessions); // Séances
            totalSessionsSum += sessions; // Ajout aux séances totales
            uniqueSubIds.push(subId);
        }
        presentCountSum += attendance.status === "Present" ? 1 : 0; // Ajout au total des présents
    });

    if (totalSessionsSum === 0 || presentCountSum === 0) {
        return 0;
    }

    return (presentCountSum / totalSessionsSum) * 100;
};
