import { useState } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import PageHeader from "../../Components/layout/PageHeader";
import {
  Search,
  MessageCircle,
  Mail,
  Phone,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  UserRound,
  FileText,
  BriefcaseBusiness,
  GraduationCap,
} from "lucide-react";

const faqs = [
  {
    id: 1,
    category: "Account",
    question: "How can I create an account on Disha?",
    answer:
      "Create a student account from Sign Up with your name, email address, password, and optional phone number. Admin and recruiter registration are not supported.",
  },
  {
    id: 2,
    category: "Profile",
    question: "How can I update my profile information?",
    answer:
      "Open My Profile from your dashboard. You can update your personal details, educational background, languages and career interests.",
  },
  {
    id: 3,
    category: "Resume",
    question: "Which resume file formats are supported?",
    answer:
      "The resume API accepts PDF and DOCX files up to 4 MB on Vercel deployments and up to 10 MB in local development. Uploaded files are stored in Cloudinary and can be listed, downloaded, parsed, analyzed, or deleted from Resume & Skills.",
  },
  {
    id: 4,
    category: "Careers",
    question: "How does Disha recommend careers?",
    answer:
      "Career recommendations use the skills, interests, and academic information saved in your student profile. Refresh recommendations after updating those details.",
  },
  {
    id: 5,
    category: "Learning",
    question: "Can I track my learning progress?",
    answer:
      "Generate a roadmap for a career and update each phase as not started, in progress, or completed. The current backend provides activities and progress tracking, but not a course catalog.",
  },
  {
    id: 6,
    category: "Jobs",
    question: "Can I apply for jobs through Disha?",
    answer:
      "The current backend does not provide job listings, application, or placement-readiness APIs, so these features are unavailable in the connected interface.",
  },
  {
    id: 7,
    category: "AI Counsellor",
    question: "Is the AI Counsellor fully functional?",
    answer:
      "The counsellor sends your messages to the backend AI service and saves conversation history. Responses depend on the backend Gemini configuration. English and Assamese are supported.",
  },
  {
    id: 8,
    category: "Language",
    question: "Does Disha support Assamese?",
    answer:
      "You can save English or Assamese as your preferred language. The counsellor request uses that language selection; translated labels are available where the frontend has translations.",
  },
];

const categories = [
  {
    title: "Account & Profile",
    description: "Questions about your account and personal information.",
    icon: UserRound,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Resume & Skills",
    description: "Help with resumes, skills and profile completion.",
    icon: FileText,
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "Career Guidance",
    description: "Explore career recommendations and opportunities.",
    icon: BriefcaseBusiness,
    color: "bg-teal-50 text-teal-700",
  },
  {
    title: "Learning & Placement",
    description: "Learning roadmaps, assessments and preparation.",
    icon: GraduationCap,
    color: "bg-orange-50 text-orange-600",
  },
];

function HelpSupport() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);

  const filteredFaqs = faqs.filter((faq) => {
    const search = searchTerm.toLowerCase();

    return (
      faq.question.toLowerCase().includes(search) ||
      faq.answer.toLowerCase().includes(search) ||
      faq.category.toLowerCase().includes(search)
    );
  });

  return (
    <div className="w-full min-w-0 space-y-7">

      <PageHeader
        title="Help & Support"
        description="Find answers to common questions or contact our support team."
      />

      {/* Hero Section */}
      <section className="rounded-2xl bg-teal-800 p-6 text-white shadow-sm sm:p-9">

        <div className="max-w-2xl">

          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-700">
            <HelpCircle size={27} />
          </div>

          <h2 className="text-2xl font-bold sm:text-3xl">
            {t("How can we help you?")}
          </h2>

          <p className="mt-3 text-sm leading-6 text-teal-100 sm:text-base">
            {t("Explore our help center to find answers about your account, career guidance, learning roadmap and more.")}
          </p>

          <div className="mt-6 flex items-center gap-3 rounded-xl bg-white px-4 py-3">

            <Search size={20} className="shrink-0 text-gray-400" />

            <input
              type="text"
              placeholder={t("Search your questions...")}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setActiveFaq(null);
              }}
              className="w-full min-w-0 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
            />

          </div>

        </div>
      </section>

      {/* Support Categories */}
      <section>

        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            {t("Browse Help Topics")}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {t("Find assistance based on your requirements.")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <div
                key={category.title}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${category.color}`}>
                  <Icon size={22} />
                </div>

                <h3 className="font-semibold text-gray-900">
                  {t(category.title, category.title)}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {t(category.description, category.description)}
                </p>

              </div>
            );
          })}

        </div>
      </section>

      {/* FAQ Section */}
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {t("Frequently Asked Questions")}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {t("Find quick answers to common questions.")}
          </p>
        </div>

        <div className="space-y-3">

          {filteredFaqs.length > 0 ? (

            filteredFaqs.map((faq) => {
              const isOpen = activeFaq === faq.id;

              return (
                <div
                  key={faq.id}
                  className="overflow-hidden rounded-xl border border-gray-100"
                >

                  <button
                    type="button"
                    onClick={() =>
                      setActiveFaq(isOpen ? null : faq.id)
                    }
                    className="flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-gray-50 sm:p-5"
                  >

                    <div>
                      <span className="mb-2 inline-block rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                        {t(faq.category, faq.category)}
                      </span>

                      <h3 className="text-sm font-semibold leading-6 text-gray-800">
                        {t(faq.question, faq.question)}
                      </h3>
                    </div>

                    {isOpen ? (
                      <ChevronUp
                        size={20}
                        className="shrink-0 text-teal-700"
                      />
                    ) : (
                      <ChevronDown
                        size={20}
                        className="shrink-0 text-gray-400"
                      />
                    )}

                  </button>

                  {isOpen && (
                    <div className="border-t border-gray-100 bg-gray-50 px-4 py-4 sm:px-5">
                      <p className="text-sm leading-7 text-gray-600">
                        {t(faq.answer, faq.answer)}
                      </p>
                    </div>
                  )}

                </div>
              );
            })

          ) : (

            <div className="py-12 text-center">
              <Search
                size={32}
                className="mx-auto text-gray-300"
              />

              <h3 className="mt-3 font-semibold text-gray-800">
                {t("No matching questions")}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {t("Try searching with a different keyword.")}
              </p>
            </div>

          )}

        </div>
      </section>

      {/* Contact Support */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">

        {/* Contact Information */}
        <div className="space-y-5 xl:col-span-2">

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {t("Still need help?")}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {t("Can't find the answer? Use the support form to describe your issue.")}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <MessageCircle size={21} />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">
                  {t("Support Center")}
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  {t("We're here to help you.")}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5">

              <div className="flex items-center gap-3">
                <Mail size={18} className="text-teal-700" />

                <div>
                  <p className="text-xs text-gray-400">
                    {t("Email Support")}
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {t("Support contact coming soon")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} className="text-teal-700" />

                <div>
                  <p className="text-xs text-gray-400">
                    {t("Phone Support")}
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {t("Contact information coming soon")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <BookOpen size={18} className="text-teal-700" />

                <div>
                  <p className="text-xs text-gray-400">
                    {t("Help Resources")}
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {t("Disha Help Center")}
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm sm:p-7 xl:col-span-3">
          <h2 className="text-lg font-semibold text-amber-900">Support contact unavailable</h2>
          <p className="mt-2 text-sm leading-6 text-amber-800">
            The current backend does not provide a support-request endpoint or published email/phone contact. This page will not pretend to submit a support ticket.
          </p>
        </div>

      </section>

    </div>
  );
}

export default HelpSupport;
