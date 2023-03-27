import React, { useState } from "react";
import { Icon } from "@iconify/react";
import styles from "./CommentItem.module.css";
import { commentType } from "store/commentList";
import { useDispatch } from "react-redux";
import { commentListActions } from "store/commentList";

interface CommentType {
    items: commentType
};

const CommentItem:React.FC<CommentType> = comment => {
    const dispatch = useDispatch()
    const userName = comment.items.userName;
    const userImg = "http://localhost:3000/" + comment.items.userImgUrl;
    const commentDate = comment.items.date;
    const commentText = comment.items.comment;
    const heart = comment.items.liked;
    const heartNum = comment.items.likes;

    const handleHeart = (heart:number) => {
        dispatch(commentListActions.toggleLike({id:comment.items.id}))
    };

    return (
        <div className={styles.commentItemContainer}>
            <div className={styles.userImgWrapper}>
                <img src={userImg} alt="" className={styles.commentUserImg}/>
            </div>

            <div className={styles.commentInfoWrapper}>
                <div className={styles.commentHeader}>
                    <div className={styles.commentUserName}>
                        {userName}
                    </div>
                    <div className={styles.commentTime}>
                        {commentDate}
                    </div>
                    <div className={styles.bestComment}>
                        Best
                    </div>
                </div>

                <div className={styles.commentBody}>
                    <div className={styles.commentText}>
                        {commentText}
                    </div>
                    <div className={styles.iconWrapper}>
                        {heart===1 ? <Icon icon="clarity:heart-solid" className={styles.heartFilledIcon} onClick={() => {handleHeart(heart)}}/> : <Icon icon="clarity:heart-line" className={styles.heartIcon} onClick={()=> {handleHeart(heart)}}/>}
                    </div>
                </div>

                <div className={styles.userReaction}>
                    <div>
                        좋아요 {heartNum}개
                    </div>
                    <div>
                        답글 달기
                    </div>
                    <div>
                        삭제
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentItem;