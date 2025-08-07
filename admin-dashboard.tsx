"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  LogOut,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  QrCode,
  Download,
  Eye,
  Filter,
  Search,
  BarChart3,
  TrendingUp,
  DollarSign,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import QRCode from "qrcode"

interface Reservation {
  id: string
  solicitudId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  visitDate: string
  totalPeople: number
  totalAmount: number
  status: "pending" | "approved" | "rejected"
  paymentMethod: string
  submittedAt: string
  approvedAt?: string
  rejectedAt?: string
  qrCode?: string
  specialRequests?: string
  entradas: number
  exonerados: number
  selectedAreas: string[]
}

interface AdminDashboardProps {
  onLogout: () => void
  adminUser: string
}

// Datos de ejemplo de reservas
const mockReservations: Reservation[] = [
  {
    id: "1",
    solicitudId: "PM-12345678",
    customerName: "María González",
    customerEmail: "maria@email.com",
    customerPhone: "+58 412 123 4567",
    visitDate: "2024-02-15",
    totalPeople: 8,
    totalAmount: 4500.5,
    status: "pending",
    paymentMethod: "pago-movil",
    submittedAt: "2024-02-01T10:30:00Z",
    entradas: 6,
    exonerados: 2,
    selectedAreas: ["salon_colonial_mesa"],
    specialRequests: "Celebración de cumpleaños, necesitamos decorar el área",
  },
  {
    id: "2",
    solicitudId: "PM-87654321",
    customerName: "Carlos Rodríguez",
    customerEmail: "carlos@email.com",
    customerPhone: "+58 424 987 6543",
    visitDate: "2024-02-20",
    totalPeople: 15,
    totalAmount: 8750.25,
    status: "approved",
    paymentMethod: "pago-movil",
    submittedAt: "2024-01-28T14:15:00Z",
    approvedAt: "2024-01-29T09:00:00Z",
    entradas: 12,
    exonerados: 3,
    selectedAreas: ["caney_piscina_grande", "area_piscina_pequena"],
    qrCode:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  },
  {
    id: "3",
    solicitudId: "PM-11223344",
    customerName: "Ana Martínez",
    customerEmail: "ana@email.com",
    customerPhone: "+58 416 555 7890",
    visitDate: "2024-02-10",
    totalPeople: 4,
    totalAmount: 2440.0,
    status: "rejected",
    paymentMethod: "pago-movil",
    submittedAt: "2024-01-25T16:45:00Z",
    rejectedAt: "2024-01-26T11:30:00Z",
    entradas: 4,
    exonerados: 0,
    selectedAreas: [],
    specialRequests: "Visita familiar tranquila",
  },
  {
    id: "4",
    solicitudId: "PM-99887766",
    customerName: "Luis Fernández",
    customerEmail: "luis@email.com",
    customerPhone: "+58 414 333 2222",
    visitDate: "2024-02-25",
    totalPeople: 25,
    totalAmount: 15300.75,
    status: "pending",
    paymentMethod: "pago-movil",
    submittedAt: "2024-02-02T08:20:00Z",
    entradas: 20,
    exonerados: 5,
    selectedAreas: ["salon_colonial_mesa", "bohio_potrero"],
    specialRequests: "Evento corporativo, necesitamos área techada",
  },
]

export default function AdminDashboard({ onLogout, adminUser }: AdminDashboardProps) {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [isGeneratingQR, setIsGeneratingQR] = useState(false)

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.solicitudId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const stats = {
    total: reservations.length,
    pending: reservations.filter((r) => r.status === "pending").length,
    approved: reservations.filter((r) => r.status === "approved").length,
    rejected: reservations.filter((r) => r.status === "rejected").length,
    totalRevenue: reservations.filter((r) => r.status === "approved").reduce((sum, r) => sum + r.totalAmount, 0),
  }

  const generateQRCode = async (reservation: Reservation) => {
    setIsGeneratingQR(true)
    try {
      const qrData = {
        solicitudId: reservation.solicitudId,
        customerName: reservation.customerName,
        visitDate: reservation.visitDate,
        totalPeople: reservation.totalPeople,
        status: "approved",
        validUntil: reservation.visitDate,
      }

      const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 200,
        margin: 2,
        color: {
          dark: "#005f73",
          light: "#ffffff",
        },
      })

      return qrCodeDataURL
    } catch (error) {
      console.error("Error generating QR code:", error)
      return null
    } finally {
      setIsGeneratingQR(false)
    }
  }

  const handleApproveReservation = async (reservationId: string) => {
    const qrCode = await generateQRCode(reservations.find((r) => r.id === reservationId)!)

    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === reservationId
          ? {
              ...reservation,
              status: "approved" as const,
              approvedAt: new Date().toISOString(),
              qrCode,
            }
          : reservation,
      ),
    )

    // Aquí se enviaría el email de confirmación con el QR
    console.log(`Enviando email de aprobación para reserva ${reservationId}`)
  }

  const handleRejectReservation = (reservationId: string) => {
    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === reservationId
          ? {
              ...reservation,
              status: "rejected" as const,
              rejectedAt: new Date().toISOString(),
            }
          : reservation,
      ),
    )

    // Aquí se enviaría el email de rechazo
    console.log(`Enviando email de rechazo para reserva ${reservationId}`)
  }

  const downloadQRCode = (reservation: Reservation) => {
    if (!reservation.qrCode) return

    const link = document.createElement("a")
    link.download = `QR-${reservation.solicitudId}.png`
    link.href = reservation.qrCode
    link.click()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Aprobada
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Rechazada
          </Badge>
        )
      default:
        return null
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-VE", {
      style: "currency",
      currency: "VES",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-VE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-[#005f73]" />
                <div>
                  <h1 className="text-xl font-bold text-[#001219]">Panel Administrativo</h1>
                  <p className="text-sm text-[#005f73]">Hacienda Rincón Grande</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-[#001219]">Bienvenido, {adminUser}</p>
                <p className="text-xs text-[#005f73]">Administrador</p>
              </div>
              <Button
                onClick={onLogout}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="reservations" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Reservas</span>
            </TabsTrigger>
            <TabsTrigger value="qr-management" className="flex items-center space-x-2">
              <QrCode className="w-4 h-4" />
              <span>Códigos QR</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Reservas</p>
                      <p className="text-2xl font-bold text-[#001219]">{stats.total}</p>
                    </div>
                    <Users className="w-8 h-8 text-[#005f73]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pendientes</p>
                      <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Aprobadas</p>
                      <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Rechazadas</p>
                      <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                    </div>
                    <XCircle className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Ingresos</p>
                      <p className="text-lg font-bold text-[#005f73]">{formatCurrency(stats.totalRevenue)}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-[#005f73]" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Reservations */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-[#005f73]" />
                  <span>Reservas Recientes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reservations.slice(0, 5).map((reservation) => (
                    <div key={reservation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium text-[#001219]">{reservation.customerName}</p>
                          <p className="text-sm text-gray-600">{reservation.solicitudId}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatDate(reservation.visitDate)}</p>
                          <p className="text-xs text-gray-600">{reservation.totalPeople} personas</p>
                        </div>
                        {getStatusBadge(reservation.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reservations Tab */}
          <TabsContent value="reservations" className="space-y-6">
            {/* Filters */}
            <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Buscar por nombre, email o ID de reserva..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-48">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las reservas</SelectItem>
                        <SelectItem value="pending">Pendientes</SelectItem>
                        <SelectItem value="approved">Aprobadas</SelectItem>
                        <SelectItem value="rejected">Rechazadas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reservations List */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Gestión de Reservas ({filteredReservations.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {filteredReservations.map((reservation) => (
                      <div
                        key={reservation.id}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-[#001219]">{reservation.customerName}</h3>
                              {getStatusBadge(reservation.status)}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>
                                <p>
                                  <strong>ID:</strong> {reservation.solicitudId}
                                </p>
                                <p>
                                  <strong>Email:</strong> {reservation.customerEmail}
                                </p>
                                <p>
                                  <strong>Teléfono:</strong> {reservation.customerPhone}
                                </p>
                              </div>
                              <div>
                                <p>
                                  <strong>Fecha de visita:</strong> {formatDate(reservation.visitDate)}
                                </p>
                                <p>
                                  <strong>Personas:</strong> {reservation.totalPeople} ({reservation.entradas} entradas
                                  + {reservation.exonerados} exonerados)
                                </p>
                                <p>
                                  <strong>Total:</strong> {formatCurrency(reservation.totalAmount)}
                                </p>
                              </div>
                            </div>
                            {reservation.specialRequests && (
                              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm">
                                  <strong>Solicitudes especiales:</strong> {reservation.specialRequests}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>Enviada: {formatDate(reservation.submittedAt)}</span>
                            {reservation.approvedAt && (
                              <>
                                <span>•</span>
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span>Aprobada: {formatDate(reservation.approvedAt)}</span>
                              </>
                            )}
                            {reservation.rejectedAt && (
                              <>
                                <span>•</span>
                                <XCircle className="w-3 h-3 text-red-500" />
                                <span>Rechazada: {formatDate(reservation.rejectedAt)}</span>
                              </>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            {reservation.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveReservation(reservation.id)}
                                  disabled={isGeneratingQR}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Aprobar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRejectReservation(reservation.id)}
                                  className="border-red-200 text-red-600 hover:bg-red-50"
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Rechazar
                                </Button>
                              </>
                            )}

                            {reservation.status === "approved" && reservation.qrCode && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadQRCode(reservation)}
                                className="border-[#005f73] text-[#005f73] hover:bg-[#005f73] hover:text-white"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Descargar QR
                              </Button>
                            )}

                            <Button size="sm" variant="outline" onClick={() => setSelectedReservation(reservation)}>
                              <Eye className="w-4 h-4 mr-1" />
                              Ver Detalles
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* QR Management Tab */}
          <TabsContent value="qr-management" className="space-y-6">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <QrCode className="w-5 h-5 text-[#005f73]" />
                  <span>Gestión de Códigos QR</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reservations
                    .filter((r) => r.status === "approved" && r.qrCode)
                    .map((reservation) => (
                      <div key={reservation.id} className="border border-gray-200 rounded-lg p-4 text-center">
                        <div className="mb-4">
                          <img
                            src={reservation.qrCode || "/placeholder.svg"}
                            alt={`QR Code for ${reservation.solicitudId}`}
                            className="w-32 h-32 mx-auto border border-gray-200 rounded-lg"
                          />
                        </div>
                        <h4 className="font-semibold text-[#001219] mb-1">{reservation.customerName}</h4>
                        <p className="text-sm text-gray-600 mb-2">{reservation.solicitudId}</p>
                        <p className="text-xs text-gray-500 mb-4">{formatDate(reservation.visitDate)}</p>
                        <Button
                          size="sm"
                          onClick={() => downloadQRCode(reservation)}
                          className="w-full bg-[#005f73] hover:bg-[#001219] text-white"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Descargar
                        </Button>
                      </div>
                    ))}
                </div>

                {reservations.filter((r) => r.status === "approved" && r.qrCode).length === 0 && (
                  <div className="text-center py-12">
                    <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay códigos QR disponibles</h3>
                    <p className="text-gray-500">
                      Los códigos QR se generan automáticamente cuando apruebas una reserva.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Reservation Detail Modal */}
      {selectedReservation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Detalles de Reserva</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedReservation(null)}>
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-[#001219] mb-3">Información del Cliente</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Nombre:</strong> {selectedReservation.customerName}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedReservation.customerEmail}
                    </p>
                    <p>
                      <strong>Teléfono:</strong> {selectedReservation.customerPhone}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#001219] mb-3">Detalles de la Visita</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>ID:</strong> {selectedReservation.solicitudId}
                    </p>
                    <p>
                      <strong>Fecha:</strong> {formatDate(selectedReservation.visitDate)}
                    </p>
                    <p>
                      <strong>Total personas:</strong> {selectedReservation.totalPeople}
                    </p>
                    <p>
                      <strong>Estado:</strong> {getStatusBadge(selectedReservation.status)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-[#001219] mb-3">Detalles de Pago</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p>
                      <strong>Entradas:</strong> {selectedReservation.entradas} × $5.00
                    </p>
                    <p>
                      <strong>Exonerados:</strong> {selectedReservation.exonerados}
                    </p>
                    <p>
                      <strong>Método:</strong> {selectedReservation.paymentMethod}
                    </p>
                    <p>
                      <strong>Total:</strong> {formatCurrency(selectedReservation.totalAmount)}
                    </p>
                  </div>
                </div>
              </div>

              {selectedReservation.specialRequests && (
                <div>
                  <h4 className="font-semibold text-[#001219] mb-3">Solicitudes Especiales</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm">{selectedReservation.specialRequests}</p>
                  </div>
                </div>
              )}

              {selectedReservation.qrCode && (
                <div>
                  <h4 className="font-semibold text-[#001219] mb-3">Código QR de Autorización</h4>
                  <div className="text-center">
                    <img
                      src={selectedReservation.qrCode || "/placeholder.svg"}
                      alt="QR Code"
                      className="w-48 h-48 mx-auto border border-gray-200 rounded-lg mb-4"
                    />
                    <Button
                      onClick={() => downloadQRCode(selectedReservation)}
                      className="bg-[#005f73] hover:bg-[#001219] text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Descargar Código QR
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
