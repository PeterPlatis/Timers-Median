import React, { useState, useEffect } from "react";

export default function LogsViewer() {
    const [allDates, setAllDates] = useState([]);
    const [logsByDate, setLogsByDate] = useState({});
    const [selectedDate, setSelectedDate] = useState("");

    useEffect(() => {
        const keys = Object.keys(localStorage).filter((key) => key.startsWith("logs-"));
        const dates = keys.map((key) => key.replace("logs-", ""));
        const data = {};
        dates.forEach((date) => {
            const saved = localStorage.getItem(`logs-${date}`);
            if (saved) {
                data[date] = JSON.parse(saved);
            }
        });
        setAllDates(dates);
        if (dates.length > 0) {
            setSelectedDate(dates[1]);
        }
        setLogsByDate(data);
    }, []);

    const formatTime = (ms) => {
        const seconds = Math.floor(ms / 1000);
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const mills = Math.floor((ms % 1000) / 100);
        return `${mins}:${secs.toString().padStart(2, "0")}.${mills}`;
    };

    const getMedian = (logs) => {
        if (!logs || logs.length === 0) return 0;
        const sorted = [...logs].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-lg rounded-2xl flex flex-col gap-6 transition-colors">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center">
                Logs Calendar Viewer
            </h1>

            {allDates.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400">
                    No logs saved yet.
                </p>
            )}

            {allDates.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <label className="font-medium text-gray-700 dark:text-gray-300">
                        Select Date:
                    </label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>
            )}

            {selectedDate && logsByDate[selectedDate] ? (
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center">
                        Logs for {selectedDate}
                    </h2>

                    <div className="border border-gray-300 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800 h-64 overflow-auto">
                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-200 font-mono space-y-1">
                            {logsByDate[selectedDate].map((log, index) => (
                                <li key={index}>{formatTime(log)}</li>
                            ))}
                        </ul>
                    </div>

                    <p className="text-center text-lg font-mono text-gray-800 dark:text-gray-100">
                        Median: {formatTime(getMedian(logsByDate[selectedDate]))}
                    </p>
                </div>
            ) : (
                selectedDate && (
                    <p className="text-center text-gray-500 dark:text-gray-400">
                        No logs for selected date.
                    </p>
                )
            )}
        </div>
    );
}
