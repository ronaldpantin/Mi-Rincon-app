"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Users, MapPin, Phone, Mail, User, PartyPopper } from "lucide-react"
import { useRouter } from "next/navigation"

// Definir las áreas disponibles con precios actualizados
const availableAreas = [
  {
    id: "salon-colonial",
    name: "Salón Colonial (Por Mesa)",
    price: 25,
    description: "Alquiler por mesa individual",
    capacity: "8-10 personas por mesa",
  },
  {
    id: "caney-piscina-grande",
    name: "Caney Piscina Grande",
    price: 50,
    description: "Área exclusiva junto a la piscina grande",
    capacity: "Hasta 100 personas",
  },
  {
    id: "bohio-potrero",
    name: "Bohío Potrero",
    price: 30,
    description: "Espacio rústico en área de potrero",
    capacity: "Hasta 80 personas",
  },
  {
    id: "area-piscina-pequena",
    name: "Área Piscina Pequeña",
    price: 20,
    description: "Área exclusiva junto a la piscina pequeña",
    capacity: "Hasta 50 personas",
  },
]

// Tipos de eventos disponibles
const eventTypes = [
  { id: "cumpleanos", name: "Cumpleaños", icon: "🎂" },
  { id: "reunion-familiar", name: "Reunión Familiar", icon: "👨‍👩‍👧‍👦" },
  { id: "boda", name: "Boda", icon: "💒" },
  { id: "despedida-solteros", name: "Despedida de Solteros", icon: "🎉" },
  { id: "reunion-escuela", name: "Reunión de Escuela o Colegio", icon: "🎓" },
  { id: "reunion-deportivo", name: "Reunión de Equipo Deportivo", icon: "⚽" },
  { id: "reunion-automotores", name: "Reunión de Grupos Automotores", icon: "🚗" },
  { id: "empresas-pequenos", name: "Empresas Grupos Pequeños", icon: "🏢" },
  { id: "otros", name: "Otros", icon: "📝" },
]

export default function ReservationSmallGroupsForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    cedula: "",
    email: "",
    phone: "",
    visitDate: "",
    eventType: null as any,
    eventTypeOther: "",
    selectedArea: null as any,
    numberOfPeople: 50,
    otherRequirements: "",
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAreaSelect = (areaId: string) => {
    const area = availableAreas.find((a) => a.id === areaId)
    handleInputChange("selectedArea", area)
  }

  const handleEventTypeSelect = (eventTypeId: string) => {
    const eventType = eventTypes.find((e) => e.id === eventTypeId)
    handleInputChange("eventType", eventType)

    // Limpiar el campo "otros" si no es necesario
    if (eventTypeId !== "otros") {
      handleInputChange("eventTypeOther", "")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log("Submitting small groups reservation:", formData)

      const response = await fetch("/api/send-small-groups-reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Response error:", errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("Submission result:", result)

      if (result.success) {
        // Redirigir a página de confirmación con los datos
        const params = new URLSearchParams({
          type: "small-groups",
          id: result.solicitudId,
          name: result.data.customerName,
          eventType: result.data.eventType,
          area: result.data.selectedArea?.name || "",
          people: result.data.numberOfPeople.toString(),
          date: result.data.visitDate,
          emailSent: result.data.emailSent ? "true" : "false",
        })

        router.push(`/reservation-success?${params.toString()}`)
      } else {
        throw new Error(result.error || "Error al enviar la solicitud")
      }
    } catch (error) {
      console.error("Error submitting reservation:", error)
      alert("Error al enviar la solicitud. Por favor, inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = () => {
    const requiredFields = [
      formData.firstName,
      formData.lastName,
      formData.cedula,
      formData.email,
      formData.phone,
      formData.visitDate,
      formData.eventType,
      formData.selectedArea,
    ]

    const allFieldsFilled = requiredFields.every((field) => field && field !== "")

    // Si seleccionó "otros", también debe llenar el campo específico
    const otherEventSpecified = formData.eventType?.id !== "otros" || formData.eventTypeOther.trim() !== ""

    return allFieldsFilled && otherEventSpecified
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6" />
              Reserva para Grupos Pequeños
            </CardTitle>
            <CardDescription className="text-green-100">
              Complete el formulario para solicitar una reserva para su evento especial
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Información Personal */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <User className="h-5 w-5 text-green-600" />
                  Información Personal
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre *</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Ingrese su nombre"
                      required
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido *</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Ingrese su apellido"
                      required
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cedula">Cédula de Identidad *</Label>
                    <Input
                      id="cedula"
                      type="text"
                      value={formData.cedula}
                      onChange={(e) => handleInputChange("cedula", e.target.value)}
                      placeholder="V-12345678"
                      required
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="correo@ejemplo.com"
                        required
                        className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone">Teléfono *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+58 412-123-4567"
                        required
                        className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Detalles de la Visita */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-green-600" />
                  Detalles de la Visita
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="visitDate">Fecha de Visita *</Label>
                    <Input
                      id="visitDate"
                      type="date"
                      value={formData.visitDate}
                      onChange={(e) => handleInputChange("visitDate", e.target.value)}
                      required
                      min={new Date().toISOString().split("T")[0]}
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventType">Tipo de Evento *</Label>
                    <Select onValueChange={handleEventTypeSelect} required>
                      <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                        <SelectValue placeholder="Seleccione el tipo de evento" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((eventType) => (
                          <SelectItem key={eventType.id} value={eventType.id}>
                            <div className="flex items-center gap-2">
                              <span>{eventType.icon}</span>
                              <span>{eventType.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Campo adicional para "Otros" */}
                  {formData.eventType?.id === "otros" && (
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="eventTypeOther">Especifique el tipo de evento *</Label>
                      <Input
                        id="eventTypeOther"
                        type="text"
                        value={formData.eventTypeOther}
                        onChange={(e) => handleInputChange("eventTypeOther", e.target.value)}
                        placeholder="Describa su evento"
                        required
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  )}

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="selectedArea">Área que desea reservar *</Label>
                    <Select onValueChange={handleAreaSelect} required>
                      <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                        <SelectValue placeholder="Seleccione el área a reservar" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableAreas.map((area) => (
                          <SelectItem key={area.id} value={area.id}>
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-green-600" />
                                <span>{area.name}</span>
                              </div>
                              <Badge variant="secondary" className="ml-2">
                                ${area.price} USD
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Mostrar detalles del área seleccionada */}
                  {formData.selectedArea && (
                    <div className="md:col-span-2 p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">{formData.selectedArea.name}</h4>
                      <p className="text-green-700 text-sm mb-2">{formData.selectedArea.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-green-600 text-sm">Capacidad: {formData.selectedArea.capacity}</span>
                        <Badge className="bg-green-600 hover:bg-green-700">${formData.selectedArea.price} USD</Badge>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="numberOfPeople">Número de personas (mínimo 50) *</Label>
                    <Input
                      id="numberOfPeople"
                      type="number"
                      min="50"
                      max="1000"
                      value={formData.numberOfPeople}
                      onChange={(e) => handleInputChange("numberOfPeople", Number.parseInt(e.target.value))}
                      required
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                    <p className="text-sm text-gray-500">Capacidad máxima: 1000 personas</p>
                  </div>
                </div>
              </div>

              {/* Otros Requerimientos */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">Otros Requerimientos</h3>
                <div className="space-y-2">
                  <Label htmlFor="otherRequirements">Describa cualquier requerimiento especial</Label>
                  <Textarea
                    id="otherRequirements"
                    value={formData.otherRequirements}
                    onChange={(e) => handleInputChange("otherRequirements", e.target.value)}
                    placeholder="Ejemplo: decoración especial, catering, sonido, necesidades especiales, etc."
                    rows={4}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Botón de envío */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={!isFormValid() || isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Enviando Solicitud...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Enviar Solicitud de Reserva
                    </div>
                  )}
                </Button>
              </div>

              <div className="text-center text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                <p className="flex items-center justify-center gap-2">
                  <PartyPopper className="h-4 w-4 text-blue-600" />
                  Al enviar esta solicitud, nuestro equipo se pondrá en contacto con usted para confirmar disponibilidad
                  y coordinar los detalles.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
