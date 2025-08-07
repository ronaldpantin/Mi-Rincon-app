"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Calendar, Users, Mail, Phone, FileText, Loader2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface FormData {
  companyName: string
  contactName: string
  contactEmail: string
  contactPhone: string
  estimatedAttendees: number
  eventDate: string
  eventType: string
  specialRequests: string
}

const eventTypes = [
  { value: "conferencia", label: "Conferencia" },
  { value: "seminario", label: "Seminario" },
  { value: "workshop", label: "Workshop" },
  { value: "team-building", label: "Team Building" },
  { value: "lanzamiento-producto", label: "Lanzamiento de Producto" },
  { value: "reunion-anual", label: "Reunión Anual" },
  { value: "capacitacion", label: "Capacitación" },
  { value: "evento-networking", label: "Evento de Networking" },
  { value: "celebracion-corporativa", label: "Celebración Corporativa" },
  { value: "otro", label: "Otro" },
]

export default function ReservationCorporateEventsForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    estimatedAttendees: 50,
    eventDate: "",
    eventType: "",
    specialRequests: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const validateForm = (): boolean => {
    if (!formData.contactName.trim()) {
      setError("El nombre de contacto es requerido")
      return false
    }
    if (!formData.contactEmail.trim()) {
      setError("El correo electrónico es requerido")
      return false
    }
    if (!formData.contactPhone.trim()) {
      setError("El teléfono de contacto es requerido")
      return false
    }
    if (!formData.eventDate) {
      setError("La fecha del evento es requerida")
      return false
    }
    if (!formData.eventType) {
      setError("El tipo de evento es requerido")
      return false
    }
    if (formData.estimatedAttendees < 1) {
      setError("El número de asistentes debe ser mayor a 0")
      return false
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.contactEmail)) {
      setError("Por favor ingresa un correo electrónico válido")
      return false
    }

    // Validate future date
    const selectedDate = new Date(formData.eventDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (selectedDate < today) {
      setError("La fecha del evento debe ser futura")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      console.log("Submitting corporate event reservation...", formData)

      const response = await fetch("/api/send-corporate-events-reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      console.log("API Response:", result)

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`)
      }

      if (result.success && result.redirectUrl) {
        console.log("Redirecting to:", result.redirectUrl)
        router.push(result.redirectUrl)
      } else {
        throw new Error(result.error || "Error desconocido al procesar la solicitud")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setError(error instanceof Error ? error.message : "Error al enviar el email via SMTP")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl text-gray-900">Reserva para Eventos Corporativos / Grandes Grupos</CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Para empresas, eventos especiales, conferencias o grupos muy grandes. Por favor, completa el siguiente
              formulario y nos pondremos en contacto contigo para diseñar una experiencia a medida.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-sm font-medium flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Nombre de la Empresa (Opcional)
                </Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Ej: Empresa ABC S.A."
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Contact Name */}
              <div className="space-y-2">
                <Label htmlFor="contactName" className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Nombre de Contacto *
                </Label>
                <Input
                  id="contactName"
                  type="text"
                  placeholder="Tu nombre completo"
                  value={formData.contactName}
                  onChange={(e) => handleInputChange("contactName", e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              {/* Contact Email and Phone */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Correo Electrónico *
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    className="w-full"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone" className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Teléfono de Contacto *
                  </Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    placeholder="+58 412-123-4567"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimatedAttendees" className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Asistentes Estimados *
                  </Label>
                  <Input
                    id="estimatedAttendees"
                    type="number"
                    min="1"
                    max="1000"
                    placeholder="50"
                    value={formData.estimatedAttendees}
                    onChange={(e) => handleInputChange("estimatedAttendees", Number.parseInt(e.target.value) || 0)}
                    className="w-full"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventDate" className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fecha Preferida del Evento *
                  </Label>
                  <Input
                    id="eventDate"
                    type="date"
                    min={getMinDate()}
                    value={formData.eventDate}
                    onChange={(e) => handleInputChange("eventDate", e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
              </div>

              {/* Event Type */}
              <div className="space-y-2">
                <Label htmlFor="eventType" className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Tipo de Evento *
                </Label>
                <Select value={formData.eventType} onValueChange={(value) => handleInputChange("eventType", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona el tipo de evento" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Special Requests */}
              <div className="space-y-2">
                <Label htmlFor="specialRequests" className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Requerimientos Especiales
                </Label>
                <Textarea
                  id="specialRequests"
                  placeholder="Describe cualquier requerimiento especial, equipos necesarios, catering, etc."
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                  className="w-full min-h-[80px] resize-none"
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando Solicitud...
                  </>
                ) : (
                  "Enviar Solicitud de Evento Corporativo"
                )}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                * Campos requeridos. Nos pondremos en contacto contigo dentro de 24-48 horas.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
