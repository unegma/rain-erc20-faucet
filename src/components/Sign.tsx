import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF, Text } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

const SIGN_URL = 'https://assets.unegma.net/unegma.work/rain-erc20-faucet.unegma.work/sign-transformed.glb';

type GLTFResult = GLTF & {
  nodes: {
    sign06_LP_sign_06__0001: THREE.Mesh
  }
  materials: {
    ['sign_06.001']: THREE.MeshStandardMaterial
  }
}

export default function Model({ reserveSymbol, ...props }: any) {
  const group = useRef<THREE.Group>(null)
  const { nodes, materials } = useGLTF(SIGN_URL, 'https://www.gstatic.com/draco/versioned/decoders/1.4.1/') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <Text
        position={[-20, 70, -7.58]}
        rotation={[0,10.2,-0.06]}
        fontSize={8}
        // lineHeight={0.8}
        // material-toneMapped={false}
        color='#333333'
      >
        Click For:
      </Text>
      <Text
        position={[-20, 62, -7.58]}
        rotation={[0,10.2,-0.06]}
        fontSize={8}
        // lineHeight={0.8}
        // material-toneMapped={false}
        color='#333333'
      >
        {reserveSymbol}
      </Text>

      <mesh castShadow receiveShadow geometry={nodes.sign06_LP_sign_06__0001.geometry} material={materials['sign_06.001']} scale={[-0.05,0.05,0.05]} rotation={[0,3.9,0]}/>
    </group>
  )
}

useGLTF.preload(SIGN_URL)
