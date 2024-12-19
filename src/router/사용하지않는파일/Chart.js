import React, { useState, useEffect } from 'react';
import axios from 'axios'; // axios를 사용하기 위해 import합니다.
import Chart from 'chart.js/auto'; // Chart.js를 import
import "../../css/chart.css"

function ChartComponent() {

    // 2020년 ~ 2022년도 서버 데이터
    const [serverData20, setServerData20] = useState([]);
    const [currentYear20, setCurrentYear20] = useState(2020);
    const [chartInstance20, setChartInstance20] = useState(null);
    useEffect(() => {
        fetch('http://localhost:3001/home1') // 서버 API URL에 따라 바꾸세요
        // fetch('http://54.82.4.76:3000/year2020') // 서버 API URL에 따라 바꾸세요
            .then(response => response.json())
            .then(fetchedData => {
                setServerData20(fetchedData);// 서버에서 가져온 데이터를 상태에 저장
                console.log(serverData20)
            })
            .catch(error => {
                console.error('Fetching data failed:', error);
            });
    }, []); // 빈 배열은 컴포넌트가 마운트될 때 한 번만 실행됨을 의미
    useEffect(() => {
        console.log(serverData20); // 데이터가 업데이트될 때마다 콘솔에 출력
    }, [serverData20]);

    // 2015년 ~ 2019년도 서버 데이터
    const [serverData15, setServerData15] = useState([]);
    const [currentYear15, setCurrentYear15] = useState(2015);
    const [chartInstance15, setChartInstance15] = useState(null);
    useEffect(() => {
        fetch('http://localhost:3001/home')
        // fetch('http://54.82.4.76:3000/year2015')
            .then(response => response.json())
            .then(fetchedData => {
                setServerData15(fetchedData);
            })
            .catch(error => {
                console.error('Fetching data failed:', error);
            });
    }, []);
    useEffect(() => {
        console.log(serverData15); // 데이터가 업데이트될 때마다 콘솔에 출력
    }, [serverData15]);


    // 2015~2019년 쓰레기배출량 라인차트
    useEffect(() => {
        // '총계'에 해당하는 데이터 필터링
        const filteredData = serverData15.filter(item => item.CATEGORY2 === '총계');
        // 차트 생성
        const chart = new Chart(document.getElementById('emissionsChart15'), {
            type: 'line', // 차트의 타입
            data: {
                labels: filteredData.map(item => item.YEAR), // 각 데이터 항목의 'year'를 라벨로 사용
                datasets: [{
                    label: '연도별 전국 쓰레기 배출량(2015~2019)',
                    data: filteredData.map(item => item.AMOUNT), // 각 데이터 항목의 'AMOUNT'를 값으로 사용
                    fill: false,
                    borderColor: '#49C6E5',
                    tension: 0.1
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: `연도별 전국 쓰레기 배출량(2015~2019)`,
                        font: {
                            size: 20
                        }
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false // 차트가 부모 요소의 크기에 맞게 조절되도록 함
        });

        // 컴포넌트가 언마운트될 때 차트 인스턴스 정리
        return () => chart.destroy();
    }, [serverData15]); // data가 변경될 때마다 차트를 업데이트

    // 2020~2022년 쓰레기배출량 라인차트
    useEffect(() => {
        // '합계'에 해당하는 데이터 필터링
        const filteredData = serverData20.filter(item => item.CATEGORY2 === '합계');
        // 차트 생성
        const chart = new Chart(document.getElementById('emissionsChart20'), {
            type: 'line', // 차트의 타입
            data: {
                labels: filteredData.map(item => item.YEAR), // 각 데이터 항목의 'year'를 라벨로 사용
                datasets: [{
                    label: '연도별 전국 쓰레기 배출량(2020~2022)',
                    data: filteredData.map(item => item.AMOUNT), // 각 데이터 항목의 'AMOUNT'를 값으로 사용
                    fill: false,
                    borderColor: '#49C6E5',
                    tension: 0.1
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: `연도별 전국 쓰레기 배출량(2020~2022)`,
                        font: {
                            size: 20
                        }
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false // 차트가 부모 요소의 크기에 맞게 조절되도록 함
        });

        // 컴포넌트가 언마운트될 때 차트 인스턴스 정리
        return () => chart.destroy();
    }, [serverData20]); // data가 변경될 때마다 차트를 업데이트

    // 2015~2019년 재활용쓰레기 라인차트
    useEffect(() => {
        // '재활용'을 포함하고 '소계'인 데이터 필터링
        const filteredData = serverData15.filter(item => item.CATEGORY3 === '소계' && item.CATEGORY2.includes('재활용'));

        // 차트 생성
        const chart = new Chart(document.getElementById('recycleChart15'), {
            type: 'line', // 차트의 타입
            data: {
                labels: filteredData.map(item => item.YEAR), // 각 데이터 항목의 'year'를 라벨로 사용
                datasets: [{
                    label: '연도별 전국 재활용 처리 현황(2015~2019)',
                    data: filteredData.map(item => item.AMOUNT), // 각 데이터 항목의 'AMOUNT'를 값으로 사용
                    fill: false,
                    borderColor: '#49C6E5',
                    tension: 0.1
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: `연도별 전국 재활용 처리 현황(2015~2019)`,
                        font: {
                            size: 20
                        }
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false // 차트가 부모 요소의 크기에 맞게 조절되도록 함
        });

        // 컴포넌트가 언마운트될 때 차트 인스턴스 정리
        return () => chart.destroy();
    }, [serverData15]); // data가 변경될 때마다 차트를 업데이트

    // 2020~2022년 재활용쓰레기 라인차트
    useEffect(() => {
        // '재활용'을 포함하고 '소계'인 데이터 필터링
        const filteredData = serverData20.filter(item => item.CATEGORY3 === '소계' && item.CATEGORY2.includes('재활용'));

        // 차트 생성
        const chart = new Chart(document.getElementById('recycleChart20'), {
            type: 'line', // 차트의 타입
            data: {
                labels: filteredData.map(item => item.YEAR), // 각 데이터 항목의 'year'를 라벨로 사용
                datasets: [{
                    label: '연도별 전국 재활용 처리 현황(2020~2022)',
                    data: filteredData.map(item => item.AMOUNT), // 각 데이터 항목의 'AMOUNT'를 값으로 사용
                    fill: false,
                    borderColor: '#49C6E5',
                    tension: 0.1
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: `연도별 전국 재활용 처리 현황(2020~2022)`,
                        font: {
                            size: 20
                        }
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false // 차트가 부모 요소의 크기에 맞게 조절되도록 함
        });

        // 컴포넌트가 언마운트될 때 차트 인스턴스 정리
        return () => chart.destroy();
    }, [serverData20]); // data가 변경될 때마다 차트를 업데이트

    // 2015~2019년 상세재활용쓰레기 도넛차트
    useEffect(() => {
        if (!serverData15.length) return; // 데이터가 없으면 함수 종료

        // 현재 연도에 해당하는 데이터 필터링
        const filteredData = serverData15.filter(item => item.YEAR === currentYear15);

        // 카테고리를 묶어서 데이터 합산
        const groupedData = {
            '천류': ['섬유', '의류'],
            '소형가전류': ['전기전자'],
            '플라스틱류': ['수지', '플라스틱'],
            '금속류': ['캔', '고철'],
            '유리류': ['유리'],
            '종이류': ['종이', '폐지']
        };

        const categoryData = {};
        Object.keys(groupedData).forEach(key => {
            categoryData[key] = 0;
        });

        filteredData.forEach(item => {
            Object.entries(groupedData).forEach(([category, subcategories]) => {
                if (subcategories.some(subcategory => item.CATEGORY3.includes(subcategory))) {
                    categoryData[category] += parseFloat(item.AMOUNT);
                }
            });
        });

        // 이전 차트 인스턴스가 있으면 파괴
        if (chartInstance15) chartInstance15.destroy();

        // 새로운 차트 생성
        const newChart = new Chart(document.getElementById('Chart15'), {
            type: 'doughnut',
            data: {
                labels: Object.keys(categoryData),
                datasets: [{
                    label: `${currentYear15}년 품목별 재활용 처리 현황`,
                    data: Object.values(categoryData),
                    backgroundColor: [
                        '#49C6E5',   // 글로우 블루
                        '#82D4F2',   // 라이트 글로우 블루
                        '#0088A8',   // 딥 글로우 블루
                        '#BF40BF',   // 글로우 퍼플
                        '#7A67EE',   // 퍼플 블루 믹스
                        '#00FFFF',   // 네온 시안
                        '#E0FFFF',   // 라이트 사이언
                        '#008B8B'    // 딥 사이언
                    ],
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: `${currentYear15}년 품목별 재활용 처리 현황`,
                        font: {
                            size: 20
                        }
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });

        setChartInstance15(newChart); // 차트 인스턴스 저장

    }, [serverData15, currentYear15]); // serverData15 또는 currentYear15가 변경될 때마다 실행
    // 연도 변경 인터벌 설정
    useEffect(() => {
        const years = [2015, 2016, 2017, 2018, 2019];
        let index = 0;

        const interval = setInterval(() => {
            setCurrentYear15(years[index]); // 현재 연도 설정
            index++;
            if (index === years.length) {
                index = 0; // 인덱스를 다시 0으로 설정하여 순환
            }
        }, 2000);

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
    }, []); // 초기 한 번만 실행

    // 2020~2022년 상세재활용쓰레기 도넛차트
    useEffect(() => {
        if (!serverData20.length) return; // 데이터가 없으면 함수 종료

        // 현재 연도에 해당하는 데이터 필터링
        const filteredData = serverData20.filter(item => item.YEAR === currentYear20);

        // 카테고리를 묶어서 데이터 합산
        const groupedData = {
            '천류': ['섬유', '의류'],
            '소형가전류': ['전기전자'],
            '플라스틱류': ['수지', '플라스틱'],
            '금속류': ['캔', '고철'],
            '유리류': ['유리'],
            '종이류': ['종이', '폐지']
        };

        const categoryData = {};
        Object.keys(groupedData).forEach(key => {
            categoryData[key] = 0;
        });

        filteredData.forEach(item => {
            Object.entries(groupedData).forEach(([category, subcategories]) => {
                if (subcategories.some(subcategory => item.CATEGORY3.includes(subcategory))) {
                    categoryData[category] += parseFloat(item.AMOUNT);
                }
            });
        });

        // 이전 차트 인스턴스가 있으면 파괴
        if (chartInstance20) chartInstance20.destroy();

        // 새로운 차트 생성
        const newChart = new Chart(document.getElementById('Chart20'), {
            type: 'doughnut',
            data: {
                labels: Object.keys(categoryData),
                datasets: [{
                    label: `${currentYear20}년 품목별 재활용 처리 현황`,
                    data: Object.values(categoryData),
                    backgroundColor: [
                        '#49C6E5',   // 글로우 블루
                        '#82D4F2',   // 라이트 글로우 블루
                        '#0088A8',   // 딥 글로우 블루
                        '#BF40BF',   // 글로우 퍼플
                        '#7A67EE',   // 퍼플 블루 믹스
                        '#00FFFF',   // 네온 시안
                        '#E0FFFF',   // 라이트 사이언
                        '#008B8B'    // 딥 사이언
                    ],
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: `${currentYear20}년 품목별 재활용 처리 현황`,
                        font: {
                            size: 20
                        }
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });

        setChartInstance20(newChart); // 차트 인스턴스 저장

    }, [serverData20, currentYear20]); // serverData20 또는 currentYear20가 변경될 때마다 실행
    // 연도 변경 인터벌 설정
    useEffect(() => {
        const years = [2020, 2021, 2022];
        let index = 0;

        const interval = setInterval(() => {
            setCurrentYear20(years[index]); // 현재 연도 설정
            index++;
            if (index === years.length) {
                index = 0; // 인덱스를 다시 0으로 설정하여 순환
            }
        }, 2000);

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
    }, []); // 초기 한 번만 실행


    return (
        <div className="chart-container">
            <div className="chart">
                <canvas id="emissionsChart15" width="500px" height="500px"></canvas>
            </div>
            <div className="chart">
                <canvas id="recycleChart15" width="500" height="500"></canvas>
            </div>
            <div className="doughnutChart">
                <canvas id="Chart15" width="500" height="500"></canvas>
            </div>
            <div className="chart">
                <canvas id="emissionsChart20" width="500" height="500"></canvas>
            </div>
            <div className="chart">
                <canvas id="recycleChart20" width="500" height="500"></canvas>
            </div>

            <div className="doughnutChart">
                <canvas id="Chart20" width="500" height="500"></canvas>
            </div>
        </div>
    );
};

export default ChartComponent;
