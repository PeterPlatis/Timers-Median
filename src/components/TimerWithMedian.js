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
                if (
                    ["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName)
                ) {
                    return;
                }
                e.preventDefault();
                if (running) {
                    stopTimer();
                } else {
                    startTimer();
                }
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
        if (saved) {
            setLogs(JSON.parse(saved));
        } else {
            setLogs([]);
        }
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
        <div className="grid  p-6 max-w-l mx-auto bg-white rounded-2xl shadow-md space-y-4">
            <h1 className="title text-2xl font-bold">Timer for {selectedDate}</h1>
            {selectedDate === new Date().toISOString().split("T")[0] && (
                <>
                    <div className="col-span-3 justify-self-center self-center h-4rem text-8xl font-mono">{formatTime(elapsed)}</div>
                    <div className="row-start-3 col-start-1 col-span-full grid grid-cols-3 space-x-2">
                        {!running ? (
                            <button
                                onClick={startTimer}
                                className="col-start-1 col-span-2 px-4 py-2 bg-green-500 text-white rounded-xl"
                            >
                                Start
                            </button>
                        ) : (
                            <button
                                onClick={stopTimer}
                                className="col-start-1 col-span-2 px-4 py-2 bg-red-500 text-white rounded-xl"
                            >
                                Stop & Log
                            </button>
                        )}
                        <button
                            onClick={resetLogs}
                            className="col-start-3 px-4 py-2 bg-gray-500 text-white rounded-xl"
                        >
                            Reset Logs
                        </button>
                    </div>
                </>
            )}
            <div className="col-start-1 row-start-4 flex flex-col">
                <h2 className="text-xl font-semibold">Logs:</h2>
                <div className=" border p-4 rounded-xl overflow-auto">
                    <ol className="list-disc font-extralight list-inside">
                        {logs.map((log, index) => (
                            <li key={index}>{formatTime(log)}</li>
                        ))}
                    </ol>
                </div>
            </div>


            <div>
                <h2 className="text-xl font-semibold">Median of the Day:</h2>
                <p className="text-lg font-mono">{formatTime(getMedian())}</p>
            </div>
        </div>
    );
}