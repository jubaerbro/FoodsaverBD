type ReservationSlipInput = {
  reservationId: string
  orderCode: string
  reservedAt: Date
  quantity: number
  customerName: string
  customerEmail: string
  dealTitle: string
  sellerName: string
  pickupAddress: string
  pickupStartTime: Date
  pickupEndTime: Date
  amountLabel: string
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

export function buildReservationSlipHtml(input: ReservationSlipInput) {
  const pickupWindow = `${formatDateTime(input.pickupStartTime)} - ${new Intl.DateTimeFormat("en-BD", {
    timeStyle: "short",
  }).format(input.pickupEndTime)}`

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>FoodSaver Slip ${escapeHtml(input.orderCode)}</title>
    <style>
      :root {
        color-scheme: light;
      }
      body {
        margin: 0;
        padding: 32px;
        background: #f8fafc;
        color: #0f172a;
        font-family: Arial, sans-serif;
      }
      .sheet {
        max-width: 760px;
        margin: 0 auto;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 24px;
        padding: 32px;
        box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
      }
      .header {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        align-items: start;
        border-bottom: 1px solid #e2e8f0;
        padding-bottom: 24px;
      }
      .brand {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.28em;
        color: #64748b;
      }
      h1 {
        margin: 10px 0 0;
        font-size: 32px;
      }
      .pill {
        border-radius: 999px;
        background: #ecfdf5;
        color: #047857;
        padding: 10px 16px;
        font-weight: bold;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
        margin-top: 24px;
      }
      .card {
        border: 1px solid #e2e8f0;
        border-radius: 18px;
        padding: 18px;
      }
      .label {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        color: #64748b;
      }
      .value {
        margin-top: 8px;
        font-size: 18px;
        font-weight: 700;
        line-height: 1.45;
      }
      .small {
        margin-top: 6px;
        font-size: 14px;
        color: #475569;
        line-height: 1.7;
      }
      .notice {
        margin-top: 24px;
        border-radius: 18px;
        background: #0f172a;
        color: white;
        padding: 20px;
      }
      .notice p {
        margin: 8px 0 0;
        color: rgba(255,255,255,0.76);
        line-height: 1.7;
      }
      .footer {
        margin-top: 24px;
        font-size: 13px;
        color: #64748b;
      }
      @media print {
        body {
          background: white;
          padding: 0;
        }
        .sheet {
          box-shadow: none;
          border: none;
          max-width: none;
          border-radius: 0;
        }
      }
    </style>
  </head>
  <body>
    <main class="sheet">
      <section class="header">
        <div>
          <div class="brand">FoodSaver reservation slip</div>
          <h1>Order ${escapeHtml(input.orderCode)}</h1>
          <div class="small">Reservation ID: ${escapeHtml(input.reservationId)}</div>
        </div>
        <div class="pill">Reserved</div>
      </section>

      <section class="grid">
        <div class="card">
          <div class="label">Customer</div>
          <div class="value">${escapeHtml(input.customerName)}</div>
          <div class="small">${escapeHtml(input.customerEmail)}</div>
        </div>
        <div class="card">
          <div class="label">Reserved at</div>
          <div class="value">${escapeHtml(formatDateTime(input.reservedAt))}</div>
          <div class="small">Keep this slip for pickup.</div>
        </div>
        <div class="card">
          <div class="label">Food item</div>
          <div class="value">${escapeHtml(input.dealTitle)}</div>
          <div class="small">Seller: ${escapeHtml(input.sellerName)}</div>
        </div>
        <div class="card">
          <div class="label">Quantity</div>
          <div class="value">${escapeHtml(String(input.quantity))}</div>
          <div class="small">Estimated payable amount: ${escapeHtml(input.amountLabel)}</div>
        </div>
        <div class="card">
          <div class="label">Pickup window</div>
          <div class="value">${escapeHtml(pickupWindow)}</div>
          <div class="small">Arrive during the listed pickup time.</div>
        </div>
        <div class="card">
          <div class="label">Pickup address</div>
          <div class="value">${escapeHtml(input.pickupAddress)}</div>
          <div class="small">Show the order code to the seller at collection.</div>
        </div>
      </section>

      <section class="notice">
        <strong>Payment and collection</strong>
        <p>Payment is completed with the seller during pickup. Bring this slip or show the order code on your phone.</p>
      </section>

      <div class="footer">
        Generated by FoodSaver for reservation tracking and pickup verification.
      </div>
    </main>
  </body>
</html>`
}
