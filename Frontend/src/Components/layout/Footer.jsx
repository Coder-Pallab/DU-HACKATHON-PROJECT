function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 pt-5">

      <div className="flex flex-col items-center justify-between gap-3 text-center text-sm text-slate-500 sm:flex-row sm:text-left">

        <p>
          © {new Date().getFullYear()} Disha. All rights reserved.
        </p>

        <div className="flex gap-5">
          <a href="#" className="hover:text-teal-700">
            Privacy Policy
          </a>

          <a href="#" className="hover:text-teal-700">
            Terms
          </a>

          <a href="#" className="hover:text-teal-700">
            Contact
          </a>
        </div>

      </div>

    </footer>
  );
}

export default Footer;