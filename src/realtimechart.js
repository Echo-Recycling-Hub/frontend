import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

const RealtimeLineChart = () => {
    const [chartInstance, setChartInstance] = useState(null);
    const [data, setData] = useState([]);

    useEffect(() => {
        const ctx = document.getElementById('realtimeChart').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: '실시간 재활용 처리량 (kg/s)',
                    data: data,
                    backgroundColor: 'rgb(71,195,225)',
                    borderColor: 'rgb(72,197,228)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '처리량 (kg/s)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: '시간'
                        }
                    }
                }
            }
        });

        setChartInstance(chart);

        // Cleanup
        return () => chart.destroy();
    }, []); // 초기 한 번만 실행

    useEffect(() => {
        if (!chartInstance) return; // 차트 인스턴스가 없으면 아무 작업도 수행하지 않습니다.

        const interval = setInterval(() => {
            const newData = generateRandomData();
            const newTime = getCurrentTime();
            setData([...data, { x: newTime, y: newData }]);
            // 10개 이상의 데이터가 쌓이면 첫 번째 데이터 삭제
            if (data.length >= 10) {
                setData(data.slice(1));
            }
            // 차트 업데이트
            chartInstance.data.datasets[0].data = data; // 데이터 업데이트
            chartInstance.update(); // 차트 업데이트
        }, 1000); // 1초마다 데이터 업데이트

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
    }, [data, chartInstance]); // 데이터 또는 차트 인스턴스가 변경될 때마다 실행

    // 랜덤값 생성 함수
    const generateRandomData = () => {
        return Math.floor(Math.random() * 151); // 0~150 사이의 랜덤값 생성
    };

    // 현재 시간을 문자열로 반환하는 함수
    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    return (
        <div className="chart-container">
            <h2>실시간 재활용 처리량</h2>
            <canvas id="realtimeChart" width="500" height="300"></canvas>
        </div>
    );
};

export default RealtimeLineChart;
