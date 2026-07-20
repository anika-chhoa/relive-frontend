export default function TermsPage() {
  return (
    <main className="min-h-screen bg-bg text-ink px-6 py-20 sm:px-10 lg:px-24">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="space-y-2">
          <h1 className="font-display text-4xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-xs text-ink-faint uppercase tracking-wider">Effective Date: July 20, 2026</p>
        </div>

        <p className="text-base text-ink-muted leading-relaxed font-light">
          By gaining access to, executing operations within, or registering an active profile on Relive, you systematically acknowledge and match our marketplace parameters.
        </p>

        <div className="h-px bg-border" />

        <div className="space-y-6 text-sm sm:text-base text-ink-muted leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-ink">1. Account Integrity & Roles</h2>
            <p>Users are expected to supply honest metrics during form validation. Creating dummy setups, system exploits, or unauthorized automated scripts will trigger persistent hardware bans from the server clusters.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-ink">2. Listing Rules & Product Lifecycle</h2>
            <p>Sellers agree that all item profiles must accurately map the exact status of the real-world good. To maintain high platform trust and transactional transparency:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li>Products booked or paid for by a verified buyer are immediately removed from exploration search arrays.</li>
              <li>These histories remain securely preserved on individual dashboards to unlock reviewing rights once status indicates &ldquo;Completed&rdquo;.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-ink">3. Limitation of Liabilities</h2>
            <p>Relive offers a decentralized C2C infrastructure space. While we employ strict data policies and user validations, the platform is not directly liable for secondary physical component wear or out-of-band communication beyond our architecture.</p>
          </section>

        </div>
      </div>
    </main>
  );
}