const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  `http://${process.env.HOST}:${process.env.NEXT_PUBLIC_PORT_API}`;

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const { search } = new URL(request.url);
  const url = `${apiUrl}/${resolvedParams.slug.join("/")}${search}`;

  // Copiar headers del request original incluyendo cookies
  const headers = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  // Asegurar que las cookies se pasen al backend
  const cookies = request.headers.get("cookie");
  if (cookies) {
    headers["cookie"] = cookies;
    console.log("GET - Sending cookies to backend");
  }

  try {
    console.log("GET request to:", url);
    const response = await fetch(url, {
      headers,
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    // Para status 204 (No Content), no intentar parsear body
    let data;
    if (response.status === 204) {
      data = null;
    } else {
      // Verificar si la respuesta es JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    }

    // Copiar cookies de la respuesta
    const responseHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // Pasar todas las cookies si las hay
    const setCookieHeaders = response.headers.getSetCookie?.() || [];
    if (setCookieHeaders.length > 0) {
      // Para múltiples cookies, usar array
      responseHeaders["Set-Cookie"] = setCookieHeaders;
    } else {
      // Fallback para un solo set-cookie
      const setCookieHeader = response.headers.get("set-cookie");
      if (setCookieHeader) {
        responseHeaders["Set-Cookie"] = setCookieHeader;
      }
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
    console.error("Error:", error);
    return Response.json(
      { error: "Failed to fetch", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  const resolvedParams = await params;
  const { search } = new URL(request.url);
  const url = `${apiUrl}/${resolvedParams.slug.join("/")}${search}`;
  const body = await request.text();

  // Copiar headers del request original incluyendo cookies
  const headers = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  // Asegurar que las cookies se pasen al backend
  const cookies = request.headers.get("cookie");
  if (cookies) {
    headers["cookie"] = cookies;
    console.log("Sending cookies to backend");
  } else {
    console.log("No cookies found in request");
  }

  try {
    console.log("POST request to:", url);
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    // Para status 204 (No Content), no intentar parsear body
    let data;
    if (response.status === 204) {
      data = null;
    } else {
      // Verificar si la respuesta es JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    }

    // Copiar cookies de la respuesta
    const responseHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // Pasar todas las cookies si las hay
    const setCookieHeaders = response.headers.getSetCookie?.() || [];
    if (setCookieHeaders.length > 0) {
      // Para múltiples cookies, usar array
      responseHeaders["Set-Cookie"] = setCookieHeaders;
    } else {
      // Fallback para un solo set-cookie
      const setCookieHeader = response.headers.get("set-cookie");
      if (setCookieHeader) {
        responseHeaders["Set-Cookie"] = setCookieHeader;
      }
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
    console.error("Error:", error);
    return Response.json(
      { error: "Failed to fetch", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const resolvedParams = await params;
  const { search } = new URL(request.url);
  const url = `${apiUrl}/${resolvedParams.slug.join("/")}${search}`;
  const body = await request.text();

  // Copiar headers del request original incluyendo cookies
  const headers = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  // Asegurar que las cookies se pasen al backend
  const cookies = request.headers.get("cookie");
  if (cookies) {
    headers["cookie"] = cookies;
    console.log("PUT - Sending cookies to backend");
  }

  try {
    console.log("PUT request to:", url);
    const response = await fetch(url, {
      method: "PUT",
      headers,
      body,
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    // Para status 204 (No Content), no intentar parsear body
    let data;
    if (response.status === 204) {
      data = null;
    } else {
      // Verificar si la respuesta es JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    }

    // Copiar cookies de la respuesta
    const responseHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // Pasar todas las cookies si las hay
    const setCookieHeaders = response.headers.getSetCookie?.() || [];
    if (setCookieHeaders.length > 0) {
      // Para múltiples cookies, usar array
      responseHeaders["Set-Cookie"] = setCookieHeaders;
    } else {
      // Fallback para un solo set-cookie
      const setCookieHeader = response.headers.get("set-cookie");
      if (setCookieHeader) {
        responseHeaders["Set-Cookie"] = setCookieHeader;
      }
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
    console.error("Error:", error);
    return Response.json(
      { error: "Failed to fetch", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const resolvedParams = await params;
  const { search } = new URL(request.url);
  const url = `${apiUrl}/${resolvedParams.slug.join("/")}${search}`;

  // Copiar headers del request original incluyendo cookies
  const headers = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  // Asegurar que las cookies se pasen al backend
  const cookies = request.headers.get("cookie");
  if (cookies) {
    headers["cookie"] = cookies;
    console.log("DELETE - Sending cookies to backend");
  }

  try {
    console.log("DELETE request to:", url);
    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    // Para status 204 (No Content), no intentar parsear body
    let data;
    if (response.status === 204) {
      data = null;
    } else {
      // Verificar si la respuesta es JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    }

    // Copiar cookies de la respuesta
    const responseHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // Pasar todas las cookies si las hay
    const setCookieHeaders = response.headers.getSetCookie?.() || [];
    if (setCookieHeaders.length > 0) {
      // Para múltiples cookies, usar array
      responseHeaders["Set-Cookie"] = setCookieHeaders;
    } else {
      // Fallback para un solo set-cookie
      const setCookieHeader = response.headers.get("set-cookie");
      if (setCookieHeader) {
        responseHeaders["Set-Cookie"] = setCookieHeader;
      }
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
    console.error("Error:", error);
    return Response.json(
      { error: "Failed to fetch", details: error.message },
      { status: 500 }
    );
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
