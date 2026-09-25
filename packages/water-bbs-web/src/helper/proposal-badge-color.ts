export const proposalBadgeColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'surface';
    case 'controversy':
      return 'warning';
    case 'approved':
      return 'success';
    case 'rejected':
      return 'danger';
    case 'executing':
      return 'primary';
    case 'executed':
      return 'success';
    case 'failed':
      return 'danger';
    case 'cancelled':
      return 'danger';
    case 'emergency-review':
      return 'danger';
    default:
      return 'surface';
  }
};
