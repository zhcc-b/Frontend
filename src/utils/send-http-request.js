async function sendHttpRequest(url, method, data = null) {
  const headers = new Headers();
  const options = {
    method,
    headers,
  };

  if (method === 'POST' || method === 'PUT') {
    headers.append('Content-Type', 'application/json');
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);

    return {
      status: response.status,
      data: await response.json(),
    };

  } catch (error) {
    // Handle network errors and other unexpected issues
    console.error('There was a problem with the fetch operation:', error);
    return {
      status: 500,
      data: "Internal Server Error",
    };
  }
}

export default sendHttpRequest;
