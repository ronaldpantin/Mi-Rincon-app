import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 API Route: send-small-groups-reservation called")

    const body = await request.json()
    console.log("📝 Received data:", body)

    // Validar datos requeridos
    if (
      !body.firstName ||
      !body.lastName ||
      !body.email ||
      !body.phone ||
      !body.visitDate ||
      !body.eventType ||
      !body.selectedArea
    ) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Validar campo "otros" si es necesario
    if (body.eventType?.id === "otros" && !body.eventTypeOther?.trim()) {
      return NextResponse.json({ error: "Debe especificar el tipo de evento" }, { status: 400 })
    }

    // Validar configuración SMTP
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("❌ SMTP credentials not configured")
      return NextResponse.json({ error: "Configuración de email no disponible" }, { status: 500 })
    }

    // Generar ID único para la solicitud
    const solicitudId = `SGR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const currentDate = new Date().toLocaleString("es-VE", {
      timeZone: "America/Caracas",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })

    console.log("Generated solicitudId:", solicitudId)

    // Determinar el tipo de evento para mostrar
    const eventTypeDisplay =
      body.eventType?.id === "otros" ? `Otros: ${body.eventTypeOther}` : body.eventType?.name || "No especificado"

    // Preparar datos estructurados
    const reservationData = {
      solicitudId,
      type: "small-groups-reservation",
      customerName: `${body.firstName} ${body.lastName}`,
      firstName: body.firstName,
      lastName: body.lastName,
      cedula: body.cedula,
      email: body.email,
      phone: body.phone,
      visitDate: body.visitDate,
      eventType: body.eventType,
      eventTypeDisplay,
      eventTypeOther: body.eventTypeOther || "",
      selectedArea: body.selectedArea,
      numberOfPeople: body.numberOfPeople,
      otherRequirements: body.otherRequirements || "Ninguno",
      submittedAt: new Date().toISOString(),
      emailSent: false,
      emailMethod: "none",
    }

    console.log("📋 Processed reservation data:", reservationData)

    // Preparar contenido del email
    const emailSubject = `🎉 Nueva Solicitud Grupos Pequeños - ${eventTypeDisplay} - ${solicitudId}`

    // Email HTML profesional
    const emailHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva Solicitud de Reserva</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
        .header { background: linear-gradient(135deg, #16a085, #27ae60); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .section { margin-bottom: 25px; padding: 20px; border-left: 4px solid #27ae60; background: #f8f9fa; border-radius: 8px; }
        .section h3 { margin-top: 0; color: #27ae60; font-size: 18px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px; }
        .info-item { padding: 12px; background: white; border-radius: 6px; border: 1px solid #e9ecef; }
        .label { font-weight: bold; color: #2c3e50; font-size: 14px; }
        .value { color: #34495e; margin-top: 4px; }
        .area-details { background: #e8f5e8; padding: 20px; border-radius: 8px; margin-top: 15px; border: 1px solid #c3e6cb; }
        .footer { background: #34495e; color: white; padding: 20px; text-align: center; }
        .highlight { background: #fff3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107; margin-top: 15px; }
        .action-required { background: #d4edda; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin-top: 20px; }
        .action-required h4 { color: #155724; margin-top: 0; }
        .action-required ul { color: #155724; margin: 10px 0; padding-left: 20px; }
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
            <h1>🎉 Nueva Solicitud de Reserva</h1>
            <h2>Grupos Pequeños - Hacienda Rincón Grande</h2>
            <p><strong>ID:</strong> ${solicitudId}</p>
            <p><strong>Fecha:</strong> ${currentDate}</p>
        </div>
        
        <div class="content">
            <div class="section">
                <h3>👤 Información del Cliente</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="label">Nombre Completo:</div>
                        <div class="value">${reservationData.customerName}</div>
                    </div>
                    <div class="info-item">
                        <div class="label">Cédula:</div>
                        <div class="value">${reservationData.cedula}</div>
                    </div>
                    <div class="info-item">
                        <div class="label">Email:</div>
                        <div class="value"><a href="mailto:${reservationData.email}">${reservationData.email}</a></div>
                    </div>
                    <div class="info-item">
                        <div class="label">Teléfono:</div>
                        <div class="value"><a href="tel:${reservationData.phone}">${reservationData.phone}</a></div>
                    </div>
                </div>
            </div>

            <div class="section">
                <h3>📅 Detalles del Evento</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="label">Fecha de Visita:</div>
                        <div class="value">${new Date(reservationData.visitDate).toLocaleDateString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}</div>
                    </div>
                    <div class="info-item">
                        <div class="label">Tipo de Evento:</div>
                        <div class="value">${eventTypeDisplay}</div>
                    </div>
                    <div class="info-item">
                        <div class="label">Número de Personas:</div>
                        <div class="value">${reservationData.numberOfPeople} personas</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <h3>🏞️ Área Seleccionada</h3>
                ${
                  reservationData.selectedArea
                    ? `
                    <div class="area-details">
                        <h4 style="margin-top: 0; color: #155724;">${reservationData.selectedArea.name}</h4>
                        <p><strong>Descripción:</strong> ${reservationData.selectedArea.description}</p>
                        <p><strong>Capacidad:</strong> ${reservationData.selectedArea.capacity}</p>
                        <p><strong>Precio:</strong> $${reservationData.selectedArea.price} USD</p>
                    </div>
                `
                    : "<p>No se seleccionó área específica</p>"
                }
            </div>

            ${
              reservationData.otherRequirements !== "Ninguno"
                ? `
            <div class="section">
                <h3>📝 Requerimientos Especiales</h3>
                <div class="highlight">
                    <p style="margin: 0;">${reservationData.otherRequirements}</p>
                </div>
            </div>
            `
                : ""
            }

            <div class="action-required">
                <h4>⚠️ Acción Requerida</h4>
                <ul>
                    <li>Contactar al cliente dentro de 24-48 horas</li>
                    <li>Verificar disponibilidad para: <strong>${new Date(reservationData.visitDate).toLocaleDateString("es-ES")}</strong></li>
                    <li>Enviar cotización detallada para: <strong>${eventTypeDisplay}</strong></li>
                    <li>Coordinar detalles del área: <strong>${reservationData.selectedArea?.name}</strong></li>
                    <li>Confirmar capacidad para <strong>${reservationData.numberOfPeople} personas</strong></li>
                </ul>
            </div>
        </div>

        <div class="footer">
            <p><strong>Hacienda Rincón Grande</strong></p>
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
NUEVA SOLICITUD DE RESERVA - GRUPOS PEQUEÑOS
============================================

ID de Solicitud: ${solicitudId}
Fecha de Recepción: ${currentDate}

INFORMACIÓN DEL CLIENTE:
- Nombre Completo: ${reservationData.customerName}
- Cédula: ${reservationData.cedula}
- Email: ${reservationData.email}
- Teléfono: ${reservationData.phone}

DETALLES DEL EVENTO:
- Fecha de Visita: ${new Date(reservationData.visitDate).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}
- Tipo de Evento: ${eventTypeDisplay}
- Área Solicitada: ${reservationData.selectedArea?.name} ($${reservationData.selectedArea?.price} USD)
- Capacidad del Área: ${reservationData.selectedArea?.capacity}
- Número de Personas: ${reservationData.numberOfPeople}
- Otros Requerimientos: ${reservationData.otherRequirements}

ACCIÓN REQUERIDA:
✅ Contactar al cliente dentro de 24-48 horas
✅ Verificar disponibilidad para: ${new Date(reservationData.visitDate).toLocaleDateString("es-ES")}
✅ Enviar cotización detallada para: ${eventTypeDisplay}
✅ Coordinar detalles del área: ${reservationData.selectedArea?.name}
✅ Confirmar capacidad para ${reservationData.numberOfPeople} personas

CONTACTO DIRECTO:
Email: ${reservationData.email}
Teléfono: ${reservationData.phone}

---
Hacienda Rincón Grande
📧 admin@haciendarincongrande.com
📱 +58 412-232-8332
📍 Hacienda Paya, Turmero 2115, Aragua, Venezuela

ID de Solicitud: ${solicitudId}
    `

    console.log("📧 Email content prepared")
    console.log("📧 Subject:", emailSubject)

    // SOLO SMTP directo - sin respaldos
    console.log("🔄 Sending via Gmail SMTP...")
    console.log("📧 SMTP Configuration:")
    console.log(`Host: smtp.gmail.com`)
    console.log(`Port: 587`)
    console.log(`User: ${process.env.SMTP_USER}`)
    console.log(`From: ${process.env.SMTP_FROM || process.env.SMTP_USER}`)

    // Configurar transporter SMTP con configuración específica para Gmail
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
      from: `"Hacienda Rincón Grande - Sistema de Reservas" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: "admin@haciendarincongrande.com",
      replyTo: reservationData.email,
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

    console.log("✅ Reservation processed successfully:", reservationData)

    // Preparar URL de redirección con parámetros
    const redirectParams = new URLSearchParams({
      type: "small-groups",
      id: solicitudId,
      name: reservationData.customerName,
      eventType: eventTypeDisplay,
      area: reservationData.selectedArea?.name || "No especificada",
      people: reservationData.numberOfPeople.toString(),
      date: reservationData.visitDate,
      emailSent: "true",
    })

    return NextResponse.json({
      success: true,
      message: "Solicitud de reserva enviada correctamente via Gmail SMTP",
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
