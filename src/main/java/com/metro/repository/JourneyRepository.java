package com.metro.repository;

import com.metro.model.Journey;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JourneyRepository extends JpaRepository<Journey, Long> {
    // 基本查詢方法已由 JpaRepository 提供
    // 學員需實作：進階聚合查詢（熱門路線、尖峰時段分析）
}

// Made with Bob