const WeatherIcon = ({ iconCode, isDay, description }) => {
    const iconUrl = `${iconCode.toString().padStart(2, '0')}${isDay ? 'd' : 'n'}.png`

    return (
        <img src={`/images/weather/${iconUrl}`} alt={description} />
    );
};

export default WeatherIcon