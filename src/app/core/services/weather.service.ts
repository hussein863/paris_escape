import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface WeatherData {
  temp: number;
  description: string;
  tip: string;
}

const WMO_CODES: Record<number, { desc: string; tip: string }> = {
  0:  { desc: 'Clear sky in Paris',       tip: 'Great day for outdoor tours!' },
  1:  { desc: 'Mainly clear in Paris',    tip: 'Perfect for a walking tour.' },
  2:  { desc: 'Partly cloudy in Paris',   tip: 'Comfortable — bring a light jacket.' },
  3:  { desc: 'Overcast in Paris',        tip: 'Good for museum visits.' },
  45: { desc: 'Foggy in Paris',           tip: 'Magical atmosphere for photos!' },
  48: { desc: 'Foggy in Paris',           tip: 'Atmospheric — great for photography.' },
  51: { desc: 'Light drizzle in Paris',   tip: 'Bring an umbrella.' },
  53: { desc: 'Drizzle in Paris',         tip: 'Umbrella recommended.' },
  61: { desc: 'Light rain in Paris',      tip: 'Perfect day for indoor experiences.' },
  63: { desc: 'Rainy in Paris',           tip: 'Check out our museum tours.' },
  71: { desc: 'Light snow in Paris',      tip: 'Magical snowy Paris — dress warm!' },
  80: { desc: 'Rain showers in Paris',    tip: 'Take a covered experience today.' },
  95: { desc: 'Thunderstorm in Paris',    tip: 'Stay cozy — indoor tours available.' },
};

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly url = 'https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&current=temperature_2m,weather_code&timezone=Europe%2FParis';

  constructor(private http: HttpClient) {}

  getParisWeather(): Observable<WeatherData> {
    return this.http.get<any>(this.url).pipe(
      map(res => {
        const temp = Math.round(res.current.temperature_2m);
        const code = res.current.weather_code as number;
        const match = WMO_CODES[code] ?? WMO_CODES[2];
        return { temp, description: match.desc, tip: match.tip };
      })
    );
  }
}
