import React, { useState, useEffect } from "react";

export function TimerWithMedian() {
    const [startTime, setStartTime] = useState(null);
    const [elapsed, setElapsed] = useState(0);
    const [running, setRunning] = useState(false);
    const [logs, setLogs] = useState([]);
    const [allDates, setAllDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const todayKey = `logs-${selectedDate}`;

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === "Space") {
                if (
                    ["INPUT", "SELECT", "TEXTAREA"].includes(
                        document.activeElement.tagName
                    )
                ) {
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
        const keys = Object.keys(localStorage).filter((key) =>
            key.startsWith("logs-")
        );
        setAllDates(keys.map((key) => key.replace("logs-", "")));
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
        return sorted.length % 2 !== 0
            ? sorted[mid]
            : (sorted[mid - 1] + sorted[mid]) / 2;
    };

    const formatTime = (ms) => {
        const seconds = Math.floor(ms / 1000);
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const mills = Math.floor((ms % 1000) / 100);
        return `${mins}:${secs.toString().padStart(2, "0")}.${mills}`;
    };

    return (
        <div className="w-2xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-lg rounded-2xl flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
                Timer for {selectedDate}
            </h1>

            {selectedDate === new Date().toISOString().split("T")[0] && (
                <>
                    <div className="w-full flex justify-center text-left text-9xl md:text-9xl font-normal text-gray-900 dark:text-gray-100">
                        <p className="w-[360px]">{formatTime(elapsed)}</p>
                    </div>
                    <div className="grid grid-cols-3 md:flex-row gap-1 h-15 justify-center">
                        {!running ? (
                            <button
                                onClick={startTimer}
                                className="col-span-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition"
                            >
                                Start
                            </button>
                        ) : (
                            <button
                                onClick={stopTimer}
                                className="col-span-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition"
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

            <div className="self-center h-xl">
                <h2 className="text-xl text-center font-bold mb-1 text-gray-900 dark:text-gray-100">
                    Median of the Day
                </h2>
                <p className="text-5xl text-center font-semibold text-gray-900 dark:text-gray-100">
                    {formatTime(getMedian())}
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    Logs
                </h2>
                <div className="h-48 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800">
                    {logs.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1 text-sm font-extralight text-gray-900 dark:text-gray-100">
                            {logs.map((log, index) => (
                                <li key={index} className="text-base">
                                    {formatTime(log)}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">No logs yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
