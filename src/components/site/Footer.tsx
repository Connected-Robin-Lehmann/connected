export function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-primary" />
          Connected Webdesign © 2025
        </div>
        <div className="flex items-center gap-6">
          <span>Heidelberg</span>
          <a href="#" className="hover:text-foreground transition">Impressum</a>
          <a href="#" className="hover:text-foreground transition">Datenschutz</a>
        </div>
      </div>
    </footer>
  );
}
