// Sample medical records data
const medical_records = [
  {
    id: 1,
    name: "John Doe",
    dob: "1985-05-15",
    height: "5'10\"",
    data: [
      {
        id: 101,
        timestamp: "2024-01-15",
        diagnosis: { name: "Hypertension" },
        vitals: { weight: 85 },
        doctor: { name: "Dr. Smith" },
      },
      {
        id: 102,
        timestamp: "2024-01-22",
        diagnosis: { name: "Follow-up" },
        vitals: { weight: 84 },
        doctor: { name: "Dr. Johnson" },
      },
      {
        id: 103,
        timestamp: "2024-02-01",
        diagnosis: { name: "Hypertension Control" },
        vitals: { weight: 83 },
        doctor: { name: "Dr. Smith" },
      },
      {
        id: 104,
        timestamp: "2024-02-15",
        diagnosis: { name: "General Checkup" },
        vitals: { weight: 82 },
        doctor: { name: "Dr. Brown" },
      },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    dob: "1990-03-22",
    height: "5'6\"",
    data: [
      {
        id: 201,
        timestamp: "2024-01-10",
        diagnosis: { name: "Migraine" },
        vitals: { weight: 65 },
        doctor: { name: "Dr. Johnson" },
      },
      {
        id: 202,
        timestamp: "2024-01-25",
        diagnosis: { name: "Follow-up" },
        vitals: { weight: 65 },
        doctor: { name: "Dr. Williams" },
      },
      {
        id: 203,
        timestamp: "2024-02-08",
        diagnosis: { name: "Migraine Management" },
        vitals: { weight: 64 },
        doctor: { name: "Dr. Johnson" },
      },
      {
        id: 204,
        timestamp: "2024-02-20",
        diagnosis: { name: "Physical Therapy" },
        vitals: { weight: 64 },
        doctor: { name: "Dr. Brown" },
      },
    ],
  },
  {
    id: 3,
    name: "Michael Johnson",
    dob: "1978-11-30",
    height: "6'0\"",
    data: [
      {
        id: 301,
        timestamp: "2024-01-05",
        diagnosis: { name: "Diabetes Management" },
        vitals: { weight: 95 },
        doctor: { name: "Dr. Williams" },
      },
      {
        id: 302,
        timestamp: "2024-01-20",
        diagnosis: { name: "Follow-up" },
        vitals: { weight: 94 },
        doctor: { name: "Dr. Smith" },
      },
      {
        id: 303,
        timestamp: "2024-02-05",
        diagnosis: { name: "Diabetes Control" },
        vitals: { weight: 93 },
        doctor: { name: "Dr. Williams" },
      },
      {
        id: 304,
        timestamp: "2024-02-18",
        diagnosis: { name: "Nutrition Counseling" },
        vitals: { weight: 92 },
        doctor: { name: "Dr. Brown" },
      },
    ],
  },
];

export default medical_records;
