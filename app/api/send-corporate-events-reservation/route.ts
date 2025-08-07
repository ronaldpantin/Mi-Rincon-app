import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 API Route: send-corporate-events-reservation called")

    const body = await request.json()
    console.log("📝 Received data:", body)

    // Validar datos requeridos
    if (
      !body.contactName ||
      !body.contactEmail ||
      !body.contactPhone ||
      !body.estimatedAttendees ||
      !body.eventDate ||
      !body.eventType
    ) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Validar configuración SMTP
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("❌ SMTP credentials not configured")
      return NextResponse.json({ error: "Configuración de email no disponible" }, { status: 500 })
    }

    // Generar ID único para la solicitud
    const solicitudId = `CER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const currentDate = new Date().toLocaleString("es-VE", {
      timeZone: "America/Caracas",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })

    console.log("Generated solicitudId:", solicitudId)

    // Preparar datos estructurados
    const reservationData = {
      solicitudId,
      type: "corporate-events-reservation",
      companyName: body.companyName || "No especificada",
      contactName: body.contactName,
      contactEmail: body.contactEmail,
      contactPhone: body.contactPhone,
      estimatedAttendees: body.estimatedAttendees,
      eventDate: body.eventDate,
      eventType: body.eventType,
      specialRequests: body.specialRequests || "Ninguno",
      submittedAt: new Date().toISOString(),
      emailSent: false,
      emailMethod: "none",
    }

    console.log("📋 Processed reservation data:", reservationData)

    // Preparar contenido del email
    const emailSubject = `🏢 Nueva Solicitud Evento Corporativo - ${body.eventType} - ${solicitudId}`

    // Email HTML profesional
    const emailHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva Solicitud Evento Corporativo</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
        .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .section { margin-bottom: 25px; padding: 20px; border-left: 4px solid #3b82f6; background: #f8fafc; border-radius: 8px; }
        .section h3 { margin-top: 0; color: #1e40af; font-size: 18px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px; }
        .info-item { padding: 12px; background: white; border-radius: 6px; border: 1px solid #e2e8f0; }
        .label { font-weight: bold; color: #1e293b; font-size: 14px; }
        .value { color: #475569; margin-top: 4px; }
        .footer { background: #1e293b; color: white; padding: 20px; text-align: center; }
        .highlight { background: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b; margin-top: 15px; }
        .action-required { background: #dbeafe; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-top: 20px; }
        .action-required h4 { color: #1e40af; margin-top: 0; }
        .action-required ul { color: #1e40af; margin: 10px 0; padding-left: 20px; }
        .company-info { background: #f1f5f9; padding: 20px; border-radius: 8px; margin-top: 15px; border: 1px solid #cbd5e1; }
        @media (max-width: 600px) {
            .info-grid { grid-template-columns: 1fr; }
            .content { padding: 20px; }
            .header { padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏢 Nueva Solicitud Evento Corporativo</h1>
            <h2>Grandes Grupos - Hacienda Rincón Grande</h2>
            <p><strong>ID:</strong> ${solicitudId}</p>
            <p><strong>Fecha:</strong> ${currentDate}</p>
        </div>
        
        <div class="content">
            <div class="section">
                <h3>🏢 Información de la Empresa</h3>
                ${
                  reservationData.companyName !== "No especificada"
                    ? `
                <div class="company-info">
                    <h4 style="margin-top: 0; color: #1e40af;">${reservationData.companyName}</h4>
                </div>
                `
                    : ""
                }
                <div class="info-grid">
                    <div class="info-item">
                        <div class="label">Persona de Contacto:</div>
                        <div class="value">${reservationData.contactName}</div>
                    </div>
                    <div class="info-item">
                        <div class="label">Email:</div>
                        <div class="value"><a href="mailto:${reservationData.contactEmail}">${reservationData.contactEmail}</a></div>
                    </div>
                    <div class="info-item">
                        <div class="label">Teléfono:</div>
                        <div class="value"><a href="tel:${reservationData.contactPhone}">${reservationData.contactPhone}</a></div>
                    </div>
                </div>
            </div>

            <div class="section">
                <h3>📅 Detalles del Evento Corporativo</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="label">Fecha Preferida:</div>
                        <div class="value">${new Date(reservationData.eventDate).toLocaleDateString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}</div>
                    </div>
                    <div class="info-item">
                        <div class="label">Tipo de Evento:</div>
                        <div class="value">${reservationData.eventType}</div>
                    </div>
                    <div class="info-item">
                        <div class="label">Asistentes Estimados:</div>
                        <div class="value">${reservationData.estimatedAttendees} personas</div>
                    </div>
                </div>
            </div>

            ${
              reservationData.specialRequests !== "Ninguno"
                ? `
            <div class="section">
                <h3>📝 Requerimientos Especiales</h3>
                <div class="highlight">
                    <p style="margin: 0;">${reservationData.specialRequests}</p>
                </div>
            </div>
            `
                : ""
            }

            <div class="action-required">
                <h4>⚠️ Acción Requerida - Evento Corporativo</h4>
                <ul>
                    <li>Contactar al cliente dentro de 24-48 horas</li>
                    <li>Verificar disponibilidad para: <strong>${new Date(reservationData.eventDate).toLocaleDateString("es-ES")}</strong></li>
                    <li>Preparar propuesta personalizada para: <strong>${reservationData.eventType}</strong></li>
                    <li>Coordinar capacidad para <strong>${reservationData.estimatedAttendees} personas</strong></li>
                    <li>Evaluar requerimientos especiales y servicios adicionales</li>
                    <li>Enviar cotización detallada con opciones de paquetes corporativos</li>
                </ul>
            </div>
        </div>

        <div class="footer">
            <p><strong>Hacienda Rincón Grande - Eventos Corporativos</strong></p>
            <p>📧 admin@haciendarincongrande.com | 📱 +58 412-232-8332</p>
            <p>📍 Hacienda Paya, Turmero 2115, Aragua, Venezuela</p>
            <p style="margin-top: 15px; font-size: 12px; opacity: 0.8;">
                ID de Solicitud: ${solicitudId} | Generado automáticamente
            </p>
        </div>
    </div>
</body>
</html>
    `

    // Email en texto plano como respaldo
    const emailText = `
NUEVA SOLICITUD DE EVENTO CORPORATIVO
====================================

ID de Solicitud: ${solicitudId}
Fecha de Recepción: ${currentDate}

INFORMACIÓN DE LA EMPRESA:
- Empresa: ${reservationData.companyName}
- Persona de Contacto: ${reservationData.contactName}
- Email: ${reservationData.contactEmail}
- Teléfono: ${reservationData.contactPhone}

DETALLES DEL EVENTO:
- Fecha Preferida: ${new Date(reservationData.eventDate).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}
- Tipo de Evento: ${reservationData.eventType}
- Asistentes Estimados: ${reservationData.estimatedAttendees} personas
- Requerimientos Especiales: ${reservationData.specialRequests}

ACCIÓN REQUERIDA:
✅ Contactar al cliente dentro de 24-48 horas
✅ Verificar disponibilidad para: ${new Date(reservationData.eventDate).toLocaleDateString("es-ES")}
✅ Preparar propuesta personalizada para: ${reservationData.eventType}
✅ Coordinar capacidad para ${reservationData.estimatedAttendees} personas
✅ Evaluar requerimientos especiales y servicios adicionales
✅ Enviar cotización detallada con opciones de paquetes corporativos

CONTACTO DIRECTO:
Email: ${reservationData.contactEmail}
Teléfono: ${reservationData.contactPhone}

---
Hacienda Rincón Grande - Eventos Corporativos
📧 admin@haciendarincongrande.com
📱 +58 412-232-8332
📍 Hacienda Paya, Turmero 2115, Aragua, Venezuela

ID de Solicitud: ${solicitudId}
    `

    console.log("📧 Email content prepared")
    console.log("📧 Subject:", emailSubject)

    // Envío directo via Gmail SMTP
    console.log("🔄 Sending via Gmail SMTP...")
    console.log("📧 SMTP Configuration:")
    console.log(`Host: smtp.gmail.com`)
    console.log(`Port: 587`)
    console.log(`User: ${process.env.SMTP_USER}`)
    console.log(`From: ${process.env.SMTP_FROM || process.env.SMTP_USER}`)

    // Configurar transporter SMTP con configuración específica para Gmail - CORREGIDO
    const transporter = nodemailer.createTransport({
      service: "gmail", // Usar servicio predefinido de Gmail
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    // Verificar conexión SMTP antes de enviar
    console.log("🔍 Verifying SMTP connection...")
    await transporter.verify()
    console.log("✅ SMTP connection verified successfully")

    // Configurar opciones del email
    const mailOptions = {
      from: `"Hacienda Rincón Grande - Eventos Corporativos" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: "admin@haciendarincongrande.com",
      replyTo: reservationData.contactEmail,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "high",
      },
    }

    console.log("📤 Sending email...")
    const result = await transporter.sendMail(mailOptions)
    console.log("✅ Email sent successfully via Gmail SMTP!")
    console.log("📧 Message ID:", result.messageId)
    console.log("📧 Response:", result.response)

    // Actualizar datos de reserva
    reservationData.emailSent = true
    reservationData.emailMethod = "gmail-smtp-direct"

    console.log("✅ Corporate event reservation processed successfully:", reservationData)

    // Preparar URL de redirección con parámetros
    const redirectParams = new URLSearchParams({
      type: "corporate-events",
      id: solicitudId,
      name: reservationData.contactName,
      eventType: reservationData.eventType,
      area: "Evento Corporativo",
      people: reservationData.estimatedAttendees.toString(),
      date: reservationData.eventDate,
      emailSent: "true",
      email: reservationData.contactEmail,
      phone: reservationData.contactPhone,
      company: reservationData.companyName,
    })

    return NextResponse.json({
      success: true,
      message: "Solicitud de evento corporativo enviada correctamente via Gmail SMTP",
      solicitudId: solicitudId,
      data: reservationData,
      redirectUrl: `/reservation-success?${redirectParams.toString()}`,
      emailMethod: "gmail-smtp-direct",
      messageId: result.messageId,
    })
  } catch (error) {
    console.error("❌ SMTP Error:", error)

    // Log detallado del error para debugging
    if (error instanceof Error) {
      console.error("Error name:", error.name)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }

    return NextResponse.json(
      {
        success: false,
        error: "Error al enviar el email via SMTP",
        details: error instanceof Error ? error.message : "Error desconocido",
        suggestion: "Verifique las credenciales SMTP en las variables de entorno",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({ error: "Método no permitido. Use POST para enviar reservas." }, { status: 405 })
}
