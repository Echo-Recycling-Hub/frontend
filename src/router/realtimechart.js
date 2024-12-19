import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

const RealtimeLineChart = () => {
    const [chartInstance, setChartInstance] = useState(null);
    const [data, setData] = useState([]);
    const [data1, setData1] = useState([]);

    useEffect(() => {
        const fetchRandomData = () => {
            // fetch('http://localhost:5000/api/random-data')
                fetch('http://54.82.4.76:5000/api/random-data')
                .then(response => response.json())
                .then(data => {
                    // data 객체에서 value를 추출하여 배열에 추가
                    setData(currentData => [...currentData, data.value]);
                })
                .catch(error => console.error('Error:', error));
        };

        const fetchRandomData1 = () => {
            // fetch('http://localhost:5000/api/random-data1')
                fetch('http://54.82.4.76:5000/api/random-data1')
                .then(response => response.json())
                .then(data => {
                    // data 객체에서 value를 추출하여 배열에 추가
                    setData1(currentData1 => [...currentData1, data.value]);
                })
                .catch(error => console.error('Error:', error));
        };

        const interval = setInterval(fetchRandomData, 2000);
        const interval1 = setInterval(fetchRandomData1, 5000);

        return () => {
            clearInterval(interval);
            clearInterval(interval1);
        };
    }, []);


    useEffect(() => {
        if (!chartInstance) {
            const ctx = document.getElementById('realtimeChart').getContext('2d');
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [], // 라벨은 초기에 비어있으며 데이터 업데이트 시 채워집니다.
                    datasets: [{
                        label: '실시간 재활용 처리량 (kg/s)',
                        data: [], // 데이터도 초기에 비어있습니다.
                        backgroundColor: 'rgb(71,195,225)',
                        borderColor: 'rgb(72,197,228)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'category', // 카테고리 타입으로 변경
                            title: {
                                display: true,
                                text: '시간'
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: '처리량 (kg/s)'
                            }
                        }
                    }
                }
            });
            setChartInstance(chart);
        }
    }, [chartInstance]);

// 유사하게, 두 번째 차트를 위한 useEffect도 검토하고 같은 방식으로 데이터를 처리합니다.


    useEffect(() => {
        if (!chartInstance) return; // 차트 인스턴스가 없으면 아무 작업도 수행하지 않습니다.

        const updateChartData = () => {
            const newTime = getCurrentTime(); // 현재 시간 가져오기

            // 새로운 데이터와 시간 라벨을 추가합니다.
            const newLabels = [...chartInstance.data.labels, newTime];
            const newDataValues = [...chartInstance.data.datasets[0].data, data[data.length - 1]];

            // 데이터가 9개 이상이면 가장 오래된 데이터(첫 번째 요소)를 제거합니다.
            if (newLabels.length > 8) {
                newLabels.shift(); // 첫 번째 라벨 제거
                newDataValues.shift(); // 첫 번째 데이터 제거
            }

            // 차트의 데이터와 라벨을 업데이트합니다.
            chartInstance.data.labels = newLabels;
            chartInstance.data.datasets.forEach(dataset => {
                dataset.data = newDataValues;
            });

            chartInstance.update(); // 차트 업데이트
        };

        const interval = setInterval(updateChartData, 2000); // 2초마다 데이터 업데이트
        return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
    }, [chartInstance, data]);


    // 현재 시간을 문자열로 반환하는 함수
    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };


    const [chartInstance1, setChartInstance1] = useState(null);

    useEffect(() => {
        if (!chartInstance1) {
            const ctx2 = document.getElementById('realtimeChart1').getContext('2d');
            const chart2 = new Chart(ctx2, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: '에리허브 회원 적립량',
                        data: [], // 데이터도 초기에 비어있습니다.
                        backgroundColor: 'rgb(255,99,132)',
                        borderColor: 'rgb(255,99,132)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'category', // 카테고리 타입으로 변경
                            title: {
                                display: true,
                                text: '시간'
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: '적립량'
                            }
                        }
                    }
                }
            });
            setChartInstance1(chart2);
        }
    }, [chartInstance1]);

    useEffect(() => {
        if (!chartInstance1) return;

        const updateChartData = () => {
            const newTime = getCurrentTime1(); // 현재 시간 가져오기

            // 새로운 데이터와 시간 라벨을 추가합니다.
            const newLabels = [...chartInstance1.data.labels, newTime];
            const newDataValues = [...chartInstance1.data.datasets[0].data, data1[data1.length - 1]];

            // 데이터가 5개 이상이면 가장 오래된 데이터(첫 번째 요소)를 제거합니다.
            if (newLabels.length > 6) {
                newLabels.shift(); // 첫 번째 라벨 제거
                newDataValues.shift(); // 첫 번째 데이터 제거
            }

            // 차트의 데이터와 라벨을 업데이트합니다.
            chartInstance1.data.labels = newLabels;
            chartInstance1.data.datasets.forEach(dataset => {
                dataset.data = newDataValues;
            });

            chartInstance1.update(); // 차트 업데이트
        };

        const interval1 = setInterval(updateChartData, 5000);
        return () => clearInterval(interval1); // 컴포넌트 언마운트 시 인터벌 정리
    }, [chartInstance1, data1]); // 차트 인스턴스가 변경될 때마다 실행


    // 현재 시간을 문자열로 반환하는 함수
    const getCurrentTime1 = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };


    return (
        <div className="chart-container3">
            <h2>실시간 재활용 처리량</h2>
            <canvas id="realtimeChart" width="500" height="500"></canvas>
            <h2>에리허브 회원 적립량</h2>
            <canvas id="realtimeChart1" width="500" height="500"></canvas>
        </div>
    );
};

export default RealtimeLineChart;