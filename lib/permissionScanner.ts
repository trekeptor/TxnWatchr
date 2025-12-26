export function scanPermissions(sourceCode: string) {
  const lower = sourceCode.toLowerCase();

  const checks = {
    mint: lower.includes('mint('),
    pause: lower.includes('pause('),
    blacklist: lower.includes('blacklist'),
    setTax: lower.includes('settax') || lower.includes('setfee'),
    transferOwnership: lower.includes('transferownership'),
    owner: lower.includes('owner('),
  };

  return checks;
}
