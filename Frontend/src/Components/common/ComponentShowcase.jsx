import { useState } from "react";

import Button from "./Button";
import Input from "./Input";
import Select from "./Select";
import Badge from "./Badges";
import ProgressBar from "./ProgressBar";
import Modal from "./Modal";
import Loader from "./Loader";
import EmptyState from "./EmptyState";

function ComponentShowcase() {
  const [name, setName] = useState("");
  const [education, setEducation] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const educationOptions = [
    { label: "Class 10", value: "10th" },
    { label: "Class 12", value: "12th" },
    { label: "Graduation", value: "graduation" },
    { label: "Post Graduation", value: "postgraduation" }
  ];

  return (
    <div className="min-h-screen space-y-10 bg-slate-50 p-8">

      <h1 className="text-3xl font-bold text-slate-900">
        Disha Component Showcase
      </h1>

      {/* Buttons */}
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-semibold">
          Buttons
        </h2>

        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </section>

      {/* Inputs */}
      <section className="max-w-xl rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-semibold">
          Form Components
        </h2>

        <div className="space-y-5">
          <Input
            label="Full Name"
            name="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Select
            label="Education"
            name="education"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            options={educationOptions}
          />

          <Button
            onClick={() => alert(`Hello ${name}!`)}
          >
            Submit
          </Button>
        </div>
      </section>

      {/* Badges */}
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-semibold">
          Badges
        </h2>

        <div className="flex flex-wrap gap-3">
          <Badge variant="success">Completed</Badge>
          <Badge variant="warning">In Progress</Badge>
          <Badge variant="primary">Recommended</Badge>
          <Badge variant="danger">Required</Badge>
        </div>
      </section>

      {/* Progress */}
      <section className="max-w-xl rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-semibold">
          Progress Bar
        </h2>

        <ProgressBar
          value={75}
          label="Profile Completion"
        />
      </section>

      {/* Modal */}
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-semibold">
          Modal
        </h2>

        <Button onClick={() => setModalOpen(true)}>
          Open Modal
        </Button>

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Welcome to Disha"
        >
          <p className="text-gray-600">
            Your reusable modal component is working!
          </p>
        </Modal>
      </section>

      {/* Loader */}
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-semibold">
          Loader
        </h2>

        <Loader text="Loading your profile..." />
      </section>

      {/* Empty State */}
      <section>
        <h2 className="mb-5 text-xl font-semibold">
          Empty State
        </h2>

        <EmptyState
          title="No careers saved"
          description="Your saved career recommendations will appear here."
        />
      </section>

    </div>
  );
}

export default ComponentShowcase;