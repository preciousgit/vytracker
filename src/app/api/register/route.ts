import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parse JSON safely
    const body = await req.json();
    console.log("Received Registration Data:", body);

    // Required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "dateOfBirth",
      "gender",
      "email",
      "weight",
      "temperature",
      "pulseRate",
      "respiratoryRate",
      "password",
    ];

    // Check for missing fields
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Basic Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // 🔒 Password Security Check
    if (body.password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // ✅ Simulate checking for existing user (Replace with actual DB query)
    const existingUser = await checkUserExists(body.email); // Function to query DB
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    // ✅ Simulated database save (Replace with actual DB operation)
    const newUser = await saveUserToDatabase(body);

    return NextResponse.json({ message: "Registration successful!", user: newUser }, { status: 201 });

  } catch (error) {
    console.error("Error in /api/register:", error);

    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// 🔍 Mock database check (Replace with actual DB logic)
async function checkUserExists(email: string): Promise<boolean> {
  console.log(`Checking if user exists with email: ${email}`);
  return false; // Simulated: Change this to a real DB check
}

// 🔍 Mock user save (Replace with actual DB logic)
interface User {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  weight: number;
  temperature: number;
  pulseRate: number;
  respiratoryRate: number;
  password: string;
}

async function saveUserToDatabase(user: User) {
  return { id: 1, ...user }; // Simulated: Change this to a real DB insert
}
