package com.metro.service;

import com.metro.dto.JourneyStatisticsDto;
import com.metro.model.Journey;
import com.metro.repository.JourneyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

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

    // TODO: 學員實作 - 熱門路線分析
    // public List<RouteAnalysisDto> getPopularRoutes() {
    //     // 統計各起迄站組合的搭乘次數
    //     // 計算各路線總收入
    //     // 依搭乘次數排序，取前 10 名
    // }
}

// Made with Bob