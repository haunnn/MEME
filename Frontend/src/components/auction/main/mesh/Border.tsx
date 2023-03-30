import React, { useEffect, useRef } from "react";

import { useSelector } from "react-redux";
import { RootState } from "store/configStore";
import { auctionInfo } from "store/auction";
import * as THREE from "three";
import { useFrame, useLoader } from "react-three-fiber";
import GifLoader from "three-gif-loader";
import GifTexture from "three-gif-loader/lib/gif-texture";

const Border: React.FC = () => {
  const texCanvas = document.createElement("canvas");
  const texContext = texCanvas.getContext("2d");
  const nftTexture = useRef<THREE.Texture | GifTexture>();
  texCanvas.width = 100;
  texCanvas.height = 100;
  const canvasTexture = new THREE.CanvasTexture(texCanvas);
  const { topPrice, finishTime, memeImgSrc } = useSelector<
    RootState,
    auctionInfo
  >((state) => state.auction.auctionInfo);
  // const arrOne = memeImgSrc.split(",");
  // const arrTwo = arrOne[0].match(/:(.*?);/);
  // console.log(arrTwo)
  // const mime = arrTwo![1];
  const loader = new GifLoader();
  nftTexture.current! = useLoader(THREE.TextureLoader, memeImgSrc);
  // if (mime === "gif") {
    nftTexture.current! = loader.load(memeImgSrc, (reader) => {
      console.log(reader.numFrames());
    });
    // }

  const border = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
      color: "",
    })
  );

  const NFT = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshBasicMaterial({
      map: nftTexture.current,
      fog: false,
    })
  );
  const timerMaterial = new THREE.MeshBasicMaterial({
    map: canvasTexture,
  });

  NFT.position.set(-1, 5, -28.9);
  border.position.set(-1, 7, -29);

  const targetTime = Math.floor(+new Date(finishTime) / 1000);

  const getRemainTime = () => {
    const date = Math.floor(+new Date() / 1000);
    // console.log(date, targetTime)
    let diff;
    if (targetTime < date) {
      diff = 0;
    } else {
      diff = targetTime - date;
    }
    const remainTime = new Date(0);
    remainTime.setSeconds(diff);

    const hours = remainTime.getUTCHours().toString().padStart(2, "0");
    const minutes = remainTime.getUTCMinutes().toString().padStart(2, "0");
    const seconds = remainTime.getUTCSeconds().toString().padStart(2, "0");

    return [diff, `${hours}:${minutes}:${seconds}`];
  };
  useEffect(() => {
    if (texContext) {
    }
  }, []);

  useFrame(() => {
    canvasTexture.needsUpdate = true;
    if (texContext) {
      texContext.fillStyle = "#0277BD"; // 물감
      texContext.fillRect(0, 0, 100, 100); // 좌표0,0, 크기
      texContext.font = "10px Gmarket Sans TTF";
      texContext.fillStyle = "white"; // 물감
      texContext.fillText(`${topPrice} SSF`, 30, 37);
      texContext.font = "17px Gmarket Sans TTF";
      let timerProps = getRemainTime();
      let diff = timerProps[0];
      let timerView = timerProps[1];
      if (diff <= 3 * 60) {
        texContext.fillStyle = "red"; // 물감
      } else {
        texContext.fillStyle = "white"; // 물감
      }
      texContext.fillText(`${timerView}`, 10, 20);
    }
  });

  const timer = new THREE.Mesh(new THREE.PlaneGeometry(9, 10), timerMaterial);
  timer.position.set(-1, 7, -28.95);

  return (
    <>
      <primitive castShadow object={border} />
      <primitive object={NFT} />
      <primitive object={timer} />
    </>
  );
};
export default Border;
