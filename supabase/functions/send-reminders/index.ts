import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.44.4";
import { Resend } from "https://esm.sh/resend@3.5.0";

console.log("Hello from Functions!");

serve(async (req) => {
  const { method } = req;

  if (method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          persistSession: false,
        },
      },
    );

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    // Fetch pending reminders that are due
    const { data: reminders, error: fetchError } = await supabaseClient
      .from("reminders")
      .select(
        `
        id,
        channel,
        scheduled_for,
        appointment_id,
        appointments (
          start_at,
          patients (
            full_name,
            email,
            phone
          ),
          staff_profiles (
            full_name,
            email
          )
        )
      `,
      )
      .eq("status", "pending")
      .lte("scheduled_for", new Date().toISOString());

    if (fetchError) {
      console.error("Error fetching reminders:", fetchError);
      return new Response(JSON.stringify({ error: fetchError.message }), {
        headers: { "Content-Type": "application/json" },
        status: 500,
      });
    }

    if (!reminders || reminders.length === 0) {
      console.log("No reminders due.");
      return new Response(JSON.stringify({ message: "No reminders due." }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    console.log(`Processing ${reminders.length} reminders...`);

    for (const reminder of reminders) {
      const {
        id: reminderId,
        channel,
        appointments: appointment,
      } = reminder;
      const patient = appointment?.patients;
      const practitioner = appointment?.staff_profiles;

      if (!patient || !practitioner || !appointment) {
        console.error(`Missing data for reminder ${reminderId}`);
        await supabaseClient
          .from("reminders")
          .update({ status: "failed", error: "Missing appointment/patient/practitioner data" })
          .eq("id", reminderId);
        continue;
      }

      let status: "sent" | "failed" = "failed";
      let providerMessageId: string | null = null;
      let errorMessage: string | null = null;

      try {
        if (channel === "email" && patient.email) {
          const { data, error: resendError } = await resend.emails.send({
            from: "Clinic MVP <onboarding@resend.dev>", // Replace with your verified Resend domain
            to: [patient.email],
            subject: `Appointment Reminder: ${patient.full_name} with ${practitioner.full_name}`,
            html: `
              <p>Hi ${patient.full_name},</p>
              <p>This is a friendly reminder about your upcoming appointment with ${practitioner.full_name} at Clinic MVP.</p>
              <p><strong>When:</strong> ${new Date(appointment.start_at).toLocaleString()}</p>
              <p>We look forward to seeing you!</p>
              <p>Best regards,</p>
              <p>The Clinic MVP Team</p>
            `,
          });

          if (resendError) {
            throw new Error(resendError.message);
          }
          status = "sent";
          providerMessageId = data?.id || null;
          console.log(`Email reminder ${reminderId} sent to ${patient.email}`);
        } else if (channel === "sms" && patient.phone) {
          // TODO: Implement Twilio SMS sending here
          // For now, we'll just log it and mark as sent
          console.log(
            `SMS reminder ${reminderId} for ${patient.full_name} (phone: ${patient.phone}) - SMS not yet implemented. Marking as sent.`,
          );
          status = "sent"; // Mark as sent for now, until Twilio is integrated
          providerMessageId = "mock-sms-id";
        } else {
          errorMessage = `Reminder channel ${channel} not supported or missing recipient info.`;
          console.warn(errorMessage);
        }
      } catch (sendError: any) {
        errorMessage = sendError.message;
        console.error(`Error sending reminder ${reminderId}:`, errorMessage);
      }

      // Update reminder status in DB
      const { error: updateError } = await supabaseClient
        .from("reminders")
        .update({
          status: status,
          sent_at: status === "sent" ? new Date().toISOString() : null,
          provider_message_id: providerMessageId,
          error: errorMessage,
        })
        .eq("id", reminderId);

      if (updateError) {
        console.error(
          `Error updating reminder status for ${reminderId}:`,
          updateError,
        );
      }
    }

    return new Response(JSON.stringify({ message: "Reminders processed." }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Unhandled error in send-reminders function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});