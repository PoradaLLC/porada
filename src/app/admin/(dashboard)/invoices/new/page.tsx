import Link from "next/link";
import { createInvoice } from "@/app/admin/actions";
import { InvoiceForm } from "./InvoiceForm";

export default function NewInvoicePage() {
  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>New invoice</h1>
          <div className="sub">§ billing · issue a payable invoice to a customer</div>
        </div>
        <Link href="/admin/invoices" className="admin-btn">
          ← Back to invoices
        </Link>
      </header>
      <InvoiceForm action={createInvoice} />
    </div>
  );
}
