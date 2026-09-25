export const proposalBadgeText = (status?: string) => {
  if (!status) {
    return '';
  }
  if (status === 'pending') {
    return '投票中';
  }
  if (status === 'controversy') {
    return '争议';
  }
  if (status === 'approved') {
    return '已通过';
  }
  if (status === 'rejected') {
    return '已拒绝';
  }
  if (status === 'executing') {
    return '执行中';
  }
  if (status === 'executed') {
    return '已完成';
  }
  if (status === 'failed') {
    return '执行失败';
  }
  if (status === 'cancelled') {
    return '已取消';
  }
  if (status === 'emergency-review') {
    return '紧急审核';
  }
  return '';
};
