import React, {useState} from "react";
import style from './style.module.css';
import Navbar from "../components/Navbar/Navbar";

import ParticleImage, {
  Vector,
  forces,
} from "react-particle-image";
import Signup from "./SignUp";
import Signin from "./SignIn";

const particleOptions = {
  filter: ({ x, y, image }) => {
    // Get pixel
    const pixel = image.get(x, y);
    // Make a particle for this pixel if blue > 50 (range 0-255)
    return pixel.b > 10;
  },
  color: ({ x, y, image }) => "#009dff",
  radius: () => Math.random() * 1.5 + 0.75,
  mass: () => 20,
  friction: () => 2,
  initialPosition: ({ canvasDimensions }) => {
    return new Vector(canvasDimensions.width / 2, canvasDimensions.height / 2);
  }
};

const motionForce = (x, y) => {
  return forces.disturbance(x, y, 65);
};

export default function Welcome() {

    const [popupSignIn, setPopupSignIn] = useState(false);
    const [popupSignUp, setPopupSignUp] = useState(false);

    function handleSignIn(event){
        setPopupSignIn(true);
        setPopupSignUp(false);
    }

    function handleSignUp(event){
        setPopupSignUp(true);
        setPopupSignIn(false);
    }

    function handleCloseAll(){
        setPopupSignUp(false);
        setPopupSignIn(false);
    }

    function handleSwitch(event){
      setPopupSignIn(!popupSignIn);
      setPopupSignUp(!popupSignUp);
  } 

    return (
        <div className={style.welcome_container}>
            {popupSignIn && <Signin handleSwitch={handleSwitch} handleClose={handleCloseAll}/>}
            {popupSignUp && <Signup handleSwitch={handleSwitch} handleClose={handleCloseAll}/>}

            <Navbar handleSignIn={handleSignIn} handleSignUp={handleSignUp}/>
            <div className={style.welcome_content}>
                <div className={style.welcome_text}>
                    <h1>Welcome to MeMetrics</h1>
                    <button onClick={handleSignUp} type="button">Try it now for free</button>
                </div>
                <div className={style.welcome_image}>
                    <ParticleImage
                        width={1000}
                        height={800}
                        src={"/img/memetrics-logo.png"}
                        scale={2.1}
                        entropy={15}
                        maxParticles={7500}
                        particleOptions={particleOptions}
                        mouseMoveForce={motionForce}
                        touchMoveForce={motionForce}
                        backgroundColor="transparent"
                        mouseMoveForceDuration={1000}
                        mouseDownForceDuration={0}
                    />
                </div>
            </div>
        </div>
    )
}
