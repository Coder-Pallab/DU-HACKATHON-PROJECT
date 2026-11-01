import { useMemo, useState } from "react";
import { X, BriefcaseBusiness, Bookmark } from "lucide-react";

import PageHeader from "../../Components/layout/PageHeader";

import JobCard from "../../Components/jobs/JobCard";
import JobFilters from "../../Components/jobs/JobFilters";
import JobSearch from "../../Components/jobs/JobSearch";
import ApplicationTracker from "../../Components/jobs/ApplicationTracker";

// Sample Job Data
const initialJobs = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "Tech Solutions",
    location: "Guwahati",
    type: "Internship",
    mode: "Remote",
    salary: "₹10,000 – ₹15,000/month",
    experience: "Fresher",
    skills: ["React", "JavaScript", "Tailwind CSS"],
    posted: "2 days ago",
    deadline: "15 Nov 2026",
    description:
      "Work with our development team to build responsive web applications using modern frontend technologies.",
  },
  {
    id: 2,
    title: "MERN Stack Developer",
    company: "WebTech Solutions",
    location: "Assam",
    type: "Full-time",
    mode: "Hybrid",
    salary: "₹20,000 – ₹30,000/month",
    experience: "Entry-level",
    skills: ["MongoDB", "Express", "React", "Node.js"],
    posted: "3 days ago",
    deadline: "20 Nov 2026",
    description:
      "Develop full-stack web applications using the MERN stack and collaborate with the product development team.",
  },
  {
    id: 3,
    title: "Data Analyst Intern",
    company: "Analytics Hub",
    location: "India",
    type: "Internship",
    mode: "Remote",
    salary: "₹8,000 – ₹12,000/month",
    experience: "Fresher",
    skills: ["Python", "SQL", "Excel", "Power BI"],
    posted: "1 day ago",
    deadline: "18 Nov 2026",
    description:
      "Assist the analytics team in collecting, analysing, and visualising data to generate meaningful insights.",
  },
  {
    id: 4,
    title: "UI/UX Designer",
    company: "Creative Studio",
    location: "Guwahati",
    type: "Part-time",
    mode: "On-site",
    salary: "₹12,000 – ₹18,000/month",
    experience: "Entry-level",
    skills: ["Figma", "UI Design", "Prototyping"],
    posted: "5 days ago",
    deadline: "25 Nov 2026",
    description:
      "Create user-friendly interfaces, design prototypes, and improve the overall user experience of digital products.",
  },
  {
    id: 5,
    title: "Backend Developer Intern",
    company: "CodeWorks",
    location: "India",
    type: "Internship",
    mode: "Remote",
    salary: "₹10,000 – ₹14,000/month",
    experience: "Fresher",
    skills: ["Node.js", "Express.js", "MongoDB"],
    posted: "4 days ago",
    deadline: "22 Nov 2026",
    description:
      "Learn and contribute to backend development, REST APIs, and database management.",
  },
];

// Default Filters
const initialFilters = {
  type: "All",
  mode: "All",
  location: "All",
  experience: "All",
};

function JobsInternships() {
  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState(initialFilters);

  const [savedJobs, setSavedJobs] = useState([]);

  const [applications, setApplications] = useState([]);

  const [selectedJob, setSelectedJob] = useState(null);

  const [selectedApplication, setSelectedApplication] = useState(null);

  // Search and Filter Jobs
  const filteredJobs = useMemo(() => {
    return initialJobs.filter((job) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        job.title.toLowerCase().includes(search) ||
        job.company.toLowerCase().includes(search) ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(search)
        );

      const matchesType =
        filters.type === "All" || job.type === filters.type;

      const matchesMode =
        filters.mode === "All" || job.mode === filters.mode;

      const matchesLocation =
        filters.location === "All" ||
        job.location === filters.location;

      const matchesExperience =
        filters.experience === "All" ||
        job.experience === filters.experience;

      return (
        matchesSearch &&
        matchesType &&
        matchesMode &&
        matchesLocation &&
        matchesExperience
      );
    });
  }, [searchTerm, filters]);

  // Save and Unsave Jobs
  const handleSaveJob = (job) => {
    setSavedJobs((previous) => {
      const alreadySaved = previous.some(
        (savedJob) => savedJob.id === job.id
      );

      if (alreadySaved) {
        return previous.filter(
          (savedJob) => savedJob.id !== job.id
        );
      }

      return [...previous, job];
    });
  };

  // Apply for Job
  const handleApply = (job) => {
    const alreadyApplied = applications.some(
      (application) => application.jobId === job.id
    );

    if (alreadyApplied) return;

    const newApplication = {
      id: Date.now(),
      jobId: job.id,
      title: job.title,
      company: job.company,
      appliedDate: new Date().toLocaleDateString("en-IN"),
      status: "Applied",
    };

    setApplications((previous) => [
      ...previous,
      newApplication,
    ]);

    setSelectedJob(null);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setFilters(initialFilters);
    setSearchTerm("");
  };

  const hasApplied = selectedJob
    ? applications.some(
        (application) => application.jobId === selectedJob.id
      )
    : false;

  return (
    <div className="w-full min-w-0 space-y-6">

      {/* Page Header */}
      <PageHeader
        title="Jobs & Internships"
        description="Discover opportunities, explore internships and take the next step in your career."
      />

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Available Opportunities
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {initialJobs.length}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Saved Jobs
          </p>

          <h2 className="mt-2 text-2xl font-bold text-teal-700">
            {savedJobs.length}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Applied Jobs
          </p>

          <h2 className="mt-2 text-2xl font-bold text-blue-600">
            {applications.length}
          </h2>
        </div>

      </div>

      {/* Search */}
      <JobSearch onSearch={setSearchTerm} />

      {/* Filters */}
      <JobFilters
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
      />

      {/* Available Jobs */}
      <section className="space-y-5">

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Explore Opportunities
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {filteredJobs.length} opportunities found
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <BriefcaseBusiness size={17} />
            Latest Opportunities
          </div>
        </div>

        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onView={setSelectedJob}
                onSave={handleSaveJob}
                isSaved={savedJobs.some(
                  (savedJob) => savedJob.id === job.id
                )}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center">
            <BriefcaseBusiness
              size={35}
              className="mx-auto text-gray-400"
            />

            <h3 className="mt-3 font-semibold text-gray-800">
              No opportunities found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filters.
            </p>

            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 text-sm font-semibold text-teal-700 hover:text-teal-900"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {/* Saved Jobs */}
      {savedJobs.length > 0 && (
        <section className="space-y-4">

          <div className="flex items-center gap-2">
            <Bookmark size={19} className="text-teal-700" />

            <h2 className="text-lg font-semibold text-gray-900">
              Saved Opportunities
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {savedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onView={setSelectedJob}
                onSave={handleSaveJob}
                isSaved={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* Application Tracker */}
      <ApplicationTracker
        applications={applications}
        onView={setSelectedApplication}
      />

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">

          <div className="my-auto w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl sm:p-7">

            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedJob.title}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedJob.company}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close job details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="my-5 space-y-3 text-sm text-gray-600">

              <p>
                <strong>Location:</strong> {selectedJob.location}
              </p>

              <p>
                <strong>Job Type:</strong> {selectedJob.type}
              </p>

              <p>
                <strong>Work Mode:</strong> {selectedJob.mode}
              </p>

              <p>
                <strong>Salary:</strong> {selectedJob.salary}
              </p>

              <p>
                <strong>Experience:</strong> {selectedJob.experience}
              </p>

              <p>
                <strong>Deadline:</strong> {selectedJob.deadline}
              </p>

            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Job Description
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {selectedJob.description}
              </p>
            </div>

            <div className="mt-5">
              <h3 className="font-semibold text-gray-900">
                Required Skills
              </h3>

              <div className="mt-2 flex flex-wrap gap-2">
                {selectedJob.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={hasApplied}
              onClick={() => handleApply(selectedJob)}
              className={`mt-7 w-full rounded-xl px-5 py-3 text-sm font-semibold text-white transition ${
                hasApplied
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-teal-700 hover:bg-teal-800"
              }`}
            >
              {hasApplied ? "Already Applied" : "Apply Now"}
            </button>

            <p className="mt-2 text-center text-xs text-gray-400">
              Demo only — no application is sent to an employer.
            </p>

          </div>
        </div>
      )}

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-gray-900">
                Application Details
              </h2>

              <button
                type="button"
                onClick={() => setSelectedApplication(null)}
                aria-label="Close application details"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 space-y-3 text-sm text-gray-600">
              <p>
                <strong>Position:</strong> {selectedApplication.title}
              </p>

              <p>
                <strong>Company:</strong> {selectedApplication.company}
              </p>

              <p>
                <strong>Applied Date:</strong>{" "}
                {selectedApplication.appliedDate}
              </p>

              <p>
                <strong>Status:</strong> {selectedApplication.status}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedApplication(null)}
              className="mt-6 w-full rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-800"
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default JobsInternships;