export default function Footer() {
  return (
    <footer className="border-t mt-10">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-500 flex flex-col sm:flex-row gap-2 sm:gap-0 sm:items-center sm:justify-between">
        <div>© {new Date().getFullYear()} SafeNest</div>
        <div>Built with love for podcasts.</div>
      </div>
    </footer>
  );
}
