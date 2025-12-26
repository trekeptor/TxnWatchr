export function calculateRisk(permissions: any) {
  let score = 0;

  if (permissions.owner) score += 2;
  if (permissions.mint) score += 3;
  if (permissions.pause) score += 2;
  if (permissions.blacklist) score += 2;
  if (permissions.setTax) score += 2;
  if (permissions.transferOwnership) score += 1;

  let level = 'Low';
  if (score >= 6) level = 'High';
  else if (score >= 3) level = 'Medium';

  return { score, level };
}
