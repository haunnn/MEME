package com.memepatentoffice.mpoffice.db.entity;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum like {
    LIKE,HATE;

//    @JsonCreator
//    public static like from(String value) {
//        for (like status : like.values()) {
//            if (status.name().equals(value)) {
//                return status;
//            }
//        }
//        return null;
//    }


}
