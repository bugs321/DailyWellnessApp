package com.dailywell.app

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class MeditationTimerTest {

    enum class BoxBreathPhase {
        INHALE,
        HOLD_FULL,
        EXHALE,
        HOLD_EMPTY
    }

    private fun nextPhase(current: BoxBreathPhase): BoxBreathPhase {
        return when (current) {
            BoxBreathPhase.INHALE -> BoxBreathPhase.HOLD_FULL
            BoxBreathPhase.HOLD_FULL -> BoxBreathPhase.EXHALE
            BoxBreathPhase.EXHALE -> BoxBreathPhase.HOLD_EMPTY
            BoxBreathPhase.HOLD_EMPTY -> BoxBreathPhase.INHALE
        }
    }

    private fun formatTimer(secondsLeft: Int): String {
        val minutes = secondsLeft / 60
        val seconds = secondsLeft % 60
        return "%02d:%02d".format(minutes, seconds)
    }

    @Test
    fun boxBreathingSequence_advancesThroughAllFourPhases() {
        var phase = BoxBreathPhase.INHALE
        assertEquals(BoxBreathPhase.INHALE, phase)

        phase = nextPhase(phase)
        assertEquals(BoxBreathPhase.HOLD_FULL, phase)

        phase = nextPhase(phase)
        assertEquals(BoxBreathPhase.EXHALE, phase)

        phase = nextPhase(phase)
        assertEquals(BoxBreathPhase.HOLD_EMPTY, phase)

        phase = nextPhase(phase)
        assertEquals(BoxBreathPhase.INHALE, phase)
    }

    @Test
    fun timerFormatting_correctPadding() {
        assertEquals("05:00", formatTimer(300))
        assertEquals("00:45", formatTimer(45))
        assertEquals("00:00", formatTimer(0))
        assertEquals("15:30", formatTimer(930))
    }

    @Test
    fun countdownBoundary_doesNotDropBelowZero() {
        var secondsLeft = 3
        val tick = {
            if (secondsLeft > 0) secondsLeft--
        }

        tick()
        assertEquals(2, secondsLeft)
        tick()
        assertEquals(1, secondsLeft)
        tick()
        assertEquals(0, secondsLeft)
        tick() // extra tick
        assertEquals(0, secondsLeft)
    }

    @Test
    fun durationClamping_validatesRange() {
        fun validateMinutes(mins: Int): Int = mins.coerceIn(1, 60)

        assertEquals(1, validateMinutes(0))
        assertEquals(15, validateMinutes(15))
        assertEquals(60, validateMinutes(90))
    }
}
