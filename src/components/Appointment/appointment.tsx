"use client";

import Link from "next/link";
import React, { useState, ChangeEvent, FormEvent } from "react";
import axiosInstance from '../axoisInstance';
import AppointmentModal from "./appointmentmodal";
import SuccessModal from './successModal';
import { AxiosError } from 'axios';  // Import AxiosError for error handling

// Define types for the appointment request
interface AppointmentRequest {
  title: string;
  specialist: string;
  location: string;
  startTime: string;
  endTime: string;
  description: string;
  appointmentType: number;
  isRecurring: boolean;
  frequency: string;
  userId: number;
  patientId: number;
}

const Appointment: React.FC = () => {
  const [appointmentRequest, setAppointmentRequest] = useState<AppointmentRequest>({
    title: "",
    specialist: "",
    location: "",
    startTime: "",
    endTime: "",
    description: "",
    appointmentType: 0,
    isRecurring: false,
    frequency: "",
    userId: 12345, // example user ID
    patientId: 6789, // example patient ID
  });

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState<boolean>(false);

  const specialists = [
    "Normal Doctor", "Anesthesiologist", "Cardiologist", "Dermatologist", "Family Medicine",
    "Gastroenterologist", "General Practitioner", "Gynecologist", "Nephrologist", "Neurologist",
    "Obstetrician", "Oncologist", "Ophthalmologist", "Orthopedic Surgeon", "Otolaryngologist (ENT)",
    "Pediatrician", "Physiatrist (Physical Medicine & Rehabilitation)", "Plastic Surgeon", "Psychiatrist",
    "Radiologist", "Rheumatologist", "Surgeon", "Urologist", "Vascular Surgeon", "Public Health Specialist",
    "Geneticist", "Pathologist", "Immunologist", "Sleep Medicine Specialist", "Toxicologist",
    "Speech-Language Pathologist", "Chiropractor", "Dietitian/Nutritionist", "Midwife", "Nurse Practitioner",
    "Clinical Psychologist", "Orthodontist"
  ];

  const handleModalAction = () => {
    setModalOpen(false);
    handleSubmit(); // Proceed with form submission after modal confirmation
  };

  // Handle form changes for different inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAppointmentRequest((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle checkbox change for recurring appointments
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAppointmentRequest((prev) => ({
      ...prev,
      isRecurring: e.target.checked,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    console.log('Submitting appointment data:', appointmentRequest);

    setSuccessModalOpen(true);
    setModalOpen(false);

    setTimeout(() => {
      setSuccessModalOpen(false);
    }, 3000);

    try {
      const response = await axiosInstance.post("/Appointment", appointmentRequest);
      console.log('Appointment created', response.data);
    } catch (error: unknown) {
      // Handle the error safely by narrowing the error type
      if (isAxiosError(error)) {
        console.error("Error booking appointment", error.response?.data || error.message);
      } else {
        console.error("An unknown error occurred", error);
      }
    }
  };

  // Type guard to check if the error is an AxiosError
  function isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError).isAxiosError !== undefined;
  }

  return (
    <section className="bg-gray-100 p-5 w-full border-2 border-gray-300 rounded-xl shadow-lg transition-all duration-300 ease-in-out hover:border-blue-500 hover:shadow-xl">
      <div className="max-w-2xl mx-auto p-5 rounded-lg">
        <h2 className="text-center text-gray-900 font-bold text-2xl mb-5">Create Appointment</h2>
        <form className="appointment-form space-y-4" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="block text-sm text-gray-700">Title:</label>
            <input
              type="text"
              name="title"
              value={appointmentRequest.title}
              onChange={handleChange}
              placeholder="Enter appointment title"
              className="w-full p-3 mt-1 border border-gray-300 rounded-md bg-gray-50 text-gray-800 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm text-gray-700">Specialist:</label>
            <select
              name="specialist"
              value={appointmentRequest.specialist}
              onChange={handleChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md bg-gray-50 text-gray-800 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select Specialist</option>
              {specialists.map((specialty, index) => (
                <option key={index} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="block text-sm text-gray-700">Location:</label>
            <input
              type="text"
              name="location"
              value={appointmentRequest.location}
              onChange={handleChange}
              placeholder="Enter location"
              className="w-full p-3 mt-1 border border-gray-300 rounded-md bg-gray-50 text-gray-800 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-between gap-4">
            <div className="form-group w-1/2">
              <label className="block text-sm text-gray-700">Start Date:</label>
              <input
                type="date"
                name="startDate"
                value={appointmentRequest.startTime ? appointmentRequest.startTime.split('T')[0] : ""}
                onChange={(e) => {
                  const date = e.target.value;
                  const time = appointmentRequest.startTime ? appointmentRequest.startTime.split('T')[1].substring(0, 5) : "00:00";
                  setAppointmentRequest((prev) => ({
                    ...prev,
                    startTime: `${date}T${time}:00.000Z`,
                  }));
                }}
                className="w-full p-3 mt-1 border border-gray-300 rounded-md bg-gray-50 text-gray-800 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="form-group w-1/2">
              <label className="block text-sm text-gray-700">Start Time:</label>
              <input
                type="time"
                name="startTime"
                value={appointmentRequest.startTime ? appointmentRequest.startTime.split('T')[1].substring(0, 5) : ""}
                onChange={(e) => {
                  const time = e.target.value;
                  const date = appointmentRequest.startTime ? appointmentRequest.startTime.split('T')[0] : "1970-01-01";
                  setAppointmentRequest((prev) => ({
                    ...prev,
                    startTime: `${date}T${time}:00.000Z`,
                  }));
                }}
                className="w-full p-3 mt-1 border border-gray-300 rounded-md bg-gray-50 text-gray-800 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Similar input handling for end date and time */}

          <div className="form-group">
            <label className="block text-sm text-gray-700">Description:</label>
            <textarea
              name="description"
              value={appointmentRequest.description}
              onChange={handleChange}
              placeholder="Enter description"
              className="w-full p-3 mt-1 border border-gray-300 rounded-md bg-gray-50 text-gray-800 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm text-gray-700">Appointment Type:</label>
            <select
              name="appointmentType"
              value={appointmentRequest.appointmentType}
              onChange={handleChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md bg-gray-50 text-gray-800 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select Appointment Type</option>
              <option value="1">CheckUp</option>
              <option value="2">Consultation</option>
              <option value="3">DrugPickup</option>
            </select>
          </div>

          <div className="form-group">
            <label className="block text-sm text-gray-700">Is this appointment recurring?</label>
            <input
              type="checkbox"
              checked={appointmentRequest.isRecurring}
              onChange={handleCheckboxChange}
              className="mt-1 p-3" 
            />
          </div>

          {appointmentRequest.isRecurring && (
            <div className="form-group">
              <label className="block text-sm text-gray-700">Frequency:</label>
              <input
                type="text"
                name="frequency"
                value={appointmentRequest.frequency}
                onChange={handleChange}
                placeholder="Enter frequency (e.g., weekly, monthly)"
                className="w-full p-3 mt-1 border border-gray-300 rounded-md bg-gray-50 text-gray-800 focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Book Appointment
          </button>

          <Link href="/chatBox">
            <div className="text-center text-blue-600 mt-2">or Chat with Doctor</div>
          </Link>
        </form>
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleModalAction}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        message="Your appointment has been successfully booked!"
      />
    </section>
  );
};

export default Appointment;
