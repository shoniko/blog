export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <span className="text-xl font-bold text-slate-900">Proposa</span>
            <p className="mt-1 text-sm text-slate-500">AI-powered proposals for European service businesses.</p>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#pricing" className="hover:text-slate-900">Pricing</a>
            <a href="mailto:hello@proposa.eu" className="hover:text-slate-900">Contact</a>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-8 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Proposa. Made in Europe.
          <span className="mx-2">|</span>
          <a href="#" className="hover:text-slate-600">Privacy</a>
          <span className="mx-2">|</span>
          <a href="#" className="hover:text-slate-600">Terms</a>
          <span className="mx-2">|</span>
          <a href="#" className="hover:text-slate-600">Imprint</a>
        </div>
      </div>
    </footer>
  )
}
