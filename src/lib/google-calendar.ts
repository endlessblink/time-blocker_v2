import { TimeBlock } from '@/types';

const SCOPES = 'https://www.googleapis.com/auth/calendar';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

export class GoogleCalendarService {
  private static instance: GoogleCalendarService;
  private initialized = false;
  private tokenClient: google.accounts.oauth2.TokenClient | null = null;

  private constructor() {}

  static getInstance(): GoogleCalendarService {
    if (!GoogleCalendarService.instance) {
      GoogleCalendarService.instance = new GoogleCalendarService();
    }
    return GoogleCalendarService.instance;
  }

  async initialize(clientId: string, apiKey: string): Promise<void> {
    if (this.initialized) return;

    try {
      await this.loadGapiClient();
      await this.loadGsiClient();
      
      await new Promise<void>((resolve, reject) => {
        gapi.load('client', async () => {
          try {
            await gapi.client.init({
              apiKey,
              discoveryDocs: [DISCOVERY_DOC],
            });
            resolve();
          } catch (err) {
            reject(err);
          }
        });
      });

      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPES,
        callback: '', // Will be set later
      });

      this.initialized = true;
    } catch (err) {
      console.error('Error initializing Google Calendar:', err);
      throw err;
    }
  }

  private async loadGapiClient(): Promise<void> {
    if (typeof gapi !== 'undefined') return;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load GAPI client'));
      document.body.appendChild(script);
    });
  }

  private async loadGsiClient(): Promise<void> {
    if (typeof google !== 'undefined') return;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load GSI client'));
      document.body.appendChild(script);
    });
  }

  async authorize(): Promise<void> {
    if (!this.tokenClient) {
      throw new Error('Token client not initialized');
    }

    return new Promise((resolve, reject) => {
      try {
        this.tokenClient!.callback = async (resp) => {
          if (resp.error) {
            reject(resp);
          }
          resolve();
        };

        if (gapi.client.getToken() === null) {
          this.tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
          this.tokenClient.requestAccessToken({ prompt: '' });
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  async syncTimeBlockToCalendar(block: TimeBlock): Promise<string> {
    if (!gapi.client.getToken()) {
      throw new Error('Not authorized');
    }

    const event = {
      summary: block.title,
      description: block.description,
      start: {
        dateTime: block.startTime.toISOString(),
      },
      end: {
        dateTime: block.endTime.toISOString(),
      },
      colorId: this.getColorIdForCategory(block.category),
    };

    try {
      const response = await gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      return response.result.id;
    } catch (err) {
      console.error('Error creating calendar event:', err);
      throw err;
    }
  }

  private getColorIdForCategory(category: string): string {
    // Google Calendar color IDs (1-11)
    const colorMap: Record<string, string> = {
      '1': '1', // Lavender
      '2': '2', // Sage
      '3': '3', // Grape
      '4': '4', // Flamingo
      '5': '5', // Banana
      default: '1',
    };

    return colorMap[category] || colorMap.default;
  }

  async getCalendarEvents(timeMin: Date, timeMax: Date): Promise<any[]> {
    if (!gapi.client.getToken()) {
      throw new Error('Not authorized');
    }

    try {
      const response = await gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        showDeleted: false,
        singleEvents: true,
        orderBy: 'startTime',
      });

      return response.result.items;
    } catch (err) {
      console.error('Error fetching calendar events:', err);
      throw err;
    }
  }
}