export async function fetchContractSource(address: string) {
  const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;

  const url = `https://api.etherscan.io/v2/api?chainid=1&module=contract&action=getsourcecode&address=${address}&apikey=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== '1' || !data.result || data.result.length === 0) {
    return null;
  }

  return data.result[0];
}
