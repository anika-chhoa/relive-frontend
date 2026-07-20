export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-bg text-ink px-6 py-20 sm:px-10 lg:px-24">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="space-y-2">
          <h1 className="font-display text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-ink-faint uppercase tracking-wider">Effective Date: July 20, 2026</p>
        </div>

        <p className="text-base text-ink-muted leading-relaxed font-light">
          At Relive, your digital privacy and identity safety are foundational to our marketplace architecture. This Privacy Policy details exactly how your metadata, account logs, and transactional information are managed.
        </p>

        <div className="h-px bg-border" />

        <div className="space-y-6 text-sm sm:text-base text-ink-muted leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-ink">1. Information Collection</h2>
            <p>We actively gather data vital for transactional operations and safety validation, including:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li><strong>Profile Metrics:</strong> Standard identifier nodes (Name, authenticated Email, active Phone profiles).</li>
              <li><strong>Marketplace Analytics:</strong> Inventory uploads, category search behaviors, and communication patterns via our secure chat layers.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-ink">2. Advanced Data Encryption & Security</h2>
            <p>All core authentication mechanisms flow securely through encrypted architectures. Financial variables, user credentials, and session logs are run behind layers of tokens preventing cross-site scripting (XSS) or third-party unauthorized exploration.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-ink">3. Information Dissemination</h2>
            <p>Relive strictly prohibits the commercial monetization or direct sale of your behavioral transaction records. Information is shared strictly under compliance triggers or with shipping entities solely to conclude order logic pipelines.</p>
          </section>

        </div>
      </div>
    </main>
  );
}