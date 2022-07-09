import React, {Suspense, useEffect} from "react";
import {
  useParams
} from "react-router-dom";
import NavBar from "./NavBar";
import Modal from "./Modal";
import {Canvas} from "@react-three/fiber";
import {ContactShadows, Environment, OrbitControls} from "@react-three/drei";
import Fountain from "./Fountain";
const displayedImage = 'https://assets.unegma.net/unegma.work/rain-erc20-faucet.unegma.work/faucet.jpg';

type tokenViewProps = {
  reserveName: string, reserveSymbol: string, modalOpen: any, setModalOpen: any, reserveInitialSupply: any, buttonLock: any, tokenAddress: string,
  // redeemableName: any, redeemableSymbol: any, modalOpen: any, setModalOpen: any, initiateBuy: any, buttonLock: any,
  // redeemableTokenAddress: any, staticReservePriceOfRedeemable: any, reserveSymbol: any, consoleData: any,
  consoleColor: any, consoleData: any, initiateClaim: any, setTokenAddress: any, faucetView: any
}

export default function TokenView({
    reserveName, reserveSymbol, modalOpen, setModalOpen, reserveInitialSupply, buttonLock, tokenAddress,
    consoleData, consoleColor, initiateClaim, setTokenAddress, faucetView
    // initiateBuy, buttonLock, tokenAddress,
    // staticReservePriceOfRedeemable, reserveSymbol, consoleData, consoleColor, redeemableInitialSupply
  }: tokenViewProps )
{
  return (
    <>
      { faucetView && (
        <>
          <NavBar string={`${reserveName} (${reserveSymbol}) Faucet!`} stringRight={`Click the Faucet!`} />
          <div className="canvasContainer">
            <Modal
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              reserveSymbol={reserveSymbol}
              reserveInitialSupply={reserveInitialSupply}
              // initiateBuy={initiateBuy}
              buttonLock={buttonLock}
              // redeemableTokenAddress={redeemableTokenAddress}
              // staticReservePriceOfRedeemable={staticReservePriceOfRedeemable}
              // redeemableSymbol={redeemableSymbol}
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
              <Suspense fallback={null}>
                {/*<Shoes modalOpen={modalOpen} setModalOpen={setModalOpen} amount={redeemableInitialSupply} />*/}
                {/*<Environment preset="city" />*/}
                {/*<Fountain position={[0,0,0]} rotation={[0,0,0]} />*/}
                <Fountain position={[-5,0,1]} rotation={[1.9,3.5,0]} />
                <ContactShadows frames={1} rotation-x={[Math.PI / 2]} position={[0, -0.33, 0]} far={0.4} width={2} height={2} blur={4} />
              </Suspense>
              {/*<OrbitControls autoRotate autoRotateSpeed={1} enableZoom={false} enablePan={false} />*/}
              {/*<OrbitControls autoRotateSpeed={1} enableZoom={false} enablePan={false} />*/}

            </Canvas>

          </div>
        </>
      )}
    </>
  )
}
