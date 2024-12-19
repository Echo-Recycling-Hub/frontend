import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
    'en-US': require('date-fns/locale/en-US')
};
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
});

const MyCalendar = () => {
    const [events, setEvents] = useState([]);
    const [lastFetched, setLastFetched] = useState(null);


    useEffect(() => {
        const now = Date.now();
        // 1시간 이내에 데이터가 이미 가져와졌다면 캐시된 데이터를 사용
        if (lastFetched && now - lastFetched < 60 * 60 * 1000) {
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const response = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily`, {
                    params: {
                        key: 'a30883f85d544928864f19eac413ab7b',
                        lat: latitude,
                        lon: longitude,
                        days: '16'
                    }
                });
                const weatherData = response.data.data;
                const weatherEvents = weatherData.map(day => ({
                    title: `${day.weather.description}, Temp: ${day.temp}°C`,
                    iconUrl: `https://www.weatherbit.io/static/img/icons/${day.weather.icon}.png`,
                    start: new Date(day.valid_date),
                    end: new Date(day.valid_date),
                    allDay: true
                }));
                setEvents(weatherEvents);
                setLastFetched(Date.now()); // 캐시 시간을 업데이트합니다.
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        });
    },);

    return (
        <div style={{marginTop: '30px', height: '800px', width: '100%' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                components={{
                    event: EventComponent  // 커스텀 이벤트 컴포넌트 사용
                }}
            />
        </div>
    );
};

// 커스텀 이벤트 컴포넌트 정의
const EventComponent = ({ event }) => {
    return (
        <span>
            <img src={event.iconUrl} alt="Weather icon" style={{ width: 30, verticalAlign: 'middle' }} />
            <strong>{event.title}</strong>
        </span>
    );
};

export default MyCalendar;