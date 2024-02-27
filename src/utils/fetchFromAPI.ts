interface APIRequestBody {
    [key: string]: any;
  }
  
export async function fetchFromAPI(endpoint: string, body: APIRequestBody): Promise<any> {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      console.error(`Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    return;
  }
}