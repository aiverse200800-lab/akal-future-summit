import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RESEND_FROM = "AYFFS Summit <onboarding@resend.dev>";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { registrationId, studentName, studentEmail, registrationRef } = await req.json();

    if (!studentEmail || !studentName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Read Resend API key from the database vault via a SECURITY DEFINER function
    let resendApiKey: string | null = null;
    const { data: rpcData } = await supabase.rpc("get_resend_api_key");
    if (rpcData) {
      resendApiKey = rpcData as string;
    }

    const ref = registrationRef || "N/A";

    const emailHtml = buildEmailHtml(studentName, ref);

    // Always store in email_queue as a record
    const { data: queuedRow, error: queueErr } = await supabase.from("email_queue").insert({
      registration_id: registrationId || null,
      recipient_email: studentEmail,
      recipient_name: studentName,
      registration_ref: ref,
      subject: "Registration Confirmed — Akal Young Future Founders Summit",
      body_html: emailHtml,
      status: "queued",
    }).select().single();

    if (queueErr) {
      console.error("Failed to insert into email_queue:", queueErr.message);
    }

    // If Resend API key is available, try to send the email immediately
    if (resendApiKey) {
      try {
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: RESEND_FROM,
            to: [studentEmail],
            subject: "Registration Confirmed — Akal Young Future Founders Summit",
            html: emailHtml,
          }),
        });

        if (resendResponse.ok) {
          // Mark as sent in the queue
          if (queuedRow) {
            await supabase.from("email_queue").update({
              status: "sent",
              sent_at: new Date().toISOString(),
            }).eq("id", queuedRow.id);
          }
          return new Response(
            JSON.stringify({ success: true, message: "Email sent successfully" }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        } else {
          // Resend rejected (e.g. unverified recipient on free tier)
          // Email stays queued — can be retried later
          const errText = await resendResponse.text();
          console.warn("Resend API rejected email (stays queued):", errText);
        }
      } catch (sendErr) {
        console.warn("Failed to send via Resend (stays queued):", sendErr);
      }
    }

    // Email is queued regardless — returns success so the UX is not broken
    return new Response(
      JSON.stringify({ success: true, message: "Registration confirmed. Email queued." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function buildEmailHtml(studentName: string, ref: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#FAF7F2;font-family:Inter,system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF7F2;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
          <tr>
            <td style="background-color:#EA580C;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">Akal Young Future Founders Summit</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">40th Foundation Day Summit &bull; 22&ndash;23 October 2026</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 16px;color:#1A1814;font-size:20px;font-weight:700;">Registration Confirmed!</h2>
              <p style="margin:0 0 16px;color:#4a4a4a;font-size:15px;line-height:1.6;">
                Dear ${studentName},
              </p>
              <p style="margin:0 0 16px;color:#4a4a4a;font-size:15px;line-height:1.6;">
                Your registration for the <strong>Akal Young Future Founders Summit (AYFFS)</strong> has been successfully completed. We're excited to have you join us for two days of innovation, learning, and pitching in the Himalayas!
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFF7ED;border:1px solid #FED7AA;border-radius:12px;margin:24px 0;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#666;font-size:13px;padding-bottom:6px;">Registration Reference</td>
                        <td style="color:#1A1814;font-size:14px;font-weight:600;text-align:right;padding-bottom:6px;">${ref}</td>
                      </tr>
                      <tr>
                        <td style="color:#666;font-size:13px;padding-bottom:6px;border-top:1px solid #FED7AA;padding-top:12px;">Student Name</td>
                        <td style="color:#1A1814;font-size:14px;font-weight:600;text-align:right;padding-bottom:6px;border-top:1px solid #FED7AA;padding-top:12px;">${studentName}</td>
                      </tr>
                      <tr>
                        <td style="color:#666;font-size:13px;border-top:1px solid #FED7AA;padding-top:12px;">Summit Dates</td>
                        <td style="color:#1A1814;font-size:14px;font-weight:600;text-align:right;border-top:1px solid #FED7AA;padding-top:12px;">22&ndash;23 October 2026</td>
                      </tr>
                      <tr>
                        <td style="color:#666;font-size:13px;border-top:1px solid #FED7AA;padding-top:12px;">Venue</td>
                        <td style="color:#1A1814;font-size:14px;font-weight:600;text-align:right;border-top:1px solid #FED7AA;padding-top:12px;">Akal Academy Baru Sahib, Himachal Pradesh</td>
                      </tr>
                      <tr>
                        <td style="color:#666;font-size:13px;border-top:1px solid #FED7AA;padding-top:12px;">Fee Paid</td>
                        <td style="color:#EA580C;font-size:16px;font-weight:700;text-align:right;border-top:1px solid #FED7AA;padding-top:12px;">&#8377;5,000</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 16px;color:#4a4a4a;font-size:15px;line-height:1.6;">
                You will be notified soon with further details about the summit schedule, what to bring, and travel arrangements. Please keep your Registration Reference safe for any future correspondence.
              </p>
              <p style="margin:24px 0 0;color:#4a4a4a;font-size:15px;line-height:1.6;">
                We look forward to seeing you at the summit!
              </p>
              <p style="margin:24px 0 0;color:#4a4a4a;font-size:15px;line-height:1.6;">
                Warm regards,<br>
                <strong style="color:#1A1814;">AYFFS Organising Team</strong><br>
                <span style="color:#999;font-size:13px;">Akal Academy Baru Sahib &bull; 40th Foundation Day</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#1A1814;padding:24px 40px;text-align:center;">
              <p style="margin:0;color:rgba(255,255,255,0.4);font-size:12px;">
                &copy; 2026 Akal Young Future Founders Summit &bull; Two Days. One Summit. Every Idea Climbing.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
