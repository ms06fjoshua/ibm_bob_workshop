package com.metro.dto;

/**
 * 尖峰時段分析 DTO
 * 記錄每個小時的進站人數統計
 */
public class PeakHourDto {
    private final int hour;
    private final long entryCount;
    private final boolean peak;  // 改名：isPeak -> peak
    private final String level;  // 改名：congestionLevel -> level
    private final String timeRange;  // 新增：時間範圍欄位

    // Constructor for JPQL query (basic version)
    public PeakHourDto(int hour, long entryCount) {
        this.hour = hour;
        this.entryCount = entryCount;
        this.peak = false;
        this.level = "UNKNOWN";
        this.timeRange = formatTimeRange(hour);
    }

    // Full constructor with enhancements
    public PeakHourDto(int hour, long entryCount, boolean peak, String level) {
        this.hour = hour;
        this.entryCount = entryCount;
        this.peak = peak;
        this.level = level;
        this.timeRange = formatTimeRange(hour);
    }

    public int getHour() {
        return hour;
    }

    public long getEntryCount() {
        return entryCount;
    }

    public boolean isPeak() {
        return peak;
    }

    public String getLevel() {
        return level;
    }

    public String getTimeRange() {
        return timeRange;
    }

    /**
     * 建立增強版本的 DTO（加入尖峰標記和擁擠程度）
     */
    public PeakHourDto withEnhancements(boolean peak, String level) {
        return new PeakHourDto(this.hour, this.entryCount, peak, level);
    }

    /**
     * 格式化時間範圍
     */
    private static String formatTimeRange(int hour) {
        String startHour = String.format("%02d:00", hour);
        String endHour = String.format("%02d:59", hour);
        return startHour + " - " + endHour;
    }
}

// Made with Bob