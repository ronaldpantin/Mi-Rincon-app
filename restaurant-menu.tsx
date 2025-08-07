"use client"

import { Button } from "@/components/ui/button"
import { DollarSign } from "lucide-react"
import Image from "next/image"

interface RestaurantMenuProps {
  onBack?: () => void
}

const menuCategories = [
  {
    name: "Entradas",
    items: [
      {
        name: "Tequeños (6 unidades)",
        description: "Deliciosos palitos de queso fritos",
        price: "$6",
        image: "/images/menu/tequenos.jpg",
      },
      {
        name: "Dedos de Yuca (6 unidades)",
        description: "Crujientes dedos de yuca frita",
        price: "$3",
        image: "/images/menu/dedos-yuca.jpg",
      },
      {
        name: "Tostadas Mixtas",
        description: "Variedad de tostadas con diferentes toppings",
        price: "$6",
        image: "/images/menu/tostadas-mixtas.jpg",
      },
      {
        name: "Bollitos",
        description: "Bollitos caseros, suaves y deliciosos",
        price: "$6",
        image: "/images/menu/bollitos.jpg",
      },
      {
        name: "Pan Frito con Hummus",
        description: "Crujiente pan frito acompañado de nuestra cremosa salsa de garbanzos",
        price: "$10",
        image: "/images/menu/pan-frito-hummus.jpg",
      },
      {
        name: "Rollos de Jamón y Queso (3 unidades)",
        description: "Rollos de jamón y queso, perfectos para picar",
        price: "$5",
        image: "/images/menu/rollos-jamon-queso.jpg",
      },
      {
        name: "Papas Fritas",
        description: "Porción de papas fritas clásicas",
        price: "$3",
        image: "/images/menu/papas-fritas.jpg",
      },
    ],
  },
  {
    name: "Platos Principales",
    items: [
      {
        name: "Bolitas de Carne",
        description: "Deliciosas bollitas de carne en salsa",
        price: "$8",
        image: "/images/menu/bolitas-carne.jpg",
      },
      {
        name: "Pizza",
        description: "Pizza individual con tus ingredientes favoritos",
        price: "$6",
        image: "/images/menu/pizza.jpg",
      },
      {
        name: "Alitas de Pollo (med)",
        description: "Alitas de pollo crujientes y sabrosas",
        price: "$8",
        image: "/images/menu/alitas-pollo.jpg",
      },
      {
        name: "Carpaccio",
        description: "Finas láminas de carne con aderezo",
        price: "$8",
        image: "/images/menu/carpaccio.jpg",
      },
      {
        name: "Tartar",
        description: "Tartar fresco de carne o pescado",
        price: "$8",
        image: "/images/menu/tartar.jpg",
      },
      {
        name: "Tender de Pollo",
        description: "Tiernos trozos de pollo empanizado",
        price: "$6",
        image: "/images/menu/chicken-tender.jpg",
      },
      {
        name: "Tabla de Jamón y Queso",
        description: "Selección de embutidos y quesos",
        price: "$6",
        image: "/images/menu/tabla-jamon-queso.jpg",
      },
      {
        name: "Brochettas Mixtas",
        description: "Brochetas de carne y vegetales",
        price: "$9",
        image: "/images/menu/brochetas-mixtas.jpg",
      },
      {
        name: "Patacones",
        description: "Plátano verde frito con toppings",
        price: "$7",
        image: "/images/menu/patacones.jpg",
      },
      {
        name: "Perros Polacos",
        description: "Hot dogs estilo polaco",
        price: "$5",
        image: "/images/menu/perros-polacos.jpg",
      },
      {
        name: "Pastas",
        description: "Boloñesa, Carbonara, 4 Quesos, Champiñón, Putanesca - Elige tu salsa favorita",
        price: "$8",
        image: "/images/menu/pasta.jpg",
      },
      {
        name: "Pasticho",
        description: "Lasaña casera, capas de pasta, carne y bechamel",
        price: "$10",
        image: "/images/menu/pasticho.jpg",
      },
      {
        name: "Arroz con Pollo",
        description: "Clásico arroz con pollo, sabroso y abundante",
        price: "$8",
        image: "/images/menu/arroz-con-pollo.jpg",
      },
      {
        name: "Lomito",
        description: "Jugoso lomito a la parrilla",
        price: "$12",
        image: "/images/menu/lomito.jpg",
      },
      {
        name: "Churrasco",
        description: "Corte de churrasco a la parrilla",
        price: "$12",
        image: "/images/menu/churrasco.jpg",
      },
      {
        name: "Pollo",
        description: "Pollo a la parrilla o al horno",
        price: "$12",
        image: "/images/menu/pollo-asado.jpg",
      },
    ],
  },
  {
    name: "Hamburguesas",
    items: [
      {
        name: "Smash (2x)",
        description: "Doble carne smash, queso americano",
        price: "$5",
        image: "/images/menu/smash-burger.jpg",
      },
      {
        name: "Smash (2x) con papas",
        description: "Doble carne smash, queso americano, con papas fritas",
        price: "$7",
        image: "/images/menu/smash-con-papas.jpg",
      },
      {
        name: "Hamburguesa de 100 gr",
        description: "Carne de 100gr con queso americano y tocineta",
        price: "$7",
        image: "/images/menu/hamburguesa-100gr.jpg",
      },
    ],
  },
  {
    name: "Guarniciones",
    items: [
      {
        name: "Papas Fritas",
        description: "Porción extra de papas fritas",
        price: "",
        image: "/images/menu/papas-fritas.jpg",
      },
      {
        name: "Puré de Papa",
        description: "Suave y cremoso puré de papa",
        price: "",
        image: "/images/menu/pure-de-papas.jpg",
      },
      {
        name: "Plátano",
        description: "Plátano maduro frito o cocido",
        price: "",
        image: "/images/menu/platanos.jpg",
      },
      {
        name: "Vegetales Salteados",
        description: "Mix de vegetales frescos salteados",
        price: "",
        image: "/images/menu/vegetales-salteados.jpg",
      },
      {
        name: "Arroz Salvaje",
        description: "Arroz salvaje aromático",
        price: "",
        image: "/images/menu/arroz-salvaje.jpg",
      },
      {
        name: "Ensalada Mixta",
        description: "Ensalada fresca con lechuga, tomate y pepino",
        price: "",
        image: "/images/menu/ensalada-mixta.jpg",
      },
    ],
  },
  {
    name: "Postres",
    items: [
      {
        name: "Rollos de Canela",
        description: "Tiernos rollos de canela con glaseado",
        price: "$6",
        image: "/images/menu/rollos-canela.jpg",
      },
      {
        name: "Tarta de Chocolate",
        description: "Deliciosa tarta de chocolate, rica y cremosa",
        price: "$6",
        image: "/images/menu/tarta-chocolate.jpg",
      },
      {
        name: "Yogurt Griego con Frutas y Granola",
        description: "Yogurt griego cremoso con frutas frescas y granola",
        price: "$5",
        image: "/images/menu/yogurt-griego.jpg",
      },
    ],
  },
  {
    name: "Bebidas",
    items: [
      {
        name: "Papelón con Limón",
        description: "Refrescante bebida tradicional venezolana",
        price: "",
        image: "/images/menu/papelon-con-limon.jpg",
      },
      {
        name: "Jugos Naturales",
        description: "Variedad de jugos de frutas frescas del día",
        price: "",
        image: "/images/menu/jugos-naturales.jpg",
      },
      {
        name: "Refrescos",
        description: "Variedad de bebidas gaseosas",
        price: "",
        image: "/images/menu/coca-cola.jpg",
      },
      {
        name: "Infusiones",
        description: "Selección de tés e infusiones calientes",
        price: "",
        image: "/images/menu/cafe.jpg",
      },
      {
        name: "Agua",
        description: "Botella de agua mineral",
        price: "",
        image: "/images/menu/agua-natural.jpg",
      },
    ],
  },
]

export default function RestaurantMenu({ onBack }: RestaurantMenuProps) {
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      window.history.back()
    }
  }

  return (
    <div className="p-6 bg-black min-h-screen">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-2">
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      {/* Logo and Title Section */}
      <div className="text-center mb-4">
        <div className="flex justify-center mb-4">
          <div className="relative w-32 h-32">
            <Image
              src="/images/logo-dudegrill.png"
              alt="Logo Restaurante"
              fill
              className="object-contain"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=128&width=128&text=Logo"
              }}
            />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Nuestro Menú</h1>
        <p className="text-white text-lg font-medium">Gastronomía local deliciosa</p>
      </div>

      {/* Restaurant Info */}
      {/* Menu Categories */}
      <div className="space-y-8">
        {menuCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="space-y-4">
            <div className="flex items-center space-x-3">
              <h3 className="text-2xl font-bold text-white">{category.name}</h3>
              <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-4">
              {category.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="p-4 bg-gray-900 rounded-lg border border-green-500 hover:border-green-400 transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-white text-lg">{item.name}</h4>
                        <div className="flex items-center space-x-1 ml-2">
                          <DollarSign className="w-3 h-3 text-green-500" />
                          <span className="text-green-500 font-bold text-lg whitespace-nowrap">{item.price}</span>
                        </div>
                      </div>
                      <p className="text-white text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-green-500">
        <p className="text-white text-xs text-center leading-relaxed">
          * Los precios pueden variar según disponibilidad de ingredientes.
          <br />* Consulta con nuestro personal sobre opciones vegetarianas y veganas.
          <br />* Horario del restaurante: Miércoles a Domingo, 9:00 AM - 6:00 PM
        </p>
      </div>

      {/* Back Button */}
      <Button
        variant="outline"
        onClick={handleBack}
        className="w-full mt-8 border border-green-500 text-white hover:bg-gray-900 hover:border-green-500 bg-transparent rounded-lg py-3 text-sm font-light hover:text-white transition-all duration-300"
      >
        Volver
      </Button>
    </div>
  )
}
