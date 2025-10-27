export default function Footer() {
  return (
    <footer className="bg-slate-800 border-t border-slate-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-center text-sm text-slate-400">
          &copy; {new Date().getFullYear()} CyberSecure. Built to promote cybersecurity awareness.
        </p>
      </div>
    </footer>
  );
}
