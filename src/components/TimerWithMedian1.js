import React, { useState, useEffect } from "react";

export function TimerWithMedian() {
    const [startTime, setStartTime] = useState(null);
    const [elapsed, setElapsed] = useState(0);
    const [running, setRunning] = useState(false);
    const [logs, setLogs] = useState([]);
    const [allDates, setAllDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

    const todayKey = `logs-${selectedDate}`;

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === "Space") {
                if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName)) {
                    return;
                }
                e.preventDefault();
                running ? stopTimer() : startTimer();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [running, elapsed, logs]);

    useEffect(() => {
        const keys = Object.keys(localStorage).filter(key => key.startsWith("logs-"));
        setAllDates(keys.map(key => key.replace("logs-", "")));
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem(todayKey);
        setLogs(saved ? JSON.parse(saved) : []);
    }, [todayKey]);

    useEffect(() => {
        localStorage.setItem(todayKey, JSON.stringify(logs));
        if (!allDates.includes(selectedDate)) {
            setAllDates([...allDates, selectedDate]);
        }
    }, [logs, todayKey, allDates, selectedDate]);

    useEffect(() => {
        let interval;
        if (running) {
            interval = setInterval(() => {
                setElapsed(Date.now() - startTime);
            }, 100);
        }
        return () => clearInterval(interval);
    }, [running, startTime]);

    const startTimer = () => {
        setStartTime(Date.now() - elapsed);
        setRunning(true);
    };

    const stopTimer = () => {
        setRunning(false);
        setLogs([...logs, elapsed]);
        setElapsed(0);
    };

    const resetLogs = () => {
        setLogs([]);
    };

    const getMedian = () => {
        if (logs.length === 0) return 0;
        const sorted = [...logs].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    };

    const formatTime = (ms) => {
        const seconds = Math.floor(ms / 1000);
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const mills = Math.floor((ms % 1000) / 100);
        return `${mins}:${secs.toString().padStart(2, "0")}.${mills}`;
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-2xl flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-center">Timer for {selectedDate}</h1>

            {selectedDate === new Date().toISOString().split("T")[0] && (
                <>
                    <div className="text-center text-6xl md:text-8xl font-mono font-bold">
                        {formatTime(elapsed)}
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        {!running ? (
                            <button
                                onClick={startTimer}
                                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition"
                            >
                                Start
                            </button>
                        ) : (
                            <button
                                onClick={stopTimer}
                                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition"
                            >
                                Stop & Log
                            </button>
                        )}
                        <button
                            onClick={resetLogs}
                            className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition"
                        >
                            Reset Logs
                        </button>
                    </div>
                </>
            )}

            <div>
                <h2 className="text-xl font-semibold mb-2">Logs</h2>
                <div className="h-48 overflow-y-auto border rounded-xl p-4 bg-gray-50">
                    {logs.length > 0 ? (
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                            {logs.map((log, index) => (
                                <li key={index} className="font-mono">{formatTime(log)}</li>
                            ))}
                        </ol>
                    ) : (
                        <p className="text-gray-500 italic">No logs yet.</p>
                    )}
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-1">Median of the Day</h2>
                <p className="text-2xl font-mono">{formatTime(getMedian())}</p>
            </div>
        </div>
    );
}
