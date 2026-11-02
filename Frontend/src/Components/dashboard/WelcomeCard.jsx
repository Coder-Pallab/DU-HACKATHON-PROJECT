import { ArrowRight, Sparkles } from "lucide-react";
import Button from "../common/Button";
import { useLanguage } from "../../hooks/useLanguage";

function WelcomeCard({ name = "Student" }) {
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-800 to-teal-600 p-6 text-white md:p-8">

      <div className="relative z-10 max-w-xl">

        <div className="mb-3 flex items-center gap-2 text-teal-100">
          <Sparkles size={18} />
          <span className="text-sm font-medium">
            {t("Your Career Journey Starts Here")}
          </span>
        </div>

        <h1 className="text-2xl font-bold md:text-3xl">
          {t("Welcome back,")} {name}! 👋
        </h1>

        <p className="mt-3 text-sm leading-6 text-teal-100 md:text-base">
          {t("Discover your strengths, explore career opportunities, and take the next step towards your dream career.")}
        </p>

        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => console.log("Explore careers")}
        >
          {t("Explore Careers")}
          <ArrowRight size={17} className="ml-2 inline" />
        </Button>

      </div>

      <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10" />

      <div className="pointer-events-none absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-white/10" />

    </div>
  );
}

export default WelcomeCard;
