export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { name, mobile, requirement, source = "form" } = await req.json();
    if (!name || !mobile || !requirement) {
      return new Response(JSON.stringify({ error: "Name, mobile, and requirement are required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const newInquiry = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      mobile,
      requirement,
      source,
      createdAt: new Date().toISOString(),
    };

    console.log("In-memory Inquiry Captured via Serverless:", newInquiry);

    return new Response(JSON.stringify({
      success: true,
      message: "Our team will contact you soon.",
      inquiry: newInquiry,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Failed to submit inquiry." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
