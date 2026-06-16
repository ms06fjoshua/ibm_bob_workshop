package com.metro.repository;

import com.metro.dto.PeakHourDto;
import com.metro.model.Journey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface JourneyRepository extends JpaRepository<Journey, Long> {
    
    /**
     * 查詢尖峰時段統計
     * 依小時分組統計進站人數，並按人數降序排列
     *
     * @return 尖峰時段列表（依進站人數降序）
     */
    @Query("SELECT new com.metro.dto.PeakHourDto(" +
           "HOUR(j.entryTime), COUNT(j)) " +
           "FROM Journey j " +
           "GROUP BY HOUR(j.entryTime) " +
           "ORDER BY COUNT(j) DESC")
    List<PeakHourDto> findPeakHours();
    
    // 基本查詢方法已由 JpaRepository 提供
    // 學員需實作：進階聚合查詢（熱門路線分析）
}

// Made with Bob