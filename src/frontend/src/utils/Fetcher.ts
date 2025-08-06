export class Fetcher {
  static apiUrl = import.meta.env.VITE_API_URL;

  static async get(uri: string, resetUser?: any): Promise<Response> {
    let response = await fetch(this.apiUrl + uri, {
      credentials: 'include',
    });

    if (response.status >= 400) {
      await this.refresh();

      response = await fetch(this.apiUrl + uri, {
        credentials: 'include',
      });
    }

    // user is most likely unauthenticated, redirect to login
    if (resetUser && response.status === 401) resetUser();

    return response;
  }

  static async post(uri: string, body?: any, resetUser?: any) {
    let response = await fetch(this.apiUrl + uri, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(body),
    });

    if (response.status >= 400) {
      await this.refresh();
      response = await fetch(this.apiUrl + uri, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(body),
      });
    }

    if (resetUser && response.status === 401) resetUser();

    return response;
  }

  static async put(uri: string, body?: any, resetUser?: any) {
    let response = await fetch(this.apiUrl + uri, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify(body),
    });
    if (response.status >= 400) {
      await this.refresh();
      response = await fetch(this.apiUrl + uri, {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify(body),
      });
    }

    if (resetUser && response.status === 401) resetUser();

    return response;
  }

  static async delete(uri: string, body?: any, resetUser?: any) {
    let response = await fetch(this.apiUrl + uri, {
      method: 'DELETE',
      credentials: 'include',
      body: JSON.stringify(body),
    });

    if (response.status >= 400) {
      await this.refresh();
      response = await fetch(this.apiUrl + uri, {
        method: 'DELETE',
        credentials: 'include',
        body: JSON.stringify(body),
      });
    }

    if (resetUser && response.status === 401) resetUser();

    return response;
  }

  static async refresh() {
    await fetch(this.apiUrl + '/api/token/refresh/', {
      method: 'POST',
      credentials: 'include',
    });
  }
}
