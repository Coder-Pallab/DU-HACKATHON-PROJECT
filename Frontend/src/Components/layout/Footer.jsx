import { useLanguage } from "../../hooks/useLanguage";

function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-10 border-t border-slate-200 pt-5">

      <div className="flex flex-col items-center justify-between gap-3 text-center text-sm text-slate-500 sm:flex-row sm:text-left">

        <p>
          © {new Date().getFullYear()} Disha. {t("All rights reserved.")}
        </p>

        <div className="flex gap-5">
          <a href="#" className="hover:text-teal-700">
            {t("Privacy Policy")}
          </a>

          <a href="#" className="hover:text-teal-700">
            {t("Terms")}
          </a>

          <a href="#" className="hover:text-teal-700">
            {t("Contact")}
          </a>
        </div>

      </div>

    </footer>
  );
}

export default Footer;
