import * as rainSDK from "rain-sdk";

const SUBGRAPH_ENDPOINT = rainSDK.AddressBook.getSubgraphEndpoint(parseInt(process.env.REACT_APP_CHAIN_ID as string));

/**
 * Get Token Data from blockchain instead of .env
 * THIS WILL ALL BE AS IF THERE IS NO .ENV ON SALE LOAD
 */
export async function getTokenData(tokenAddress: string, setReserveName: any, setReserveSymbol: any, setReserveDecimals: any, setFaucetView: any) {
  try {
    let subgraphData = await fetch(SUBGRAPH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
            query {
              emissionsERC20S (where: {id: "${tokenAddress.toLowerCase()}"}) {
                id
                symbol
                name
                decimals
              }
            }
          `
      })
    });

    // the response will then come back as promise, the data of which will need to be accessed as such:
    subgraphData = await subgraphData.json();
    console.log(subgraphData);

    // @ts-ignore
    subgraphData = subgraphData.data.emissionsERC20S[0]; // should only be one here anyway. // todo--question is there potential for 'too quick' to cause it not to exist yet in the subgraph?
    if (subgraphData === undefined) throw new Error('NO_SUBGRAPH_DATA');

    console.log(`Result: data from subgraph with endpoint ${SUBGRAPH_ENDPOINT}:`);
    // @ts-ignore
    setReserveName(subgraphData.name);
    // @ts-ignore
    setReserveSymbol(subgraphData.symbol);
    // @ts-ignore
    setReserveDecimals((subgraphData.decimals.toString()));
    setFaucetView(true);
  } catch (err) {
    console.log(err);
  }
}

