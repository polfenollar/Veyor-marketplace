"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type Tariff = {
  id: number;
  mode: string;
  originPort: string;
  destinationPort: string;
  price: number;
  currency: string;
  validFrom: string;
  validTo: string;
  transitTimeDays: number;
  carrierName: string;
};

export default function TariffsPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    mode: "AIR",
    originPort: "",
    destinationPort: "",
    price: "",
    currency: "USD",
    validFrom: "",
    validTo: "",
    transitTimeDays: "",
    carrierName: "",
  });

  useEffect(() => {
    if (!token) {
      // Optional: redirect if not authenticated, or just show empty/loading
      // router.push("/");
    }
  }, [token, router]);

  const loadTariffs = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/tariffs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }
      const data = await res.json();
      setTariffs(data);
    } catch (e: any) {
      setError(e.message ?? "Error loading tariffs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadTariffs();
    }
  }, [token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const body = {
        mode: form.mode,
        originPort: form.originPort,
        destinationPort: form.destinationPort,
        price: Number(form.price),
        currency: form.currency,
        validFrom: form.validFrom,
        validTo: form.validTo,
        transitTimeDays: Number(form.transitTimeDays),
        carrierName: form.carrierName,
      };

      const res = await fetch(`${API_BASE}/api/tariffs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      setForm((prev) => ({
        ...prev,
        originPort: "",
        destinationPort: "",
        price: "",
        validFrom: "",
        validTo: "",
        transitTimeDays: "",
        carrierName: "",
      }));

      await loadTariffs();
    } catch (e: any) {
      setError(e.message ?? "Error creating tariff");
    }
  };

  return (
    <main
      style={{
        padding: "1.5rem",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Carrier Tariffs</h1>

      <p style={{ marginBottom: "1rem", color: "#9ca3af" }}>
        Gestión de tarifas contractuales. Sólo visible para usuarios con rol
        carrier/admin.
      </p>



      {error && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.5rem 0.75rem",
            backgroundColor: "#b91c1c",
            borderRadius: "0.375rem",
          }}
        >
          {error}
        </div>
      )}

      {/* Formulario alta rápida */}
      <section
        style={{
          marginBottom: "1.5rem",
          padding: "1rem",
          borderRadius: "0.75rem",
          border: "1px solid #1f2937",
          backgroundColor: "#020617",
        }}
      >
        <h2 style={{ marginBottom: "0.75rem", fontSize: "1.1rem" }}>
          Crear nueva tarifa
        </h2>
        <form
          onSubmit={handleCreate}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "0.75rem",
            alignItems: "end",
          }}
        >
          <label style={{ display: "flex", flexDirection: "column", fontSize: 12 }}>
            Mode
            <select
              name="mode"
              value={form.mode}
              onChange={handleChange}
              style={{
                marginTop: 4,
                padding: "0.35rem",
                borderRadius: 6,
                border: "1px solid #374151",
                backgroundColor: "#020617",
                color: "#e5e7eb",
              }}
            >
              <option value="AIR">AIR</option>
              <option value="OCEAN">OCEAN</option>
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", fontSize: 12 }}>
            Origin port
            <input
              name="originPort"
              value={form.originPort}
              onChange={handleChange}
              placeholder="BCN"
              style={{
                marginTop: 4,
                padding: "0.35rem",
                borderRadius: 6,
                border: "1px solid #374151",
                backgroundColor: "#020617",
                color: "#e5e7eb",
              }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", fontSize: 12 }}>
            Destination port
            <input
              name="destinationPort"
              value={form.destinationPort}
              onChange={handleChange}
              placeholder="JFK"
              style={{
                marginTop: 4,
                padding: "0.35rem",
                borderRadius: 6,
                border: "1px solid #374151",
                backgroundColor: "#020617",
                color: "#e5e7eb",
              }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", fontSize: 12 }}>
            Price
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="3.5"
              style={{
                marginTop: 4,
                padding: "0.35rem",
                borderRadius: 6,
                border: "1px solid #374151",
                backgroundColor: "#020617",
                color: "#e5e7eb",
              }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", fontSize: 12 }}>
            Currency
            <input
              name="currency"
              value={form.currency}
              onChange={handleChange}
              placeholder="USD"
              style={{
                marginTop: 4,
                padding: "0.35rem",
                borderRadius: 6,
                border: "1px solid #374151",
                backgroundColor: "#020617",
                color: "#e5e7eb",
              }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", fontSize: 12 }}>
            Valid from
            <input
              type="date"
              name="validFrom"
              value={form.validFrom}
              onChange={handleChange}
              style={{
                marginTop: 4,
                padding: "0.35rem",
                borderRadius: 6,
                border: "1px solid #374151",
                backgroundColor: "#020617",
                color: "#e5e7eb",
              }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", fontSize: 12 }}>
            Valid to
            <input
              type="date"
              name="validTo"
              value={form.validTo}
              onChange={handleChange}
              style={{
                marginTop: 4,
                padding: "0.35rem",
                borderRadius: 6,
                border: "1px solid #374151",
                backgroundColor: "#020617",
                color: "#e5e7eb",
              }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", fontSize: 12 }}>
            Transit time (days)
            <input
              name="transitTimeDays"
              value={form.transitTimeDays}
              onChange={handleChange}
              placeholder="5"
              style={{
                marginTop: 4,
                padding: "0.35rem",
                borderRadius: 6,
                border: "1px solid #374151",
                backgroundColor: "#020617",
                color: "#e5e7eb",
              }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", fontSize: 12 }}>
            Carrier name
            <input
              name="carrierName"
              value={form.carrierName}
              onChange={handleChange}
              placeholder="My Airline"
              style={{
                marginTop: 4,
                padding: "0.35rem",
                borderRadius: 6,
                border: "1px solid #374151",
                backgroundColor: "#020617",
                color: "#e5e7eb",
              }}
            />
          </label>

          <button
            type="submit"
            style={{
              marginTop: "1.2rem",
              padding: "0.45rem 0.9rem",
              borderRadius: 999,
              border: "none",
              backgroundColor: "#22c55e",
              color: "#000",
              fontWeight: 600,
              cursor: "pointer",
              height: "2.3rem",
            }}
          >
            Add tariff
          </button>
        </form>
      </section>

      {/* Tabla de tarifas */}
      <section>
        <h2 style={{ marginBottom: "0.75rem", fontSize: "1.1rem" }}>Tariffs</h2>

        {loading ? (
          <p>Cargando tarifas...</p>
        ) : (
          <div
            style={{
              borderRadius: "0.75rem",
              border: "1px solid #1f2937",
              overflow: "hidden",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.9rem",
              }}
            >
              <thead style={{ backgroundColor: "#030712" }}>
                <tr>
                  <th style={thStyle}>Mode</th>
                  <th style={thStyle}>Origin</th>
                  <th style={thStyle}>Destination</th>
                  <th style={thStyle}>Price</th>
                  <th style={thStyle}>Validity</th>
                  <th style={thStyle}>Transit</th>
                  <th style={thStyle}>Carrier</th>
                </tr>
              </thead>
              <tbody>
                {tariffs.map((t) => (
                  <tr key={t.id} style={{ borderTop: "1px solid #1f2937" }}>
                    <td style={tdStyle}>{t.mode}</td>
                    <td style={tdStyle}>{t.originPort}</td>
                    <td style={tdStyle}>{t.destinationPort}</td>
                    <td style={tdStyle}>
                      {t.price} {t.currency}
                    </td>
                    <td style={tdStyle}>
                      {t.validFrom} → {t.validTo}
                    </td>
                    <td style={tdStyle}>{t.transitTimeDays} d</td>
                    <td style={tdStyle}>{t.carrierName}</td>
                  </tr>
                ))}
                {tariffs.length === 0 && !loading && (
                  <tr>
                    <td style={tdStyle} colSpan={7}>
                      No tariffs yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "0.5rem 0.75rem",
  fontWeight: 500,
  color: "#9ca3af",
};

const tdStyle: React.CSSProperties = {
  padding: "0.5rem 0.75rem",
};
