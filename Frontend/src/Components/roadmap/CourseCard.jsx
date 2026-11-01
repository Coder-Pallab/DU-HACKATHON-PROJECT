import {
  BookOpen,
  Clock,
  Star,
  ExternalLink,
  GraduationCap,
} from "lucide-react";

function CourseCard({
  title = "Complete React.js Course",
  platform = "Udemy",
  instructor = "Web Development Instructor",
  duration = "25 Hours",
  level = "Beginner",
  rating = "4.8",
  description = "Learn React.js from fundamentals to advanced concepts through practical projects.",
  topics = ["React", "Hooks", "Components", "React Router"],
  courseUrl = "",
}) {
  const levelStyles = {
    Beginner: "bg-green-50 text-green-700",
    Intermediate: "bg-yellow-50 text-yellow-700",
    Advanced: "bg-red-50 text-red-700",
  };

  return (
    <div className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-6">

      {/* Course Header */}
      <div className="mb-4 flex items-start justify-between gap-3">

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          <GraduationCap size={25} />
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            levelStyles[level] || "bg-slate-100 text-slate-600"
          }`}
        >
          {level}
        </span>

      </div>

      {/* Course Information */}
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
          {platform}
        </p>

        <h3 className="mt-2 text-lg font-bold text-slate-800">
          {title}
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          By {instructor}
        </p>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          {description}
        </p>
      </div>

      {/* Course Details */}
      <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">

        <div className="flex items-center gap-1.5">
          <Clock size={16} className="text-teal-600" />
          {duration}
        </div>

        <div className="flex items-center gap-1.5">
          <Star size={16} className="fill-yellow-400 text-yellow-400" />
          {rating}
        </div>

      </div>

      {/* Topics */}
      <div className="mb-5">
        <p className="mb-2 text-xs font-semibold text-slate-700">
          What you'll learn
        </p>

        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <span
              key={topic}
              className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-600"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-slate-100 pt-4">

        <a
          href={courseUrl || undefined}
          target={courseUrl ? "_blank" : undefined}
          rel={courseUrl ? "noopener noreferrer" : undefined}
          aria-disabled={!courseUrl}
          onClick={(event) => {
            if (!courseUrl) event.preventDefault();
          }}
          className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition ${
            courseUrl
              ? "bg-teal-700 text-white hover:bg-teal-800"
              : "cursor-not-allowed bg-slate-100 text-slate-400"
          }`}
        >
          <BookOpen size={17} />
          {courseUrl ? "Explore Course" : "Course Link Coming Soon"}
          {courseUrl && <ExternalLink size={15} />}
        </a>

      </div>

    </div>
  );
}

export default CourseCard;