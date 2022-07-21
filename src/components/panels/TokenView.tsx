import React, {Suspense, useEffect} from "react";
import {
  useParams
} from "react-router-dom";
import NavBar from "../layout/NavBar";
import TokenClaimModal from "./Modal";
import {Canvas} from "@react-three/fiber";
import {ContactShadows, Html} from "@react-three/drei";
import Fountain from "../3d/Fountain";
import Sign from "../3d/Sign";
const CHAIN_NAME = process.env.REACT_APP_CHAIN_NAME; // Mumbai (Polygon Testnet) Chain ID
const BASE_URL = process.env.REACT_APP_BASE_URL; // Mumbai (Polygon Testnet) Chain ID

type tokenViewProps = {
  reserveName: string, reserveSymbol: string, modalOpen: any, setModalOpen: any, reserveInitialSupply: any,
  buttonLock: any, tokenAddress: string, consoleColor: any, consoleData: any, initiateClaim: any, setTokenAddress: any,
  faucetView: any,
}

export default function TokenView({
    reserveName, reserveSymbol, modalOpen, setModalOpen, reserveInitialSupply, buttonLock, tokenAddress,
    consoleData, consoleColor, initiateClaim, setTokenAddress, faucetView,
  }: tokenViewProps )
{

  // this needs to be here as id is within the router
  let {id}: any = useParams();
  console.log(`The ID: ${id}`);
  // set token address by url instead of t= (check line 80 onwards works in app.tsx for getting the tokenData)
  useEffect(() => {
    setTokenAddress(id);
  }, []);

  return (
    <>
      { faucetView && (
        <>
          <NavBar string={`${reserveSymbol} Faucet (${reserveName})`} />
          <p className='deploy-own'>Must be connected to <a href={`https://chainlist.org/?search=mumbai&testnets=true`} target="_blank"><b className='modalTextRed'>{CHAIN_NAME}</b></a> Testnet. <a href={`${BASE_URL}`}>Deploy Your Own Reserve Token Here!</a></p>

          <div className="canvasContainer">
            <TokenClaimModal
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              reserveSymbol={reserveSymbol}
              buttonLock={buttonLock}
              consoleData={consoleData}
              consoleColor={consoleColor}
              initiateClaim={initiateClaim}
              tokenAddress={tokenAddress}
            />

            <Canvas className="the-canvas" onClick={() => {setModalOpen(!modalOpen)}} shadows dpr={[1,2 ]} camera={{ position: [0,-30,0], fov: 50 }}>
              <ambientLight intensity={1} />
              <spotLight position={[1, 6, 1.5]} angle={0.2} penumbra={1} intensity={2.5} castShadow shadow-mapSize={[2048, 2048]} />
              <spotLight position={[-5, 5, -1.5]} angle={0.03} penumbra={1} intensity={4} castShadow shadow-mapSize={[1024, 1024]} />
              <spotLight position={[5, 5, -5]} angle={0.3} penumbra={1} intensity={4} castShadow={true} shadow-mapSize={[256, 256]} color="#ffffc0" />
              <Suspense fallback={<Html className="black">loading..</Html>}>
                <Fountain position={[-5,0,1]} rotation={[1.9,3.5,0]} />
                <Sign position={[9,-10,-4]} rotation={[2.8,1.5,-1.1]} scale={0.08} reserveSymbol={reserveSymbol} />
                <ContactShadows frames={1} rotation-x={[Math.PI / 2]} position={[0, -0.33, 0]} far={0.4} width={2} height={2} blur={4} />
              </Suspense>

            </Canvas>

          </div>
        </>
      )}
    </>
  )
}
