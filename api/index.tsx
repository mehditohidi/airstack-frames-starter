
import {
  getFarcasterUserNFTBalances,
  FarcasterUserNFTBalancesInput,
  FarcasterUserNFTBalancesOutput,
  TokenBlockchain,
  NFTType,
  Frog,
  Button,
} from "@airstack/frog";
import { devtools } from "@airstack/frog/dev";
import { handle } from "@airstack/frog/next";
import { serveStatic } from "@hono/node-server/serve-static";
import { config } from "dotenv";
type State = {
  count: 0
}
export const app = new Frog<{ State: State, basePath: "/api",
}>({
  verify: 'silent',
  initialState: {
    count: 0
  },

  apiKey: "1f4ac6d603aa340a29aecd892268c834b",
});
let userFid;

 

// app.frame("/", async (c)=> {
//   const { status, buttonValue, deriveState, frameData, verified } = c;
//   return c.res({
//     image: (
//       <div
//       style={{
//         color: "white",
//         display: "flex",
        
//         justifyContent: "center",
//         flexDirection: "column",
//         width: "100%",
//         height: "100%",
//         alignItems: "center"
//       }}
//       >
//         <div style={{fontSize:120, color:"yellow"}}>BASE</div> 
//         <div style={{fontSize:60, color:"cyan"}}>NFT BALANCE CHECKER</div>
//         <div style={{fontSize:40, color:"pink"}}>OSBCOLLEGE</div>
//         <div style={{fontSize:30}}>Developer: THEMEHT</div>
//         <div style={{fontSize:30}}>Support us!</div>
//       </div>
//     ), intents:[<Button action="/response">Check</Button>]
//   });
// })


app.frame("/", async (c) => {
  const { status, buttonValue, deriveState, frameData, verified } = c;
  if (!verified) console.log('Frame verification failed');

  console.log(frameData);

  if (frameData?.fid && frameData.fid > 1) {
    userFid = frameData?.fid;
  } else {
    userFid = 269737;
  }

  let limitRange = 50;

  const state = deriveState(previousState => {
    if (buttonValue === 'inc' && previousState.count < limitRange) previousState.count+=2
    if (buttonValue === 'dec' && previousState.count > 2) previousState.count-=2

  })



  console.log(state.count);


  const variables: FarcasterUserNFTBalancesInput = {
 
    fid: userFid,
    
    tokenType: [NFTType.ERC721, NFTType.ERC1155],
    chains: [
      TokenBlockchain.Base,
    ],
    limit: limitRange,
  };
  const {
    data,
    error,
  }: FarcasterUserNFTBalancesOutput = await getFarcasterUserNFTBalances(
    variables
  );


  let nftNum1 = state.count;


  let nftImage = data[nftNum1]?.image.small;
  let nftName = data[nftNum1]?.name;

  let nftImage2 = data[nftNum1 + 1]?.image.small;
  let nftName2 = data[nftNum1 + 1]?.name;

  let nftImage3 = data[nftNum1 + 2]?.image.small;
  let nftName3 = data[nftNum1 + 2]?.name;

  let nftImage4 = data[nftNum1 + 3]?.image.small;
  let nftName4 = data[nftNum1 + 3]?.name;

  if (error) throw new Error(error);
  return c.res({
    image: (
      <div
        style={{
          color: "white",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center", 
          alignItems: "center",
          height: "100%",
          width: "100%",
          backgroundColor: "DarkSlateBlue",
         
          
        }}
      >
        {status === "initial" ? <div style={{fontSize:60, display: "flex", flexDirection: "column"}}>
        <div style={{fontSize:120, color:"yellow"}}>BASE</div> 
         <div style={{fontSize:60, color:"cyan"}}>NFT BALANCE CHECKER</div>
        <div style={{fontSize:40, color:"pink"}}>OSBCOLLEGE</div>
         <div style={{fontSize:30}}>Developer: THEMEHT</div>
        <div style={{fontSize:30}}>Support us!</div>
        </div> : 

<>            
         
              <div style={{display:"flex", flexDirection:"column", justifyContent: "center"}}>
            <div style={{display: "flex", justifyContent: "center", width: "100%", flexDirection: "row", textAlign: "center"}}>
              <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "50%"}}>
                <img style={{borderRadius: 15, border: "solid", borderColor: "white", justifyContent: "center"}} height={300}  src={nftImage} />
                <p style={{justifyContent: "center", width: "100%", fontSize: 32, fontWeight: "bold"}}>{nftName}</p>
              </div>
              <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "50%"}}>
                <img style={{borderRadius: 15,  border: "solid", borderColor: "white", justifyContent: "center"}} height={300} src={nftImage2} />
                <p style={{justifyContent: "center", width: "100%", fontSize: 32, fontWeight: "bold" }}>{nftName2}</p>
              </div>
            </div>

                        <div style={{display: "flex", justifyContent: "center", width: "100%", flexDirection: "row", textAlign: "center", opacity: 0.3}}>
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "50%"}}>
                          <img style={{borderRadius: 15, border: "solid", borderColor: "yellow", justifyContent: "center"}} height={100}  src={nftImage3} />
                          <p style={{justifyContent: "center", width: "100%", fontSize: 20, fontWeight: "bold"}}>{nftName3}</p>
                        </div>
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "50%"}}>
                          <img style={{borderRadius: 15,  border: "solid", borderColor: "yellow", justifyContent: "center"}} height={100} src={nftImage4} />
                          <p style={{justifyContent: "center", width: "100%", fontSize: 20, fontWeight: "bold" }}>{nftName4}</p>
                        </div>
                      </div>


                      </div>
                     
                </>      
            

        }
       
      </div>
      
      
    ),
    intents: [ <Button value="inc">Check now!</Button>]
    
    
    
  });
});
  config();

  devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);