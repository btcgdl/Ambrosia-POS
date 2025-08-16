const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  `http://${process.env.HOST}:${process.env.NEXT_PUBLIC_PORT_API}`;

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const url = `${apiUrl}/${resolvedParams.slug.join("/")}`;

  // Copiar headers del request original
  const headers = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  try {
    console.log('GET request to:', url);
    const response = await fetch(url, {
      headers,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    // Verificar si la respuesta es JSON
    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Copiar cookies de la respuesta
    const responseHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
    
    // Pasar cookies si las hay
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      responseHeaders['Set-Cookie'] = setCookieHeader;
    }

    // Para status 204, no enviar body
    if (response.status === 204) {
      return new Response(null, {
        status: 204,
        headers: responseHeaders,
      });
    }

    return Response.json(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: "Failed to fetch", details: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const resolvedParams = await params;
  const url = `${apiUrl}/${resolvedParams.slug.join("/")}`;
  const body = await request.text();

  // Copiar headers del request original
  const headers = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  try {
    console.log('POST request to:', url);
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    // Verificar si la respuesta es JSON
    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Copiar cookies de la respuesta
    const responseHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
    
    // Pasar cookies si las hay
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      responseHeaders['Set-Cookie'] = setCookieHeader;
    }

    // Para status 204, no enviar body
    if (response.status === 204) {
      return new Response(null, {
        status: 204,
        headers: responseHeaders,
      });
    }

    return Response.json(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: "Failed to fetch", details: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const resolvedParams = await params;
  const url = `${apiUrl}/${resolvedParams.slug.join("/")}`;
  const body = await request.text();

  // Copiar headers del request original
  const headers = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  try {
    console.log('PUT request to:', url);
    const response = await fetch(url, {
      method: "PUT",
      headers,
      body,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    // Verificar si la respuesta es JSON
    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Copiar cookies de la respuesta
    const responseHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
    
    // Pasar cookies si las hay
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      responseHeaders['Set-Cookie'] = setCookieHeader;
    }

    // Para status 204, no enviar body
    if (response.status === 204) {
      return new Response(null, {
        status: 204,
        headers: responseHeaders,
      });
    }

    return Response.json(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: "Failed to fetch", details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const resolvedParams = await params;
  const url = `${apiUrl}/${resolvedParams.slug.join("/")}`;

  // Copiar headers del request original
  const headers = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  try {
    console.log('DELETE request to:', url);
    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    // Verificar si la respuesta es JSON
    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Copiar cookies de la respuesta
    const responseHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
    
    // Pasar cookies si las hay
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      responseHeaders['Set-Cookie'] = setCookieHeader;
    }

    // Para status 204, no enviar body
    if (response.status === 204) {
      return new Response(null, {
        status: 204,
        headers: responseHeaders,
      });
    }

    return Response.json(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: "Failed to fetch", details: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
