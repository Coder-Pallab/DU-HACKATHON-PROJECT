import { useState } from "react";

import PageHeader from "../../Components/layout/PageHeader";

import RoadmapCard from "../../Components/roadmap/RoadmapCard";
import RoadmapTimeline from "../../Components/roadmap/RoadmapTimeline";
import LearningMilestone from "../../Components/roadmap/LearningMilestone";
import CourseCard from "../../Components/roadmap/CourseCard";

const roadmaps = [
  {
    id: 1,
    title: "Frontend Developer",
    description:
      "Master frontend development and learn to build modern, responsive websites.",
    duration: "6 Months",
    milestones: 5,
    progress: 60,
    level: "Beginner to Advanced",
  },
  {
    id: 2,
    title: "Full Stack Developer",
    description:
      "Learn frontend and backend technologies to build complete web applications.",
    duration: "8 Months",
    milestones: 7,
    progress: 25,
    level: "Beginner to Advanced",
  },
  {
    id: 3,
    title: "Data Analyst",
    description:
      "Develop data analysis skills using Python, SQL and visualization tools.",
    duration: "5 Months",
    milestones: 5,
    progress: 10,
    level: "Beginner",
  },
];

const milestones = [
  {
    id: 1,
    title: "HTML Fundamentals",
    description:
      "Learn HTML elements, forms, semantic tags and page structure.",
    duration: "2 Weeks",
    status: "completed",
  },
  {
    id: 2,
    title: "CSS & Responsive Design",
    description:
      "Understand styling, Flexbox, Grid and responsive layouts.",
    duration: "3 Weeks",
    status: "completed",
  },
  {
    id: 3,
    title: "JavaScript Fundamentals",
    description:
      "Learn variables, functions, arrays, objects and DOM manipulation.",
    duration: "4 Weeks",
    status: "current",
  },
  {
    id: 4,
    title: "React.js Development",
    description:
      "Understand components, props, hooks and React Router.",
    duration: "4 Weeks",
    status: "upcoming",
  },
  {
    id: 5,
    title: "Build Real-world Projects",
    description:
      "Create practical projects and develop your portfolio.",
    duration: "3 Weeks",
    status: "upcoming",
  },
];

const courses = [
  {
    title: "Complete JavaScript Course",
    platform: "Udemy",
    instructor: "Course Instructor",
    duration: "40 Hours",
    level: "Beginner",
    rating: "4.7",
    description:
      "Understand JavaScript fundamentals and modern ES6+ features.",
    topics: ["JavaScript", "ES6", "DOM", "Async JavaScript"],
  },
  {
    title: "React.js Complete Guide",
    platform: "Udemy",
    instructor: "Course Instructor",
    duration: "25 Hours",
    level: "Intermediate",
    rating: "4.8",
    description:
      "Learn React components, hooks, state management and routing.",
    topics: ["React", "Hooks", "Components", "React Router"],
  },
  {
    title: "Git and GitHub Essentials",
    platform: "Online Learning",
    instructor: "Learning Team",
    duration: "8 Hours",
    level: "Beginner",
    rating: "4.6",
    description:
      "Learn version control and collaborate on development projects.",
    topics: ["Git", "GitHub", "Branches", "Collaboration"],
  },
];

function LearningRoadmap() {
  const [selectedRoadmap, setSelectedRoadmap] = useState(roadmaps[0]);

  return (
    <div className="w-full min-w-0 space-y-8">

      {/* Page Header */}
      <PageHeader
        title="Learning Roadmap"
        description="Follow structured learning paths, complete milestones and develop skills for your career."
      />

      {/* Available Roadmaps */}
      <section className="space-y-5">

        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Explore Learning Paths
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Choose a career path and start developing relevant skills.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

          {roadmaps.map((roadmap) => (
            <RoadmapCard
              key={roadmap.id}
              {...roadmap}
              onViewRoadmap={() => setSelectedRoadmap(roadmap)}
            />
          ))}

        </div>
      </section>

      {/* Selected Roadmap */}
      {selectedRoadmap && (
        <>
          <section className="space-y-5">

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {selectedRoadmap.title} Roadmap
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Follow the milestones to achieve your learning goals.
              </p>
            </div>

            <RoadmapTimeline milestones={milestones} />

          </section>

          {/* Current Learning Milestone */}
          <section className="space-y-5">

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Current Learning Milestone
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Complete individual topics and track your learning progress.
              </p>
            </div>

            <LearningMilestone
              title="JavaScript Fundamentals"
              description="Build a strong foundation in JavaScript programming."
              duration="4 Weeks"
              topics={[
                "Variables and Data Types",
                "Functions and Scope",
                "Arrays and Objects",
                "DOM Manipulation",
                "ES6+ Features",
              ]}
            />

          </section>
        </>
      )}

      {/* Recommended Courses */}
      <section className="space-y-5">

        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Recommended Courses
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Explore courses that can help you develop your skills.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

          {courses.map((course, index) => (
            <CourseCard
              key={index}
              {...course}
            />
          ))}

        </div>

      </section>

    </div>
  );
}

export default LearningRoadmap;