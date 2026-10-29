package com.dailywell.app

import com.dailywell.app.util.DateUtils
import org.junit.Assert.assertEquals
import org.junit.Test

class DailyCompletionPercentageTest {

    @Test
    fun zeroTasks_returnsZeroPercent() {
        val percent = DateUtils.calculateCompletionPercentage(completedCount = 0, totalCount = 0)
        assertEquals(0, percent)
    }

    @Test
    fun halfCompleted_returnsFiftyPercent() {
        val percent = DateUtils.calculateCompletionPercentage(completedCount = 2, totalCount = 4)
        assertEquals(50, percent)
    }

    @Test
    fun allCompleted_returnsOneHundredPercent() {
        val percent = DateUtils.calculateCompletionPercentage(completedCount = 5, totalCount = 5)
        assertEquals(100, percent)
    }

    @Test
    fun roundingBehavior_truncatesOrFloorsCorrectly() {
        val percent = DateUtils.calculateCompletionPercentage(completedCount = 1, totalCount = 3)
        assertEquals(33, percent)
    }
}
