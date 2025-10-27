export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center space-y-8 max-w-2xl px-4">
        <div>
          <h1 className="text-4xl font-bold mb-4">Investitionsplanung</h1>
          <p className="text-muted-foreground text-lg">
            Multi-Mandanten Investitionsplanungsplattform
          </p>
        </div>

        <div className="bg-white rounded-lg border p-6 space-y-6">
          <h2 className="text-xl font-semibold">Erste Schritte</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4 text-left">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Mock-Daten generieren</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Erstellen Sie Testdaten für die Entwicklung
                </p>
                <a
                  href="/seed"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent h-9 px-4 py-2"
                >
                  Daten generieren →
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 text-left">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Anmelden</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Nutzen Sie einen der Demo-Accounts
                </p>
                <a
                  href="/login"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                >
                  Zum Login →
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <div className="font-semibold text-blue-900 mb-1">💡 Hinweis</div>
          <p className="text-blue-700">
            Lokale Entwicklungsversion - Daten werden im Browser gespeichert
          </p>
        </div>
      </div>
    </div>
  );
}
