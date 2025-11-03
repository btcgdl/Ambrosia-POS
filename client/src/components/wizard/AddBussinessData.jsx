"use client"
import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"

export function StoreDetailsStep({ data, onChange }) {
  const [logoPreview, setLogoPreview] = useState(null)
  const fileInputRef = useRef(null)

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      onChange({ storeLogo: file })

      // Crear preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveLogo = () => {
    onChange({ storeLogo: null })
    setLogoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Datos de la tienda</h2>
      <p className="text-muted-foreground mb-8">Completa la información de tu negocio</p>

      <div className="space-y-6">
        {/* Store Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Nombre de la tienda</label>
          <input
            type="text"
            value={data.storeName}
            onChange={(e) => onChange({ storeName: e.target.value })}
            placeholder="Ej: Mi Tienda Premium"
            className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Dirección</label>
          <input
            type="text"
            value={data.storeAddress}
            onChange={(e) => onChange({ storeAddress: e.target.value })}
            placeholder="Ej: Calle Principal 123, Apartado 4, Ciudad"
            className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* RFC */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">RFC</label>
          <input
            type="text"
            value={data.storeRFC}
            onChange={(e) => onChange({ storeRFC: e.target.value.toUpperCase() })}
            placeholder="Ej: ABC123456XYZ"
            maxLength={13}
            className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary uppercase"
          />
          <p className="text-xs text-muted-foreground mt-1">Formato: 13 caracteres (letras y números)</p>
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Logo de la tienda</label>

          {logoPreview ? (
            <div className="relative w-32 h-32 rounded-lg border-2 border-border overflow-hidden bg-muted">
              <img src={logoPreview || "/placeholder.svg"} alt="Logo preview" className="w-full h-full object-cover" />
              <button
                onClick={handleRemoveLogo}
                className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded hover:opacity-90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-8 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center cursor-pointer"
            >
              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-foreground">Sube tu logo</p>
              <p className="text-xs text-muted-foreground">PNG, JPG o GIF (máx. 5MB)</p>
            </button>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
        </div>
      </div>
    </div>
  )
}
