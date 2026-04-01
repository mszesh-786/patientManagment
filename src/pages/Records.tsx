import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import medical_records from "../medicalRecords";

function Records({ id }: { id: string }) {
  const navigate = useNavigate();
  
  // Find the current patient by id
  const currentPatient = medical_records.find((p) => Number(p.id) === Number(id));
  const initialRecords = currentPatient?.data.slice(0, 3) || [];

  const [selectedRecord, setSelectedRecords] = React.useState(initialRecords);

  React.useEffect(() => {
    if (currentPatient) {
      setSelectedRecords(currentPatient.data.slice(0, 3));
    }
  }, [id, currentPatient]);

  const handleNext = () => {
    if (id != null) {
      // Find the index of the current patient
      const currentIndex = medical_records.findIndex(
        (p) => Number(p.id) === Number(id)
      );

      // -1 means patient not found, so only proceed if found and not at the end
      if (currentIndex !== -1 && currentIndex < medical_records.length - 1) {
        const nextPatient = medical_records[currentIndex + 1];
        setSelectedRecords(nextPatient.data.slice(0, 3)); // Use next patient's data
        navigate(`/records/${nextPatient.id}`);
      }
    }
  };

  const handlePrevious = () => {
    // Find the index of the current patient
    const currentIndex = medical_records.findIndex(
      (p) => Number(p.id) === Number(id)
    );

    // If there's a previous patient, navigate to it
    if (currentIndex > 0) {
      const previousPatient = medical_records[currentIndex - 1];
      navigate(`/records/${previousPatient.id}`);
    }
  };

  return (
    <div className="patient-profile-container" id="profile-view">
      <div className="layout-row justify-content-center">
        <div id="patient-profile" data-testid="patient-profile" className="mx-auto">
          <h4 id="patient-name">{currentPatient?.name || "Patient Name"}</h4>
          <h5 id="patient-dob">DOB: {currentPatient?.dob || "Patient DOB"}</h5>
          <h5 id="patient-height">Height: {currentPatient?.height || "Patient Height"}</h5>
        </div>
        <div className="mt-10 mr-10 flex gap-2">
          <button
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
            onClick={handlePrevious}
            disabled={medical_records.findIndex((p) => Number(p.id) === Number(id)) === 0}
          >
            Previous
          </button>
          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
            data-testid="next-btn"
            onClick={handleNext}
            disabled={
              medical_records.findIndex((p) => Number(p.id) === Number(id)) ===
              medical_records.length - 1
            }
          >
            Next
          </button>
        </div>
      </div>

      <table id="patient-records-table" className="w-full border-collapse border border-gray-300">
        <thead id="table-header">
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">SL</th>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Diagnosis</th>
            <th className="border border-gray-300 p-2">Weight</th>
            <th className="border border-gray-300 p-2">Doctor</th>
          </tr>
        </thead>
        <tbody id="table-body" data-testid="patient-table">
          {selectedRecord &&
            selectedRecord.map((record, index) => (
              <tr key={record.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">
                  {new Date(record.timestamp).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 p-2">{record.diagnosis.name}</td>
                <td className="border border-gray-300 p-2">{record.vitals.weight}</td>
                <td className="border border-gray-300 p-2">{record.doctor.name}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default Records;
