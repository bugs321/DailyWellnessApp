package com.dailywell.app

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class HydrationGoalValidationTest {

    private fun validateWaterGoal(ml: Int): Int {
        return ml.coerceIn(500, 8000)
    }

    private fun validateHydrationInterval(hours: Int): Int {
        return hours.coerceIn(1, 6)
    }

    private fun calculateWaterProgress(totalMl: Int, goalMl: Int): Int {
        if (goalMl <= 0) return 0
        return ((totalMl.toDouble() / goalMl.toDouble()) * 100).toInt().coerceAtLeast(0)
    }

    @Test
    fun goalBoundary_clampsMinimumAndMaximum() {
        assertEquals(500, validateWaterGoal(200))
        assertEquals(2500, validateWaterGoal(2500))
        assertEquals(8000, validateWaterGoal(12000))
    }

    @Test
    fun intervalBoundary_clampsMinimumAndMaximum() {
        assertEquals(1, validateHydrationInterval(0))
        assertEquals(2, validateHydrationInterval(2))
        assertEquals(6, validateHydrationInterval(10))
    }

    @Test
    fun waterProgress_calculatesCorrectPercentage() {
        assertEquals(0, calculateWaterProgress(0, 2000))
        assertEquals(50, calculateWaterProgress(1000, 2000))
        assertEquals(100, calculateWaterProgress(2000, 2000))
        assertEquals(125, calculateWaterProgress(2500, 2000)) // allows overachieving
    }
}
