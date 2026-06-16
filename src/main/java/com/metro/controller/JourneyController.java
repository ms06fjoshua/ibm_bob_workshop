package com.metro.controller;

import com.metro.dto.JourneyStatisticsDto;
import com.metro.model.Journey;
import com.metro.service.JourneyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/journeys")
@CrossOrigin(origins = "*")
public class JourneyController {

    private final JourneyService journeyService;

    public JourneyController(JourneyService journeyService) {
        this.journeyService = journeyService;
    }

    @GetMapping
    public ResponseEntity<List<Journey>> getAllJourneys() {
        return ResponseEntity.ok(journeyService.getAllJourneys());
    }

    @GetMapping("/statistics")
    public ResponseEntity<JourneyStatisticsDto> getStatistics() {
        return ResponseEntity.ok(journeyService.getStatistics());
    }

    // TODO: 學員實作 - 熱門路線分析 API

    
}

// Made with Bob