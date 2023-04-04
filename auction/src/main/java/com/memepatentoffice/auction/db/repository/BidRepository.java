package com.memepatentoffice.auction.db.repository;

import com.memepatentoffice.auction.db.entity.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BidRepository extends JpaRepository<Bid, Long> {
    Bid findTopByOrderByCreatedAtDesc();

    @Query("select b.askingprice from Bid b where b.auctionId = :auctionId")
    Optional<Long> highestBid(@Param("auctionId") Long auctionId);

    List<Bid> findByAuctionId(@Param("auctionId") Long auctionId);
}