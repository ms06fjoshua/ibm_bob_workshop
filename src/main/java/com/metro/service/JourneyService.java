package com.metro.service;

import com.metro.dto.JourneyStatisticsDto;
import com.metro.dto.PeakHourDto;
import com.metro.model.Journey;
import com.metro.repository.JourneyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class JourneyService {

    private final JourneyRepository journeyRepository;

    public JourneyService(JourneyRepository journeyRepository) {
        this.journeyRepository = journeyRepository;
    }

    public List<Journey> getAllJourneys() {
        return journeyRepository.findAll();
    }

    public JourneyStatisticsDto getStatistics() {
        List<Journey> journeys = journeyRepository.findAll();
        long totalJourneys = journeys.size();
        BigDecimal totalRevenue = journeys.stream()
                .map(Journey::getFare)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 簡單統計，學員需實作更精確的分析
        String busiestRoute = journeys.isEmpty() ? "-" : "待實作";
        String peakHourRange = journeys.isEmpty() ? "-" : "待實作";

        return new JourneyStatisticsDto(totalJourneys, totalRevenue, busiestRoute, peakHourRange);
    }

    /**
     * 取得尖峰時段分析（完整 24 小時分布）
     *
     * @return 完整 24 小時的進站人數統計，包含尖峰標記和擁擠程度
     */
    public List<PeakHourDto> getPeakHours() {
        // 1. 從資料庫查詢有資料的時段
        List<PeakHourDto> dbResults = journeyRepository.findPeakHours();
        
        // 2. 建立 24 小時完整分布的 Map
        Map<Integer, PeakHourDto> hourMap = new HashMap<>();
        for (int hour = 0; hour < 24; hour++) {
            hourMap.put(hour, new PeakHourDto(hour, 0));
        }
        
        // 3. 填入資料庫查詢結果
        for (PeakHourDto dto : dbResults) {
            hourMap.put(dto.getHour(), dto);
        }
        
        // 4. 找出最大進站人數（用於識別尖峰時段）
        long maxCount = dbResults.stream()
                .mapToLong(PeakHourDto::getEntryCount)
                .max()
                .orElse(0);
        
        // 5. 計算擁擠程度閾值
        long highThreshold = (long) (maxCount * 0.7);  // 70% 以上為高度擁擠
        long mediumThreshold = (long) (maxCount * 0.4); // 40-70% 為中度擁擠
        
        // 6. 增強每個時段的資訊（加入尖峰標記和擁擠程度）
        List<PeakHourDto> result = new ArrayList<>();
        for (int hour = 0; hour < 24; hour++) {
            PeakHourDto dto = hourMap.get(hour);
            long count = dto.getEntryCount();
            
            // 判斷是否為尖峰時段（人數達到最大值的 70% 以上）
            boolean isPeak = count >= highThreshold && count > 0;
            
            // 判斷擁擠程度
            String level;
            if (count == 0) {
                level = "NONE";
            } else if (count >= highThreshold) {
                level = "HIGH";
            } else if (count >= mediumThreshold) {
                level = "MEDIUM";
            } else {
                level = "LOW";
            }
            
            result.add(dto.withEnhancements(isPeak, level));
        }
        
        return result;
    }

    // TODO: 學員實作 - 熱門路線分析
    // public List<RouteAnalysisDto> getPopularRoutes() {
    //     // 統計各起迄站組合的搭乘次數
    //     // 計算各路線總收入
    //     // 依搭乘次數排序，取前 10 名
    // }
}

// Made with Bob