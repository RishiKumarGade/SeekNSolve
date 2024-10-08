import { usePlane } from "@react-three/cannon"
import{ grassTexture } from "./images/texture"
import { NearestFilter, RepeatWrapping } from "three"

export const Ground = ()=>{
    const [ref] = usePlane(()=>({
        rotation:[-Math.PI/2,0,0],
        position:[1,0,0]
    }))

    grassTexture.magFilter = NearestFilter
    grassTexture.wrapS = RepeatWrapping
    grassTexture.wrapT = RepeatWrapping
    grassTexture.repeat.set(100,100)
    
    return (
        <mesh ref={ref}>
                <planeBufferGeometry attach="geometry" args={[100,100]} />
                <meshStandardMaterial attach="material"  map={grassTexture}/>
        </mesh>
    )
}