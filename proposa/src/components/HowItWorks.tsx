export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Describe your business',
      description: 'Tell Proposa about your company, services, and preferred tone. Do this once — we remember it.',
    },
    {
      number: '02',
      title: 'Paste the client brief',
      description: 'Drop in the RFP, client email, or project description. The messier, the better — our AI untangles it.',
    },
    {
      number: '03',
      title: 'Get a polished proposal',
      description: 'Receive a structured, professional proposal with scope, timeline, and pricing. Edit, export, and send.',
    },
  ]

  return (
    <section id="how-it-works" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Three steps. One proposal.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            What used to take 4 hours now takes 4 minutes.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="relative rounded-2xl border border-slate-200 bg-slate-50 p-8">
              <span className="text-5xl font-bold text-indigo-100">{step.number}</span>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
