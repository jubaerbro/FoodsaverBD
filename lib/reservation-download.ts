import { getStoredToken } from '@/lib/client-session';

export async function downloadReservationSlip(reservationId: string) {
  const token = await getStoredToken();
  if (!token) {
    throw new Error('Sign in to download your reservation slip.');
  }

  const res = await fetch(`/api/reservations/${reservationId}/slip`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || 'Failed to download slip');
  }

  const blob = await res.blob();
  const disposition = res.headers.get('Content-Disposition') || '';
  const match = disposition.match(/filename="([^"]+)"/i);
  const fileName = match?.[1] || `foodsaver-slip-${reservationId}.html`;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
