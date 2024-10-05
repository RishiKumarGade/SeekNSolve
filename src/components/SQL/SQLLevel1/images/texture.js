import { TextureLoader } from "three";

import { dirtImg, grassImg, glassImg, woodImg, logImg , mo1,o1 } from "./images";

const grassTexture = new TextureLoader().load(grassImg);
const o1Texture = new TextureLoader().load(o1);
const mo1Texture = new TextureLoader().load(mo1);


export { grassTexture , o1Texture , mo1Texture };


 