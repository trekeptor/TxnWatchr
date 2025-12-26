export async function fetchTransactions(address: string) {
  const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;

  const url = `https://api.etherscan.io/v2/api?chainid=1&module=account&action=txlist&address=${address}&page=1&offset=5&sort=desc&apikey=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== '1') {
    console.error('Etherscan error:', data.result);
    return [];
  }

  return data.result;
}
