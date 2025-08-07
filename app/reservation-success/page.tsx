"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Users, MapPin, Mail, Phone, ArrowLeft, Home } from "lucide-react"
import Link from "next/link"

interface ReservationData {
  type: string
  id: string
  name: string
  eventType: string
  area: string
  people: string
  date: string
  emailSent: string
  email?: string
  phone?: string
  company?: string
}

function ReservationSuccessContent() {
  const searchParams = useSearchParams()
  const [reservationData, setReservationData] = useState<ReservationData | null>(null)

  useEffect(() => {
    const data: ReservationData = {
      type: searchParams.get("type") || "",
      id: searchParams.get("id") || "",
      name: searchParams.get("name") || "",
      eventType: searchParams.get("eventType") || "",
      area: searchParams.get("area") || "",
      people: searchParams.get("people") || "",
      date: searchParams.get("date") || "",
      emailSent: searchParams.get("emailSent") || "false",
      email: searchParams.get("email") || "",
      phone: searchParams.get("phone") || "",
      company: searchParams.get("company") || "",
    }
    setReservationData(data)
  }, [searchParams])

  if (!reservationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "small-groups":
        return "Grupos Pequeños"
      case "corporate-events":
        return "Eventos Corporativos"
      default:
        return "Reserva"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "small-groups":
        return "bg-green-100 text-green-800"
      case "corporate-events":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto space-y-4">
        {/* Success Card */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">¡Solicitud Enviada Exitosamente!</h1>
            <p className="text-sm text-gray-600 mb-4">Tu solicitud de reserva ha sido procesada correctamente</p>

            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">ID de Solicitud</span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{reservationData.id}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Tipo de Reserva</span>
                <Badge className={`text-xs ${getTypeColor(reservationData.type)}`}>
                  {getTypeLabel(reservationData.type)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              Información del Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Nombre</span>
                <span className="font-medium text-right">{reservationData.name}</span>
              </div>

              {reservationData.company && reservationData.company !== "No especificada" && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Empresa</span>
                  <span className="font-medium text-right">{reservationData.company}</span>
                </div>
              )}

              {reservationData.email && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium text-right text-xs">{reservationData.email}</span>
                </div>
              )}

              {reservationData.phone && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Teléfono</span>
                  <span className="font-medium text-right">{reservationData.phone}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Tipo de Evento</span>
                <span className="font-medium text-right capitalize">{reservationData.eventType}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Número de Personas</span>
                <span className="font-medium">{reservationData.people} personas</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Fecha de Visita</span>
                <span className="font-medium text-right text-xs">{formatDate(reservationData.date)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selected Area */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Área Seleccionada
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 text-sm">{reservationData.area}</h3>
              <p className="text-green-700 text-xs mt-1">
                Área reservada para tu evento de {reservationData.eventType.toLowerCase()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Email Status */}
        {reservationData.emailSent === "true" && (
          <Card className="border-0 shadow-lg bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-blue-800">
                <Mail className="h-4 w-4" />
                <span className="text-sm font-medium">Email enviado correctamente</span>
              </div>
              <p className="text-xs text-blue-700 mt-1">
                Hemos enviado los detalles de tu reserva a admin@haciendarincongrande.com
              </p>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Próximos Pasos:</h3>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Recibirás una confirmación por email en las próximas 24-48 horas</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Nuestro equipo se pondrá en contacto contigo para coordinar los detalles</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Te enviaremos información sobre servicios adicionales disponibles</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link href="/" className="flex items-center justify-center gap-2">
              <Home className="h-4 w-4" />
              Volver al Inicio
            </Link>
          </Button>

          <Button variant="outline" asChild className="w-full bg-transparent">
            <Link href="/" className="flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Hacer Otra Reserva
            </Link>
          </Button>
        </div>

        {/* Contact Info */}
        <Card className="border-0 shadow-lg bg-gray-50">
          <CardContent className="p-4 text-center">
            <h3 className="font-semibold text-gray-900 text-sm mb-2">¿Necesitas ayuda?</h3>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex items-center justify-center gap-2">
                <Phone className="h-3 w-3" />
                <span>+58 412-232-8332</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Mail className="h-3 w-3" />
                <span>admin@haciendarincongrande.com</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ReservationSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      }
    >
      <ReservationSuccessContent />
    </Suspense>
  )
}
