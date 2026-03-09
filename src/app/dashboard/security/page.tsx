const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

async function getSystemHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/system-health`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getRecentAudit() {
  try {
    const res = await fetch(`${API_BASE}/api/audit?limit=20`, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  resource_type: string;
  created_at: string;
}

export default async function SecurityPage() {
  const [health, audit] = await Promise.all([getSystemHealth(), getRecentAudit()]);

  const securityChecks = [
    { name: "Secrets in ENV (not hardcoded)", status: "pass", note: "All secrets via environment variables" },
    { name: "CORS Configuration", status: "warning", note: "Currently allow_origins=['*'] — restrict in production" },
    { name: "n8n Basic Auth", status: "pass", note: "N8N_BASIC_AUTH_ACTIVE=true" },
    { name: "Database Auth", status: "pass", note: "PostgreSQL requires password" },
    { name: "Audit Trail", status: "pass", note: "All material actions logged to audit_events" },
    { name: "Secret Exposure in Logs", status: "pass", note: "No raw secrets in log output" },
    { name: "HTTPS/TLS", status: "warning", note: "Not configured — requires domain + Cloudflare" },
    { name: "Rate Limiting", status: "warning", note: "LiteLLM budget caps configured; API rate limits pending" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Security</h1>

      {/* Security Checks */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Security Posture</h2>
        <div className="space-y-2">
          {securityChecks.map((check, i) => (
            <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{check.name}</p>
                <p className="text-xs text-neutral-500">{check.note}</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs ${
                check.status === "pass" ? "bg-green-900/30 text-green-400" :
                check.status === "fail" ? "bg-red-900/30 text-red-400" :
                "bg-yellow-900/30 text-yellow-400"
              }`}>
                {check.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Service Health */}
      {health && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Service Health</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(health).map(([name, data]) => {
              const d = data as { status: string };
              return (
                <div key={name} className="bg-neutral-900 border border-neutral-800 rounded-lg p-3">
                  <p className="text-xs text-neutral-500">{name}</p>
                  <p className={`text-sm font-medium ${
                    d.status === "healthy" ? "text-green-400" :
                    d.status === "unreachable" ? "text-red-400" : "text-yellow-400"
                  }`}>{d.status}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Recent Audit Activity */}
      {audit && (
        <section>
          <h2 className="text-lg font-semibold mb-3">Recent Audit Activity</h2>
          <div className="space-y-1">
            {audit.events.map((evt: AuditEvent) => (
              <div key={evt.id} className="flex items-center gap-3 text-sm py-1 border-b border-neutral-800/50">
                <span className="text-neutral-500 text-xs w-40">{new Date(evt.created_at).toLocaleString()}</span>
                <span className="font-medium w-32">{evt.actor}</span>
                <span className="text-neutral-400">{evt.action}</span>
                <span className="text-neutral-600">{evt.resource_type}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
