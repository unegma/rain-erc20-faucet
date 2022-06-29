import NavBar from "./NavBar";
import Modal from "./Modal";
import {Canvas} from "@react-three/fiber";
import React, {Suspense} from "react";
import {ContactShadows, Environment, OrbitControls} from "@react-three/drei";
import Faucet from "./Faucet";

type tokenViewProps = {
  // redeemableName: any, redeemableSymbol: any, modalOpen: any, setModalOpen: any, initiateBuy: any, buttonLock: any,
  // redeemableTokenAddress: any, staticReservePriceOfRedeemable: any, reserveSymbol: any, consoleData: any,
  // consoleColor: any, redeemableInitialSupply: any
}

export default function TokenView({
    // redeemableName, redeemableSymbol, modalOpen, setModalOpen, initiateBuy, buttonLock, redeemableTokenAddress,
    // staticReservePriceOfRedeemable, reserveSymbol, consoleData, consoleColor, redeemableInitialSupply
  }: tokenViewProps )
{

  return (
    <>
      {/*<NavBar string={`${redeemableName} (${redeemableSymbol}) Sale!`} stringRight={`Click a Shoe!`} />*/}
      <div className="canvasContainer">
        {/*<Modal*/}
        {/*  modalOpen={modalOpen}*/}
        {/*  setModalOpen={setModalOpen}*/}
        {/*  initiateBuy={initiateBuy}*/}
        {/*  buttonLock={buttonLock}*/}
        {/*  redeemableTokenAddress={redeemableTokenAddress}*/}
        {/*  staticReservePriceOfRedeemable={staticReservePriceOfRedeemable}*/}
        {/*  reserveSymbol={reserveSymbol}*/}
        {/*  redeemableSymbol={redeemableSymbol}*/}
        {/*  consoleData={consoleData}*/}
        {/*  consoleColor={consoleColor}*/}
        {/*/>*/}

        <Canvas shadows dpr={[1,2 ]} camera={{ position: [0, 0, 1.1], fov: 50 }}>
          <ambientLight intensity={2} />
          <spotLight position={[1, 6, 1.5]} angle={0.2} penumbra={1} intensity={2.5} castShadow shadow-mapSize={[2048, 2048]} />
          <spotLight position={[-5, 5, -1.5]} angle={0.03} penumbra={1} intensity={4} castShadow shadow-mapSize={[1024, 1024]} />
          <spotLight position={[5, 5, -5]} angle={0.3} penumbra={1} intensity={4} castShadow={true} shadow-mapSize={[256, 256]} color="#ffffc0" />
          <Suspense fallback={null}>
            {/*<Shoes modalOpen={modalOpen} setModalOpen={setModalOpen} amount={redeemableInitialSupply} />*/}
            {/*<Environment preset="city" />*/}
            {/*<Faucet scale={0.225} position={[0, -0.09, 0]} />*/}
            <ContactShadows frames={1} rotation-x={[Math.PI / 2]} position={[0, -0.33, 0]} far={0.4} width={2} height={2} blur={4} />
          </Suspense>
          <OrbitControls autoRotate autoRotateSpeed={1} />
        </Canvas>

      </div>
    </>
  )
}
