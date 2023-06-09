import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import * as THREE from "three";
import useAxios from "hooks/useAxios";

import { useSelector } from "react-redux";
import { biddingHistory } from "store/auction";
import { RootState } from "store/configStore";

import { Canvas } from "react-three-fiber";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import styles from "components/auction/main/FinishModal.module.css";
import FinishModalCharacter from "./FinishModalCharacter";
import { transferNftCoin, transferNftOwnership } from "web3config";

const FinishModal: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const auctionId = parseInt(params.auctionId!, 10);
  const walletAddress = JSON.parse(
    sessionStorage.getItem("user")!
  ).walletAddress;

  // 경매 끝나자마자 get으로 경매 결과 받아옴
  const { data: resultData, sendRequest: getResultData } = useAxios();
  const { data: postDataStatus, sendRequest: postResultData } = useAxios();
  const biddingHistory = useSelector<RootState, biddingHistory[]>(
    (state) => state.auction.auctionInfo.biddingHistory
  );
  
  // 모달창
  const visible = useSelector<RootState, boolean>(
    (state) => state.auction.finishModalVisible
  );
  // const visible = false;
  // 남은 시간
  // const [remainTime, setRemainTime] = useState<number>(5);
  const remainTime = useRef<number>(6);

  const memeTransaction = (resultData: any) => {
    if (resultData) {
      const memeId = resultData.memeId;
      const buyerId = resultData.buyerUserId;
      const sellerId = resultData.sellerUserId;
      const createdAt = resultData.finishTime;
      const price = resultData.price;

      // 판매자 : fromAccount, 구매자 : toAccount
      const transferCoinStatus = true;
      const transferOwnershipStatus = true;
      if (transferCoinStatus && transferOwnershipStatus) {
        postResultData({
          url: `/api/mpoffice/meme/addTransaction`,
          method: "POST",
          data: {
            memeId: memeId,
            buyerId: buyerId,
            sellerId: sellerId,
            createdAt: createdAt,
            price: price,
          },
        });
      };
    };
  };

  useEffect(() => {
    if (visible) {
      getResultData({
        url: `/api/auction/result?auctionId=${auctionId}`,
      });
    }
  }, [visible]);

  useEffect(() => {
    if (resultData) {
      memeTransaction(resultData);
    };
  }, [resultData]);

  const camera = useRef<THREE.PerspectiveCamera>(
    new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
  );
  camera.current.position.set(-0.5, 0.5, 2.5);
  camera.current.lookAt(0, 0.5, 0);
  return (
    <Dialog
      header="경매 마감"
      visible={visible}
      closable={false}
      modal={false}
      className={styles.modal}
      onHide={() => {}}
    >
      {/* 경매 끝났을 때 최고가 닉네임 띄우기 */}
      <div className={styles.wrapper}>
        {biddingHistory.length === 0 ? (
          <>
            <p>경매가 종료되었습니다.</p>
            <Button
                className={styles.exitBtn}
                onClick={() => {
                  navigate(`/main`);
                }}
              >
                나가기
              </Button>
          </>
        ) : (
          <>
            <p className={styles.nickname}>{biddingHistory[0].nickname}님</p>
            <p className={styles.cong}>축하드립니다!!</p>
            <div className={styles.canvasDiv}>
              <Canvas className={styles.canvas} camera={camera.current}>
                <ambientLight />
                <FinishModalCharacter />
              </Canvas>
            </div>
            <div className={styles.exitContainer}>
              <p className={styles.remainTime}>거래 완료 후 종료됩니다.</p>
              <Button
                className={styles.exitBtn}
                onClick={() => {
                  navigate(`/main`);
                }}
              >
                나가기
              </Button>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
};

export default FinishModal;
