"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MapPin,
  Calendar,
  UtensilsCrossed,
  MessageCircle,
  Phone,
  Instagram,
  Facebook,
  Clock,
  Users,
  TreePine,
  Camera,
  Car,
  Utensils,
  Waves,
  ShieldCheck,
  Table,
  Briefcase,
  UserCheck,
  ArrowLeft,
  CreditCard,
  Send,
  Bot,
  User,
  Mail,
  HelpCircle,
  X,
  Home,
  Activity,
} from "lucide-react"
import Image from "next/image"
import { ParkMap } from "../park-map"
import RestaurantMenu from "../restaurant-menu"
import SmallGroupsForm from "../reservation-small-groups-form"
import CorporateEventsForm from "../reservation-corporate-events-form"
import { PaymentForm } from "../payment-form"
import { PaymentPending } from "../payment-pending"
import FaqSection from "../faq-section"
import BcvReservationWidget from "../bcv-reservation-widget"
import Preloader from "../preloader"
import AdminLogin from "../admin-login"
import AdminDashboard from "../admin-dashboard"

// TikTok SVG Icon Component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

interface Message {
  id: string
  text: string
  sender: "user" | "assistant"
  timestamp: Date
  type?: "text" | "action" | "suggestion"
  actions?: Array<{
    label: string
    action: () => void
    icon?: any
  }>
}

interface ExclusiveArea {
  id: string
  name: string
  price: number
  description: string
  icon: any
}

const exclusiveAreas: ExclusiveArea[] = [
  {
    id: "salon_colonial_mesa",
    name: "Salón Colonial (Por Mesa)",
    price: 25,
    description: "Alquiler por mesa individual",
    icon: Table,
  },
  {
    id: "caney_piscina_grande",
    name: "Caney Piscina Grande",
    price: 50,
    description: "Área exclusiva junto a la piscina grande",
    icon: Waves,
  },
  {
    id: "bohio_potrero",
    name: "Bohío Potrero",
    price: 30,
    description: "Espacio rústico en área de potrero",
    icon: Home,
  },
  {
    id: "area_piscina_pequena",
    name: "Área Piscina Pequeña",
    price: 20,
    description: "Área exclusiva junto a la piscina pequeña",
    icon: Waves,
  },
]

const galleryImages = [
  {
    src: "/images/hacienda-landscape.jpg",
    alt: "Vista panorámica de Hacienda Rincón Grande con piscina y edificio amarillo",
    title: "Vista Panorámica",
    fallback: "/placeholder.svg?height=800&width=1200&text=Vista+Panorámica",
  },
  {
    src: "/images/gallery/paisaje-hacienda.jpg",
    alt: "Hermoso paisaje de campos verdes con carreta azul y montañas al fondo",
    title: "Paisaje Natural",
    fallback: "/placeholder.svg?height=800&width=1200&text=Paisaje+Natural",
  },
  {
    src: "/images/gallery/patineta-hacienda.jpg",
    alt: "Persona practicando skateboard en el skatepark de la hacienda",
    title: "Skatepark",
    fallback: "/placeholder.svg?height=800&width=1200&text=Skatepark",
  },
  {
    src: "/images/gallery/paseo-caballo-hacienda.jpg",
    alt: "Mujer montando caballo blanco en sendero natural de la hacienda",
    title: "Paseos a Caballo",
    fallback: "/placeholder.svg?height=800&width=1200&text=Paseo+a+Caballo",
  },
  {
    src: "/images/gallery/hacienda-caballos.jpg",
    alt: "Dos caballos pastando juntos en campo verde de la hacienda",
    title: "Caballos de la Hacienda",
    fallback: "/placeholder.svg?height=800&width=1200&text=Caballos",
  },
  {
    src: "/images/gallery/vista-piscina-hacienda.jpg",
    alt: "Vista espectacular de la piscina al atardecer con reflejos dorados",
    title: "Piscina al Atardecer",
    fallback: "/placeholder.svg?height=800&width=1200&text=Piscina+Atardecer",
  },
]

// Admin credentials (in a real app, this would be handled securely)
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "hacienda2024",
}

export default function MiRinconApp() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("home")
  const [selectedReservationType, setSelectedReservationType] = useState<string | null>(null)
  const [generalEntrySubStep, setGeneralEntrySubStep] = useState<"details" | "payment" | "pending">("details")
  const [currentReservationDetails, setCurrentReservationDetails] = useState<any>(null)
  const [solicitudId, setSolicitudId] = useState<string | null>(null)
  const [bcvRate, setBcvRate] = useState<number>(122.17)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Admin state
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [adminUser, setAdminUser] = useState("")
  const [adminLoginError, setAdminLoginError] = useState("")

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    cedula: "",
    bookerEmail: "",
    bookerPhone: "",
    visitDate: "",
    entradas: 1,
    exonerados: 0,
    selectedAreas: [] as string[],
    specialRequests: "",
    acceptsTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // AI Assistant state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "¡Hola! 👋 Soy tu asistente virtual de Hacienda Rincón Grande. Estoy aquí para ayudarte con información sobre nuestras instalaciones, precios, reservas y mucho más. ¿En qué puedo ayudarte hoy?",
      sender: "assistant",
      timestamp: new Date(),
      type: "text",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  // Admin access key combination listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+Alt+A to access admin
      if (event.ctrlKey && event.altKey && event.key === "a") {
        event.preventDefault()
        if (!isAdminMode && !isAdminAuthenticated) {
          setIsAdminMode(true)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isAdminMode, isAdminAuthenticated])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [activeSection])

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  const handleProceedToPayment = (details: any) => {
    setCurrentReservationDetails(details)
    setGeneralEntrySubStep("payment")
  }

  const handlePaymentSuccess = async (generatedSolicitudId: string) => {
    setSolicitudId(generatedSolicitudId)
    setGeneralEntrySubStep("pending")
  }

  const handleBackFromPayment = () => {
    setGeneralEntrySubStep("details")
    setCurrentReservationDetails(null)
  }

  const handleResetGeneralEntryReservation = () => {
    setGeneralEntrySubStep("details")
    setCurrentReservationDetails(null)
    setSolicitudId(null)
    setSelectedReservationType(null)
  }

  // Admin functions
  const handleAdminLogin = (credentials: { username: string; password: string }) => {
    if (credentials.username === ADMIN_CREDENTIALS.username && credentials.password === ADMIN_CREDENTIALS.password) {
      setIsAdminAuthenticated(true)
      setAdminUser(credentials.username)
      setAdminLoginError("")
    } else {
      setAdminLoginError("Credenciales incorrectas. Verifica tu usuario y contraseña.")
    }
  }

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false)
    setIsAdminMode(false)
    setAdminUser("")
    setAdminLoginError("")
    setActiveSection("home")
  }

  const handleBackFromAdminLogin = () => {
    setIsAdminMode(false)
    setAdminLoginError("")
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleAreaSelection = (areaId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      selectedAreas: checked ? [...prev.selectedAreas, areaId] : prev.selectedAreas.filter((id) => id !== areaId),
    }))
  }

  const handleBcvRateUpdate = (rate: number) => {
    setBcvRate(rate)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  const calculateAreasTotal = () => {
    return formData.selectedAreas.reduce((total, areaId) => {
      const area = exclusiveAreas.find((a) => a.id === areaId)
      return total + (area?.price || 0)
    }, 0)
  }

  const calculateSubtotalUSD = () => {
    const entradasTotal = formData.entradas * 5
    const areasTotal = calculateAreasTotal()
    return entradasTotal + areasTotal
  }

  const calculateSubtotalVEF = () => {
    return calculateSubtotalUSD() * bcvRate
  }

  const calculateIVAVEF = () => {
    return calculateSubtotalVEF() * 0.16
  }

  const calculateTotalVEF = () => {
    return calculateSubtotalVEF() + calculateIVAVEF()
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido"
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido"
    }
    if (!formData.cedula.trim()) {
      newErrors.cedula = "La cédula es requerida"
    }
    if (!formData.bookerEmail.trim()) {
      newErrors.bookerEmail = "El email es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.bookerEmail)) {
      newErrors.bookerEmail = "Email inválido"
    }
    if (!formData.bookerPhone.trim()) {
      newErrors.bookerPhone = "El teléfono es requerido"
    }
    if (!formData.visitDate) {
      newErrors.visitDate = "La fecha de visita es requerida"
    } else {
      const selectedDate = new Date(formData.visitDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate <= today) {
        newErrors.visitDate = "La fecha debe ser futura"
      }
    }
    if (formData.entradas < 1) {
      newErrors.entradas = "Debe haber al menos 1 entrada"
    }
    if (!formData.acceptsTerms) {
      newErrors.acceptsTerms = "Debe aceptar los términos y condiciones"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }

    const totalPeople = formData.entradas + formData.exonerados
    const entradaPrice = 5
    const subtotalUSD = calculateSubtotalUSD()
    const subtotalVEF = calculateSubtotalVEF()
    const ivaVEF = calculateIVAVEF()
    const totalVEF = calculateTotalVEF()

    const reservationDetails = {
      ...formData,
      bookerName: `${formData.firstName} ${formData.lastName}`,
      totalPeople,
      subtotalUSD,
      subtotalVEF,
      ivaVEF,
      totalVEF,
      bcvRate,
      entradaPrice,
      selectedAreasDetails: formData.selectedAreas.map((areaId) => exclusiveAreas.find((a) => a.id === areaId)),
    }

    handleProceedToPayment(reservationDetails)
  }

  const getAIResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase()

    if (message.includes("hola") || message.includes("buenos") || message.includes("buenas")) {
      return {
        text: "¡Hola! 😊 Bienvenido a Hacienda Rincón Grande. Soy tu asistente virtual y estoy aquí para ayudarte. Puedo ayudarte con información sobre precios, horarios, actividades, reservas y mucho más. ¿Qué te gustaría saber?",
        type: "action" as const,
        actions: [
          { label: "Ver Precios", action: () => {}, icon: CreditCard },
          { label: "Hacer Reserva", action: () => setActiveSection("reservations"), icon: Calendar },
          { label: "Ver Actividades", action: () => {}, icon: Activity },
        ],
      }
    }

    if (message.includes("precio") || message.includes("costo") || message.includes("tarifa")) {
      return {
        text: "💰 **Nuestros Precios:**\n\n🎫 **Entrada General:** $5 USD por persona (a partir de 4 años)\n👶 **Gratis:** Menores de 4 años y personas con discapacidades\n\n🏢 **Áreas Exclusivas:**\n• Salón Colonial: $25 USD por mesa\n• Caney Piscina Grande: $50 USD\n• Bohío Potrero: $30 USD\n• Área Piscina Pequeña: $20 USD\n\n💳 Aceptamos pagos en bolívares al cambio BCV del día.",
        type: "action" as const,
        actions: [
          { label: "Hacer Reserva", action: () => setActiveSection("reservations"), icon: Calendar },
          { label: "Ver Áreas", action: () => setActiveSection("map"), icon: MapPin },
        ],
      }
    }

    return {
      text: "🤔 Interesante pregunta. Aunque no tengo información específica sobre eso, puedo ayudarte con:\n\n• 💰 Precios y tarifas\n• 🕐 Horarios de atención\n• 🎯 Actividades disponibles\n• 📍 Ubicación y direcciones\n• 📅 Reservas y eventos\n• 🍽️ Restaurante y comida\n• 📞 Información de contacto\n\n¿Sobre cuál de estos temas te gustaría saber más?",
      type: "action" as const,
      actions: [
        { label: "Ver Precios", action: () => {}, icon: CreditCard },
        { label: "Hacer Reserva", action: () => setActiveSection("reservations"), icon: Calendar },
        { label: "Contactar", action: () => setActiveSection("contact"), icon: Phone },
      ],
    }
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputMessage
    setInputMessage("")
    setIsTyping(true)

    setTimeout(() => {
      const aiResponseData = getAIResponse(currentInput)
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseData.text,
        sender: "assistant",
        timestamp: new Date(),
        type: aiResponseData.type,
        actions: aiResponseData.actions,
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const today = new Date().toISOString().split("T")[0]

  // Show preloader while loading
  if (isLoading) {
    return <Preloader onLoadingComplete={handleLoadingComplete} />
  }

  // Show admin login if in admin mode but not authenticated
  if (isAdminMode && !isAdminAuthenticated) {
    return <AdminLogin onLogin={handleAdminLogin} onBack={handleBackFromAdminLogin} error={adminLoginError} />
  }

  // Show admin dashboard if authenticated
  if (isAdminAuthenticated) {
    return <AdminDashboard onLogout={handleAdminLogout} adminUser={adminUser} />
  }

  // Render functions
  const renderReservationSelector = () => (
    <div className="p-6 bg-transparent min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#9b2226] mb-2">Tipo de Reserva</h1>
        <p className="text-[#005f73] text-sm">Selecciona el tipo de reserva que mejor se adapte a tus necesidades</p>
      </div>

      <div className="space-y-4">
        <div
          className="p-6 cursor-pointer transition-all duration-500 rounded-lg group"
          style={{ backgroundColor: "#efe8d7" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#005f73"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#efe8d7"
          }}
          onClick={() => setSelectedReservationType("general")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <UserCheck className="w-6 h-6 text-[#005f73] group-hover:text-[#e9d8a6] transition-all duration-500" />
              <div>
                <h3 className="font-bold text-[#005f73] text-lg mb-1 group-hover:text-[#e9d8a6] transition-all duration-500">
                  Entrada General
                </h3>
                <p className="text-[#005f73] text-sm group-hover:text-[#e9d8a6] transition-all duration-500">
                  Para individuos, familias y grupos pequeños (hasta 40 personas)
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs bg-[#ee9b00] text-black px-2 py-1 rounded-full font-medium">
                    Pago inmediato
                  </span>
                  <span className="text-xs bg-[#ca6702] text-white px-2 py-1 rounded-full">
                    Confirmación instantánea
                  </span>
                </div>
              </div>
            </div>
            <div className="w-2 h-2 bg-[#ee9b00] rounded-full animate-pulse"></div>
          </div>
        </div>

        <div
          className="p-6 cursor-pointer transition-all duration-500 rounded-lg group"
          style={{ backgroundColor: "#efe8d7" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#bb3e03"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#efe8d7"
          }}
          onClick={() => setSelectedReservationType("small_groups")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Users className="w-6 h-6 text-[#bb3e03] group-hover:text-[#ee9b00] transition-all duration-500" />
              <div>
                <h3 className="font-bold text-[#bb3e03] text-lg mb-1 group-hover:text-[#ee9b00] transition-all duration-500">
                  Grupos Pequeños
                </h3>
                <p className="text-[#bb3e03] text-sm group-hover:text-[#ee9b00] transition-all duration-500">
                  Para grupos de 41+ personas, cumpleaños, reuniones familiares
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs bg-[#ee9b00] text-black px-2 py-1 rounded-full">Solicitud</span>
                  <span className="text-xs bg-[#ca6702] text-white px-2 py-1 rounded-full">Respuesta en 24-48h</span>
                </div>
              </div>
            </div>
            <div className="w-2 h-2 bg-[#ee9b00] rounded-full animate-pulse"></div>
          </div>
        </div>

        <div
          className="p-6 cursor-pointer transition-all duration-500 rounded-lg group"
          style={{ backgroundColor: "#efe8d7" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#005f73"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#efe8d7"
          }}
          onClick={() => setSelectedReservationType("corporate_events")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Briefcase className="w-6 h-6 text-[#005f73] group-hover:text-[#e9d8a6] transition-all duration-500" />
              <div>
                <h3 className="font-bold text-[#005f73] text-lg mb-1 group-hover:text-[#e9d8a6] transition-all duration-500">
                  Eventos Corporativos
                </h3>
                <p className="text-[#005f73] text-sm group-hover:text-[#e9d8a6] transition-all duration-500">
                  Para empresas, conferencias, eventos especiales y grandes grupos
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs bg-[#ee9b00] text-black px-2 py-1 rounded-full">
                    Solicitud personalizada
                  </span>
                  <span className="text-xs bg-[#ca6702] text-white px-2 py-1 rounded-full">Respuesta en 24-48h</span>
                </div>
              </div>
            </div>
            <div className="w-2 h-2 bg-[#ee9b00] rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        onClick={() => setActiveSection("home")}
        className="w-full mt-8 border-2 border-[#005f73] text-[#005f73] hover:bg-[#005f73] bg-transparent rounded-lg py-3 text-sm font-medium hover:text-[#e9d8a6] transition-all duration-300"
      >
        Volver al Inicio
      </Button>
    </div>
  )

  const renderGeneralEntryForm = () => (
    <div className="p-6 bg-transparent min-h-screen">
      <div className="flex items-center space-x-3 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedReservationType(null)}
          className="p-2 hover:bg-[#005f73] rounded-lg text-[#005f73] hover:text-[#e9d8a6]"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#9b2226]">Entrada General</h1>
          <p className="text-[#005f73] text-sm">Complete los detalles de su reserva</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="p-6 rounded-lg" style={{ backgroundColor: "#bb3e03" }}>
          <div className="flex items-center space-x-3 mb-6">
            <User className="w-5 h-5 text-[#ee9b00] font-bold" strokeWidth={3} />
            <h3 className="text-xl font-bold text-[#ee9b00]">Información Personal</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-[#ee9b00] font-medium text-sm">
                Nombre *
              </Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className={`border-2 border-[#ee9b00] focus:border-[#ca6702] rounded-lg py-3 text-sm bg-[#efe8d7] text-[#005f73] placeholder:text-[#005f73]/60 ${
                  errors.firstName ? "border-red-500" : ""
                }`}
                placeholder="Tu nombre"
              />
              {errors.firstName && <p className="text-red-300 text-xs">{errors.firstName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-[#ee9b00] font-medium text-sm">
                Apellido *
              </Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={`border-2 border-[#ee9b00] focus:border-[#ca6702] rounded-lg py-3 text-sm bg-[#efe8d7] text-[#005f73] placeholder:text-[#005f73]/60 ${
                  errors.lastName ? "border-red-500" : ""
                }`}
                placeholder="Tu apellido"
              />
              {errors.lastName && <p className="text-red-300 text-xs">{errors.lastName}</p>}
            </div>
          </div>

          <div className="space-y-2 mt-6">
            <Label htmlFor="cedula" className="text-[#ee9b00] font-medium text-sm">
              Cédula de Identidad *
            </Label>
            <Input
              id="cedula"
              type="text"
              value={formData.cedula}
              onChange={(e) => handleInputChange("cedula", e.target.value)}
              className={`border-2 border-[#ee9b00] focus:border-[#ca6702] rounded-lg py-3 text-sm bg-[#efe8d7] text-[#005f73] placeholder:text-[#005f73]/60 ${
                errors.cedula ? "border-red-500" : ""
              }`}
              placeholder="V-12345678 o E-12345678"
            />
            {errors.cedula && <p className="text-red-300 text-xs">{errors.cedula}</p>}
          </div>

          <div className="space-y-2 mt-6">
            <Label htmlFor="bookerEmail" className="text-[#ee9b00] font-medium text-sm">
              Email *
            </Label>
            <Input
              id="bookerEmail"
              type="email"
              value={formData.bookerEmail}
              onChange={(e) => handleInputChange("bookerEmail", e.target.value)}
              className={`border-2 border-[#ee9b00] focus:border-[#ca6702] rounded-lg py-3 text-sm bg-[#efe8d7] text-[#005f73] placeholder:text-[#005f73]/60 ${
                errors.bookerEmail ? "border-red-500" : ""
              }`}
              placeholder="tu@email.com"
            />
            {errors.bookerEmail && <p className="text-red-300 text-xs">{errors.bookerEmail}</p>}
          </div>

          <div className="space-y-2 mt-6">
            <Label htmlFor="bookerPhone" className="text-[#ee9b00] font-medium text-sm">
              Teléfono *
            </Label>
            <Input
              id="bookerPhone"
              type="tel"
              value={formData.bookerPhone}
              onChange={(e) => handleInputChange("bookerPhone", e.target.value)}
              className={`border-2 border-[#ee9b00] focus:border-[#ca6702] rounded-lg py-3 text-sm bg-[#efe8d7] text-[#005f73] placeholder:text-[#005f73]/60 ${
                errors.bookerPhone ? "border-red-500" : ""
              }`}
              placeholder="+58 412 123 4567"
            />
            {errors.bookerPhone && <p className="text-red-300 text-xs">{errors.bookerPhone}</p>}
          </div>
        </div>

        {/* Visit Details */}
        <div className="p-6 rounded-lg" style={{ backgroundColor: "#005f73" }}>
          <div className="flex items-center space-x-3 mb-6">
            <Calendar className="w-5 h-5 text-[#e9d8a6] font-bold" strokeWidth={3} />
            <h3 className="text-xl font-bold text-[#e9d8a6]">Detalles de la Visita</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="visitDate" className="text-[#e9d8a6] font-medium text-sm">
              Fecha de Visita *
            </Label>
            <Input
              id="visitDate"
              type="date"
              min={today}
              value={formData.visitDate}
              onChange={(e) => handleInputChange("visitDate", e.target.value)}
              className={`border-2 border-[#e9d8a6] focus:border-[#ee9b00] rounded-lg py-3 text-sm bg-[#efe8d7] text-[#005f73] ${
                errors.visitDate ? "border-red-500" : ""
              }`}
            />
            {errors.visitDate && <p className="text-red-300 text-xs">{errors.visitDate}</p>}
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="entradas" className="text-[#e9d8a6] font-medium text-sm">
                Entradas *
              </Label>
              <Select
                value={formData.entradas.toString()}
                onValueChange={(value) => handleInputChange("entradas", Number.parseInt(value))}
              >
                <SelectTrigger
                  className={`border-2 border-[#e9d8a6] focus:border-[#ee9b00] rounded-lg py-3 text-sm bg-[#efe8d7] text-[#005f73] ${
                    errors.entradas ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#efe8d7] border-[#e9d8a6]">
                  {[...Array(40)].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()} className="text-[#005f73] hover:bg-[#e9d8a6]">
                      {i + 1} {i === 0 ? "Entrada" : "Entradas"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.entradas && <p className="text-red-300 text-xs">{errors.entradas}</p>}
              <p className="text-[#e9d8a6] text-xs">Personas a partir de 4 años</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exonerados" className="text-[#e9d8a6] font-medium text-sm">
                Exonerados
              </Label>
              <Select
                value={formData.exonerados.toString()}
                onValueChange={(value) => handleInputChange("exonerados", Number.parseInt(value))}
              >
                <SelectTrigger className="border-2 border-[#e9d8a6] focus:border-[#ee9b00] rounded-lg py-3 text-sm bg-[#efe8d7] text-[#005f73]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#efe8d7] border-[#e9d8a6]">
                  {[...Array(21)].map((_, i) => (
                    <SelectItem key={i} value={i.toString()} className="text-[#005f73] hover:bg-[#e9d8a6]">
                      {i} {i === 1 ? "Exonerado" : "Exonerados"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[#e9d8a6] text-xs">Menores de 4 años y personas con discapacidades</p>
            </div>
          </div>
        </div>

        {/* Exclusive Areas */}
        <div className="p-6 rounded-lg" style={{ backgroundColor: "#efe8d7" }}>
          <div className="flex items-center space-x-3 mb-6">
            <Table className="w-5 h-5 text-[#005f73] font-bold" strokeWidth={3} />
            <h3 className="text-xl font-bold text-[#005f73]">Áreas Exclusivas</h3>
            <span className="text-xs bg-[#ee9b00] text-black px-2 py-1 rounded-full font-medium">Opcional</span>
          </div>
          <p className="text-[#005f73] text-sm mb-6">
            Selecciona las áreas exclusivas que deseas alquilar para tu evento
          </p>

          <div className="space-y-4">
            <Label className="text-[#005f73] font-medium text-sm">Seleccionar Áreas</Label>
            <Select
              onValueChange={(value) => {
                if (value && !formData.selectedAreas.includes(value)) {
                  handleAreaSelection(value, true)
                }
              }}
            >
              <SelectTrigger className="border-2 border-[#005f73] focus:border-[#bb3e03] rounded-lg py-3 text-sm bg-white text-[#005f73]">
                <SelectValue placeholder="Selecciona un área exclusiva..." />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#005f73]">
                {exclusiveAreas.map((area) => (
                  <SelectItem
                    key={area.id}
                    value={area.id}
                    disabled={formData.selectedAreas.includes(area.id)}
                    className="text-[#005f73] hover:bg-[#e9d8a6]"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-3">
                        <area.icon className="w-4 h-4 text-[#bb3e03]" />
                        <div>
                          <span className="font-medium">{area.name}</span>
                          <p className="text-[#005f73] text-xs">{area.description}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-[#bb3e03] ml-4">${area.price}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Selected Areas Display */}
            {formData.selectedAreas.length > 0 && (
              <div className="space-y-3">
                <Label className="text-[#005f73] font-medium text-sm">Áreas Seleccionadas:</Label>
                <div className="space-y-2">
                  {formData.selectedAreas.map((areaId) => {
                    const area = exclusiveAreas.find((a) => a.id === areaId)
                    if (!area) return null

                    return (
                      <div key={areaId} className="p-4 bg-white rounded-lg border-2 border-[#005f73]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <area.icon className="w-4 h-4 text-[#bb3e03]" />
                            <div>
                              <span className="text-sm font-medium text-[#005f73]">{area.name}</span>
                              <p className="text-[#005f73] text-xs">{area.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-[#bb3e03]">${area.price} USD</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAreaSelection(areaId, false)}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-400 hover:bg-red-100 rounded-lg"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BCV Widget */}
        <div className="space-y-4">
          <BcvReservationWidget onRateFetched={handleBcvRateUpdate} />
        </div>

        {/* Pricing Summary */}
        <div className="p-6 rounded-lg space-y-4" style={{ backgroundColor: "#bb3e03" }}>
          <div className="flex items-center space-x-3 mb-4">
            <CreditCard className="w-5 h-5 text-[#ee9b00]" />
            <h4 className="font-bold text-[#ee9b00] text-lg">Resumen de Precios</h4>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-3 bg-[#efe8d7] rounded-lg border-2 border-[#ee9b00]">
              <span className="text-[#005f73]">Entradas ({formData.entradas} × $5)</span>
              <span className="font-medium text-[#bb3e03]">${(formData.entradas * 5).toFixed(2)}</span>
            </div>

            {formData.exonerados > 0 && (
              <div className="flex justify-between items-center p-3 bg-[#efe8d7] rounded-lg border-2 border-[#ee9b00]">
                <span className="text-[#005f73]">Exonerados ({formData.exonerados})</span>
                <span className="font-medium text-[#005f73]">Gratis</span>
              </div>
            )}

            {formData.selectedAreas.length > 0 && (
              <>
                <div className="border-t-2 border-[#ee9b00] pt-4 mt-4">
                  <p className="font-bold text-[#ee9b00] mb-3 text-sm">Áreas Exclusivas:</p>
                  {formData.selectedAreas.map((areaId) => {
                    const area = exclusiveAreas.find((a) => a.id === areaId)
                    return (
                      <div
                        key={areaId}
                        className="flex justify-between items-center p-3 bg-[#efe8d7] rounded-lg mb-2 border-2 border-[#ee9b00]"
                      >
                        <span className="text-[#005f73] text-sm">{area?.name}</span>
                        <span className="font-medium text-[#bb3e03] text-sm">${area?.price?.toFixed(2)}</span>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>

          <div className="border-t-2 border-[#ee9b00] pt-4 space-y-3">
            <div className="flex justify-between items-center p-3 bg-[#efe8d7] rounded-lg border-2 border-[#ee9b00]">
              <span className="text-[#005f73] text-sm">Subtotal USD:</span>
              <span className="font-medium text-[#bb3e03] text-sm">${calculateSubtotalUSD().toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[#efe8d7] rounded-lg border-2 border-[#ee9b00]">
              <span className="text-[#005f73] text-sm">Subtotal VEF (BCV {bcvRate.toFixed(8).replace(".", ",")}):</span>
              <span className="font-medium text-[#bb3e03] text-sm">Bs. {calculateSubtotalVEF().toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[#efe8d7] rounded-lg border-2 border-[#ee9b00]">
              <span className="text-[#005f73] text-sm">IVA (16% sobre VEF):</span>
              <span className="font-medium text-[#bb3e03] text-sm">Bs. {calculateIVAVEF().toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-[#ee9b00] rounded-lg">
              <span className="text-black text-sm font-bold">Total Final VEF:</span>
              <span className="text-black text-lg font-bold">Bs. {calculateTotalVEF().toFixed(2)}</span>
            </div>
          </div>

          <div className="text-xs text-[#ee9b00] mt-4 space-y-1 bg-[#efe8d7] p-4 rounded-lg border-2 border-[#ee9b00]">
            <p>• Entradas: Personas a partir de 4 años ($5 USD c/u)</p>
            <p>• Exonerados: Menores de 4 años y personas con discapacidades (Gratis)</p>
            <p>• Áreas exclusivas: Alquiler por día completo</p>
            <p>• IVA: Calculado sobre el monto en bolívares (16% - Venezuela)</p>
            <p>• Tasa BCV actualizada automáticamente</p>
          </div>
        </div>

        {/* Special Requests */}
        <div className="p-6 rounded-lg" style={{ backgroundColor: "#efe8d7" }}>
          <Label htmlFor="specialRequests" className="text-[#005f73] font-medium text-sm mb-2 block">
            Solicitudes Especiales (Opcional)
          </Label>
          <Textarea
            id="specialRequests"
            value={formData.specialRequests}
            onChange={(e) => handleInputChange("specialRequests", e.target.value)}
            className="border-2 border-[#005f73] focus:border-[#bb3e03] rounded-lg py-3 text-sm bg-white text-[#005f73] placeholder:text-[#005f73]/60"
            placeholder="¿Hay algo especial que debamos saber sobre tu visita?"
            rows={4}
          />
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-2">
          <div className="flex items-start space-x-3 p-4 bg-[#efe8d7] rounded-lg border-2 border-[#005f73]">
            <Checkbox
              id="acceptsTerms"
              checked={formData.acceptsTerms}
              onCheckedChange={(checked) => handleInputChange("acceptsTerms", checked)}
              className="mt-1 border-[#005f73] data-[state=checked]:bg-[#005f73] data-[state=checked]:border-[#005f73]"
            />
            <Label htmlFor="acceptsTerms" className="text-[#005f73] leading-relaxed text-sm font-medium">
              Acepto los términos y condiciones de la reserva. Entiendo que esta reserva está sujeta a disponibilidad y
              que recibiré una confirmación por email.
            </Label>
          </div>
          {errors.acceptsTerms && <p className="text-red-500 text-xs">{errors.acceptsTerms}</p>}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-[#ee9b00] hover:bg-[#ca6702] text-black font-bold text-sm py-4 rounded-lg transition-all duration-300"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Proceder al Pago
        </Button>
      </form>
    </div>
  )

  const renderAIAssistant = () => (
    <div className="p-6 bg-transparent min-h-screen">
      <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: "#bb3e03" }}>
        <div className="flex items-center space-x-3 mb-4">
          <Bot className="w-6 h-6 text-[#ee9b00] font-bold" strokeWidth={3} />
          <h1 className="text-2xl font-bold text-[#ee9b00]">Asistente Virtual</h1>
        </div>
        <p className="text-[#ee9b00] text-sm">Pregúntame lo que necesites saber sobre Hacienda Rincón Grande</p>
      </div>

      <div className="p-6 rounded-lg mb-8" style={{ backgroundColor: "#005f73" }}>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] p-4 rounded-lg ${
                    message.sender === "user"
                      ? "bg-[#ee9b00] text-black"
                      : "bg-[#efe8d7] text-[#005f73] border-2 border-[#e9d8a6]"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {message.sender === "assistant" && <Bot className="w-4 h-4 text-[#bb3e03] flex-shrink-0 mt-1" />}
                    {message.sender === "user" && <User className="w-4 h-4 text-black flex-shrink-0 mt-1" />}
                    <div className="flex-1">
                      <div className="text-sm whitespace-pre-line leading-relaxed">{message.text}</div>
                      {message.sender === "assistant" && message.actions && message.actions.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {message.actions.map((action, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={action.action}
                              className="text-xs border-2 border-[#bb3e03] text-[#bb3e03] hover:bg-[#bb3e03] hover:text-[#ee9b00] bg-transparent rounded-lg font-medium"
                            >
                              {action.icon && <action.icon className="w-3 h-3 mr-1" />}
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      )}
                      <p
                        className={`text-xs mt-3 ${message.sender === "user" ? "text-black/70" : "text-[#005f73]/70"}`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#efe8d7] text-[#005f73] p-4 rounded-lg border-2 border-[#e9d8a6]">
                  <div className="flex items-center space-x-3">
                    <Bot className="w-4 h-4 text-[#bb3e03]" />
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-[#bb3e03] rounded-full animate-bounce"></div>
                      <div
                        className="w-1 h-1 bg-[#bb3e03] rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-1 h-1 bg-[#bb3e03] rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-3">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu pregunta aquí..."
            className="flex-1 border-2 border-[#005f73] focus:border-[#bb3e03] rounded-lg py-3 text-sm bg-[#efe8d7] text-[#005f73] placeholder:text-[#005f73]/60"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-[#ee9b00] hover:bg-[#ca6702] rounded-lg px-4 py-3"
          >
            <Send className="w-4 h-4 text-black" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            "¿Cuáles son los precios?",
            "¿Qué horarios tienen?",
            "¿Qué actividades hay?",
            "¿Cómo llego al parque?",
            "¿Tienen restaurante?",
            "Quiero hacer una reserva",
            "¿Hay áreas exclusivas?",
            "Información de contacto",
          ].map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => {
                setInputMessage(suggestion)
                setTimeout(() => handleSendMessage(), 100)
              }}
              className="text-xs border-2 border-[#005f73] text-[#005f73] hover:bg-[#005f73] hover:text-[#e9d8a6] rounded-lg bg-transparent font-medium"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )

  const renderGallerySection = () => (
    <div className="p-4 bg-transparent min-h-screen">
      <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: "#bb3e03" }}>
        <div className="flex items-center space-x-3">
          <Camera className="w-6 h-6 text-[#ee9b00] font-bold" strokeWidth={3} />
          <h1 className="text-2xl font-bold text-[#ee9b00]">Galería</h1>
        </div>
        <p className="text-[#ee9b00] text-sm mt-2">Descubre la belleza natural de Hacienda Rincón Grande</p>
      </div>

      <div
        className="relative w-full max-w-sm mx-auto bg-[#efe8d7] overflow-hidden rounded-lg border-2 border-[#005f73]"
        style={{ height: "600px", maxHeight: "90vh" }}
      >
        <div className="relative w-full h-full">
          <Image
            src={galleryImages[currentImageIndex].src || "/placeholder.svg"}
            alt={galleryImages[currentImageIndex].alt}
            fill
            className="object-cover"
            priority
            onError={(e) => {
              e.currentTarget.src = galleryImages[currentImageIndex].fallback
            }}
          />

          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#005f73]/80 hover:bg-[#005f73] text-[#e9d8a6] p-2 rounded-lg transition-all duration-300 z-10"
            aria-label="Imagen anterior"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#005f73]/80 hover:bg-[#005f73] text-[#e9d8a6] p-2 rounded-lg transition-all duration-300 z-10"
            aria-label="Siguiente imagen"
          >
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </button>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10 bg-[#005f73]/80 p-3 rounded-lg">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? "bg-[#ee9b00] scale-125"
                    : "bg-[#e9d8a6]/40 hover:bg-[#e9d8a6]/60 hover:scale-110"
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setActiveSection("home")}
            className="absolute top-6 right-6 bg-[#005f73]/80 hover:bg-[#005f73] text-[#e9d8a6] p-2 rounded-lg transition-all duration-300 z-10"
            aria-label="Cerrar galería"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute top-6 left-6 bg-[#005f73]/80 text-[#e9d8a6] px-3 py-1 rounded-lg text-xs font-medium z-10">
            {currentImageIndex + 1} / {galleryImages.length}
          </div>
        </div>
      </div>
    </div>
  )

  const renderContactSection = () => (
    <div className="p-6 bg-transparent min-h-screen">
      <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: "#bb3e03" }}>
        <div className="flex items-center space-x-3 mb-4">
          <Phone className="w-6 h-6 text-[#ee9b00] font-bold" strokeWidth={3} />
          <h1 className="text-2xl font-bold text-[#ee9b00]">Contacto</h1>
        </div>
        <p className="text-[#ee9b00] text-sm">Ponte en contacto con nosotros para cualquier consulta</p>
      </div>

      <div className="space-y-6 mb-8">
        <div
          className="p-6 rounded-lg transition-all duration-500 hover:scale-105"
          style={{ backgroundColor: "#005f73" }}
        >
          <div className="flex items-center space-x-4">
            <Phone className="w-6 h-6 text-[#e9d8a6]" />
            <div>
              <h3 className="font-bold text-[#e9d8a6] text-lg">Teléfono</h3>
              <p className="text-[#ee9b00] text-sm font-bold">+58 243 123 4567</p>
              <p className="text-[#e9d8a6] text-xs">Mier-Dom: 9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>

        <div
          className="p-6 rounded-lg transition-all duration-500 hover:scale-105"
          style={{ backgroundColor: "#efe8d7" }}
        >
          <div className="flex items-center space-x-4">
            <Mail className="w-6 h-6 text-[#005f73]" />
            <div>
              <h3 className="font-bold text-[#005f73] text-lg">Email</h3>
              <p className="text-[#bb3e03] text-sm font-bold">admin@haciendarincongrande.com</p>
              <p className="text-[#005f73] text-xs">Respuesta en 24 horas</p>
            </div>
          </div>
        </div>

        <div
          className="p-6 rounded-lg transition-all duration-500 hover:scale-105"
          style={{ backgroundColor: "#005f73" }}
        >
          <div className="flex items-center space-x-4">
            <MapPin className="w-6 h-6 text-[#e9d8a6]" />
            <div>
              <h3 className="font-bold text-[#e9d8a6] text-lg">Dirección</h3>
              <p className="text-[#ee9b00] text-sm font-bold">Hacienda Paya</p>
              <p className="text-[#e9d8a6] text-xs">Turmero 2115, Aragua, Venezuela</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: "#efe8d7" }}>
        <h3 className="text-xl font-bold text-[#9b2226] flex items-center space-x-3 mb-6">
          <span>Síguenos en Redes Sociales</span>
          <div className="w-1 h-1 bg-[#9b2226] rounded-full animate-pulse"></div>
        </h3>
        <div className="flex justify-center space-x-6">
          {[
            {
              icon: Facebook,
              label: "Facebook",
              type: "icon",
              url: "https://www.facebook.com/HaciendaRinconGrande",
            },
            {
              icon: Instagram,
              label: "Instagram",
              type: "icon",
              url: "https://www.instagram.com/HaciendaRinconGrande",
            },
            {
              icon: TikTokIcon,
              label: "TikTok",
              type: "icon",
              url: "https://www.tiktok.com/@HaciendaRinconGrande",
            },
          ].map((social, index) => (
            <a key={index} href={social.url} target="_blank" rel="noopener noreferrer">
              <button
                className={`p-3 rounded-full transition-all duration-300 ${
                  social.label === "Instagram"
                    ? "bg-gradient-to-r from-[#405de6] via-[#833ab4] via-[#c13584] via-[#e1306c] via-[#fd1d1d] via-[#f56040] to-[#fcaf45] hover:opacity-80"
                    : social.label === "Facebook"
                      ? "bg-[#1877F2] hover:bg-[#1877F2]/80"
                      : "bg-black hover:bg-black/80"
                }`}
              >
                <social.icon className="w-5 h-5 text-white" />
                <span className="sr-only">{social.label}</span>
              </button>
            </a>
          ))}
        </div>
      </div>

      <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: "#005f73" }}>
        <h3 className="text-xl font-bold text-[#e9d8a6] mb-6">Enlaces Útiles</h3>
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={() => setActiveSection("faq")}
            className="w-full justify-start border-2 border-[#e9d8a6] text-[#e9d8a6] hover:bg-[#e9d8a6] hover:text-[#005f73] rounded-lg py-3 text-sm font-medium transition-all duration-300 bg-transparent"
          >
            <HelpCircle className="w-4 h-4 mr-3" />
            Preguntas Frecuentes
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveSection("directions")}
            className="w-full justify-start border-2 border-[#e9d8a6] text-[#e9d8a6] hover:bg-[#e9d8a6] hover:text-[#005f73] rounded-lg py-3 text-sm font-medium transition-all duration-300 bg-transparent"
          >
            <MapPin className="w-4 h-4 mr-3" />
            Cómo Llegar
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveSection("reservations")}
            className="w-full justify-start border-2 border-[#e9d8a6] text-[#e9d8a6] hover:bg-[#e9d8a6] hover:text-[#005f73] rounded-lg py-3 text-sm font-medium transition-all duration-300 bg-transparent"
          >
            <Calendar className="w-4 h-4 mr-3" />
            Hacer Reserva
          </Button>
        </div>
      </div>

      <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: "#efe8d7" }}>
        <h4 className="font-bold text-[#005f73] mb-4 text-lg flex items-center space-x-2">
          <Clock className="w-5 h-5 text-[#bb3e03]" />
          <span>Horarios de Atención</span>
        </h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center p-3 bg-white rounded-lg border-2 border-[#005f73]">
            <span className="font-medium text-[#005f73]">Miércoles - Domingo</span>
            <span className="font-bold text-[#bb3e03]">9:00 AM - 6:00 PM</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white rounded-lg border-2 border-[#005f73]">
            <span className="font-medium text-[#005f73]">Días Festivos</span>
            <span className="font-bold text-[#bb3e03]">9:00 AM - 6:00 PM</span>
          </div>
        </div>
        <p className="text-xs text-[#005f73] mt-4 bg-white p-3 rounded-lg border-2 border-[#005f73]">
          * Los horarios pueden variar en fechas especiales. Consulta nuestras redes sociales para actualizaciones.
        </p>
      </div>

      <Button
        variant="outline"
        onClick={() => setActiveSection("home")}
        className="w-full mt-0 border-2 border-[#005f73] text-[#005f73] hover:bg-[#005f73] hover:text-[#e9d8a6] bg-transparent rounded-lg py-3 text-sm font-medium transition-all duration-300"
      >
        Volver al Inicio
      </Button>
    </div>
  )

  const renderHomeSection = () => (
    <div className="p-6 bg-transparent min-h-screen">
      {/* Hero Section */}
      <div className="relative mb-8">
        <div className="relative h-64 rounded-lg overflow-hidden mb-4">
          <Image
            src="/images/hacienda-cover.jpg"
            alt="Hacienda Rincón Grande - Vista Panorámica"
            fill
            className="object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=320&width=400&text=Hacienda+Rincon+Grande"
            }}
          />
          <div className="absolute bottom-4 left-4 right-4 bg-black/50 px-4 py-1 rounded-lg">
            <h2 className="font-bold text-white text-xl mb-1">Hacienda Rincón Grande</h2>
            <p className="text-white text-xs font-light">Naturaleza, aventura y tranquilidad</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div
          className="p-6 text-center cursor-pointer transition-all duration-500 rounded-lg group"
          style={{ backgroundColor: "#efe8d7" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#2d4a2b"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#efe8d7"
          }}
          onClick={() => setActiveSection("reservations")}
        >
          <Calendar className="w-6 h-6 text-[#4a5d23] mx-auto mb-3 group-hover:scale-110 group-hover:text-[#9ACD32] transition-all duration-500" />
          <h3 className="font-medium text-[#4a5d23] text-lg mb-1 group-hover:text-[#9ACD32] transition-all duration-500">
            Reservar Ahora
          </h3>
          <p className="text-[#4a5d23] text-sm group-hover:text-[#9ACD32] transition-all duration-500">
            Asegura tu visita
          </p>
          <span className="text-xs bg-[#9ACD32] text-black px-2 py-1 rounded-full font-medium">¡Disponible!</span>
        </div>

        <div
          className="p-6 text-center cursor-pointer transition-all duration-500 rounded-lg group"
          style={{ backgroundColor: "#efe8d7" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#2d4a2b"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#efe8d7"
          }}
          onClick={() => setActiveSection("directions")}
        >
          <MapPin className="w-6 h-6 text-[#4a5d23] mx-auto mb-3 group-hover:scale-110 group-hover:text-[#9ACD32] transition-all duration-500" />
          <h3 className="font-medium text-[#4a5d23] text-lg mb-1 group-hover:text-[#9ACD32] transition-all duration-500">
            Cómo Llegar
          </h3>
          <p className="text-[#4a5d23] text-sm group-hover:text-[#9ACD32] transition-all duration-500">
            Direcciones GPS
          </p>
          <span className="text-xs bg-[#9ACD32] text-black px-2 py-1 rounded-full">Fácil acceso</span>
        </div>
      </div>

      {/* About Section */}
      <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: "#bb3e03" }}>
        <div className="flex items-center space-x-3 mb-6">
          <TreePine className="w-5 h-5 text-[#ee9b00] font-bold" strokeWidth={3} />
          <h3 className="text-xl font-bold text-[#6a6702] text-[rgba(238,155,0,1)]">Sobre el Parque</h3>
        </div>
        <p className="text-[#ee9b00] text-sm leading-relaxed mb-6">
          Hacienda Rincón Grande es un oasis natural donde puedes disfrutar de la tranquilidad del campo, actividades al
          aire libre y deliciosa gastronomía local.
        </p>
        <div className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg">
          <Clock className="w-5 h-5 text-[#ca6702]" />
          <div>
            <p className="text-[#ca6702] font-medium">Horarios</p>
            <p className="text-[#ee9b00] text-sm">Mier-Dom: 9:00 AM - 6:00 PM</p>
          </div>
        </div>
      </div>

      {/* Amenities Grid */}
      <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: "#005f73" }}>
        <h3 className="text-xl font-bold text-[#e9d8a6] mb-6 flex items-center space-x-3">
          <span>Comodidades</span>
          <div className="w-1 h-1 bg-[#e9d8a6] rounded-full animate-pulse"></div>
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Car, label: "Estacionamiento" },
            { icon: Utensils, label: "Restaurante" },
            { icon: Waves, label: "Área de Piscinas" },
            { icon: ShieldCheck, label: "Seguridad" },
            { icon: UserCheck, label: "Personal Calificado" },
            { icon: Activity, label: "Actividades al Aire Libre" },
          ].map((amenity, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-4 bg-[#e9d8a6] rounded-lg transition-all duration-500 hover:bg-[#efe8d7]"
            >
              <amenity.icon className="w-4 h-4 text-[#005f73]" />
              <span className="text-xs font-bold text-[#005f73]">{amenity.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Social Media */}
      <div className="p-6 rounded-lg" style={{ backgroundColor: "#efe8d7" }}>
        <h3 className="text-xl font-bold text-black mb-6 flex items-center space-x-3">
          <span className="text-[rgba(155,34,38,1)]">Síguenos</span>
          <div className="w-1 h-1 bg-[#9b2226] rounded-full animate-pulse"></div>
        </h3>
        <div className="flex justify-center space-x-6">
          {[
            {
              icon: Facebook,
              label: "Facebook",
              type: "icon",
              url: "https://www.facebook.com/HaciendaRinconGrande",
            },
            {
              icon: Instagram,
              label: "Instagram",
              type: "icon",
              url: "https://www.instagram.com/HaciendaRinconGrande",
            },
            {
              icon: TikTokIcon,
              label: "TikTok",
              type: "icon",
              url: "https://www.tiktok.com/@HaciendaRinconGrande",
            },
          ].map((social, index) => (
            <a key={index} href={social.url} target="_blank" rel="noopener noreferrer">
              <button
                className={`p-3 rounded-full transition-all duration-300 ${
                  social.label === "Instagram"
                    ? "bg-gradient-to-r from-[#405de6] via-[#833ab4] via-[#c13584] via-[#e1306c] via-[#fd1d1d] via-[#f56040] to-[#fcaf45] hover:opacity-80"
                    : social.label === "Facebook"
                      ? "bg-[#1877F2] hover:bg-[#1877F2]/80"
                      : "bg-black hover:bg-black/80"
                }`}
              >
                <social.icon className="w-5 h-5 text-white" />
                <span className="sr-only">{social.label}</span>
              </button>
            </a>
          ))}
        </div>
      </div>
    </div>
  )

  const renderDirectionsSection = () => {
    const latitude = 10.240245
    const longitude = -67.459364
    const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=es&z=14&output=embed`
    const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`

    return (
      <div className="p-6 bg-transparent min-h-screen">
        <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: "#bb3e03" }}>
          <div className="flex items-center space-x-3 mb-4">
            <MapPin className="w-6 h-6 text-[#ee9b00] font-bold" strokeWidth={3} />
            <h1 className="text-2xl font-bold text-[#ee9b00]">Ubicación</h1>
          </div>
          <p className="text-[#ee9b00] text-sm">Encuentra la ruta más fácil para llegar a nuestro paraíso natural</p>
        </div>

        <div className="relative h-80 w-full rounded-lg overflow-hidden border border-[#005f73] mb-8">
          <iframe
            src={googleMapsEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa de Hacienda Rincón Grande"
          ></iframe>
        </div>

        <div className="space-y-6 mb-8">
          <div className="p-6 rounded-lg" style={{ backgroundColor: "#005f73" }}>
            <h3 className="font-bold text-[#e9d8a6] text-lg mb-3 flex items-center space-x-2">
              <Home className="w-5 h-5 text-[#ee9b00]" />
              <span>Dirección</span>
            </h3>
            <p className="text-[#e9d8a6] text-sm leading-relaxed">
              Hacienda Paya
              <br />
              Turmero 2115, Aragua
              <br />
              Venezuela
            </p>
          </div>

          <div className="p-6 rounded-lg" style={{ backgroundColor: "#efe8d7" }}>
            <h3 className="font-bold text-[#005f73] text-lg mb-3 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-[#bb3e03]" />
              <span>Coordenadas GPS</span>
            </h3>
            <p className="text-[#bb3e03] text-sm font-mono bg-white p-3 rounded-lg border-2 border-[#005f73]">
              {latitude}° N, {Math.abs(longitude)}° W
            </p>
          </div>
        </div>

        <div className="flex space-x-3 mb-8">
          <Button
            className="flex-1 bg-[#ee9b00] hover:bg-[#ca6702] text-black font-bold text-sm py-4 rounded-lg transition-all duration-300"
            onClick={() => window.open(googleMapsDirectionsUrl, "_blank")}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Abrir en Maps
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-2 border-[#005f73] text-[#005f73] hover:bg-[#005f73] hover:text-[#e9d8a6] bg-transparent font-medium text-sm py-4 rounded-lg transition-all duration-300"
          >
            <Phone className="w-4 h-4 mr-2" />
            Llamar
          </Button>
        </div>

        <div className="p-6 rounded-lg" style={{ backgroundColor: "#005f73" }}>
          <h3 className="text-xl font-bold text-[#e9d8a6] mb-6 flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-[#ee9b00]" />
            <span>Instrucciones de Llegada</span>
          </h3>
          <div className="space-y-4 text-sm">
            <div className="flex items-start space-x-4 p-4 bg-[#efe8d7] rounded-lg border-2 border-[#e9d8a6]">
              <div className="w-6 h-6 bg-[#ee9b00] text-black rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">
                1
              </div>
              <p className="text-[#005f73] leading-relaxed">
                Utiliza el botón "Abrir en Maps" para obtener la ruta más precisa desde tu ubicación.
              </p>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-[#efe8d7] rounded-lg border-2 border-[#e9d8a6]">
              <div className="w-6 h-6 bg-[#ee9b00] text-black rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">
                2
              </div>
              <p className="text-[#005f73] leading-relaxed">
                Sigue las indicaciones de tu GPS hasta llegar a Hacienda Paya.
              </p>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-[#efe8d7] rounded-lg border-2 border-[#e9d8a6]">
              <div className="w-6 h-6 bg-[#ee9b00] text-black rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">
                3
              </div>
              <p className="text-[#005f73] leading-relaxed">
                Antes del puente de Paya cruza a mano derecha si vienes desde Turmero, busca el letrero de Hacienda
                Rincón Grande al llegar.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return renderHomeSection()
      case "directions":
        return renderDirectionsSection()
      case "reservations":
        if (selectedReservationType === "general") {
          if (generalEntrySubStep === "details") {
            return renderGeneralEntryForm()
          } else if (generalEntrySubStep === "payment") {
            return (
              <PaymentForm
                onPaymentSuccess={handlePaymentSuccess}
                onBack={handleBackFromPayment}
                totalVEF={currentReservationDetails?.totalVEF || 0}
                reservationDetails={currentReservationDetails}
              />
            )
          } else if (generalEntrySubStep === "pending") {
            return (
              <PaymentPending
                solicitudId={solicitudId || ""}
                customerEmail={currentReservationDetails?.bookerEmail || ""}
                customerPhone={currentReservationDetails?.bookerPhone || ""}
                onStartOver={handleResetGeneralEntryReservation}
              />
            )
          }
        } else if (selectedReservationType === "small_groups") {
          return <SmallGroupsForm onBackToSelector={() => setSelectedReservationType(null)} />
        } else if (selectedReservationType === "corporate_events") {
          return <CorporateEventsForm onBackToSelector={() => setSelectedReservationType(null)} />
        } else {
          return renderReservationSelector()
        }
        break
      case "gallery":
        return renderGallerySection()
      case "map":
        return <ParkMap />
      case "menu":
        return <RestaurantMenu />
      case "assistant":
        return renderAIAssistant()
      case "contact":
        return renderContactSection()
      case "faq":
        return <FaqSection onBack={() => setActiveSection("contact")} />
      default:
        return renderHomeSection()
    }
  }

  return (
    <div className="min-h-screen bg-[#e9d8a6] text-[rgba(155,34,38,1)] relative">
      {/* Background Pattern Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "url(/images/nature-camping-pattern.png)",
          backgroundRepeat: "repeat",
          backgroundSize: "400px 400px",
          opacity: 0.2,
          mixBlendMode: "multiply",
        }}
      />

      <header className="bg-[#2d4a2b] border-b border-[#0a9396] relative z-10">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src="/images/logo_verde.png"
                  alt="Logo Hacienda Rincón Grande"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Mi Rincón</h1>
                <p className="text-xs text-white font-light">Hacienda Rincón Grande</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full border border-[#0a9396] bg-transparent">
              <div className="w-1 h-1 bg-[#0a9396] rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-white">Abierto</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto pb-24 relative z-10">{renderSection()}</main>

      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-[#001219] border-t border-[#0a9396] relative z-20">
        <div className="flex justify-around py-3">
          {[
            { id: "home", icon: TreePine, label: "Inicio" },
            { id: "directions", icon: MapPin, label: "Ubicación" },
            { id: "reservations", icon: Calendar, label: "Reservar" },
            { id: "gallery", icon: Camera, label: "Galería" },
            { id: "menu", icon: UtensilsCrossed, label: "Menú" },
            { id: "assistant", icon: MessageCircle, label: "Asistente" },
            { id: "contact", icon: Phone, label: "Contacto" },
            { id: "faq", icon: MessageCircle, label: "FAQ" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id)
                setSelectedReservationType(null)
                setGeneralEntrySubStep("details")
              }}
              className={`flex flex-col items-center py-2 px-2 rounded-lg transition-all duration-300 ${
                activeSection === item.id
                  ? item.id === "home"
                    ? "text-[#e9d8a6] bg-[#005f73] transform scale-105 font-bold"
                    : item.id === "reservations"
                      ? "text-black bg-[#94d2bd] transform scale-105"
                      : item.id === "gallery"
                        ? "text-black bg-[#ee9b00] transform scale-105"
                        : item.id === "menu"
                          ? "text-black bg-[#ca6702] transform scale-105"
                          : item.id === "assistant"
                            ? "text-black bg-[#bb3e03] transform scale-105"
                            : item.id === "contact"
                              ? "text-black bg-[#ae2012] transform scale-105"
                              : item.id === "faq"
                                ? "text-black bg-[#9b2226] transform scale-105"
                                : "text-black bg-[#0a9396] transform scale-105"
                  : item.id === "home"
                    ? "text-[#e9d8a6] hover:text-[#e9d8a6] hover:scale-105 font-bold"
                    : item.id === "directions"
                      ? "text-white hover:text-[#0a9396] hover:scale-105"
                      : item.id === "reservations"
                        ? "text-white hover:text-[#94d2bd] hover:scale-105"
                        : item.id === "gallery"
                          ? "text-white hover:text-[#ee9b00] hover:scale-105"
                          : item.id === "menu"
                            ? "text-white hover:text-[#ca6702] hover:scale-105"
                            : item.id === "assistant"
                              ? "text-white hover:text-[#bb3e03] hover:scale-105"
                              : item.id === "contact"
                                ? "text-white hover:text-[#ae2012] hover:scale-105"
                                : item.id === "faq"
                                  ? "text-white hover:text-[#9b2226] hover:scale-105"
                                  : "text-white hover:text-[#0a9396] hover:scale-105"
              }`}
            >
              <item.icon className="w-4 h-4 mb-1" />
              <span className="text-xs font-light">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Admin Access Hint - Only visible in development */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 z-30">
          <div className="bg-black/80 text-white text-xs p-2 rounded-lg">Admin: Ctrl+Alt+A</div>
        </div>
      )}
    </div>
  )
}
