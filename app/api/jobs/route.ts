import { NextResponse } from "next/server";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
}

const jobs: Job[] = [
  {
    id: "1",
    title: "Senior Data Engineer",
    company: "Acme Corp",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$180k – $220k",
    posted: "2d ago",
  },
  {
    id: "2",
    title: "ML Platform Engineer",
    company: "NovaTech",
    location: "Remote",
    type: "Full-time",
    salary: "$160k – $200k",
    posted: "5d ago",
  },
  {
    id: "3",
    title: "Frontend Developer",
    company: "PixelPerfect",
    location: "New York, NY",
    type: "Contract",
    salary: "$90/hr",
    posted: "1d ago",
  },
  {
    id: "4",
    title: "DevOps Engineer",
    company: "CloudScale",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$150k – $185k",
    posted: "3d ago",
  },
];

export async function GET() {
  return NextResponse.json({ jobs });
}
