interface TicketEntry {
  username: string;
  verified: boolean;
}

const ticketStore = new Map<string, TicketEntry>();

let counter = 0;

export function issueTicket(username: string, prefix: string): string {
  const ticket = `${prefix}-${++counter}-${Date.now()}`;
  ticketStore.set(ticket, { username, verified: false });
  return ticket;
}

export function getTicketEntry(ticket: string): TicketEntry | undefined {
  return ticketStore.get(ticket);
}

export function markVerified(ticket: string): void {
  const entry = ticketStore.get(ticket);
  if (entry) entry.verified = true;
}

export function deleteTicket(ticket: string): void {
  ticketStore.delete(ticket);
}

export function resetTickets(): void {
  ticketStore.clear();
  counter = 0;
}
