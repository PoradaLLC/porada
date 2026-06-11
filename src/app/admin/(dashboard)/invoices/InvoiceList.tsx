"use client";

import { useState } from "react";
import { Copy, Check, X, ExternalLink } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cancelInvoice } from "@/app/admin/actions";
import type { InvoiceRow } from "./page";

export function InvoiceList({
  invoices,
  justCreatedId,
}: {
  invoices: InvoiceRow[];
  justCreatedId: string | null;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function siteOrigin() {
    if (typeof window !== "undefined") return window.location.origin;
    return "";
  }

  function copyLink(id: string) {
    const url = `${siteOrigin()}/payment/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handleCancel(id: string) {
    if (!confirm("Cancel this invoice? The customer will no longer be able to pay it.")) return;
    setCancellingId(id);
    setError(null);
    try {
      await cancelInvoice(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel invoice");
    } finally {
      setCancellingId(null);
    }
  }

  if (invoices.length === 0) {
    return (
      <div
        className="admin-panel"
        style={{ textAlign: "center", padding: "60px 24px", color: "var(--ink-soft)", marginTop: 0 }}
      >
        No invoices yet. Click <strong>New invoice</strong> to send one.
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="admin-error" role="alert" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}
      <div style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Description</th>
              <th style={{ textAlign: "right" }}>Amount</th>
              <th>Status</th>
              <th>Created</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => {
              const justCreated = inv.id === justCreatedId;
              const link = `${siteOrigin()}/payment/${inv.id}`;
              return (
                <tr
                  key={inv.id}
                  style={
                    justCreated
                      ? { background: "color-mix(in oklab, var(--accent) 10%, transparent)" }
                      : undefined
                  }
                >
                  <td style={{ verticalAlign: "top" }}>
                    <div style={{ color: "var(--ink)", fontWeight: 500 }}>
                      {inv.customer_name ?? inv.customer_email}
                    </div>
                    {inv.customer_name && (
                      <div
                        style={{
                          fontFamily: "var(--font-mono-family)",
                          fontSize: 12,
                          color: "var(--ink-faint)",
                          marginTop: 2,
                        }}
                      >
                        {inv.customer_email}
                      </div>
                    )}
                  </td>
                  <td
                    style={{
                      color: "var(--ink-soft)",
                      fontSize: 13,
                      maxWidth: 360,
                      verticalAlign: "top",
                    }}
                  >
                    {inv.description}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      fontFamily: "var(--font-mono-family)",
                      color: "var(--ink)",
                      verticalAlign: "top",
                    }}
                  >
                    {formatCurrency(inv.amount_cents)}
                  </td>
                  <td style={{ verticalAlign: "top" }}>
                    <StatusBadge status={inv.status} />
                    {inv.paid_at && (
                      <div
                        style={{
                          fontFamily: "var(--font-mono-family)",
                          fontSize: 11,
                          color: "var(--ink-faint)",
                          marginTop: 4,
                        }}
                      >
                        {formatDate(inv.paid_at)}
                      </div>
                    )}
                  </td>
                  <td
                    style={{
                      fontFamily: "var(--font-mono-family)",
                      fontSize: 12,
                      color: "var(--ink-faint)",
                      verticalAlign: "top",
                    }}
                  >
                    {formatDate(inv.created_at)}
                  </td>
                  <td style={{ textAlign: "right", verticalAlign: "top" }}>
                    <div style={{ display: "inline-flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        className="admin-btn"
                        onClick={() => copyLink(inv.id)}
                        title={link}
                      >
                        {copiedId === inv.id ? (
                          <>
                            <Check aria-hidden="true" style={{ width: 13, height: 13 }} />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy aria-hidden="true" style={{ width: 13, height: 13 }} />
                            Copy link
                          </>
                        )}
                      </button>
                      <a
                        href={`/payment/${inv.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="admin-btn"
                      >
                        <ExternalLink aria-hidden="true" style={{ width: 13, height: 13 }} />
                        Open
                      </a>
                      {inv.status === "open" && (
                        <button
                          type="button"
                          className="admin-btn"
                          onClick={() => handleCancel(inv.id)}
                          disabled={cancellingId === inv.id}
                        >
                          <X aria-hidden="true" style={{ width: 13, height: 13 }} />
                          {cancellingId === inv.id ? "Cancelling…" : "Cancel"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function StatusBadge({ status }: { status: InvoiceRow["status"] }) {
  const cls =
    status === "paid"
      ? "admin-badge ok"
      : status === "cancelled" || status === "expired"
      ? "admin-badge muted"
      : "admin-badge";
  return <span className={cls}>{status}</span>;
}
