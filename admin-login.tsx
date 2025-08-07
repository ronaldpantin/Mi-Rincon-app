"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, User, Eye, EyeOff, Shield } from "lucide-react"
import Image from "next/image"

interface AdminLoginProps {
  onLogin: (credentials: { username: string; password: string }) => void
  onBack: () => void
  error?: string
}

export default function AdminLogin({ onLogin, onBack, error }: AdminLoginProps) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate loading delay
    setTimeout(() => {
      onLogin(credentials)
      setIsLoading(false)
    }, 1000)
  }

  const handleInputChange = (field: string, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001219] via-[#005f73] to-[#0a9396] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-[#005f73]">
                <Image src="/images/logo_verde.png" alt="Logo Hacienda Rincón Grande" fill className="object-cover" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-[#001219] flex items-center justify-center space-x-2">
              <Shield className="w-6 h-6 text-[#005f73]" />
              <span>Panel Administrativo</span>
            </CardTitle>
            <p className="text-[#005f73] text-sm mt-2">Hacienda Rincón Grande</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-[#001219] font-medium flex items-center space-x-2">
                  <User className="w-4 h-4 text-[#005f73]" />
                  <span>Usuario</span>
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className="border-2 border-[#005f73]/20 focus:border-[#005f73] rounded-lg py-3 text-[#001219]"
                  placeholder="Ingresa tu usuario"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#001219] font-medium flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-[#005f73]" />
                  <span>Contraseña</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="border-2 border-[#005f73]/20 focus:border-[#005f73] rounded-lg py-3 pr-12 text-[#001219]"
                    placeholder="Ingresa tu contraseña"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#005f73] hover:text-[#001219]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-3">
                <Button
                  type="submit"
                  disabled={isLoading || !credentials.username || !credentials.password}
                  className="w-full bg-[#005f73] hover:bg-[#001219] text-white font-bold py-3 rounded-lg transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Verificando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>Iniciar Sesión</span>
                    </div>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="w-full border-2 border-[#005f73] text-[#005f73] hover:bg-[#005f73] hover:text-white rounded-lg py-3 transition-all duration-300 bg-transparent"
                >
                  Volver al Sitio
                </Button>
              </div>
            </form>

            <div className="mt-8 p-4 bg-[#005f73]/5 rounded-lg">
              <p className="text-xs text-[#005f73] text-center">
                <Lock className="w-3 h-3 inline mr-1" />
                Acceso restringido solo para administradores autorizados
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
