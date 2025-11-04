"use client"
import { useState, useRef } from "react"
import { Input, Select, SelectItem } from "@heroui/react"
import { Upload, X } from "lucide-react"

const CURRENCIES = [
  { code: "USD", name: "Dólar Estadounidense ($)" },
  { code: "CAD", name: "Dólar Canadiense (C$)" },
  { code: "MXN", name: "Peso Mexicano ($)" },
  { code: "HNL", name: "Lempira Hondureño (L)" },
  { code: "GTQ", name: "Quetzal Guatemalteco (Q)" },
  { code: "CRC", name: "Colón Costarricense (₡)" },
  { code: "NIO", name: "Córdoba Nicaragüense (C$)" },
  { code: "PAB", name: "Balboa Panameño (B/.)" },
  { code: "JMD", name: "Dólar Jamaicano (J$)" },
  { code: "DOP", name: "Peso Dominicano (RD$)" },
  { code: "CUP", name: "Peso Cubano (₱)" },
  { code: "COP", name: "Peso Colombiano ($)" },
  { code: "VES", name: "Bolívar Venezolano (Bs.)" },
  { code: "ARS", name: "Peso Argentino ($)" },
  { code: "BRL", name: "Real Brasileño (R$)" },
  { code: "CLP", name: "Peso Chileno ($)" },
  { code: "PEN", name: "Sol Peruano (S/.)" },
  { code: "BOB", name: "Boliviano (Bs.)" },
  { code: "UYU", name: "Peso Uruguayo ($U)" },
  { code: "PYG", name: "Guaraní Paraguayo (₲)" },
  { code: "USD", name: "Dólar Ecuatoriano (US$)" },
  { code: "EUR", name: "Euro (€)" },
  { code: "GBP", name: "Libra Esterlina (£)" },
  { code: "CHF", name: "Franco Suizo (Fr.)" },
  { code: "SEK", name: "Corona Sueca (kr)" },
  { code: "NOK", name: "Corona Noruega (kr)" },
  { code: "DKK", name: "Corona Danesa (kr.)" },
  { code: "ISK", name: "Corona Islandesa (kr)" },
  { code: "PLN", name: "Esloti Polaco (zł)" },
  { code: "CZK", name: "Corona Checa (Kč)" },
  { code: "HUF", name: "Florín Húngaro (Ft)" },
  { code: "RON", name: "Leu Rumano (lei)" },
  { code: "BGN", name: "Lev Búlgaro (лв)" },
  { code: "HRK", name: "Kuna Croata (kn)" },
  { code: "RUB", name: "Rublo Ruso (₽)" },
  { code: "UAH", name: "Grivnia Ucraniana (₴)" },
  { code: "TRY", name: "Lira Turca (₺)" },
  { code: "AED", name: "Dírham de los EAU (د.إ)" },
  { code: "SAR", name: "Rial Saudí (﷼)" },
  { code: "QAR", name: "Rial Qatarí (﷼)" },
  { code: "KWD", name: "Dinar Kuwaití (د.ك)" },
  { code: "BHD", name: "Dinar Bahreiní (.د.ب)" },
  { code: "OMR", name: "Rial de Omán (ر.ع.)" },
  { code: "JOD", name: "Dinar Jordano (د.ا)" },
  { code: "ILS", name: "Shequel Israelí (₪)" },
  { code: "EGP", name: "Libra Egipcia (£)" },
  { code: "IRR", name: "Rial Iraní (﷼)" },
  { code: "IQD", name: "Dinar Iraquí (ع.د)" },
  { code: "LBP", name: "Libra Libanesa (£)" },
  { code: "INR", name: "Rupia India (₹)" },
  { code: "PKR", name: "Rupia Paquistaní (₨)" },
  { code: "BDT", name: "Taka Bangladesí (৳)" },
  { code: "LKR", name: "Rupia de Sri Lanka (Rs)" },
  { code: "NPR", name: "Rupia Nepalí (₨)" },
  { code: "MVR", name: "Rupia de Maldivas (Rf)" },
  { code: "BTN", name: "Ngultrum de Bután (Nu.)" },
  { code: "CNY", name: "Yuan Chino (¥)" },
  { code: "JPY", name: "Yen Japonés (¥)" },
  { code: "KRW", name: "Won Surcoreano (₩)" },
  { code: "TWD", name: "Dólar Taiwanés (NT$)" },
  { code: "HKD", name: "Dólar de Hong Kong (HK$)" },
  { code: "SGD", name: "Dólar de Singapur (S$)" },
  { code: "MYR", name: "Ringgit Malasio (RM)" },
  { code: "THB", name: "Baht Tailandés (฿)" },
  { code: "VND", name: "Dong Vietnamita (₫)" },
  { code: "IDR", name: "Rupia Indonesia (Rp)" },
  { code: "PHP", name: "Peso Filipino (₱)" },
  { code: "AUD", name: "Dólar Australiano (A$)" },
  { code: "NZD", name: "Dólar Neozelandés (NZ$)" },
  { code: "FJD", name: "Dólar Fiyiano (FJ$)" },
  { code: "ZAR", name: "Rand Sudafricano (R)" },
  { code: "NGN", name: "Naira Nigeriana (₦)" },
  { code: "GHS", name: "Cedi Ghanés (₵)" },
  { code: "KES", name: "Chelín Keniata (KSh)" },
  { code: "ETC", name: "Birr Etíope (Br)" },
  { code: "MAD", name: "Dirham Marroquí (د.م.)" },
  { code: "TND", name: "Dinar Tunecino (د.ت)" },
  { code: "DZD", name: "Dinar Argelino (د.ج)" },
  { code: "UGX", name: "Chelín Ugandés (USh)" },
  { code: "RWF", name: "Franco Ruandés (FRw)" },
  { code: "TZS", name: "Chelín Tanzano (TSh)" },
  { code: "MUR", name: "Rupia Mauriciana (₨)" },
]

export function BusinessDetailsStep({ data, onChange }) {
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

  const getBusinessType = () => {
    return data.businessType === 'store' ? 'de la tienda' : 'del restaurante';
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Datos {getBusinessType()}</h2>
      <p className="text-muted-foreground mb-8">Completa la información de tu negocio</p>

      <div className="space-y-6">
        <Input
          label={`Nombre ${getBusinessType()}`}
          type="text"
          placeholder="El Delicioso Negocio S.A. de C.V."
          value={data.businessName}
          onChange={(e) => onChange({ ...data, businessName: e.target.value })}
        />

        <Input
          label="Dirección"
          type="text"
          placeholder="Ej: Calle Principal 123, Apartado 4, Ciudad"
          value={data.businessAddress}
          onChange={(e) => onChange({ ...data, businessAddress: e.target.value })}
        />

        <Input
          label="Teléfono"
          type="tel"
          placeholder="Ej: 3312345678"
          maxLength={10}
          value={data.businessPhone}
          onChange={(e) => onChange({ ...data, businessPhone: e.target.value })}
        />

        <Input
          label="Email"
          type="email"
          placeholder="contacto@deliciosonegocio.com"
          value={data.businessEmail}
          onChange={(e) => onChange({ ...data, businessEmail: e.target.value })}
        />

        <Input
          label="RFC"
          type="text"
          placeholder="Ej: ABC123456XYZ"
          maxLength={13}
          description="Formato: 13 caracteres (letras y números)"
          value={data.businessRFC}
          onChange={(e) => onChange({ ...data, businessRFC: e.target.value.toUpperCase() })}
        />

        <Select
          label="Moneda"
          defaultSelectedKeys={[data.businessCurrency]}
          value={data.businessCurrency}
          onChange={(e) => onChange({ ...data, businessCurrency: e.target.value })}
        >
          {CURRENCIES.map((currency) => (
              <SelectItem key={currency.code}>
                {currency.name}
              </SelectItem>
            ))}
        </Select>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Logo {getBusinessType()}</label>
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
