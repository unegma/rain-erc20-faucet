import React, {Suspense, useEffect} from "react";
import {
  useParams
} from "react-router-dom";
import NavBar from "./NavBar";
import Modal from "./Modal";
import {Canvas} from "@react-three/fiber";
import {ContactShadows, Html, OrbitControls} from "@react-three/drei";
import Fountain from "./Fountain";
import Sign from "./Sign";
const CHAIN_NAME = process.env.REACT_APP_CHAIN_NAME; // Mumbai (Polygon Testnet) Chain ID

type tokenViewProps = {
  reserveName: string, reserveSymbol: string, modalOpen: any, setModalOpen: any, reserveInitialSupply: any, buttonLock: any, tokenAddress: string,
  consoleColor: any, consoleData: any, initiateClaim: any, setTokenAddress: any, faucetView: any, BASE_URL: string
}

export default function TokenView({
    reserveName, reserveSymbol, modalOpen, setModalOpen, reserveInitialSupply, buttonLock, tokenAddress,
    consoleData, consoleColor, initiateClaim, setTokenAddress, faucetView, BASE_URL
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
          <NavBar string={`${reserveName} (${reserveSymbol}) Faucet!`} stringRight={``} />
          <p className='deploy-own'>Make sure you are connected to the <b className='modalTextRed'>{CHAIN_NAME}</b> Network. <a href={`${BASE_URL}`}>Click Here to Deploy Your Own Reserve Token!</a></p>

          <div className="canvasContainer">
            <Modal
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              reserveSymbol={reserveSymbol}
              reserveInitialSupply={reserveInitialSupply}
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
              {/*<OrbitControls autoRotate autoRotateSpeed={1} enableZoom={false} enablePan={false} />*/}
              {/*<OrbitControls autoRotateSpeed={1} enableZoom={true} enablePan={true} />*/}

            </Canvas>

          </div>
        </>
      )}
    </>
  )
}
